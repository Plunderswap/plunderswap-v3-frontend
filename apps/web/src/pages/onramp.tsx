import { useTheme } from '@pancakeswap/hooks'
import { Box, CopyAddress, Flex, Heading, Link, Text } from '@pancakeswap/uikit'
import { toBech32Address } from '@zilliqa-js/crypto'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAccount } from 'wagmi'

// TypeScript definitions for @transak/transak-sdk are outdated for the new widgetUrl pattern
// Using type assertion to bypass until they update their types

const Container = styled(Flex)`
  flex-direction: column;
  align-items: center;
  padding: 24px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  // Desktop styles
  @media (min-width: 852px) {
    position: relative;
  }
`

const AddressBox = styled(Box)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding: 8px;
  width: 100%;
  max-width: 960px;
  margin-bottom: 8px;

  // Desktop styles
  @media (min-width: 852px) {
    position: absolute;
    top: 24px;
    z-index: 10;
    left: 50%;
    transform: translateX(-50%);
  }
`

const AddressLabel = styled(Text)`
  font-size: 10px;
  margin-bottom: 2px;
`

const StyledCopyAddress = styled(CopyAddress)`
  font-size: 12px;

  > div {
    padding: 4px 8px;
    height: 28px;
  }
`

const WidgetContainer = styled.div`
  width: 100%;
  height: 570px; // Mobile height

  // Desktop styles
  @media (min-width: 852px) {
    height: 1000px; // Desktop height
    margin-bottom: 48px;
    margin-top: 12px;
  }

  & > div {
    height: 100%;
  }
`

const InfoSection = styled(Flex)`
  width: 100%;
  max-width: 1200px;
  gap: 24px;
  margin-top: 24px;
  flex-direction: row;

  @media (max-width: 968px) {
    flex-direction: column;
  }
`

const InfoCard = styled(Box)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 16px;
  padding: 24px;
  flex: 1;
  text-align: center;
`

const SupportLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 24px;
  color: ${({ theme }) => theme.colors.primary};
`

const OnRampPage = () => {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(true)
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null)
  const zilAddress = address ? toBech32Address(address) : ''
  const { isDark } = useTheme()

  // First effect: Generate widget URL
  useEffect(() => {
    if (address) {
      const generateWidgetUrl = async () => {
        try {
          // Generate the widget URL via our backend API (ALL params must go through API)
          const widgetParams = {
            apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY ?? '',
            referrerDomain: window.location.hostname,
            colorMode: isDark ? 'DARK' : 'LIGHT',
            // Add all the ZIL-specific parameters to the API call (using defaults so users can change)
            defaultCryptoCurrency: 'ZIL',
            defaultNetwork: 'zil',
            defaultFiatCurrency: 'USD',
            disableWalletAddressForm: true,
            isAutoFillUserData: true,
            hideMenu: false,
            exchangeScreenTitle: 'Buy Crypto',
            isFeeCalculationHidden: false,
            hideExchangeScreen: false,
            themeColor: '00D2FF',
            walletAddressesData: {
              networks: {
                zil: { address: zilAddress },
                ethereum: { address },
                optimism: { address },
                arbitrum: { address },
                base: { address },
                bsc: { address },
                unichain: { address },
                polygon: { address },
              },
            },
          }

          const response = await fetch('/api/transak/create-widget-url', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ widgetParams }),
          })

          if (!response.ok) {
            throw new Error(`Failed to create widget URL: ${response.statusText}`)
          }

          const { data } = await response.json()
          console.log('Generated widgetUrl from API:', data.widgetUrl)
          
          // Use the widgetUrl directly since sessionId encodes all our parameters
          setWidgetUrl(data.widgetUrl)
          setIsLoading(false)
        } catch (error) {
          console.error('Failed to generate widget URL:', error)
          setIsLoading(false)
        }
      }

      generateWidgetUrl()
    }
  }, [address, isDark, zilAddress])

  // Second effect: No SDK needed - we'll use direct iframe since manual URLs work
  // The SDK might be stripping out our URL parameters

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
        <Heading scale="xl" mb="24px">
          Buy ZIL
        </Heading>
        <Text>Loading Transak widget...</Text>
      </Container>
    )
  }

  return (
    <Container>
      <AddressBox>
        <div>
          <AddressLabel color="secondary" textTransform="uppercase" fontWeight="bold">
            Your Wallet Address
          </AddressLabel>
          <StyledCopyAddress account={address} tooltipMessage="Copied" />
        </div>
        <div>
          <AddressLabel color="secondary" textTransform="uppercase" fontWeight="bold">
            Your ZIL1 Address
          </AddressLabel>
          <StyledCopyAddress account={zilAddress} tooltipMessage="Copied" />
        </div>
      </AddressBox>
      <WidgetContainer>
        {widgetUrl && (
          <iframe
            src={widgetUrl}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            allow="clipboard-write"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Transak Widget"
          />
        )}
      </WidgetContainer>

      <InfoSection>
        <InfoCard>
          <Text bold mb="8px" fontSize="20px">
            Fast & Secure
          </Text>
          <Text color="textSubtle">Buy ZIL directly with your credit card, debit card, or bank transfer</Text>
        </InfoCard>

        <InfoCard>
          <Text bold mb="8px" fontSize="20px">
            Non-Custodial
          </Text>
          <Text color="textSubtle">Your funds go directly to your wallet - we never hold your crypto</Text>
        </InfoCard>

        <InfoCard>
          <Text bold mb="8px" fontSize="20px">
            Global Support
          </Text>
          <Text color="textSubtle">Available in 100+ countries with multiple payment methods</Text>
        </InfoCard>
      </InfoSection>

      <SupportLink href="https://support.transak.com" external>
        Need help? Contact Transak Support
      </SupportLink>
    </Container>
  )
}

OnRampPage.chains = []
export default OnRampPage
