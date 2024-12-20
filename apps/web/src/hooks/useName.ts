import { useQuery } from '@tanstack/react-query'
import { getName, GetNameReturnType } from 'utils/getName'
import { Address } from 'viem'
import { Chain, mainnet } from 'viem/chains'

/**
 * Note: exported as public Type
 */
export type UseQueryOptions = {
  enabled?: boolean
  cacheTime?: number
}

/**
 * Note: exported as public Type
 */
export type UseNameOptions = {
  address: Address // The Ethereum address for which the ENS name is to be fetched.
  chain?: Chain // Optional chain for domain resolution
}

/**
 * It leverages the `@tanstack/react-query` hook for fetching and optionally caching the ENS name
 * @returns An object containing:
 *  - `ensName`: The fetched ENS name for the provided address, or null if not found or in case of an error.
 *  - `{UseQueryResult}`: The rest of useQuery return values. including isLoading, isError, error, isFetching, refetch, etc.
 */
export const useName = ({ address, chain = mainnet }: UseNameOptions, queryOptions?: UseQueryOptions) => {
  const { enabled = true, cacheTime } = queryOptions ?? {}
  const ensActionKey = `ens-name-${address}-${chain.id}`
  return useQuery<GetNameReturnType>({
    queryKey: ['useName', ensActionKey],
    queryFn: async () => {
      return getName({ address, chain })
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false,
  })
}
