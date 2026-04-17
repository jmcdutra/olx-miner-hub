export const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`inline-flex items-center gap-2 ${className}`}>
    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
      <span className="font-display text-[15px] font-extrabold text-primary-foreground">g</span>
    </div>
    <span className="font-display text-[17px] font-extrabold tracking-tight text-foreground">
      garimpre<span className="text-accent">ço</span>
    </span>
  </div>
);
