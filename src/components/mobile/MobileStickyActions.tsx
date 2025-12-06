import { ShoppingCart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store'

interface MobileStickyActionsProps {
  onAddToCart: () => void
  disabled?: boolean
  price: string
  quantity: number // Keep for future use
}

export default function MobileStickyActions({
  onAddToCart,
  disabled = false,
  price,
}: MobileStickyActionsProps) {
  const navigate = useNavigate()
  const cartItems = useCartStore((state) => state.items)
  const hasCartItems = cartItems.length > 0

  const handleButtonClick = () => {
    if (hasCartItems) {
      navigate('/cart')
    } else {
      onAddToCart()
    }
  }

  return (
    <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border-t shadow-lg">
      <div className="container mx-auto px-3 py-2.5">
        <div className="flex items-center gap-2">
          {/* Price Display */}
          <div className="flex flex-col flex-1">
            <span className="text-[10px] text-muted-foreground leading-tight">Total Price</span>
            <span className="text-base font-bold text-primary leading-tight">{price}</span>
          </div>

          {/* Dynamic Button */}
          <Button
            className="flex-1 h-11 text-sm font-semibold bg-gradient-to-r from-primary to-green-600"
            onClick={handleButtonClick}
            disabled={disabled && !hasCartItems}
          >
            {hasCartItems ? (
              <>
                View Cart
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </>
            ) : (
              <>
                <ShoppingCart className="mr-1.5 h-4 w-4" />
                {disabled ? 'Out of Stock' : 'Add to Cart'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
