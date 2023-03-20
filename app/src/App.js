import { useState, useEffect, useContext } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { utils } from 'ethers'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Header from './components/Header'
import { BuyCharacter, BuyResource, ExploreValleys, MyTokens } from './pages'
import { getERC20RecourceWithProvider } from './api/contracts'
import { ConnectionContext } from './contexts/ConnectionContext'

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

function App() {
  // const location = useLocation()
  // const navigate = useNavigate()
  const { userAddress, chainId } = useContext(ConnectionContext)
  // const [value, setValue] = useState(0)

  // const handleChange = (event, newValue) => {
  //   setValue(newValue)
  //   switch (newValue) {
  //     case 0:
  //       navigate('/')
  //       break
  //     case 1:
  //       navigate('/resources')
  //       break
  //     case 2:
  //       navigate('/valleys')
  //       break
  //     case 3:
  //       navigate('/my-tokens')
  //       break
  //     default:
  //       navigate('/')
  //   }
  // }

  async function getWoodBalance() {
    const zksyncERC20 = await getERC20RecourceWithProvider('280')
    zksyncERC20
      .balanceOf(userAddress)
      .then(res => {
        const wood = Number(utils.formatEther(res))
        console.log('Wood:', wood)
      })
      .catch(e => console.log(e))
  }

  async function getOpticBalance() {
    const optiERC20 = await getERC20RecourceWithProvider('420')
    optiERC20
      .balanceOf(userAddress)
      .then(res => {
        const optic = Number(utils.formatEther(res))
        console.log('Optic:', optic)
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
  //
  // useEffect(() => {
  //   switch (location.pathname) {
  //     case '/':
  //       setValue(0)
  //       break
  //     case '/resources':
  //       setValue(1)
  //       break
  //     case '/valleys':
  //       setValue(2)
  //       break
  //     case '/my-tokens':
  //       setValue(3)
  //       break
  //     default:
  //       setValue(0)
  //   }
  // }, [location])

  useEffect(() => {
    if (userAddress) {
      getWoodBalance()
      getOpticBalance()
      getMainnetERC20Balance()
    }
  }, [userAddress])

  return (
    <>
      <Header />
      {/*<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>*/}
      {/*  <Tabs*/}
      {/*    value={value}*/}
      {/*    onChange={handleChange}*/}
      {/*    aria-label='basic tabs example'*/}
      {/*  >*/}
      {/*    <Tab label='Buy Character' {...a11yProps(0)} />*/}
      {/*    <Tab label='Buy Resources' {...a11yProps(1)} />*/}
      {/*    <Tab label='Explore the Valleys' {...a11yProps(2)} />*/}
      {/*    <Tab label='My Tokens' {...a11yProps(2)} />*/}
      {/*  </Tabs>*/}
      {/*</Box>*/}
      <Container sx={{
        marginTop: "100px"
      }}>
        <Box sx={{ my: 4 }}>
          <Routes>
            <Route exact path='/' element={<BuyCharacter />} />
            <Route path='/resources' element={<BuyResource />} />
            <Route path='/valleys' element={<ExploreValleys />} />
            <Route path='/my-tokens' element={<MyTokens />} />
            <Route path='*' element={<BuyCharacter />} />
          </Routes>
        </Box>
      </Container>
    </>
  )
}

export default App
