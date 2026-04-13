import { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { MoreHorizontal } from 'lucide-react';

export default function TransactionsSidebar() {
  const { transactions } = useContext(DataContext);
  
  // Use mock transactions if no actual transactions are present just to show the UI
  const displayTx = transactions && transactions.length > 0 
    ? transactions.slice(0, 8) 
    : [
        { type: 'deposit', category: 'Credit Loan', name: 'Ava Scott', amount: 420.50, date: 'Sep 08 2024' },
        { type: 'deposit', category: 'Total Deposits', name: 'Henry Adams', amount: 790.00, date: 'Sep 07 2024' },
        { type: 'withdraw', category: 'Credit Loan', name: 'Isabella Ward', amount: 1740.00, date: 'Sep 07 2024' },
        { type: 'withdraw', category: 'Wallet Balance', name: 'Lucas Evans', amount: 1810.50, date: 'Sep 06 2024' },
        { type: 'deposit', category: 'Total Deposits', name: 'Henry Adams', amount: 2410.50, date: 'Sep 06 2024' },
        { type: 'deposit', category: 'Total Deposits', name: 'Lucas Evans', amount: 1250.50, date: 'Sep 06 2024' },
      ];

  const getStyleForCategory = (cat, type) => {
    // Return background color for the row, and specific text color for category label
    if (cat === 'Credit Loan' && type === 'withdraw') return 'bg-[#3C1A5C]';
    if (cat === 'Total Deposits' && type === 'deposit') return 'bg-[#153421]';
    if (cat === 'Wallet Balance' && type === 'withdraw') return 'bg-[#1D2951]';
    if (cat === 'Credit Loan' && type === 'deposit') return 'bg-[#211A4D]';
    return 'bg-dark-paper'; // fallback
  };

  const getAvatarFallback = (name) => {
    if (!name) return 'B';
    return name.charAt(0).toUpperCase();
  };

  return (
    <aside className="flex flex-col w-full xl:w-[340px] xl:h-screen sticky top-0 py-6 xl:pl-6 xl:border-l border-glass mt-8 xl:mt-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Transactions</h2>
        <button className="text-secondary hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 100px)' }}>
        {displayTx.map((tx, idx) => {
           const isPositive = tx.type === 'deposit';
           const rowBg = getStyleForCategory(tx.category || (isPositive ? 'Total Deposits' : 'Credit Loan'), tx.type);
           const amountColor = isPositive ? 'text-accent-green' : 'text-danger';
           const sign = isPositive ? '+' : '-';
           
           return (
             <div key={idx} className={`${rowBg} rounded-xl p-3 flex justify-between items-center bg-opacity-70 border border-glass`}>
                <div className="flex items-center gap-3">
                   <div className="avatar w-10 h-10 text-lg flex-shrink-0">
                      <span className="font-bold">{getAvatarFallback(tx.name || tx.category)}</span>
                   </div>
                   <div className="flex flex-col text-left overflow-hidden">
                      <span className="font-bold text-sm truncate">{tx.category || (isPositive ? 'Income' : 'Payment')}</span>
                      <span className="text-xs text-secondary truncate">{tx.name || 'NeoBank User'}</span>
                   </div>
                </div>
                <div className="flex flex-col text-right flex-shrink-0 ml-2">
                   <span className={`font-bold text-sm ${amountColor}`}>{sign}${Math.abs(tx.amount).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                   <span className="text-[10px] text-muted">{tx.date || new Date(tx.timestamp || Date.now()).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                </div>
             </div>
           );
        })}
      </div>
    </aside>
  );
}
