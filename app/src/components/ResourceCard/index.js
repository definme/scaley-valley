import { useState, useEffect, useContext } from 'react'
import { utils } from 'ethers'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import {
    getERC20RecourceWithProvider,
    getERC20RecourceWithSigner, initializeOptimismBridge,
} from '../../api/contracts'
import { ConnectionContext } from '../../contexts/ConnectionContext'
import networks from '../../networks.json'
import { shortenAddress } from '../../utils'

function ResourceCard({
  name,
  resource_token_name,
  spend_resource_chain,
  image_uri,
}) {
  const { userAddress, chainId } = useContext(ConnectionContext)
  const [price, setPrice] = useState(0)
  const [txHash, setTxHash] = useState()
  const [success, setSuccess] = useState()
  const [amount, setAmount] = useState('1')

  async function getResourceNativePrice() {
    let resourceERC20
    if (spend_resource_chain.chain_id.toString() === '280') {
      resourceERC20 = await getERC20RecourceWithProvider('280')
    } else {
      resourceERC20 = await getERC20RecourceWithProvider('5')
    }
    resourceERC20
      .getRequiredNativeCurrencyToBuy(utils.parseEther(amount))
      .then(res => {
        setPrice(res)
      })
      .catch(e => console.log(e))
  }

  function handleAmount(e) {
    setAmount(e.target.value)
  }

  async function handleBuy() {
    const resourceERC20 = await getERC20RecourceWithSigner(chainId)
    console.log(resource_token_name)
      if(resource_token_name === "OPTIC"){
          let value = utils.parseEther(amount).div(price);

          window.ethereum.request({
              method: 'eth_sendTransaction',
              params: [{
                  from: userAddress,
                  to: "0x22E837C1E3380e8f38758C8490d9865433bF3ad5",
                  value: value.toString()
              }]
          }).then( res => {
              setTxHash(res.hash);
              console.log(res.hash)
          });
          // initializeOptimismBridge(txHash);
      }else{
          resourceERC20
              .buy(utils.parseEther(amount), { value: price })
              .then(tx => {
                  setTxHash(tx.hash)
                  tx.wait()
                      .then(() => setSuccess('SUCCESS!!'))
                      .catch(() => setSuccess('FAILED'))
              })
              .catch(e => console.log(e))
      }
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
        <Avatar src={spend_resource_chain.image_uri} alt='chain'></Avatar>
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
          Price: {Number(utils.formatEther(price))}{' '}
          {networks[spend_resource_chain.chain_id].params.nativeCurrency.symbol}
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
        {txHash ? (
          <Button
            variant='contained'
            sx={{
              fontWeight: 'bold',
              width: '100%',
            }}
          >
            <a
              href={`${networks[chainId].params.blockExplorerUrls}tx/${txHash}`}
              target='_blank'
            >
              {success ? success : txHash && shortenAddress(txHash)}
            </a>
          </Button>
        ) : (
          <Button
            variant='contained'
            sx={{
              fontWeight: 'bold',
              width: '100%',
            }}
            disabled={
              (spend_resource_chain.chain_id !== 280 && chainId !== '5') ||
              (spend_resource_chain.chain_id === 280 && chainId !== '280')
            }
            onClick={handleBuy}
          >
            BUY
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default ResourceCard
