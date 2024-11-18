import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, Image, Modal, ModalV2, Text } from '@pancakeswap/uikit'
import { useEffect, useState } from 'react'

export function PWAInstallPrompt() {
  const { t } = useTranslation()
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    const dismissedTimestamp = localStorage.getItem('pwaPromptDismissed')
    const isDismissed = dismissedTimestamp && Number(dismissedTimestamp) > Date.now()

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA Debug - Install prompt event triggered')
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    if (!isDismissed) {
      console.log('PWA Debug - Device:', isIOSDevice ? 'iOS' : 'Non-iOS')

      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone
      console.log('PWA Debug - Is standalone:', isStandalone)

      if (isIOSDevice && !isStandalone) {
        console.log('PWA Debug - Showing iOS prompt')
        setShowPrompt(true)
      }

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    } else {
      console.log('PWA Debug - Prompt was dismissed and still within 30-day period')
    }

    // Cleanup function
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const setDismissalTimestamp = () => {
    const thirtyDaysFromNow = Date.now() + 30 * 24 * 60 * 60 * 1000
    localStorage.setItem('pwaPromptDismissed', thirtyDaysFromNow.toString())
  }

  const handleDismiss = () => {
    setDismissalTimestamp()
    setShowPrompt(false)
    console.log('PWA Debug - Prompt dismissed, will show again in 30 days')
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    console.log('PWA Debug - Install button clicked')

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log('PWA Debug - User choice:', outcome)

    if (outcome === 'accepted') {
      setShowPrompt(false)
      setDismissalTimestamp()
      console.log('PWA Debug - App installed successfully')
    }
  }

  if (!showPrompt) return null

  return (
    <ModalV2 isOpen onDismiss={handleDismiss}>
      <Modal title={t('Install PlunderSwap App')}>
        <Flex flexDirection="column" alignItems="center" width="100%" style={{ gap: '16px' }}>
          <Flex justifyContent="center" width="100%">
            <Image src="/logo.png" width={96} height={96} alt="PlunderSwap" />
          </Flex>

          <Text>{t('Add PlunderSwap to your home screen for faster access')}</Text>

          {isIOS ? (
            <>
              <Text>
                {t('For iOS: Tap the share button')}{' '}
                <span role="img" aria-label="share">
                  📲
                </span>
              </Text>
              <Text>{t('Then select "Add to Home Screen"')}</Text>
            </>
          ) : (
            <Button onClick={handleInstallClick}>{t('Install App')}</Button>
          )}
        </Flex>
      </Modal>
    </ModalV2>
  )
}
