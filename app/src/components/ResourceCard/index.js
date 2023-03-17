import React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

function ResourceCard({ name, resource_token_name, price, chain, image_uri }) {
  return (
    <Box
      sx={{
        borderRadius: '20px',
        maxWidth: '268px',
        boxShadow: '0px 0px 5px 0px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          p: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          justifyContent: 'center',
          mb: '20px',
        }}
      >
        <Avatar src={chain.image_uri} alt='chain'></Avatar>
        <Typography align='center' textTransform='uppercase'>
          {resource_token_name}
        </Typography>
      </Box>
      <img src={image_uri} alt='recource' width='50%' />
      <Box
        sx={{
          mt: '20px',
          p: '15px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Typography variant='caption' sx={{ display: 'block', mb: '10px' }}>
          Description: Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </Typography>
        <Typography>Chain: {name}</Typography>
        <Typography variant='h6' gutterBottom sx={{ fontWeight: '700' }}>
          Price: {price} USDT
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: '20px',
            mb: '20px',
          }}
        >
          <Typography>I need: </Typography>
          <TextField
            id='outlined-number'
            label='amount'
            type='number'
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: '60%' }}
          />
        </Box>

        <Button
          variant='contained'
          sx={{
            fontWeight: 'bold',
            width: '100%',
          }}
        >
          BUY
        </Button>
      </Box>
    </Box>
  )
}

export default ResourceCard
