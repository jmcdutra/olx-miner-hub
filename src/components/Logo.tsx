export const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`inline-flex ${className}`}>
    <img
      src="/logo.png"
      alt="Garimpreco"
      className="max-h-16 w-auto object-contain"
      loading="eager"
      decoding="async"
    />
  </div>
);
