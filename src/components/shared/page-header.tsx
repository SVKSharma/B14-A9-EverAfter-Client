import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumb,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("border-b border-border pb-7", className)}>
      {breadcrumb && breadcrumb.length > 0 ? (
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-2 text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
            {breadcrumb.map((item, index) => (
              <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {item.href ? (
                  <Link href={item.href} className="transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow ? <p className="eyebrow text-primary">{eyebrow}</p> : null}
          <h1
            className={cn(
              "font-heading text-3xl leading-tight tracking-tight text-foreground sm:text-[2.5rem]",
              eyebrow && "mt-3"
            )}
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
