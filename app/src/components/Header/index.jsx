import { useContext } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ChainIndicator from '../ChainIndicator'
import { ConnectionContext } from '../../contexts/ConnectionContext'
import { shortenAddress } from '../../utils'

function Header() {
  const { userAddress, chainId, connectWallet } = useContext(ConnectionContext)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Scaley Valley
          </Typography>
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
      </AppBar>
    </Box>
  )
}

export default Header
