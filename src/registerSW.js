// Registers the service worker in production builds only, so `vite dev`
// stays free of stale-cache surprises.
export function registerSW() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service worker registration failed:', err)
    })
  })
}
