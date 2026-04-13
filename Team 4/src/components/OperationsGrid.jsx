import { Wallet, ShoppingCart } from 'lucide-react';

export default function OperationsGrid() {
  return (
    <div className="operations-grid">
      {/* All Operations Box */}
      <div className="grid-tile">
        <div className="tile-icon">
          <Wallet style={{width: '20px', height: '20px', color: '#a0a0b0'}} />
        </div>
        
        <div style={{marginTop: 'auto'}}>
          <h4 className="tile-title">All Operations</h4>
          <p style={{fontSize: '12px', color: '#a0a0b0', marginBottom: '4px'}}>Expenses in March, 2026</p>
          <div className="tile-amount">₹0.00</div>
          
          <div className="color-bar">
            <div style={{width: '40%', backgroundColor: '#FFD700'}}></div>
            <div style={{width: '35%', backgroundColor: '#FF3366'}}></div>
            <div style={{width: '25%', backgroundColor: '#00F0FF'}}></div>
          </div>
        </div>
      </div>

      {/* Consumer Loan Box */}
      <div className="grid-tile">
        <div className="tile-icon">
          <ShoppingCart style={{width: '20px', height: '20px', color: '#a0a0b0'}} />
        </div>
        
        <div style={{marginTop: 'auto'}}>
          <h4 className="tile-title">Consumer Loan</h4>
          <p style={{fontSize: '12px', color: '#a0a0b0', marginBottom: '4px', opacity: 0}}>Spacer</p>
          <div className="tile-amount">₹0.00</div>
          
          <div style={{display: 'inline-block', backgroundColor: '#002f18', color: '#00FF66', fontSize: '9px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px'}}>
            Next payment in 6 days
          </div>
        </div>
      </div>
    </div>
  );
}
