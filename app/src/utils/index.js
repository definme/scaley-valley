export function shortenAddress(address) {
  return `${address.substring(0, 5)}...${address.substring(address.length - 4)}`
}

export function getNetworkIcon(chain) {
  switch (chain) {
    case 420:
      return require('../images/Optimism.jpeg')
    case 80001:
      return require('../images/Polygon.png')
    default:
      return require('../images/Polygon.png')
  }
}
