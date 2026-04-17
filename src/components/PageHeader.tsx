import { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const PageHeader = ({ eyebrow, title, description, actions }: PageHeaderProps) => {
  return (
    <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="space-y-3">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 font-display text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {eyebrow}
          </span>
        )}
        <h1 className="heading-display text-[44px] font-extrabold text-foreground md:text-[56px]">{title}</h1>
        {description && (
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};
