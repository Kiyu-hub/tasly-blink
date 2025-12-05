import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import AnnouncementBar from './AnnouncementBar'
import CartSidebar from './CartSidebar'
import MobileMenu from './MobileMenu'
import SearchDialog from './SearchDialog'
import WhatsAppButton from './WhatsAppButton'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartSidebar />
      <MobileMenu />
      <SearchDialog />
      <WhatsAppButton />
    </div>
  )
}
