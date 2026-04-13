export function StatProgressWidget({ title, amount, gradientFrom, gradientTo, percent, showBadge }) {
  const formattedAmount = amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const [whole, fraction] = formattedAmount.split('.');
  
  return (
    <div className="bg-dark-paper p-6 relative overflow-hidden flex flex-col justify-between h-[180px]">
      {showBadge && (
        <div className="absolute top-4 right-4 bg-accent-green text-black font-bold text-xs px-2 py-1 rounded-full transform rotate-12">
          +35%
        </div>
      )}
      <div className="text-center">
        <h3 className="text-secondary text-sm font-medium mb-1">{title}</h3>
        <div className="font-bold">
          <span className="text-3xl text-white">{whole}</span>
          <span className="text-xl text-secondary">.{fraction}</span>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-[10px] text-muted mb-1 px-1">
          <span>50</span>
          <span>150</span>
          <span>250</span>
          <span>350</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar"
            style={{ 
              width: `${percent}%`, 
              background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})` 
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function StatActionWidget({ title, amount, onAction }) {
  const formattedAmount = amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const [whole, fraction] = formattedAmount.split('.');
  
  return (
    <div className="bg-dark-panel p-6 flex flex-col justify-center items-center h-[180px] border border-glass rounded-xl col-span-1 md:col-span-2">
      <h3 className="text-secondary text-sm font-medium mb-2">{title}</h3>
      <div className="font-bold mb-6">
        <span className="text-4xl text-white">{whole}</span>
        <span className="text-2xl text-secondary">.{fraction}</span>
      </div>
      <button onClick={onAction} className="bg-brand-blue font-semibold px-8 py-2.5 rounded-full hover:shadow-neon w-48">
        Add Funds
      </button>
    </div>
  );
}
