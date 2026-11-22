import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent text-sm font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/25 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground tracking-[0.06em] hover:bg-[color-mix(in_srgb,var(--plum)_86%,var(--charcoal))] active:bg-[color-mix(in_srgb,var(--plum)_76%,var(--charcoal))]",
        outline:
          "border-border bg-transparent text-foreground hover:border-foreground/25 hover:bg-foreground/[0.035] aria-expanded:bg-foreground/[0.05]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_srgb,var(--secondary)_88%,var(--charcoal))]",
        ghost:
          "text-foreground/75 hover:bg-foreground/[0.05] hover:text-foreground aria-expanded:bg-foreground/[0.06]",
        destructive:
          "border-destructive/25 bg-transparent text-destructive hover:bg-destructive/[0.07] focus-visible:ring-destructive/30",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 gap-2 px-4",
        xs: "h-7 gap-1.5 rounded-sm px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-sm px-3 text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 px-6",
        icon: "size-9",
        "icon-xs": "size-7 rounded-sm [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-sm [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
