import { Pickaxe } from "lucide-react";

export const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`inline-flex items-center gap-2 ${className}`}>
    <div className="relative">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-bold shadow-orange">
        <Pickaxe className="h-5 w-5 text-white animate-mine" strokeWidth={2.6} />
      </div>
    </div>
    <div className="flex flex-col leading-none">
      <span className="font-display text-[15px] font-extrabold tracking-tight text-foreground">
        garimpre<span className="text-accent">ço</span>
      </span>
      <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        mining engine
      </span>
    </div>
  </div>
);
