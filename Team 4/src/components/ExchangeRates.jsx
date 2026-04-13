import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

export default function ExchangeRates() {
  const rates = [
    { currency: 'USD', name: 'US Dollar', flag: '🇺🇸', rate: '₹83.20', drop: '₹0.05', up: true },
    { currency: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', rate: '₹92.50', drop: '₹0.12', up: false },
  ];

  return (
    <div>
      <div className="section-header">
        <h4 className="section-title">Exchange Rate</h4>
        <button className="see-more" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
          SEE MORE <ChevronRight style={{width: '12px', height: '12px'}} />
        </button>
      </div>

      <div className="exchange-list">
        {rates.map((item, idx) => (
          <div key={idx} className="exchange-item">
            <div className="ex-left">
              <div style={{fontSize: '24px'}}>{item.flag}</div>
              <div>
                <div style={{fontWeight: 'bold', fontSize: '14px', color: '#fff'}}>{item.currency}</div>
                <div style={{fontSize: '10px', color: '#a0a0b0'}}>{item.name}</div>
              </div>
            </div>
            
            <div className="ex-right">
              <span className="ex-rate">{item.rate}</span>
              <div className="ex-drop" style={{color: item.up ? '#00FF66' : '#FF3366'}}>
                {item.drop}
                {item.up ? <TrendingUp style={{width: '14px', height: '14px'}} /> : <TrendingDown style={{width: '14px', height: '14px'}} />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
