import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1.5 whitespace-nowrap border transition-colors [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "h-6 rounded-full border-transparent bg-primary px-2.5 text-[0.68rem] font-medium tracking-[0.06em] text-primary-foreground uppercase",
        secondary:
          "h-6 rounded-full border-transparent bg-secondary px-2.5 text-[0.68rem] font-medium tracking-[0.06em] text-secondary-foreground uppercase",
        destructive:
          "h-6 rounded-full border-destructive/25 bg-destructive/[0.07] px-2.5 text-[0.68rem] font-medium tracking-[0.06em] text-destructive uppercase",
        outline:
          "h-6 rounded-sm border-border px-2.5 text-[0.68rem] font-medium tracking-[0.14em] text-foreground uppercase",
        ghost: "h-6 rounded-sm border-transparent px-2 text-muted-foreground uppercase",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
