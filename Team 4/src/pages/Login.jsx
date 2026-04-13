import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';

export default function Login() {
  const { user, login } = useContext(DataContext);
  const navigate = useNavigate();
  
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [retries, setRetries] = useState(3);
  const [error, setError] = useState('');

  // Check if no user profile exists, just redirect to onboarding or let them click the join button manually.

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    
    const success = await login(phone, pin);
    if (success) {
      setStep(2);
      setError('');
    } else {
      setRetries(prev => prev - 1);
      setError(`Invalid Phone or PIN. Retries left: ${retries - 1}`);
      if (retries - 1 === 0) {
        setError("Account locked due to too many attempts (Simulation only). Refresh page.");
        setStep(-1);
      }
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // Simulate OTP Verification. In reality, this would check against a sent code.
    // For simulation, we expect "0000" or just accept it.
    if (otp === '0000') {
      navigate('/dashboard');
    } else {
      setError("Invalid OTP. Try '0000'.");
    }
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen animate-fade-in relative">
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center text-gradient font-bold text-2xl">
        NeoBank
      </div>
      <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
          <p className="text-secondary">{user ? `Hello, ${user.name}` : "Log in to your smart account"}</p>
        </div>

        {error && <div className="text-danger mb-4 text-center text-sm">{error}</div>}

        {step === 1 && (
          <form onSubmit={handlePinSubmit} className="flex-col gap-4">
            <div className="input-group w-full mb-4">
              <label className="input-label">Phone Number</label>
              <input 
                required 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="input-field text-center text-xl tracking-widest" 
                maxLength={10} 
                placeholder="9876543210" 
              />
            </div>
            <div className="input-group w-full mb-6">
              <label className="input-label">Enter MPIN</label>
              <input 
                required 
                type="password" 
                value={pin} 
                onChange={(e) => setPin(e.target.value)} 
                className="input-field text-center text-2xl tracking-widest" 
                maxLength={6} 
                placeholder="****" 
              />
            </div>
            <button type="submit" className="btn-primary w-full">Login</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="flex-col gap-4 animate-slide-in-right">
            <div className="input-group w-full mb-6">
              <label className="input-label">Verify with OTP</label>
              <p className="text-sm text-secondary mb-2">An OTP has been sent to {user.phone}</p>
              <input 
                required 
                type="text" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                className="input-field text-center text-2xl tracking-widest" 
                maxLength={4} 
                placeholder="0000" 
              />
              <p className="text-xs text-muted mt-2 text-center">Simulated OTP is "0000"</p>
            </div>
            <button type="submit" className="btn-primary w-full">Verify & Access Dashboard</button>
          </form>
        )}

        {step === -1 && (
          <div className="text-center text-danger">Please contact support.</div>
        )}

        {!user && step === 1 && (
          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-glass)' }}>
            <p className="text-secondary text-center text-sm mb-4">New to NeoBank?</p>
            <button onClick={() => navigate('/onboarding')} className="btn-secondary w-full">Join Now</button>
          </div>
        )}
      </div>
    </div>
  );
}
