import { Home, Grid3x3, ShoppingCart, Heart } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useCartStore } from '@/store'
import { cn } from '@/lib/utils'

export default function MobileBottomNav() {
  const location = useLocation()
  const { items } = useCartStore()
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid3x3, label: 'Categories', path: '/categories' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', badge: cartItemCount },
    { icon: Heart, label: 'Wishlist', path: '/wishlist' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-14 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full relative transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-gray-500 active:text-primary'
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
