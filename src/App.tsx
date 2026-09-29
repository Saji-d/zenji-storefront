import { useCallback, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { CartProvider, useCart } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { AddedToast } from './components/AddedToast'
import { Grain } from './components/Grain'
import { PageTransition } from './components/motion/PageTransition'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Collections from './pages/Collections'
import CollectionDetail from './pages/CollectionDetail'
import ProductPage from './pages/ProductPage'
import Lookbook from './pages/Lookbook'
import Story from './pages/Story'
import Faq from './pages/Faq'
import Wishlist from './pages/Wishlist'
import CartPage from './pages/CartPage'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

function Shell() {
  const [cartOpen, setCartOpen] = useState(false)
  const { lastAdded, dismissAdded } = useCart()
  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])

  // auto-dismiss the added toast
  useEffect(() => {
    if (!lastAdded) return
    const t = window.setTimeout(dismissAdded, 3200)
    return () => window.clearTimeout(t)
  }, [lastAdded, dismissAdded])

  return (
    <>
      <ScrollToTop />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header onOpenCart={openCart} />
      <main id="main">
        <AnimatedRoutes />
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={closeCart} />
      <AddedToast
        lastAdded={cartOpen ? null : lastAdded}
        onClose={dismissAdded}
        onOpenCart={openCart}
      />
      <Grain />
    </>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/drop" element={<PageTransition><Shop /></PageTransition>} />
        <Route path="/collection" element={<PageTransition><Collections /></PageTransition>} />
        <Route path="/collection/:slug" element={<PageTransition><CollectionDetail /></PageTransition>} />
        <Route path="/drop/:slug" element={<PageTransition><ProductPage /></PageTransition>} />
        <Route path="/lookbook" element={<PageTransition><Lookbook /></PageTransition>} />
        <Route path="/story" element={<PageTransition><Story /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><Faq /></PageTransition>} />
        <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Shell />
      </WishlistProvider>
    </CartProvider>
  )
}
