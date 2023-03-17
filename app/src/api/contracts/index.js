import { ethers } from 'ethers'
import networks from '../../networks.json'
import ERC20ResouceAbi from '../../abis/ERC20Abi.json'

export async function getERC20Recource(chainId) {
  let provider
  let signer
  switch (chainId) {
    case '280':
      provider = new ethers.providers.JsonRpcProvider(
        networks[chainId].params.rpcUrls[0]
      )
      signer = provider
      break
    default:
      provider = new ethers.providers.Web3Provider(window.ethereum)
      signer = provider.getSigner()
  }

  const ERC20 = new ethers.Contract(
    networks[chainId].contracts.erc20resource,
    ERC20ResouceAbi,
    signer
  )
  return ERC20
}
