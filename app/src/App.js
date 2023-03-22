import { useState, useEffect, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { utils } from 'ethers'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Header from './components/Header'
import { BuyCharacter, BuyResource, ExploreValleys, MyTokens } from './pages'
import { getERC20RecourceWithProvider } from './api/contracts'
import { ConnectionContext } from './contexts/ConnectionContext'
import Footer from "./components/Footer";

function App() {
  const { userAddress } = useContext(ConnectionContext)
  const [woodBalance, setWoodBalance] = useState(0)
  const [opticBalance, setOpticBalance] = useState(0)
  const [waterBalance, setWaterBalance] = useState(0)

  async function getWoodBalance() {
    const zksyncERC20 = await getERC20RecourceWithProvider('280')
    zksyncERC20
      .balanceOf(userAddress)
      .then(res => {
        setWoodBalance(Number(utils.formatEther(res)))
      })
      .catch(e => console.log(e))
  }

  async function getOpticBalance() {
    const optiERC20 = await getERC20RecourceWithProvider('420')
    optiERC20
      .balanceOf(userAddress)
      .then(res => {
        setOpticBalance(Number(utils.formatEther(res)))
      })
      .catch(e => console.log(e))
  }

  async function getWaterBalance() {
    const gnosisERC20 = await getERC20RecourceWithProvider('10200')
    gnosisERC20
      .balanceOf(userAddress)
      .then(res => {
        setWaterBalance(Number(utils.formatEther(res)))
      })
      .catch(e => console.log(e))
  }

  async function getMainnetERC20Balance() {
    const mainERC20 = await getERC20RecourceWithProvider('5')
    mainERC20
      .balanceOf(userAddress)
      .then(res => {
        const main = Number(utils.formatEther(res))
        console.log('Mainnet:', main)
      })
      .catch(e => console.log(e))
  }

  function renewResources() {
    getWoodBalance()
    getOpticBalance()
    getWaterBalance()
  }

  useEffect(() => {
    if (userAddress) {
      renewResources()
      getMainnetERC20Balance()
    }
  }, [userAddress])

  return (
    <Box sx={{padding: '0 24px'}}>
        <Header />
      <Container disableGutters
        sx={{
          marginTop: '100px',

        }}
      >
        <Box sx={{ my: 4 }}>
          <Routes>
            <Route exact path='/' element={<BuyCharacter />} />
            <Route
              path='/resources'
              element={<BuyResource renewResources={renewResources} />}
            />
            <Route path='/valleys' element={<ExploreValleys />} />
            <Route
              path='/my-tokens'
              element={
                <MyTokens
                  woodBalance={woodBalance}
                  opticBalance={opticBalance}
                  waterBalance={waterBalance}
                />
              }
            />
            <Route path='*' element={<BuyCharacter />} />
          </Routes>
        </Box>
      </Container>
        <Footer/>
    </Box>
  )
}

export default App
