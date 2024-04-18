import {
  useAudioPlay,
  useExpertMode,
  useSpeedQuote,
  useUserSingleHopOnly,
  useUserSlippage,
} from '@pancakeswap/utils/user'

import useTheme from 'hooks/useTheme'
import { useWebNotifications } from 'hooks/useWebNotifications'
import { useGasPriceManager, useSubgraphHealthIndicatorManager, useUserUsernameVisibility } from 'state/user/hooks'
import { useUserChart } from 'state/user/hooks/useUserChart'
import { useUserTokenRisk } from 'state/user/hooks/useUserTokenRisk'
import { useMMLinkedPoolByDefault } from 'state/user/mmLinkedPool'
import {
  useUserSplitRouteEnable,
  useUserStableSwapEnable,
  useUserV2SwapEnable,
  useUserV3SwapEnable,
} from 'state/user/smartRouter'
import { useIsSwapHotTokenDisplayFlag } from './useSwapHotTokenDisplay'
import { useTransactionDeadline } from './useTransactionDeadline'

export function useGlobalSettingsEvaluation() {
  const [gasPrice] = useGasPriceManager()

  const [expertMode] = useExpertMode()
  const [audioPlay] = useAudioPlay()
  const [subgraphHealth] = useSubgraphHealthIndicatorManager()
  const [userUsernameVisibility] = useUserUsernameVisibility()
  const { enabled } = useWebNotifications()
  const [userChart] = useUserChart(false)
  const isSwapHotTokenDisplay = useIsSwapHotTokenDisplayFlag()

  const [tokenRisk] = useUserTokenRisk()

  const { isDark } = useTheme()

  const [isStableSwapByDefault] = useUserStableSwapEnable()
  const [v2Enable] = useUserV2SwapEnable()
  const [v3Enable] = useUserV3SwapEnable()
  const [split] = useUserSplitRouteEnable()
  const [isMMLinkedPoolByDefault] = useMMLinkedPoolByDefault()
  const [singleHopOnly] = useUserSingleHopOnly()
  const [speedQuote] = useSpeedQuote()

  const [userSlippageTolerance] = useUserSlippage()
  const [ttl] = useTransactionDeadline()
}
