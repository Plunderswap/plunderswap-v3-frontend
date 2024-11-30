import { Flex, Heading, Text } from '@pancakeswap/uikit'
import type { TransakConfig } from '@transak/transak-sdk'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAccount } from 'wagmi'

const Container = styled(Flex)`
  flex-direction: column;
  align-items: center;
  padding: 24px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`

const TransakWidget = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 700px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
`

const OnRampPage = () => {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let transak: any

    if (address) {
      const initTransak = async () => {
        try {
          const { Transak } = await import('@transak/transak-sdk')

          const transakConfig: TransakConfig = {
            apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY ?? '',
            environment:
              process.env.NEXT_PUBLIC_TRANSAK_ENVIRONMENT === 'PRODUCTION'
                ? Transak.ENVIRONMENTS.PRODUCTION
                : Transak.ENVIRONMENTS.STAGING,
            defaultCryptoCurrency: 'ZIL',
            walletAddress: address,
            themeColor: '00D2FF',
            // hostURL: window.location.origin,
            widgetHeight: '700px',
            widgetWidth: '100%',
            defaultNetwork: 'zilliqa',
            defaultFiatCurrency: 'USD',
            // cryptoCurrencyList: 'ZIL,WZIL',
            // isDisableCrypto: true,
            hideMenu: true,
            exchangeScreenTitle: 'Buy ZIL',
            isFeeCalculationHidden: false,
            hideExchangeScreen: false,
            disableWalletAddressForm: true,
            isAutoFillUserData: true,
            containerId: 'transakMount',
            colorMode: 'DARK',
          }

          transak = new Transak(transakConfig)
          transak.init()

          // Order successful event
          Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
            // eslint-disable-next-line no-console
            console.log('Order Successful:', orderData)
          })
        } catch (error) {
          console.error('Failed to initialize Transak:', error)
          setIsLoading(false)
        }
      }

      initTransak()
      setIsLoading(false)
    }

    // Cleanup function
    return () => {
      if (transak) {
        transak.cleanup()
      }
    }
  }, [address])

  if (!address) {
    return (
      <Container>
        <Heading scale="xl" mb="24px">
          Buy ZIL
        </Heading>
        <Text>Please connect your wallet to continue</Text>
      </Container>
    )
  }

  if (isLoading) {
    return (
      <Container>
        <Text>Loading...</Text>
      </Container>
    )
  }

  return (
    <Container>
      <Heading scale="xl" mb="24px">
        Buy ZIL
      </Heading>
      <TransakWidget id="transakMount" />
    </Container>
  )
}

OnRampPage.chains = []
export default OnRampPage
