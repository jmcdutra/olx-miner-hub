import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
}

export const PageHeader = ({ title, description, actions, breadcrumb }: PageHeaderProps) => {
  return (
    <div className="mb-6">
      {breadcrumb && <div className="mb-3">{breadcrumb}</div>}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="font-display text-[26px] font-extrabold tracking-tight text-foreground md:text-[28px]">
            {title}
          </h1>
          {description && (
            <p className="mt-1 max-w-2xl text-[13.5px] text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
};
