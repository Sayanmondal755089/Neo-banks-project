import { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';

export default function MiniStatement() {
  const { transactions } = useContext(DataContext);
  const [filter, setFilter] = useState('all');

  const filteredTxs = transactions.filter(tx => {
    if (filter === 'all') return true;
    if (filter === 'credit') return tx.type === 'deposit' || tx.type === 'transfer_in';
    if (filter === 'debit') return tx.type === 'withdraw' || tx.type === 'transfer_out';
    return true;
  });

  const getAmountColor = (type) => {
    if (type === 'deposit' || type === 'transfer_in') return 'text-success';
    return 'text-danger';
  };

  const formatType = (type) => {
    const map = {
      deposit: 'Deposit', withdraw: 'Withdrawal', transfer_in: 'Received', transfer_out: 'Transfer'
    };
    return map[type] || type;
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold">Mini Statement</h3>
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="input-field" style={{ padding: '6px 12px', width: 'auto' }}>
          <option value="all">All</option>
          <option value="credit">Credits</option>
          <option value="debit">Debits</option>
        </select>
      </div>

      <div className="flex-col gap-3 max-h-64 overflow-y-auto pr-2">
        {filteredTxs.length === 0 ? (
          <p className="text-muted text-center py-4">No transactions found.</p>
        ) : (
          filteredTxs.slice(0, 10).map(tx => (
            <div key={tx.id} className="flex justify-between items-center p-3 rounded-lg bg-black bg-opacity-20 border border-glass">
              <div className="flex col gap-1">
                <span className="font-semibold text-sm">{tx.desc || tx.category || formatType(tx.type)}</span>
                <span className="text-xs text-muted">{new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <span className={`font-bold ${getAmountColor(tx.type)}`}>
                {tx.type === 'deposit' || tx.type === 'transfer_in' ? '+' : '-'}₹{tx.amount.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
