import { ethers } from 'ethers'
import networks from '../../networks.json'
import ERC20ResouceAbi from '../../abis/ERC20Abi.json'
import TradeContractAbi from '../../abis/TradeContractAbi.json'
import ERC721Abi from '../../abis/ERC721Abi.json'
import CollectionAbi from '../../abis/CollectionAbi.json'

export async function getProvider(chainId) {
  let provider
  if (chainId === '5' || chainId === '280' || chainId === '420') {
    provider = new ethers.providers.JsonRpcProvider(
      networks[chainId].params.rpcUrls[0]
    )
  } else {
    return
  }

  return provider
}

export async function getSigner() {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  return signer
}

export async function getERC20RecourceWithProvider(chainId) {
  let provider
  if (
    chainId === '5' ||
    chainId === '280' ||
    chainId === '420' ||
    chainId === '10200'
  ) {
    provider = new ethers.providers.JsonRpcProvider(
      networks[chainId].params.rpcUrls[0]
    )
  } else {
    return
  }

  const ERC20 = new ethers.Contract(
    networks[chainId].contracts.erc20resource,
    ERC20ResouceAbi,
    provider
  )
  return ERC20
}

export async function getERC20RecourceWithSigner(chainId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  const ERC20 = new ethers.Contract(
    networks[chainId].contracts.erc20resource,
    ERC20ResouceAbi,
    signer
  )
  return ERC20
}

export async function getTradeWithProvider(chainId) {
  let provider
  if (chainId === '280' || chainId === '420' || chainId === '10200') {
    provider = new ethers.providers.JsonRpcProvider(
      networks[chainId].params.rpcUrls[0]
    )
  } else {
    return
  }

  const Trade = new ethers.Contract(
    networks[chainId].contracts.trade,
    TradeContractAbi,
    provider
  )
  return Trade
}

export async function getERC721WithSigner(chainId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  const ERC721 = new ethers.Contract(
    networks[chainId].contracts.erc721,
    ERC721Abi,
    signer
  )
  return ERC721
}

export async function getCollectionWithSigner(chainId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  const Collection = new ethers.Contract(
    networks[chainId].contracts.collection,
    CollectionAbi,
    signer
  )
  return Collection
}
