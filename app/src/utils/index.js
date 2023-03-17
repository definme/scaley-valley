export function shortenAddress(address) {
  return `${address.substring(0, 5)}...${address.substring(address.length - 4)}`
}

export function getNetworkIcon(chain) {
  switch (chain) {
    case 5:
      return require('../images/Ethereum.png')
    case 420:
      return require('../images/Optimism.jpeg')
    case 1422:
      return require('../images/Polygon.png')
    default:
      return require('../images/Ethereum.png')
  }
}
