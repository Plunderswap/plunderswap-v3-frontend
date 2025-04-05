import { CHAIN_IDS } from 'utils/wagmi'
import DeBridgeWidget from 'views/Bridge/DeBridgeWidget'

const DeBridgePage = () => {
  return <DeBridgeWidget />
}

// Allow all chains
DeBridgePage.chains = CHAIN_IDS

export default DeBridgePage
