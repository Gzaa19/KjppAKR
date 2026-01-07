import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const BrandOutlineButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                variant="outline"
                className={cn(
                    "rounded-full border-slate-300 text-slate-700 hover:border-kjpp-dark hover:bg-kjpp-dark hover:text-white transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed",
                    className
                )}
                {...props}
            >
                {children}
            </Button>
        )
    }
)
BrandOutlineButton.displayName = "BrandOutlineButton"

export { BrandOutlineButton }
