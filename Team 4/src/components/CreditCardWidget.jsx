import { useContext } from 'react';
import { DataContext } from '../context/DataContext';

export default function CreditCardWidget() {
  const { user } = useContext(DataContext);
  const cardName = user?.name || 'Tejas';

  return (
    <div className="glass-card-vertical">
      
      {/* Abstract blurred background overlays behind the glass */}
      <div style={{position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', background: '#FF3366', filter: 'blur(40px)', borderRadius: '50%', zIndex: 0}}></div>
      <div style={{position: 'absolute', bottom: '-10px', left: '-10px', width: '80px', height: '80px', background: '#00F0FF', filter: 'blur(40px)', borderRadius: '50%', zIndex: 0}}></div>
      
      {/* Top right circles (VISA/Mastercard style) */}
      <div style={{display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 10, width: '100%'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#FF3366', opacity: 0.8}}></div>
          <div style={{width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#FFD700', opacity: 0.8, marginLeft: '-12px', mixBlendMode: 'screen'}}></div>
        </div>
      </div>
      
      <div style={{position: 'relative', zIndex: 10, alignSelf: 'flex-end', color: 'white', fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: '8px', letterSpacing: '2px'}}>
        ** 9567
      </div>
    </div>
  );
}
