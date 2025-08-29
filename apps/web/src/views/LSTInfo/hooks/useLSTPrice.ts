import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { FAST_INTERVAL } from 'config/constants'
import { publicClient } from 'utils/wagmi'
import { formatUnits } from 'viem'

// Simple ABI for getPrice function
const GET_PRICE_ABI = [
  {
    name: 'getPrice',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'amount', type: 'uint256' }],
  },
] as const

export const getLSTPrice = async (proxyAddress: string) => {
  const data = await publicClient({ chainId: ChainId.ZILLIQA }).readContract({
    abi: GET_PRICE_ABI,
    address: proxyAddress as `0x${string}`,
    functionName: 'getPrice',
  })

  return formatUnits(data, 18)
}

export const useLSTPrice = (proxyAddress: string, enabled = true) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['lstPrice', proxyAddress],
    queryFn: () => getLSTPrice(proxyAddress),
    staleTime: FAST_INTERVAL,
    refetchInterval: FAST_INTERVAL,
    enabled: enabled && !!proxyAddress,
  })

  return {
    price: data || '0',
    isLoading,
    error,
  }
}

export const getLSTHistoricalPrice = async (proxyAddress: string, blockNumber: bigint) => {
  const data = await publicClient({ chainId: ChainId.ZILLIQA }).readContract({
    abi: GET_PRICE_ABI,
    address: proxyAddress as `0x${string}`,
    functionName: 'getPrice',
    blockNumber,
  })

  return formatUnits(data, 18)
}

export const getCurrentBlockNumber = async (): Promise<bigint> => {
  const blockNumber = await publicClient({ chainId: ChainId.ZILLIQA }).getBlockNumber()
  return blockNumber
} 