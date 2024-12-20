import { ChainId } from '@pancakeswap/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useSidNameForAddress } from 'hooks/useSid'
import { useUnsNameForAddress } from 'hooks/useUns'
import { useMemo } from 'react'
import { Address, useEnsAvatar, useEnsName, useNetwork } from 'wagmi'
import { useName } from './useName'

export const useDomainNameForAddress = (address?: `0x${string}` | string, fetchData = true) => {
  const { chainId } = useActiveChainId()
  const { chain } = useNetwork()
  const { sidName, isLoading: isSidLoading } = useSidNameForAddress(address as Address, fetchData)
  const { unsName, isLoading: isUnsLoading } = useUnsNameForAddress(
    address as Address,
    fetchData && !sidName && !isSidLoading,
  )
  const { data: ensName, isLoading: isEnsLoading } = useEnsName({
    address: address as Address,
    chainId: chainId === ChainId.GOERLI ? ChainId.GOERLI : ChainId.ETHEREUM,
    enabled: chainId !== ChainId.BSC && chainId !== ChainId.BSC_TESTNET,
  })
  const { data: zilName, isLoading: isZilNameLoading } = useName({
    address: address as Address,
    chain,
  })
  const { data: ensAvatar, isLoading: isEnsAvatarLoading } = useEnsAvatar({
    name: ensName,
    chainId: chainId === ChainId.GOERLI ? ChainId.GOERLI : ChainId.ETHEREUM,
    enabled: chainId !== ChainId.BSC && chainId !== ChainId.BSC_TESTNET,
  })

  return useMemo(() => {
    return {
      domainName: zilName || ensName || sidName || unsName,
      avatar: ensAvatar ?? undefined,
      isLoading:
        isZilNameLoading ||
        isEnsLoading ||
        isEnsAvatarLoading ||
        (!ensName && isSidLoading) ||
        (!sidName && isUnsLoading),
    }
  }, [
    sidName,
    unsName,
    isSidLoading,
    isUnsLoading,
    ensName,
    isEnsLoading,
    ensAvatar,
    isEnsAvatarLoading,
    zilName,
    isZilNameLoading,
  ])
}
