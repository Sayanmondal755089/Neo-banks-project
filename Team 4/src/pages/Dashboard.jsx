import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import TransactionModal from '../components/TransactionModal';
import CreditCardWidget from '../components/CreditCardWidget';
import OperationsGrid from '../components/OperationsGrid';
import QuickTransfers from '../components/QuickTransfers';

import CardsPage from './CardsPage';
import TransactionsPage from './TransactionsPage';
import { Search, Scan, Home, CreditCard as CardIcon, Activity, Clock, ArrowUpRight, ArrowDownLeft, ShieldCheck } from 'lucide-react';

export default function Dashboard() {
  const { user, getBalance, logout, addTransaction } = useContext(DataContext);
  const navigate = useNavigate();
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, recipient: null });
  const [activeTab, setActiveTab] = useState('home');

  // Redirect to login whenever user logs out (soft redirect — no page reload)
  useEffect(() => {
    if (!user) navigate('/', { replace: true });
  }, [user, navigate]);

  const [pendingRequests, setPendingRequests] = useState([]);
  const [showIncomingRequest, setShowIncomingRequest] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [simulatedPin, setSimulatedPin] = useState('');
  const [pinError, setPinError] = useState('');

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const allReqs = JSON.parse(localStorage.getItem('neobank_pending_requests') || '[]');
      const myReqs = allReqs.filter(r => r.to === user.phone);
      setPendingRequests(myReqs);
    }, 2000);
    return () => clearInterval(interval);
  }, [user]);



  const handleApproveRequest = (e) => {
    e.preventDefault();
    if (simulatedPin.length < 4) {
      setPinError("Enter valid PIN (at least 4 digits)");
      return;
    }
    
    addTransaction({
      type: 'withdraw',
      amount: currentRequest.amount,
      recipient: currentRequest.from,
      category: 'Payment',
      desc: `Approved request from ${currentRequest.from}`,
      method: 'bank'
    });

    const allReqs = JSON.parse(localStorage.getItem('neobank_pending_requests') || '[]');
    const newReqs = allReqs.filter(r => r.id !== currentRequest.id);
    localStorage.setItem('neobank_pending_requests', JSON.stringify(newReqs));

    setShowIncomingRequest(false);
    setCurrentRequest(null);
    setSimulatedPin('');
    setPinError('');
  };

  const handleDeclineRequest = () => {
    const allReqs = JSON.parse(localStorage.getItem('neobank_pending_requests') || '[]');
    const newReqs = allReqs.filter(r => r.id !== currentRequest.id);
    localStorage.setItem('neobank_pending_requests', JSON.stringify(newReqs));
    
    setShowIncomingRequest(false);
    setCurrentRequest(null);
    setSimulatedPin('');
    setPinError('');
  };

  if (!user) {
    return <div style={{padding: '30px', color: '#fff'}}>Please Login First.</div>;
  }

  const balance = getBalance();

  return (
    <div className="mobile-app-wrapper">
      <div className="mobile-app-container">
        
        <main className="mobile-app-content">
          {/* Header */}
          <header className="app-header">
            <div className="user-pill" onClick={logout}>
              <div className="user-avatar">
                {user?.name?.charAt(0) || 'T'}
              </div>
              <span style={{fontSize: '14px', fontWeight: '600'}}>
                 {user?.name?.split(' ')[0] || 'Tejas'} <span style={{color: '#a0a0b0', marginLeft: '4px'}}>&gt;</span>
              </span>
            </div>

            <div style={{display: 'flex', gap: '16px', color: '#a0a0b0', alignItems: 'center'}}>
              <Search style={{width: '20px', height: '20px', cursor: 'pointer'}} />
              <div 
                style={{position: 'relative', cursor: 'pointer'}}
                onClick={() => {
                  if (pendingRequests.length > 0) {
                    setCurrentRequest(pendingRequests[0]);
                    setShowIncomingRequest(true);
                  } else {
                     window.dispatchEvent(new CustomEvent('toast_alert', { 
                        detail: { msg: `No pending approvals.`, type: 'success' } 
                     }));
                  }
                }}
              >
                <ShieldCheck style={{width: '20px', height: '20px', color: pendingRequests.length > 0 ? '#FF9900' : '#a0a0b0'}} />
                {pendingRequests.length > 0 && (
                  <div style={{position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', backgroundColor: '#FF3366', borderRadius: '50%'}}></div>
                )}
              </div>
            </div>
          </header>

          {activeTab === 'home' && (
            <>
              {/* Balance & Card Row */}
              <div className="balance-row">
                <div className="balance-info">
                  <span className="balance-label">Total Balance</span>
                  <span className="balance-amount">₹{balance.toLocaleString()}</span>
                  <div className="cashback-pill" style={{cursor: 'default'}}>
                    <div style={{width:'16px', height:'16px', backgroundColor:'#2a2a3c', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:'bold'}}>₹</div>
                    ₹39.44 Cashback saved <span style={{marginLeft: '4px'}}>&gt;</span>
                  </div>
                </div>
                
                <CreditCardWidget />
              </div>

              {/* Quick Actions (Send/Receive) */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <button 
                  onClick={() => setModalConfig({ isOpen: true, type: 'withdraw', recipient: null })}
                  style={{
                    flex: 1, padding: '16px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    background: 'rgba(255, 51, 102, 0.1)', border: '1px solid rgba(255, 51, 102, 0.2)', backdropFilter: 'blur(10px)',
                    color: '#FF3366', fontWeight: '800', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer'
                  }}
                >
                  <ArrowUpRight size={18} strokeWidth={3} /> SEND
                </button>
                <button 
                  onClick={() => setModalConfig({ isOpen: true, type: 'deposit', recipient: null })}
                  style={{
                    flex: 1, padding: '16px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    background: 'rgba(255, 153, 0, 0.1)', border: '1px solid rgba(255, 153, 0, 0.2)', backdropFilter: 'blur(10px)',
                    color: '#FF9900', fontWeight: '800', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer'
                  }}
                >
                  <ArrowDownLeft size={18} strokeWidth={3} /> RECEIVE
                </button>
              </div>

              <OperationsGrid />
              
              <QuickTransfers onQuickTransfer={(name) => setModalConfig({ isOpen: true, type: 'withdraw', recipient: name })} />


            </>
          )}

          {activeTab === 'card' && <CardsPage />}

          {activeTab === 'history' && <TransactionsPage />}
          
        </main>

        {/* Bottom Nav App Bar */}
        <nav className="bottom-app-bar">
          <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <Home style={{width: '24px', height: '24px'}} />
            <div className="nav-dot" style={{opacity: activeTab === 'home' ? 1 : 0}}></div>
          </div>
          <div className={`nav-item ${activeTab === 'card' ? 'active' : ''}`} onClick={() => setActiveTab('card')}>
            <CardIcon style={{width: '24px', height: '24px'}} />
            <div className="nav-dot" style={{opacity: activeTab === 'card' ? 1 : 0}}></div>
          </div>
          <div className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            <Clock style={{width: '24px', height: '24px'}} />
            <div className="nav-dot" style={{opacity: activeTab === 'history' ? 1 : 0}}></div>
          </div>
        </nav>

        <TransactionModal 
          isOpen={modalConfig.isOpen} 
          type={modalConfig.type} 
          initialRecipient={modalConfig.recipient} 
          onClose={() => setModalConfig({ isOpen: false, type: null, recipient: null })} 
        />

        {showIncomingRequest && currentRequest && (
          <div className="modal-overlay" style={{ zIndex: 1000}}>
            <div className="modal-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center', padding: '30px 20px', maxWidth: '300px' }}>
              <ShieldCheck size={48} color="#FF9900" />
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>Incoming Request</h3>
              <p style={{ fontSize: '12px', color: '#a0a0b0' }}>
                User <strong>{currentRequest.from}</strong> has requested <strong>₹{currentRequest.amount.toLocaleString()}</strong> from you.
              </p>
              <form onSubmit={handleApproveRequest} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                <input required type="password" value={simulatedPin} onChange={e => setSimulatedPin(e.target.value)} placeholder="Enter UPI PIN" style={{ width: '100%', background: '#1a1a24', border: '1px solid rgba(255,153,0,0.5)', borderRadius: '12px', padding: '12px', color: '#fff', textAlign: 'center', letterSpacing: '4px', fontSize: '20px' }} />
                {pinError && <p style={{color: '#FF3366', fontSize: '12px', margin: 0}}>{pinError}</p>}
                <button type="submit" className="modal-submit-btn" style={{ background: '#FF9900', marginTop: '8px' }}>Approve Payment</button>
                <button type="button" onClick={handleDeclineRequest} style={{ background: 'transparent', border: 'none', color: '#a0a0b0', cursor: 'pointer', fontSize: '12px', marginTop: '4px' }}>Decline Request</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

