import { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Plus, ChevronRight } from 'lucide-react';

export default function QuickTransfers({ onQuickTransfer }) {
  const { transactions } = useContext(DataContext);
  
  // Extract unique recipients from past outgoing transactions (central ledger format)
  const pastRecipients = Array.from(
    new Set(
      transactions
        .filter(t => (t.entryType === 'debit' || t.type === 'withdraw') && t.counterparty)
        .map(t => t.counterparty)
    )
  );

  return (
    <div>
      <div className="section-header">
        <h4 className="section-title">Quick Money Transfers</h4>

      </div>
      
      <div className="avatars-row">
        {pastRecipients.map((name, idx) => (
          <div key={idx} style={{position: 'relative', cursor: 'pointer', flexShrink: 0}} onClick={() => onQuickTransfer(name)}>
            <div className="avatar-tile">
               <span style={{color: '#a0a0b0', fontWeight: 'bold'}}>{name.substring(0, 2).toUpperCase()}</span>
            </div>
            {/* Small red dot indicator for recent */}
            <div style={{position: 'absolute', bottom: '-4px', right: '-4px', width: '12px', height: '12px', backgroundColor: '#FF3366', border: '2px solid #13131c', borderRadius: '50%'}}></div>
          </div>
        ))}

        <div style={{flexShrink: 0}}>
          <button className="avatar-tile add-btn" onClick={() => onQuickTransfer(null)}>
            <Plus style={{width: '24px', height: '24px'}} />
          </button>
        </div>
      </div>
    </div>
  );
}
