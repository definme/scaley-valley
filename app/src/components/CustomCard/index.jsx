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

function CustomCard({ kind, description, price }) {
  const { userAddress, chainId } = useContext(ConnectionContext)
  const [contractPrice, setContractPrice] = useState()
  const [txHash, setTxHash] = useState()
  const [success, setSuccess] = useState()

  async function getCharacterPrice() {
    const trade = await getTradeWithProvider(
      kind.payment_resource.spend_resource_chain.chain_id.toString()
    )

    trade
      .getPrice(kind.contract_kind_id)
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
      <img className='card__img' src={kind.image_uri} alt='character image' />
      <Box className='description'>
        <div className='description__text'>{description}</div>
      </Box>
      <Box className='card__inner'>
        <Typography
          align='center'
          sx={{
            color: 'white',
            fontSize: '20px',
            borderBottom: ' 1px solid #49494B',
            paddingBottom: '8px',
            marginBottom: '10px',
          }}
        >
          {kind.name}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant='caption' color='#616572'>
              Price
            </Typography>
            <Typography color='white' fontWeight='bold'>
              {contractPrice ? Number(utils.formatEther(contractPrice)) : price}{' '}
              {kind.payment_resource?.resource_token_name}
            </Typography>
          </Box>
          {txHash ? (
            <button
              className='card__inner-btn'
              disabled={
                kind.payment_resource.spend_resource_chain.chain_id.toString() !==
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
                kind.payment_resource.spend_resource_chain.chain_id.toString() !==
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
