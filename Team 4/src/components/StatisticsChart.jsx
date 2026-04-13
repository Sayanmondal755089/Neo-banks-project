import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function StatisticsChart() {
  const data = [
    { name: '30.10.24', val1: 20000, val2: 12000, val3: 15000 },
    { name: '31.10.24', val1: 25000, val2: 15000, val3: 10000 },
    { name: '01.11.24', val1: 18000, val2: 19000, val3: 24185 },
    { name: '02.11.24', val1: 28000, val2: 14000, val3: 12000 },
    { name: '03.11.24', val1: 30000, val2: 18000, val3: 18000 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-accent-green text-black font-bold px-3 py-1 rounded-full text-sm">
          ${payload[2].value.toLocaleString()}.50
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-dark-paper p-6 mt-6 rounded-xl flex flex-col lg:flex-row gap-6 relative overflow-hidden">
      <div className="flex flex-col gap-4 lg:w-1/3 z-10">
        <div>
          <h2 className="text-2xl font-semibold leading-tight">Statistics</h2>
          <h2 className="text-2xl font-semibold leading-tight">Balance</h2>
        </div>
        
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex justify-between items-center bg-black bg-opacity-40 p-3 rounded-lg border border-glass">
             <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#5865F2]"></div>
                 <span className="font-bold">$25,841<span className="text-secondary text-sm font-normal">.20</span></span>
             </div>
             <span className="text-xs text-muted">**** 8417</span>
          </div>
          
          <div className="flex justify-between items-center bg-black bg-opacity-40 p-3 rounded-lg border border-glass">
             <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-accent-green"></div>
                 <span className="font-bold">$19,473<span className="text-secondary text-sm font-normal">.00</span></span>
             </div>
             <span className="text-xs text-muted">**** 6514</span>
          </div>
          
          <div className="flex justify-between items-center bg-black bg-opacity-40 p-3 rounded-lg border border-glass">
             <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#A855F7]"></div>
                 <span className="font-bold">$16,520<span className="text-secondary text-sm font-normal">.50</span></span>
             </div>
             <span className="text-xs text-muted">**** 1957</span>
          </div>

          <div className="flex justify-between items-center bg-black bg-opacity-40 p-3 rounded-lg border border-glass mt-2">
             <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#0EA5E9]"></div>
                 <span className="font-bold">$61,834<span className="text-secondary text-sm font-normal">.70</span></span>
             </div>
             <span className="text-xs text-muted">Total</span>
          </div>
        </div>
      </div>

      <div className="lg:w-2/3 h-[280px] relative z-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVal3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A855F7" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#606070', fontSize: 10}} dy={10} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
            <Area type="monotone" dataKey="val1" stroke="#5865F2" strokeWidth={2} fill="transparent" />
            <Area type="monotone" dataKey="val2" stroke="#00F0FF" strokeWidth={2} fill="transparent" />
            <Area type="monotone" dataKey="val3" stroke="#A855F7" strokeWidth={2} fill="url(#colorVal3)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
