import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ThemeProvider } from './components/theme-provider'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Categories from './pages/Categories'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import About from './pages/About'
import Contact from './pages/Contact'
import BecomeDistributor from './pages/BecomeDistributor'
import Admin from './pages/Admin'
import DynamicFavicon from './components/DynamicFavicon'
import { initializeData } from './lib/storage'

// Initialize data on app load
initializeData()

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="tasly-theme">
      <DynamicFavicon />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:slug" element={<ProductDetail />} />
            <Route path="categories" element={<Categories />} />
            <Route path="cart" element={<Cart />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="become-distributor" element={<BecomeDistributor />} />
            <Route path="admin-tasly-ghana-346" element={<Admin />} />
          </Route>
        </Routes>
        <Toaster position="top-center" richColors closeButton />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
