import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';

export default function Onboarding() {
  const { register } = useContext(DataContext);
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    gender: 'Male',
    employment: 'Student',
    aadhaar: '',
    pin: '',
    upiPin: ''
  });

  const [generatedData, setGeneratedData] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (formData.aadhaar.length !== 12 || isNaN(formData.aadhaar)) {
      alert("Aadhaar must be a 12 digit number");
      return;
    }
    
    // Generate dummy details
    const accNo = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const upiId = `${formData.phone}@neopay`;
    const ifsc = 'NEO0000123';
    
    setGeneratedData({ accountNo: accNo, upiId, ifsc });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.pin.length < 4 || formData.upiPin.length < 4) {
      alert("PINs must be at least 4 digits");
      return;
    }
    setSubmitError('');
    const result = await register({
      ...formData,
      ...generatedData,
      createdAt: new Date().toISOString()
    });
    if (result?.success === false) {
      setSubmitError(result.error || 'Registration failed. Try a different phone/email.');
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen animate-fade-in">
      <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '500px' }}>
        <h2 className="text-2xl text-center mb-6 text-gradient font-bold">NeoBank Onboarding</h2>
        
        {step === 1 ? (
          <form onSubmit={handleNext} className="flex-col gap-4">
            <h3 className="text-lg text-secondary mb-4">Step 1: KYC Profile</h3>
            
            <div className="flex gap-4">
              <div className="input-group w-full">
                <label className="input-label">Full Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="John Doe" />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="input-group w-full">
                <label className="input-label">Phone</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="9876543210" minLength={10} maxLength={10} />
              </div>
              <div className="input-group w-full">
                <label className="input-label">Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="john@example.com" />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="input-group w-full">
                <label className="input-label">Age</label>
                <input required type="number" name="age" value={formData.age} onChange={handleChange} className="input-field" placeholder="18" min="18" max="120" />
              </div>
              <div className="input-group w-full">
                <label className="input-label">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="input-group w-full">
                <label className="input-label">Employment</label>
                <select name="employment" value={formData.employment} onChange={handleChange} className="input-field">
                  <option>Student</option>
                  <option>Employed</option>
                  <option>Unemployed</option>
                </select>
              </div>
            </div>

            <div className="input-group w-full mb-6">
              <label className="input-label">12-Digit Aadhaar</label>
              <input required name="aadhaar" value={formData.aadhaar} onChange={handleChange} className="input-field" placeholder="1234 5678 9012" minLength={12} maxLength={12} />
            </div>

            <button type="submit" className="btn-primary w-full mt-4">Continue to Setup PIN</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="flex-col gap-4 animate-slide-in-right">
            <h3 className="text-lg text-secondary mb-4">Step 2: Security & Account Creation</h3>

            <div className="glass-card mb-6" style={{ padding: '16px', background: 'rgba(0, 240, 255, 0.05)' }}>
              <p className="text-sm text-secondary mb-2">We've generated your banking details:</p>
              <p className="font-semibold text-lg text-gradient">A/C: {generatedData.accountNo}</p>
              <p className="text-sm">IFSC: {generatedData.ifsc}</p>
              <p className="text-sm">UPI ID: {generatedData.upiId}</p>
            </div>

            <div className="input-group w-full">
              <label className="input-label">App Access PIN (MPIN)</label>
              <input required type="password" name="pin" value={formData.pin} onChange={handleChange} className="input-field" placeholder="4-6 digit MPIN" minLength={4} maxLength={6} />
            </div>

            <div className="input-group w-full mb-6">
              <label className="input-label">UPI Transaction PIN</label>
              <input required type="password" name="upiPin" value={formData.upiPin} onChange={handleChange} className="input-field" placeholder="4-6 digit UPI PIN" minLength={4} maxLength={6} />
            </div>

            <div className="flex gap-4 mt-6">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary w-full">Back</button>
              <button type="submit" className="btn-primary w-full">Complete Setup</button>
            </div>
            {submitError && <p style={{color:'#FF3366', fontSize:'13px', marginTop:'8px', textAlign:'center'}}>{submitError}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
