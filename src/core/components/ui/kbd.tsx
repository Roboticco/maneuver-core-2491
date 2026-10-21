import * as React from 'react';
import { cn } from '@/core/lib/utils';

export function Kbd({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
    return (
        <kbd
            className={cn(
                'inline-flex items-center justify-center rounded border border-border bg-muted px-2 py-0.5 font-mono text-xs font-medium text-muted-foreground shadow-sm',
                className,
            )}
            {...props}
        >
            {children}
        </kbd>
    );
}
