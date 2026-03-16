import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-[hsl(0_0%_89.8%)] bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-[hsl(0_0%_45.1%)] focus-visible:ring-1 focus-visible:ring-[hsl(0_0%_3.9%)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
