import { useContext } from 'react';
import { DataContext } from '../context/DataContext';

export default function SmartAnalytics() {
  const { getBalance } = useContext(DataContext);

  // Savings Planner Calculation
  const suggestedSavings = Math.round(getBalance() * 0.2); // Suggest 20% of current balance

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div className="glass-card p-6 flex flex-col gap-4">
        <h3 className="text-lg font-bold">Savings Planner</h3>
        <div className="flex-1 flex flex-col gap-4 justify-center">
           <div className="p-4 rounded border border-glass bg-black bg-opacity-20 text-center">
             <p className="text-sm text-secondary">Suggested Savings Goal (20%)</p>
             <p className="text-2xl font-bold text-gradient mt-2">₹{suggestedSavings.toLocaleString()}</p>
           </div>
           
           <div className="p-4 rounded border border-glass bg-black bg-opacity-20 text-center">
             <p className="text-sm text-secondary">Basic FD Suggestion</p>
             <p className="text-md text-success mt-2">Earn 7.1% p.a on ₹{suggestedSavings.toLocaleString()}</p>
             <button className="btn-secondary w-full mt-3 text-xs" onClick={() => window.dispatchEvent(new CustomEvent('toast_alert', { detail: { msg: 'FD Simulation not completely mocked, but concept proved.', type: 'success' }}))}>Invest Now</button>
           </div>
        </div>
      </div>
    </div>
  );
}
