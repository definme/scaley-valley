import { ethers } from 'ethers'
import networks from '../../networks.json'
import ERC20ResouceAbi from '../../abis/ERC20Abi.json'

export async function getERC20RecourceWithProvider(chainId) {
  let provider
  if (chainId === '5' || chainId === '280' || chainId === '420') {
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
