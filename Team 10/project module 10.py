"""
Module 10: Savings & Investment Planner
Author: Your Name
Date: 2026-04-01
Modified: Added MySQL integration with better error handling
"""

import mysql.connector
from mysql.connector import Error
from datetime import datetime, timedelta

class SavingsPlanner:
    """Main class for savings and investment planning with MySQL integration"""
    
    def __init__(self, host='localhost', database='finance_db', user='root', password=''):
        """Initialize database connection"""
        self.host = host
        self.database = database
        self.user = user
        self.password = password
        self.connection = None
        self.connect_to_db()
    
    def connect_to_db(self):
        """Establish database connection"""
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                database=self.database,
                user=self.user,
                password=self.password
            )
            if self.connection.is_connected():
                print("Successfully connected to MySQL database")
        except Error as e:
            print(f"Error connecting to MySQL: {e}")
            print("Continuing in offline mode (using manual data entry)")
            self.connection = None
    
    def get_income_expenses_from_db(self, customer_id, months=1):
        """Fetch income and expenses from transaction table for a customer"""
        if not self.connection:
            print("Database not connected. Please provide income/expenses manually.")
            return None
            
        try:
            cursor = self.connection.cursor(dictionary=True)
            
            # Calculate date range
            end_date = datetime.now()
            start_date = end_date - timedelta(days=30 * months)
            
            # Query to get total income (positive transactions)
            income_query = """
                SELECT COALESCE(SUM(amount), 0) as total_income
                FROM transactions 
                WHERE customer_id = %s 
                AND transaction_type = 'credit'
                AND transaction_date BETWEEN %s AND %s
            """
            
            cursor.execute(income_query, (customer_id, start_date, end_date))
            income_result = cursor.fetchone()
            total_income = income_result['total_income']
            
            # Query to get total expenses (negative transactions or debit type)
            expense_query = """
                SELECT COALESCE(SUM(amount), 0) as total_expenses
                FROM transactions 
                WHERE customer_id = %s 
                AND transaction_type = 'debit'
                AND transaction_date BETWEEN %s AND %s
            """
            
            cursor.execute(expense_query, (customer_id, start_date, end_date))
            expense_result = cursor.fetchone()
            total_expenses = expense_result['total_expenses']
            
            cursor.close()
            
            # Calculate monthly average if multiple months
            if months > 1:
                total_income = total_income / months
                total_expenses = total_expenses / months
            
            return {
                'income': round(total_income, 2),
                'expenses': round(total_expenses, 2),
                'period_months': months
            }
            
        except Error as e:
            print(f"Database error: {e}")
            return None
    
    def calculate_savings_percentage(self, customer_id=None, income=None, expenses=None, months=1):
        """Calculate savings percentage from database or provided values"""
        
        # Try to fetch from database if customer_id provided and connection exists
        if customer_id and self.connection:
            transaction_data = self.get_income_expenses_from_db(customer_id, months)
            if transaction_data:
                income = transaction_data['income']
                expenses = transaction_data['expenses']
            else:
                print(f"Could not fetch data for customer {customer_id}. Please provide income/expenses manually.")
                if income is None or expenses is None:
                    raise ValueError(f"Cannot fetch data for customer {customer_id}. Please provide income and expenses manually.")
        
        # Validate we have income and expenses
        if income is None or expenses is None:
            raise ValueError("Either provide customer_id with valid database connection, or provide both income and expenses")
        
        savings = income - expenses
        percentage = (savings / income) * 100 if income > 0 else 0
        
        if percentage < 10:
            status = "Critical"
            suggestion = "Reduce non-essential expenses immediately"
        elif percentage < 20:
            status = "Below Target"
            suggestion = "Try to save 20% of your income"
        elif percentage < 30:
            status = "Good"
            suggestion = "On track! Consider automating savings"
        else:
            status = "Excellent"
            suggestion = "Great! Consider investing surplus"
        
        return {
            "customer_id": customer_id,
            "income": income,
            "expenses": expenses,
            "savings": round(savings, 2),
            "savings_percentage": round(percentage, 2),
            "recommended_percentage": 20,
            "status": status,
            "suggestion": suggestion,
            "analysis_period_months": months
        }
    
    def create_goal(self, customer_id, goal_name, target_amount, timeline_years, current_savings=0):
        """Create a new savings goal and optionally save to database"""
        months = timeline_years * 12
        remaining = target_amount - current_savings
        monthly_needed = remaining / months if months > 0 else remaining
        progress = (current_savings / target_amount) * 100 if target_amount > 0 else 0
        
        goal_data = {
            "goal_id": hash(f"{customer_id}{goal_name}") % 10000,  # Simple ID generation
            "customer_id": customer_id,
            "goal_name": goal_name,
            "target_amount": target_amount,
            "current_savings": current_savings,
            "remaining_amount": round(remaining, 2),
            "timeline_months": months,
            "monthly_savings_needed": round(monthly_needed, 2),
            "progress_percentage": round(progress, 2)
        }
        
        # Optionally save to database
        if self.connection:
            self.save_goal_to_db(goal_data)
        
        return goal_data
    
    def save_goal_to_db(self, goal_data):
        """Save savings goal to database"""
        if not self.connection:
            return
            
        try:
            cursor = self.connection.cursor()
            insert_query = """
                INSERT INTO savings_goals 
                (customer_id, goal_name, target_amount, current_savings, 
                 timeline_months, monthly_needed, created_date)
                VALUES (%s, %s, %s, %s, %s, %s, NOW())
            """
            cursor.execute(insert_query, (
                goal_data['customer_id'],
                goal_data['goal_name'],
                goal_data['target_amount'],
                goal_data['current_savings'],
                goal_data['timeline_months'],
                goal_data['monthly_savings_needed']
            ))
            self.connection.commit()
            print("Goal saved to database successfully")
            cursor.close()
        except Error as e:
            print(f"Error saving goal: {e}")
    
    def get_fd_recommendation(self, amount, years):
        """Get FD recommendation based on amount and timeline"""
        if years <= 1:
            tenure = "Short-term FD (6-12 months)"
            rate = 6.5
        elif years <= 3:
            tenure = "Medium-term FD (1-3 years)"
            rate = 7.2
        else:
            tenure = "Long-term FD (3-5 years)"
            rate = 7.5
        
        maturity = amount * (1 + rate/100) ** years
        
        return {
            "amount": amount,
            "tenure": tenure,
            "interest_rate": rate,
            "maturity_amount": round(maturity, 2),
            "banks": [
                {"name": "Small Finance Bank", "rate": 8.2},
                {"name": "HDFC Bank", "rate": 7.5},
                {"name": "SBI", "rate": 7.0}
            ]
        }
    
    def generate_investment_plan(self, customer_id=None, monthly_income=None, monthly_expenses=None):
        """Generate complete investment plan using database or provided values"""
        
        try:
            if customer_id and self.connection:
                # Try to get from database
                savings_data = self.calculate_savings_percentage(customer_id=customer_id)
            elif monthly_income is not None and monthly_expenses is not None:
                # Use provided values
                savings_data = self.calculate_savings_percentage(income=monthly_income, expenses=monthly_expenses)
            else:
                # Use default values for demonstration
                print("No data provided. Using default values for demonstration.")
                savings_data = self.calculate_savings_percentage(income=50000, expenses=35000)
            
            available_savings = savings_data['savings']
            
            allocation = {
                "emergency_fund": round(available_savings * 0.3, 2),
                "short_term_goals": round(available_savings * 0.4, 2),
                "long_term_investments": round(available_savings * 0.3, 2)
            }
            
            return {
                "customer_id": customer_id,
                "savings_percentage": savings_data['savings_percentage'],
                "available_savings": available_savings,
                "allocation": allocation,
                "suggestion": savings_data['suggestion']
            }
        except ValueError as e:
            print(f"Error generating investment plan: {e}")
            # Return default plan
            return {
                "customer_id": customer_id,
                "savings_percentage": 0,
                "available_savings": 0,
                "allocation": {"emergency_fund": 0, "short_term_goals": 0, "long_term_investments": 0},
                "suggestion": "Please provide income and expenses data"
            }
    
    def get_transaction_summary(self, customer_id):
        """Get detailed transaction summary from database"""
        if not self.connection:
            print("Database not connected")
            return []
            
        try:
            cursor = self.connection.cursor(dictionary=True)
            
            # Get transaction by category
            query = """
                SELECT 
                    category,
                    SUM(CASE WHEN transaction_type = 'credit' THEN amount ELSE 0 END) as total_income,
                    SUM(CASE WHEN transaction_type = 'debit' THEN amount ELSE 0 END) as total_expenses,
                    COUNT(*) as transaction_count
                FROM transactions
                WHERE customer_id = %s
                GROUP BY category
            """
            
            cursor.execute(query, (customer_id,))
            results = cursor.fetchall()
            cursor.close()
            
            return results
            
        except Error as e:
            print(f"Error getting transaction summary: {e}")
            return []
    
    def close_connection(self):
        """Close database connection"""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("Database connection closed")


# Example usage
if __name__ == "__main__":
    # Initialize planner with database connection (use empty password if none set)
    planner = SavingsPlanner(
        host='localhost',
        database='finance_db',
        user='root',
        password=''  # Empty password if you don't have one set
    )
    
    # Method 1: Calculate savings using manual data (works without database)
    print("\n=== Savings Analysis (Manual Data) ===")
    result = planner.calculate_savings_percentage(income=60000, expenses=40000)
    print("Savings Analysis:", result)
    
    # Method 2: Create goal (works without database)
    print("\n=== Goal Creation ===")
    goal = planner.create_goal(1, "Vacation", 250000, 2, 50000)
    print("Goal Created:", goal)
    
    # Method 3: FD Recommendation (works without database)
    print("\n=== FD Recommendation ===")
    fd = planner.get_fd_recommendation(250000, 2)
    print("FD Recommendation:", fd)
    
    # Method 4: Generate investment plan using manual data
    print("\n=== Investment Plan (Manual Data) ===")
    plan = planner.generate_investment_plan(monthly_income=60000, monthly_expenses=40000)
    print("Investment Plan:", plan)
    
    # Method 5: Try with customer_id (will work if database is configured)
    print("\n=== Investment Plan (From Database if available) ===")
    plan2 = planner.generate_investment_plan(customer_id=1)
    print("Investment Plan:", plan2)
    
    # Close connection
    planner.close_connection()
