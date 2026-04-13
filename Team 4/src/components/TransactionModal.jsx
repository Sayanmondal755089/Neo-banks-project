import { useState, useEffect, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { CreditCard, Landmark, X, ShieldCheck, CheckCircle, Loader } from 'lucide-react';

export default function TransactionModal({ isOpen, onClose, type, initialRecipient }) {
  const { addTransaction, getBalance, user, findUser, loading } = useContext(DataContext);
  const [amount, setAmount]               = useState('');
  const [recipient, setRecipient]         = useState('');
  const [msg, setMsg]                     = useState('');
  const [method, setMethod]               = useState('bank');
  const [receiveMode, setReceiveMode]     = useState('add_funds');
  const [showPinApproval, setShowPinApproval] = useState(false);
  const [simulatedPin, setSimulatedPin]   = useState('');
  const [matchedUser, setMatchedUser]     = useState(null);
  const [lookingUp, setLookingUp]         = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRecipient(initialRecipient || '');
      setAmount('');
      setMsg('');
      setReceiveMode('add_funds');
      setShowPinApproval(false);
      setSimulatedPin('');
      setMatchedUser(null);
    }
  }, [isOpen, initialRecipient]);

  // Live recipient lookup against the SQL users table
  useEffect(() => {
    if (type !== 'withdraw' || recipient.trim().length < 3) {
      setMatchedUser(null);
      return;
    }
    const timer = setTimeout(async () => {
      setLookingUp(true);
      const found = await findUser(recipient.trim());
      setMatchedUser(found || null);
      setLookingUp(false);
    }, 400); // debounce 400ms
    return () => clearTimeout(timer);
  }, [recipient, type, findUser]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) { setMsg('Enter a valid amount.'); return; }
    if (type === 'withdraw' && !recipient.trim()) { setMsg('Enter a recipient.'); return; }
    if (type === 'withdraw' && val > getBalance()) { setMsg('Insufficient Balance!'); return; }

    if (type === 'deposit' && receiveMode === 'request_money') {
      if (!recipient.trim()) { setMsg('Enter a phone number.'); return; }
      const requests = JSON.parse(localStorage.getItem('neobank_pending_requests') || '[]');
      requests.push({ id: Date.now(), from: user?.phone, to: recipient.trim(), amount: val });
      localStorage.setItem('neobank_pending_requests', JSON.stringify(requests));
      setMsg(`Request sent to ${recipient.trim()}`);
      setAmount('');
      setTimeout(() => { setMsg(''); onClose(); }, 1500);
      return;
    }

    if (type === 'withdraw') { setShowPinApproval(true); return; }
    executeTransaction(val);
  };

  const executeTransaction = async (val) => {
    const success = await addTransaction({
      type:      type === 'deposit' ? 'deposit' : 'withdraw',
      amount:    val,
      recipient: type === 'withdraw' ? recipient.trim() : null,
      category:  type === 'deposit' ? 'Income' : 'Payment',
      desc:      type === 'deposit'
                   ? (receiveMode === 'request_money' ? `Received from ${recipient}` : 'Funds Added')
                   : (method === 'bank' ? 'Bank Transfer' : 'Card Transaction'),
      method,
    });
    if (success !== false) {
      setMsg(`✅ Successfully ${type === 'deposit' ? 'received' : 'sent'} ₹${val.toLocaleString()}`);
      setAmount('');
      setTimeout(() => { setMsg(''); onClose(); }, 1500);
    }
  };

  const handlePinApprove = async (e) => {
    e.preventDefault();
    if (simulatedPin.length < 4) { setMsg('Enter valid PIN (at least 4 digits)'); return; }
    setMsg('');
    setShowPinApproval(false);
    await executeTransaction(parseFloat(amount));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}><X size={16} /></button>

        {!showPinApproval ? (
          <>
            <h3 className="modal-title">
              {type === 'deposit' ? 'Receive Money' : (initialRecipient ? `Pay ${initialRecipient}` : 'Send Money')}
            </h3>

            {type === 'deposit' && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button type="button" onClick={() => setReceiveMode('add_funds')}
                  style={{ flex:1, padding:'8px', borderRadius:'8px', border:'1px solid #3a3a4c',
                    background: receiveMode === 'add_funds' ? '#FF3366' : 'transparent',
                    color:'#fff', fontSize:'12px', fontWeight:'bold', cursor:'pointer' }}>
                  ADD FUNDS
                </button>
                <button type="button" onClick={() => setReceiveMode('request_money')}
                  style={{ flex:1, padding:'8px', borderRadius:'8px', border:'1px solid #3a3a4c',
                    background: receiveMode === 'request_money' ? '#FF9900' : 'transparent',
                    color:'#fff', fontSize:'12px', fontWeight:'bold', cursor:'pointer' }}>
                  REQUEST VIA PHONE
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="modal-form">
              {type === 'withdraw' && !initialRecipient && (
                <div className="form-group">
                  <label>Recipient (Phone, Name, or UPI ID)</label>
                  <input required type="text" value={recipient}
                    onChange={e => setRecipient(e.target.value)}
                    placeholder="e.g. 9876543210 or name@neopay" />
                  {lookingUp && (
                    <p style={{ fontSize:'11px', color:'#aaa', marginTop:'4px', display:'flex', alignItems:'center', gap:'4px' }}>
                      <Loader size={10} className="spin" /> Looking up...
                    </p>
                  )}
                  {!lookingUp && matchedUser && (
                    <p style={{ fontSize:'11px', color:'#00e676', marginTop:'4px', display:'flex', alignItems:'center', gap:'4px' }}>
                      <CheckCircle size={12} /> {matchedUser.name} ({matchedUser.phone}) — NeoBank user ✓
                    </p>
                  )}
                  {!lookingUp && recipient.trim().length >= 3 && !matchedUser && (
                    <p style={{ fontSize:'11px', color:'#aaa', marginTop:'4px' }}>
                      External payee — money will leave NeoBank
                    </p>
                  )}
                </div>
              )}

              {type === 'deposit' && receiveMode === 'request_money' && (
                <div className="form-group">
                  <label>Sender Phone Number</label>
                  <input required type="text" value={recipient}
                    onChange={e => setRecipient(e.target.value)} placeholder="e.g. 9876543210" />
                </div>
              )}

              <div className="form-group">
                <label>Amount</label>
                <div className="input-with-icon">
                  <span className="input-icon">₹</span>
                  <input required type="number" min="1" value={amount}
                    onChange={e => setAmount(e.target.value)} placeholder="0.00"
                    autoFocus={!!initialRecipient || type === 'deposit'} />
                </div>
              </div>

              {(type === 'withdraw' || (type === 'deposit' && receiveMode === 'add_funds')) && (
                <div className="form-group">
                  <label>Payment Method</label>
                  <div className="method-grid">
                    <div className={`method-btn ${method === 'bank' ? 'active' : ''}`} onClick={() => setMethod('bank')}>
                      <Landmark size={16} /> <span>Bank</span>
                    </div>
                    <div className={`method-btn ${method === 'card' ? 'active' : ''}`} onClick={() => setMethod('card')}>
                      <CreditCard size={16} /> <span>Card</span>
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className="modal-submit-btn" disabled={loading}
                style={{ opacity: loading ? 0.7 : 1, display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
                {loading ? <><Loader size={14} /> Processing...</> : (type === 'deposit' ? (receiveMode === 'request_money' ? 'Request' : 'Add') : 'Send')}
              </button>
            </form>
          </>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'16px', alignItems:'center', textAlign:'center', padding:'20px 0' }}>
            <ShieldCheck size={48} color="#FF3366" />
            <h3 style={{ fontSize:'18px', fontWeight:'bold', color:'#fff' }}>Secure Your Transfer</h3>
            <p style={{ fontSize:'12px', color:'#a0a0b0' }}>
              Enter your UPI PIN to send ₹{parseFloat(amount).toLocaleString()} to {matchedUser?.name || recipient}.
            </p>
            <form onSubmit={handlePinApprove} style={{ width:'100%', display:'flex', flexDirection:'column', gap:'12px' }}>
              <input required type="password" value={simulatedPin}
                onChange={e => setSimulatedPin(e.target.value)} placeholder="Enter UPI PIN"
                style={{ width:'100%', background:'#1a1a24', border:'1px solid rgba(255,51,102,0.5)',
                  borderRadius:'12px', padding:'12px', color:'#fff', textAlign:'center',
                  letterSpacing:'4px', fontSize:'20px' }} />
              <button type="submit" className="modal-submit-btn" disabled={loading}
                style={{ background:'#FF3366', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
                {loading ? <><Loader size={14} /> Sending...</> : 'Approve Payment'}
              </button>
              <button type="button" onClick={() => { setShowPinApproval(false); setMsg(''); }}
                style={{ background:'transparent', border:'none', color:'#a0a0b0', cursor:'pointer', fontSize:'12px' }}>
                Cancel
              </button>
            </form>
          </div>
        )}

        {msg && <p className={`modal-msg ${msg.includes('✅') ? 'success' : 'error'}`}>{msg}</p>}
      </div>
    </div>
  );
}
