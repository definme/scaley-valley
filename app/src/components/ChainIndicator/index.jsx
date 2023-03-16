import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import networks from '../../networks.json'
import { SUPPORTED_CHAINS } from '../../constants'
import { getNetworkIcon } from '../../utils'

export default function ChainIndicator({ chain }) {
  if (SUPPORTED_CHAINS.includes(chain)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Avatar src={getNetworkIcon(+chain)} alt='chain'></Avatar>
        <Typography variant='h6' component='h3'>
          {networks[chain].name}
        </Typography>
      </Box>
    )
  }
  return (
    <Typography variant='h6' component='h3' color='red'>
      Wrong network
    </Typography>
  )
}
