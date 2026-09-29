import { useCallback, useState } from 'react'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Collection } from './components/Collection'
import { Lookbook } from './components/Lookbook'
import { Story } from './components/Story'
import { CartDrawer } from './components/CartDrawer'
import { Footer } from './components/Footer'
import { Grain } from './components/Grain'

export default function App() {
  const [cartOpen, setCartOpen] = useState(false)

  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])

  const scrollToCollection = useCallback(() => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <CartProvider>
      <WishlistProvider>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header onOpenCart={openCart} />
        <main id="main">
          <Hero onShopClick={scrollToCollection} />
          <Marquee />
          <Collection />
          <Lookbook />
          <Story />
        </main>
        <Footer />
        <CartDrawer open={cartOpen} onClose={closeCart} />
        <Grain />
      </WishlistProvider>
    </CartProvider>
  )
}
