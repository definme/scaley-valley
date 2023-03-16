import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Header from './components/Header'
import ConnectionProvider from './contexts/ConnectionContext'
import { BuyCharacter, BuyResource, ExploreValleys, MyTokens } from './pages'

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
    switch (newValue) {
      case 0:
        navigate('/')
        break
      case 1:
        navigate('/resources')
        break
      case 2:
        navigate('/valleys')
        break
      case 3:
        navigate('/my-tokens')
        break
      default:
        navigate('/')
    }
  }

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setValue(0)
        break
      case '/resources':
        setValue(1)
        break
      case '/valleys':
        setValue(2)
        break
      case '/my-tokens':
        setValue(3)
        break
      default:
        setValue(0)
    }
  }, [location])

  return (
    <ConnectionProvider>
      <Header />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='basic tabs example'
        >
          <Tab label='Buy Character' {...a11yProps(0)} />
          <Tab label='Buy Recources' {...a11yProps(1)} />
          <Tab label='Explore the Valleys' {...a11yProps(2)} />
          <Tab label='My Tokens' {...a11yProps(2)} />
        </Tabs>
      </Box>
      <Container>
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
    </ConnectionProvider>
  )
}

export default App
