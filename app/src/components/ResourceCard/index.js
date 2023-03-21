import { useState, useContext } from 'react'
import { utils } from 'ethers'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { getERC20RecourceWithSigner } from '../../api/contracts'
import { ConnectionContext } from '../../contexts/ConnectionContext'
import networks from '../../networks.json'
import { shortenAddress } from '../../utils'
import { getOptimismTx, initializeOptimismBridge } from '../../api'

function ResourceCard({
  name,
  resource_token_name,
  spend_resource_chain,
  image_uri,
  price,
}) {
  const { userAddress, chainId } = useContext(ConnectionContext)
  const [txHash, setTxHash] = useState()
  const [success, setSuccess] = useState()
  const [amount, setAmount] = useState('100')

  function handleAmount(e) {
    setAmount(e.target.value)
  }

  async function handleBuy() {
    const resourceERC20 = await getERC20RecourceWithSigner(chainId)
    const value = utils.parseEther(amount).div(price)
    if (resource_token_name === 'OPTIC') {
      await window.ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: userAddress,
              to: networks['420'].contracts.bridge,
              value: value.toHexString(),
            },
          ],
        })
        .then(tx => {
          setTxHash(tx)
          initializeOptimismBridge(tx).then(() => {
            setTimeout(function testTx() {
              getOptimismTx(tx)
                .then(res => {
                  if (res.status === 'SUCCESS' || res.status === 'FAIL') {
                    setSuccess(res.status)
                  } else {
                    setTimeout(testTx, 5000)
                  }
                })
                .catch(e => {
                  console.log(e)
                })
            }, 1000)
          })
        })
        .catch(e => console.log(e))
    } else {
      resourceERC20
        .buy(utils.parseEther(amount), {
          value: value,
        })
        .then(tx => {
          setTxHash(tx.hash)
          tx.wait()
            .then(() => setSuccess('SUCCESS!!'))
            .catch(() => setSuccess('FAILED'))
        })
        .catch(e => console.log(e))
    }
  }

  return (
    <Box
      sx={{
        borderRadius: '20px',
        maxWidth: '268px',
        boxShadow: '0px 0px 5px 0px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
          backgroundColor: 'white'
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
          Price:{' '}
          {utils.formatEther(utils.parseEther(amount).div(price)).toString()}{' '}
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
        {txHash && !success && chainId !== '280' && (
          <Typography
            variant='body2'
            gutterBottom
            sx={{
              maxWidth: '200px',
              textAlign: 'center',
              m: 'auto',
              mt: '15px',
            }}
          >
            Keep calm: the bridge can take about 5 minutes
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default ResourceCard
