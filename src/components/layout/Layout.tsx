import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import AnnouncementBar from './AnnouncementBar'
import CartSidebar from './CartSidebar'
import MobileMenu from './MobileMenu'
import SearchDialog from './SearchDialog'
import WhatsAppButton from './WhatsAppButton'
import MobileBottomNav from '../mobile/MobileBottomNav'
import { trackPageView, trackVisitor } from '@/lib/storage'

export default function Layout() {
  const location = useLocation()

  useEffect(() => {
    // Track page view on every route change
    trackPageView()
    
    // Track unique visitor (only once per day)
    trackVisitor()
  }, [location])

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <CartSidebar />
      <MobileMenu />
      <SearchDialog />
      <WhatsAppButton />
      <MobileBottomNav />
    </div>
  )
}
