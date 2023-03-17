import * as React from 'react'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import networks from '../../networks.json'
import { SUPPORTED_CHAINS } from '../../constants'
import { ConnectionContext } from '../../contexts/ConnectionContext'

export default function ChainIndicator({ chain }) {
  const { switchNetwork } = React.useContext(ConnectionContext)
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  function handleChainClick(e, connectchainId) {
    switchNetwork(connectchainId)
    handleClose(e)
  }

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  const prevOpen = React.useRef(open)
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <div
      ref={anchorRef}
      id='composition-button'
      aria-controls={open ? 'composition-menu' : undefined}
      aria-expanded={open ? 'true' : undefined}
      aria-haspopup='true'
      onClick={handleToggle}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {SUPPORTED_CHAINS.includes(chain) ? (
          <>
            {' '}
            <Avatar src={networks[chain]?.image} alt='chain'></Avatar>
            <Typography variant='h6' component='h3'>
              {networks[chain].name}
            </Typography>
          </>
        ) : (
          <Typography variant='h6' component='h3' color='red'>
            Wrong network
          </Typography>
        )}

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement='bottom-start'
          transition
          disablePortal
          sx={{ zIndex: 100 }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id='composition-menu'
                    aria-labelledby='composition-button'
                    onKeyDown={handleListKeyDown}
                  >
                    {SUPPORTED_CHAINS.map((chain, idx) => (
                      <MenuItem
                        onClick={e => handleChainClick(e, chain)}
                        key={idx}
                      >
                        {networks[chain].name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    </div>
  )
}
