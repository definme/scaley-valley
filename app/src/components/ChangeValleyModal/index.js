import { useContext } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { ConnectionContext } from '../../contexts/ConnectionContext'
import Valley from './Valley'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

export default function ChangeValleyModal({
  open,
  handleClose,
  allValleys,
  tokenId,
  forceUpdate,
}) {
  const { chainId } = useContext(ConnectionContext)
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Typography id='modal-modal-title' variant='h6' component='h2'>
          Choose a valley to travel
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            p: '40px 10px',
            gap: '20px',
          }}
        >
          {allValleys
            .filter(el => el.chain.toString() !== chainId)
            .map((valley, idx) => (
              <Valley
                valley={valley}
                key={idx}
                tokenId={tokenId}
                forceUpdate={forceUpdate}
                handleClose={handleClose}
              />
            ))}
        </Box>
      </Box>
    </Modal>
  )
}
