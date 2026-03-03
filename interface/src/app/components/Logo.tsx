import { Home } from 'lucide-react';

export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Home className="w-8 h-8 text-[#10B981]" strokeWidth={2.5} />
      <span className="text-[#10B981] font-bold text-xl tracking-tight hidden md:block">HOMIQIO</span>
    </div>
  );
}