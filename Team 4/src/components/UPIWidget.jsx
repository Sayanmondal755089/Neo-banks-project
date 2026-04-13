import { useState, useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import { CheckCircle, Loader } from 'lucide-react';

export default function UPIWidget() {
  const { addTransaction, getBalance, user, findUser, loading } = useContext(DataContext);
  const [upiId, setUpiId]         = useState('');
  const [amount, setAmount]       = useState('');
  const [msg, setMsg]             = useState('');
  const [matchedUser, setMatchedUser] = useState(null);
  const [lookingUp, setLookingUp] = useState(false);

  // Debounced live lookup against SQL users table
  useEffect(() => {
    if (upiId.trim().length < 3) { setMatchedUser(null); return; }
    const t = setTimeout(async () => {
      setLookingUp(true);
      const found = await findUser(upiId.trim());
      setMatchedUser(found || null);
      setLookingUp(false);
    }, 400);
    return () => clearTimeout(t);
  }, [upiId, findUser]);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!upiId.includes('@')) { setMsg('Invalid UPI ID Format'); return; }
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) { setMsg('Invalid Amount'); return; }
    if (val > getBalance()) { setMsg('Insufficient Balance'); return; }

    const success = await addTransaction({
      type:      'withdraw',
      amount:    val,
      recipient: upiId.trim(),
      category:  'UPI Transfer',
      desc:      `UPI to ${upiId}`,
    });

    if (success !== false) {
      setMsg(`Successfully sent ₹${val.toLocaleString()} to ${upiId}`);
      setUpiId('');
      setAmount('');
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-4">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <span className="text-gradient">UPI Pay</span> Simulator
      </h3>
      <p className="text-sm text-secondary">Your UPI ID: <span className="font-mono text-white bg-black bg-opacity-30 px-2 py-1 rounded">{user.upiId}</span></p>

      <form onSubmit={handlePay} className="flex-col gap-4">
        <div className="input-group">
          <label className="input-label">Receiver UPI ID</label>
          <input required type="text" value={upiId} onChange={e => setUpiId(e.target.value)}
            placeholder="someone@neopay" className="input-field" />
          {lookingUp && (
            <p style={{ fontSize:'11px', color:'#aaa', marginTop:'4px', display:'flex', alignItems:'center', gap:'4px' }}>
              <Loader size={10} /> Looking up...
            </p>
          )}
          {!lookingUp && matchedUser && (
            <p style={{ fontSize:'11px', color:'#00e676', marginTop:'4px', display:'flex', alignItems:'center', gap:'4px' }}>
              <CheckCircle size={12} /> {matchedUser.name} — NeoBank user ✓
            </p>
          )}
          {!lookingUp && upiId.trim().length >= 3 && !matchedUser && (
            <p style={{ fontSize:'11px', color:'#aaa', marginTop:'4px' }}>External UPI — money leaves NeoBank</p>
          )}
        </div>
        <div className="input-group">
          <label className="input-label">Amount (₹)</label>
          <input required type="number" min="1" value={amount}
            onChange={e => setAmount(e.target.value)} placeholder="0.00" className="input-field" />
        </div>
        <button type="submit" className="btn-primary w-full mt-2" disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Sending...' : 'Send Money'}
        </button>
      </form>
      {msg && <p className={`text-sm mt-2 font-medium ${msg.includes('Success') ? 'text-success' : 'text-danger'}`}>{msg}</p>}
    </div>
  );
}
