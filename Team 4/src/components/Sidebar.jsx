import { LayoutDashboard, ArrowUpRight, ArrowDownRight, CreditCard, BookOpen, Settings, Receipt, User, Bell } from 'lucide-react';

export default function Sidebar({ user }) {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: true },
    { name: 'Withdraw', icon: ArrowUpRight },
    { name: 'Incomes', icon: ArrowDownRight },
    { name: 'Credits', icon: CreditCard },
    { name: 'NeoBank Daf', icon: BookOpen },
    { name: 'Settings', icon: Settings },
    { name: 'Payment', icon: Receipt, hideMobile: true },
    { name: 'My Profile', icon: User, hideMobile: true },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between h-screen sticky top-0 py-6 pr-6 border-r border-glass w-[240px] overflow-y-auto">
        <div>
          <div className="flex items-center gap-3 mb-10 px-4">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokelinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <span className="text-xl font-bold">NeoBank</span>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button 
                key={item.name}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  item.active ? 'bg-dark-paper text-white font-semibold' : 'text-secondary hover:bg-dark-panel hover:text-white'
                }`}
                onClick={() => window.dispatchEvent(new CustomEvent('toast_alert', { detail: { msg: `${item.name} view not implemented.`, type: 'info' }}))}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 px-4 mt-10">
          <div className="avatar bg-accent-purple">
            <span className="font-bold text-white uppercase">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-semibold text-sm truncate w-24">{user?.name || 'User'}</span>
            <span className="text-xs text-muted">@user02</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-primary border-t border-glass z-50 flex items-center justify-around px-2 backdrop-blur-lg bg-opacity-90">
        {navItems.filter(i => !i.hideMobile).slice(0, 5).map((item) => (
          <button 
            key={item.name}
            className={`flex flex-col items-center justify-center w-14 h-full gap-1 transition-all ${
              item.active ? 'text-brand-blue' : 'text-secondary hover:text-white'
            }`}
            onClick={() => window.dispatchEvent(new CustomEvent('toast_alert', { detail: { msg: `${item.name} view not implemented.`, type: 'info' }}))}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] truncate w-full text-center">{item.name}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
