import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import networks from '../../networks.json'

export default function Valley({ name, chain, description, image_uri }) {
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
          <Avatar src={networks[chain].image} alt='chain'></Avatar>
          <Typography variant='body1' component='h2'>
            {name}
          </Typography>
        </Box>
        <img src={image_uri} width='350px' alt='valley' />
      </Box>
      <Box
        sx={{
          p: '20px',
          pb: '5px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <Typography variant='h6' component='h3'>
          Chain: {networks[chain]?.params.chainName}
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
