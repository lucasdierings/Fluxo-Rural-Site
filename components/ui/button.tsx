import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dourado/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-dourado text-carvao hover:bg-dourado/90 hover:scale-[1.02] shadow-apple-md hover:shadow-apple-lg',
        secondary: 'bg-verde-folha text-white hover:bg-verde-folha/90 hover:scale-[1.02] shadow-apple-md hover:shadow-apple-lg',
        outline: 'border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm hover:backdrop-blur-md hover:scale-[1.02]',
        ghost: 'hover:bg-accent/10 hover:text-accent-foreground',
        navy: 'bg-navy text-white hover:bg-navy/90 hover:scale-[1.02] shadow-apple-md hover:shadow-apple-lg',
        link: 'text-navy underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-12 px-6 py-3',
        sm: 'h-10 px-5 py-2 text-sm',
        lg: 'h-14 px-8 py-4 text-base',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
