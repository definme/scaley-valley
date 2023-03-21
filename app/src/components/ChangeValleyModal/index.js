import { useContext } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import { ConnectionContext } from '../../contexts/ConnectionContext'

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

export default function ChangeValleyModal({ open, handleClose, allValleys }) {
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
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '15px',
                }}
                key={idx}
              >
                <img src={valley.image_uri} width='100px' alt='valley' />
                <Button>{valley.name}</Button>
                <Typography variant='caption' display='block' gutterBottom>
                  {valley.description}
                </Typography>
              </Box>
            ))}
        </Box>
      </Box>
    </Modal>
  )
}
