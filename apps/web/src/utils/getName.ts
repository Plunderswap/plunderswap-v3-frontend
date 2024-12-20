import { Chain, mainnet } from 'viem/chains'

import { Address } from 'viem'
import L2ResolverAbi from '../config/abi/l2ResolverAbi'
import { convertReverseNodeToBytes } from './convertReverseNodeToBytes'
import { getChainPublicClient } from './getChainPublicClient'
import { isEthereum } from './isEthereum'
import { isZilliqa } from './isZilliqa'

export type ZilliqaMainnetName = `${string}.zil`
export type ZilliqaTestnetName = `${string}.test.zil`
export type Zilname = ZilliqaMainnetName | ZilliqaTestnetName

/**
 * Note: exported as public Type
 */
export type GetName = {
  address: Address
  chain?: Chain
}

/**
 * Note: exported as public Type
 */
export type GetNameReturnType = string | Zilname | null

/**
 * An asynchronous function to fetch the Ethereum Name Service (ENS)
 * name for a given Ethereum address. It returns the ENS name if it exists,
 * or null if it doesn't or in case of an error.
 */
export const getName = async ({ address, chain = mainnet }: GetName): Promise<GetNameReturnType> => {
  const chainIsZilliqa = isZilliqa({ chainId: chain.id })
  const chainIsEthereum = isEthereum({ chainId: chain.id })
  const chainSupportsUniversalResolver = chainIsEthereum || chainIsZilliqa

  if (!chainSupportsUniversalResolver) {
    throw new Error('ChainId not supported, name resolution is only supported on Ethereum and Zilliqa.')
  }

  let client = getChainPublicClient(chain)

  if (chainIsZilliqa) {
    const addressReverseNode = convertReverseNodeToBytes(address, chain.id)
    try {
      const zilname = await client.readContract({
        abi: L2ResolverAbi,
        address: '0x5c0c7BFd25efCAE366fE62219fD5558305Ffc46F',
        functionName: 'name',
        args: [addressReverseNode],
      })
      if (zilname) {
        return zilname as Zilname
      }
    } catch {
      // This is a best effort attempt, so we don't need to do anything here.
    }
  }

  // Default to mainnet
  client = getChainPublicClient(mainnet)
  // ENS username
  const ensName = await client.getEnsName({
    address,
  })

  return ensName ?? null
}
