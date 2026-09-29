import { useCallback, useState } from 'react'
import { CartProvider } from './context/CartContext'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Collection } from './components/Collection'
import { Story } from './components/Story'
import { CartDrawer } from './components/CartDrawer'
import { Footer } from './components/Footer'

export default function App() {
  const [cartOpen, setCartOpen] = useState(false)

  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])

  const scrollToCollection = useCallback(() => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <CartProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header onOpenCart={openCart} />
      <main id="main">
        <Hero onShopClick={scrollToCollection} />
        <Marquee />
        <Collection />
        <Story />
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={closeCart} />
    </CartProvider>
  )
}
