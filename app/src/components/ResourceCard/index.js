import { useState, useEffect, useContext } from 'react'
import { utils } from 'ethers'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { getERC20Recource } from '../../api/contracts'
import { ConnectionContext } from '../../contexts/ConnectionContext'
import networks from '../../networks.json'

function ResourceCard({ name, resource_token_name, chain, image_uri }) {
  const { userAddress } = useContext(ConnectionContext)
  const [price, setPrice] = useState(0)
  const [amount, setAmount] = useState('1')

  async function getResourceNativePrice() {
    const resourceERC20 = await getERC20Recource('5')
    resourceERC20
      .getRequiredNativeCurrencyToBuy(utils.parseEther(amount))
      .then(res => {
        setPrice(Number(utils.formatEther(res)))
      })
      .catch(e => console.log(e))
  }

  function handleAmount(e) {
    console.log(e)
    setAmount(e.target.value)
  }

  useEffect(() => {
    if (userAddress) getResourceNativePrice()
  }, [userAddress, amount])

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
          Price: {price} {networks[chain.chain_id].params.nativeCurrency.symbol}
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
            value={amount}
            onChange={handleAmount}
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
