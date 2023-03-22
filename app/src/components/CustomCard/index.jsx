import React, { useEffect, useContext, useState } from 'react'
import { utils } from 'ethers'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import './CustomCard.css'
import {
  getTradeWithProvider,
  getERC20RecourceWithSigner,
} from '../../api/contracts'
import { ConnectionContext } from '../../contexts/ConnectionContext'
import networks from '../../networks.json'
import { shortenAddress } from '../../utils'

function CustomCard({ name, image_uri,payment_resource,contract_kind_id, description, price }) {
  const { userAddress, chainId } = useContext(ConnectionContext)
  const [contractPrice, setContractPrice] = useState()
  const [txHash, setTxHash] = useState()
  const [success, setSuccess] = useState()

  async function getCharacterPrice() {
    const trade = await getTradeWithProvider(
      payment_resource.spend_resource_chain.chain_id.toString()
    )

    trade
      .getPrice(contract_kind_id)
      .then(res => {
        setContractPrice(res)
      })
      .catch(e => console.log(e))
  }

  useEffect(() => {
    if (userAddress) getCharacterPrice()
  }, [])

  async function handleBuy() {
    const resourceERC20 = await getERC20RecourceWithSigner(chainId)

    resourceERC20
      .transfer(networks[chainId].contracts.trade, contractPrice)
      .then(tx => {
        setTxHash(tx.hash)
        tx.wait()
          .then(() => setSuccess('SUCCESS!!'))
          .catch(() => setSuccess('FAILED'))
      })
      .catch(e => console.log(e))
  }

  return (
    <Box className='card'>
      <img className='card__img' src={image_uri} alt='character image' />
      <Box className='description'>
        <div className='description__text'>{description}</div>
      </Box>
      <Box className='card__inner'>
        <Typography
          align='center'
          sx={{
            color: 'white',
            fontSize: '24px',
            borderBottom: ' 1px solid #49494B',
            paddingBottom: '8px',
            marginBottom: '10px',
            fontStyle: 'normal',
            fontWeight: '700',
            lineHeight: '29px',
            letterSpacing: '0.01em',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          {name}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant='caption' color='#616572' sx={{
                fontFamily: "'Inter', sans-serif"
            }}>
              Price
            </Typography>
            <Typography color='white' fontWeight='bold' sx={{
                fontFamily: "'Inter', sans-serif"
            }}>
              {contractPrice ? Number(utils.formatEther(contractPrice)) : Number(utils.formatEther(price))}{' '}
              {payment_resource?.resource_token_name}
            </Typography>
          </Box>
          {txHash ? (
            <button
              className='card__inner-btn'
              disabled={
                payment_resource.spend_resource_chain.chain_id.toString() !==
                chainId
              }
            >
              <a
                href={`${networks[chainId].params.blockExplorerUrls}tx/${txHash}`}
                target='_blank'
              >
                {success ? success : txHash && shortenAddress(txHash)}
              </a>
            </button>
          ) : (
            <button
              className='card__inner-btn'
              disabled={
                payment_resource.spend_resource_chain.chain_id.toString() !==
                chainId
              }
              onClick={handleBuy}
            >
              BUY
            </button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default CustomCard
