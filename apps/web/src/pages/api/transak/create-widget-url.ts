import { NextApiHandler } from 'next'

interface TransakWidgetParams {
  apiKey: string
  referrerDomain: string
  defaultCryptoCurrency?: string
  walletAddressesData?: {
    networks: {
      [key: string]: { address: string }
    }
  }
  themeColor?: string
  defaultNetwork?: string
  defaultFiatCurrency?: string
  hideMenu?: boolean
  exchangeScreenTitle?: string
  isFeeCalculationHidden?: boolean
  hideExchangeScreen?: boolean
  disableWalletAddressForm?: boolean
  isAutoFillUserData?: boolean
  colorMode?: string
}

interface CreateWidgetUrlRequest {
  widgetParams: TransakWidgetParams
  landingPage?: string
}

interface CreateWidgetUrlResponse {
  data: {
    widgetUrl: string
  }
}

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { widgetParams, landingPage } = req.body as CreateWidgetUrlRequest

    // Get environment variables
    const accessToken = process.env.TRANSAK_ACCESS_TOKEN
    // Use api-gateway subdomain for Create Widget URL API (different from base API)
    const apiBaseUrl = process.env.TRANSAK_API_BASE_URL || 'https://api-gateway.transak.com'

    if (!accessToken) {
      return res.status(500).json({ 
        error: 'TRANSAK_ACCESS_TOKEN environment variable is required' 
      })
    }

    // Prepare the request to Transak's Create Widget URL API
    const requestBody: CreateWidgetUrlRequest = {
      widgetParams,
      ...(landingPage && { landingPage })
    }

    const response = await fetch(`${apiBaseUrl}/api/v2/auth/session`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'access-token': accessToken,
        'content-type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Transak API error:', response.status, errorText)
      return res.status(response.status).json({ 
        error: `Transak API error: ${response.status} ${errorText}` 
      })
    }

    const data: CreateWidgetUrlResponse = await response.json()

    // Cache for a short time since the widgetUrl expires in 5 minutes
    res.setHeader('Cache-Control', 'max-age=240, s-maxage=240') // 4 minutes

    return res.status(200).json(data)
  } catch (error) {
    console.error('Error creating Transak widget URL:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    return res.status(500).json({ 
      error: 'Internal server error while creating widget URL',
      details: error instanceof Error ? error.message : String(error)
    })
  }
}

export default handler
