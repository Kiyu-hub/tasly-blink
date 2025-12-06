import { ShoppingCart, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MobileStickyActionsProps {
  onAddToCart: () => void
  onAddToWishlist: () => void
  inWishlist: boolean
  disabled?: boolean
  price: string
}

export default function MobileStickyActions({
  onAddToCart,
  onAddToWishlist,
  inWishlist,
  disabled = false,
  price,
}: MobileStickyActionsProps) {
  return (
    <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border-t shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Price Display */}
          <div className="flex flex-col flex-1">
            <span className="text-xs text-muted-foreground">Total Price</span>
            <span className="text-lg font-bold text-primary">{price}</span>
          </div>

          {/* Wishlist Button */}
          <Button
            size="icon"
            variant="outline"
            onClick={onAddToWishlist}
            className="h-12 w-12 flex-shrink-0"
          >
            <Heart
              className={cn(
                'h-5 w-5',
                inWishlist && 'fill-red-500 text-red-500'
              )}
            />
          </Button>

          {/* Add to Cart Button */}
          <Button
            className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-primary to-green-600"
            onClick={onAddToCart}
            disabled={disabled}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {disabled ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  )
}
