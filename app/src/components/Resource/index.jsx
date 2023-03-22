import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function Resource({ balance, color, image }) {
  return (
    <Box
      sx={{
        background:
          ' linear-gradient(135.01deg, #3E3E3E 14.4%, #21242A 112.02%)',
        width: '282px',
        height: '179px',
        borderRadius: '16px',
      }}
    >
      <Box
        sx={{
          backgroundColor: color,
          width: '100%',
          height: '100%',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          flexDirection: 'column',
        }}
      >
        <img height='52px' alt='resource' src={image} />
        <Typography
          sx={{
            color: 'white',
            fontSize: '32px',
            textAlign: 'center',
            fontWeight: '700',
            lineHeight: '38px',
          }}
        >
          {Number(Number(balance).toFixed(2))}
        </Typography>
      </Box>
    </Box>
  )
}
