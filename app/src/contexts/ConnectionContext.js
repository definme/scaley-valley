import React from 'react'
import useConnection from '../hooks/useConnection'

export const ConnectionContext = React.createContext()

const ConnectionProvider = ({ children }) => {
  const {
    chainId,
    getChain,
    userAddress,
    getUserAddress,
    connectWallet,
    switchNetwork,
  } = useConnection()

  return (
    <ConnectionContext.Provider
      value={{
        userAddress,
        chainId,
        getChain,
        getUserAddress,
        connectWallet,
        switchNetwork,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  )
}

export default ConnectionProvider
