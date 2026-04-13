import { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { ArrowUpRight, ArrowDownLeft, Zap } from 'lucide-react';

export default function TransactionsPage() {
  const { transactions, user } = useContext(DataContext);

  // Group transactions by simple categorization
  const formatTime = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '30px' }}>
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h4 className="section-title" style={{ fontSize: '18px', color: '#fff' }}>Transaction History</h4>
          <p style={{ fontSize: '12px', color: '#a0a0b0', marginTop: '4px' }}>Your recent money movements</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#a0a0b0', background: '#1f1f2e', borderRadius: '24px' }}>
            No transactions yet.
          </div>
        ) : (
          transactions.map((tx) => {
            const isDeposit = tx.type === 'deposit' || tx.type === 'transfer_in';
            const iconColor = isDeposit ? '#FF9900' : '#FF3366';
            const iconBg = isDeposit ? 'rgba(255, 153, 0, 0.1)' : 'rgba(255, 51, 102, 0.1)';

            return (
              <div key={tx.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#1f1f2e',
                padding: '16px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '16px',
                    background: iconBg,
                    color: iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {tx.category === 'Account Opening Deposit' ? (
                      <Zap size={20} />
                    ) : isDeposit ? (
                      <ArrowDownLeft size={20} />
                    ) : (
                      <ArrowUpRight size={20} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#fff', marginBottom: '2px' }}>
                      {tx.type === 'transfer_in' ? `Received from ${tx.senderPhone || 'Unknown'}` :
                       tx.category === 'Account Opening Deposit' ? user?.name :
                       tx.recipient || tx.to || tx.name || (isDeposit ? 'Money Received' : 'Money Sent')}
                    </div>
                    <div style={{ fontSize: '11px', color: '#a0a0b0', display: 'flex', gap: '8px' }}>
                      <span>{formatDate(tx.date)}</span>
                      <span>•</span>
                      <span>{formatTime(tx.date)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontWeight: '800', 
                    fontSize: '15px', 
                    color: isDeposit ? '#00FF66' : '#fff' 
                  }}>
                    {isDeposit ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '10px', color: '#a0a0b0', marginTop: '2px', textTransform: 'uppercase' }}>
                    {tx.category === 'Account Opening Deposit' ? '' : (tx.method || tx.category || 'Transfer')}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
