import { useContext, useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ChainIndicator from '../ChainIndicator'
import { ConnectionContext } from '../../contexts/ConnectionContext'
import { shortenAddress } from '../../utils'
import Container from "@mui/material/Container";
import {useLocation, useNavigate} from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import logo from '../../assets/img/logo.svg'

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}
const innerTheme = createTheme({
  palette: {
    primary: {
      main: "#FFF",
    },

  },
});

function Header() {
  const { userAddress, chainId, connectWallet } = useContext(ConnectionContext)
  const navigate = useNavigate()
  const location = useLocation()
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
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position='fixed' sx={{
            backgroundColor: "#1B1C1E",
            borderBottom: "1px solid #2A2B2F"
          }}>
            <Container disableGutters>
              <Toolbar
                  sx={{
                    justifyContent: 'space-between'
                  }}
              >
                <Box className="logo__wrapper">
                  <img src={logo} alt="logo" className="logo-img"/>
                  <div className="logo-title">SCALEY-VALLEY</div>
                </Box>


                <ThemeProvider theme={innerTheme}>
                  <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label='basic tabs example'
                      sx={{
                        '& .MuiTabs-indicator': {backgroundColor: "white", borderRadius: "62px", height: "4px"},
                        '& .MuiTab-root': { color: "#616572"},
                      }}
                  >
                    <Tab label='Buy Character' {...a11yProps(0)} />
                    <Tab label='Buy Resources' {...a11yProps(1)} />
                    <Tab label='Explore the Valleys' {...a11yProps(2)} />
                    <Tab label='My Tokens' {...a11yProps(2)} />
                  </Tabs>
                </ThemeProvider>
                {userAddress ? (
                    <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                    >
                      <ChainIndicator chain={chainId} />
                      {shortenAddress(userAddress)}
                    </Box>
                ) : (
                    <Button color='inherit' onClick={connectWallet}>
                      Connect Wallet
                    </Button>
                )}
              </Toolbar>
            </Container>


          </AppBar>
        </Box>
    // <Box sx={{ flexGrow: 1 }}>
    //   <AppBar position='static' sx={{
    //     backgroundColor: "#1B1C1E"
    //   }}>
    //     <Container disableGutters>
    //       <Toolbar>
    //         <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
    //           Scaley Valley
    //         </Typography>
    //
    //         <Tabs
    //             value={value}
    //             onChange={handleChange}
    //             aria-label='basic tabs example'
    //             sx={{
    //               '& .MuiTabs-indicator': {backgroundColor: "white", borderRadius: "62px", height: "4px" },
    //               '& .MuiTab-root': { color: "#616572"},
    //               '& .Mui-selected': { color: "white"},
    //             }}
    //         >
    //           <Tab label='Buy Character' {...a11yProps(0)} />
    //           <Tab label='Buy Resources' {...a11yProps(1)} />
    //           <Tab label='Explore the Valleys' {...a11yProps(2)} />
    //           <Tab label='My Tokens' {...a11yProps(2)} />
    //         </Tabs>
    //
    //
    //         {userAddress ? (
    //             <Box
    //                 sx={{
    //                   display: 'flex',
    //                   flexDirection: 'row',
    //                   alignItems: 'center',
    //                   gap: '10px',
    //                 }}
    //             >
    //               <ChainIndicator chain={chainId} />
    //               {shortenAddress(userAddress)}
    //             </Box>
    //         ) : (
    //             <Button color='inherit' onClick={connectWallet}>
    //               Connect Wallet
    //             </Button>
    //         )}
    //       </Toolbar>
    //     </Container>
    //
    //
    //   </AppBar>
    // </Box>
  )
}

export default Header
