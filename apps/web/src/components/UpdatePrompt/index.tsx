import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, Modal, ModalV2, Text } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

// const isDevelopment = process.env.NODE_ENV === 'development'
const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

export function UpdatePrompt() {
  const { t } = useTranslation()
  const [showPrompt, setShowPrompt] = useState(false)
  const router = useRouter()

  const checkForUpdates = async () => {
    // Skip update check for development/localhost
    if (isLocalhost) {
      console.log('Update check skipped - development/localhost environment')
      return
    }

    try {
      const metaTag = document.querySelector('meta[name="build-id"]')
      const currentBuildId = metaTag?.getAttribute('content')
      const storedBuildId = localStorage.getItem('buildId')

      if (!storedBuildId || storedBuildId !== currentBuildId) {
        console.log('New version detected', { stored: storedBuildId, current: currentBuildId })
        setShowPrompt(true)
      }
    } catch (error) {
      console.error('Failed to check for updates:', error)
    }
  }

  useEffect(() => {
    router.events.on('routeChangeComplete', checkForUpdates)
    checkForUpdates()

    return () => {
      router.events.off('routeChangeComplete', checkForUpdates)
    }
  }, [router.events])

  const handleUpdate = () => {
    const metaTag = document.querySelector('meta[name="build-id"]')
    const currentBuildId = metaTag?.getAttribute('content')
    if (currentBuildId) {
      localStorage.setItem('buildId', currentBuildId)
    }

    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name)
        })
      })
    }
    window.location.reload(true)
  }

  // Don't render anything in development/localhost
  if (isLocalhost || !showPrompt) return null

  return (
    <ModalV2 isOpen>
      <Modal title={t('Update Available')}>
        <Flex flexDirection="column" alignItems="center" width="100%" style={{ gap: '16px' }}>
          <Text>{t('A new version of PlunderSwap is available')}</Text>
          <Text fontSize="14px" color="textSubtle">
            {t('Please refresh your browser to ensure you have the latest version')}
          </Text>
          <Button onClick={handleUpdate}>{t('Update Now')}</Button>
        </Flex>
      </Modal>
    </ModalV2>
  )
}
