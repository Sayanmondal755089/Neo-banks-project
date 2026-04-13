import { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Shield, Settings, Eye, HelpCircle } from 'lucide-react';

export default function CardsPage() {
  const { user } = useContext(DataContext);
  const cardName = user?.name || 'Tejas Singh';
  
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '30px' }}>
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h4 className="section-title" style={{ fontSize: '18px', color: '#fff' }}>My Cards</h4>
          <p style={{ fontSize: '12px', color: '#a0a0b0', marginTop: '4px' }}>Manage your physical and virtual cards</p>
        </div>
      </div>

      {/* Large Glassmorphism RuPay Card */}
      <div style={{
        width: '100%',
        maxWidth: '340px',
        margin: '0 auto',
        height: '210px',
        borderRadius: '24px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        zIndex: 10
      }}>
        {/* Abstract floating blur elements for glassmorphism background */}
        <div style={{position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: '#00F0FF', filter: 'blur(60px)', borderRadius: '50%', zIndex: 0, opacity: 0.5}}></div>
        <div style={{position: 'absolute', bottom: '-40px', left: '-20px', width: '120px', height: '120px', background: '#FF3366', filter: 'blur(50px)', borderRadius: '50%', zIndex: 0, opacity: 0.4}}></div>

        {/* Card Header (Chip & Logo) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 10 }}>
          {/* Chip */}
          <div style={{ width: '40px', height: '30px', background: 'linear-gradient(135deg, #FFD700, #DAA520)', borderRadius: '6px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.4)' }}></div>
            <div style={{ position: 'absolute', left: '30%', top: 0, bottom: 0, width: '1px', background: 'rgba(0,0,0,0.4)' }}></div>
            <div style={{ position: 'absolute', right: '30%', top: 0, bottom: 0, width: '1px', background: 'rgba(0,0,0,0.4)' }}></div>
          </div>
          
          {/* RuPay Logo text styling */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '22px', fontWeight: '900', fontStyle: 'italic', letterSpacing: '1px', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>RuPay</span>
            <span style={{ fontSize: '10px', color: '#FF3366', fontWeight: 'bold', marginLeft: '4px', alignSelf: 'flex-start' }}>▶</span>
          </div>
        </div>

        {/* Card Number */}
        <div style={{ 
          position: 'relative', 
          zIndex: 10, 
          fontFamily: 'monospace', 
          fontSize: '22px', 
          color: '#fff', 
          letterSpacing: '3px',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          marginTop: '20px'
        }}>
          4356 8890 1234 5678
        </div>

        {/* Card Footer (Name & Expiry) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', opacity: 0.7, color: '#fff', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Card Holder</span>
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#fff', letterSpacing: '1px' }}>{cardName.toUpperCase()}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
            <span style={{ fontSize: '10px', opacity: 0.7, color: '#fff', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Expires</span>
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>12/28</span>
          </div>
        </div>
      </div>

      {/* Card Settings / Quick Actions */}
      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { icon: <Shield size={20} />, label: 'Freeze' },
          { icon: <Eye size={20} />, label: 'Details' },
          { icon: <Settings size={20} />, label: 'Settings' },
          { icon: <HelpCircle size={20} />, label: 'Support' }
        ].map((action, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#1f1f2e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF3366' }}>
              {action.icon}
            </div>
            <span style={{ fontSize: '11px', color: '#a0a0b0', fontWeight: '600' }}>{action.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
