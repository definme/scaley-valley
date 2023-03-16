import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import { getNetworkIcon } from '../../utils'

export default function Valley({ name, chain, description, chainNum }) {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        mb: '30px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Avatar src={getNetworkIcon(+chainNum)} alt='chain'></Avatar>
          <Typography variant='body1' component='h2'>
            {name}
          </Typography>
        </Box>
        <img src={require('../../images/Valley.jpeg')} width='350px' />
      </Box>
      <Box
        sx={{ p: '20px', pb: '5px', display: 'flex', flexDirection: 'column' }}
      >
        <Typography variant='h6' component='h3'>
          Chain: {chain}
        </Typography>
        <Typography variant='subtitle2' component='p'>
          Description: {description}
        </Typography>
        <Button
          variant='contained'
          sx={{ mt: 'auto', maxWidth: '300px' }}
          onClick={() => navigate('/my-tokens')}
        >
          Travel to this valley
        </Button>
      </Box>
    </Box>
  )
}
