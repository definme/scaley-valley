import * as React from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Header from './components/Header'

function App() {
  return (
    <>
      <Header />
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography variant='h4' component='h1' gutterBottom>
            Scaley Valley app
          </Typography>
        </Box>
      </Container>
    </>
  )
}

export default App
