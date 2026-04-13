import { createContext, useState, useEffect, useCallback } from 'react';

export const DataContext = createContext();

const API = 'http://localhost:3001/api';

// ─────────────────────────────────────────────────────────────────────────────
export const DataProvider = ({ children }) => {

  const [user,         setUser]         = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('neobank_session')); } catch { return null; }
  });
  const [transactions, setTransactions] = useState([]);
  const [balance,      setBalance]      = useState(0);
  const [loading,      setLoading]      = useState(false);

  // Persist session across hard refreshes (sessionStorage resets on tab close)
  useEffect(() => {
    if (user) sessionStorage.setItem('neobank_session', JSON.stringify(user));
    else      sessionStorage.removeItem('neobank_session');
  }, [user]);

  // ── Fetch transactions + balance from the SQL database ─────────────────────
  const refreshData = useCallback(async (phone) => {
    if (!phone) return;
    try {
      const [txRes, balRes] = await Promise.all([
        fetch(`${API}/transactions/${phone}`),
        fetch(`${API}/balance/${phone}`),
      ]);
      const txData  = await txRes.json();
      const balData = await balRes.json();
      setTransactions(txData.transactions || []);
      setBalance(balData.balance ?? 0);
    } catch (err) {
      console.error('[refreshData]', err);
    }
  }, []);

  // Auto-refresh whenever the user changes
  useEffect(() => {
    if (user?.phone) refreshData(user.phone);
    else { setTransactions([]); setBalance(0); }
  }, [user, refreshData]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = async (phone, pin) => {
    try {
      const res  = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, pin }),
      });
      const data = await res.json();
      if (!res.ok) return false;
      setUser(data.user);
      return true;
    } catch { return false; }
  };

  const register = async (userData) => {
    try {
      const res  = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setTransactions([]);
    setBalance(0);
  };

  // ── Add Transaction ──────────────────────────────────────────────────────
  const addTransaction = async (tx) => {
    if (!user) return;
    setLoading(true);
    try {
      const res  = await fetch(`${API}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderPhone: user.phone, ...tx }),
      });
      const data = await res.json();

      if (!res.ok) {
        window.dispatchEvent(new CustomEvent('toast_alert', {
          detail: { msg: data.error || 'Transaction failed', type: 'danger' }
        }));
        return false;
      }

      window.dispatchEvent(new CustomEvent('toast_alert', {
        detail: { msg: `✅ ₹${tx.amount?.toLocaleString()} successful!`, type: 'success' }
      }));

      // Refresh from DB so UI shows latest data
      await refreshData(user.phone);
      return true;

    } catch (err) {
      window.dispatchEvent(new CustomEvent('toast_alert', {
        detail: { msg: 'Server error. Please try again.', type: 'danger' }
      }));
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ── Balance (already computed by server, cached in state) ─────────────────
  const getBalance = useCallback(() => balance, [balance]);

  // ── Find a user by phone / UPI ID / name ─────────────────────────────────
  const findUser = async (identifier) => {
    if (!identifier || identifier.length < 3) return null;
    try {
      const res  = await fetch(`${API}/users/find?q=${encodeURIComponent(identifier)}`);
      const data = await res.json();
      return data.found ? data.user : null;
    } catch { return null; }
  };

  return (
    <DataContext.Provider value={{
      user,
      transactions,
      balance,
      loading,
      login,
      register,
      logout,
      addTransaction,
      getBalance,
      findUser,
      refreshData,
    }}>
      {children}
    </DataContext.Provider>
  );
};
