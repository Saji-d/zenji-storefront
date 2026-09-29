import { BrowserRouter } from 'react-router-dom'
import App from './App'

/**
 * The real application entry shell.
 *
 * `App` is router-dependent (useLocation/Routes/Link), so the BrowserRouter has
 * to live *inside* the app boundary that `main.tsx` mounts. Exported separately
 * so tests can mount the exact production shell without supplying their own
 * router — that guards against a blank screen shipping again.
 */
export function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

export default Root
