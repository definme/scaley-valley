import React, { useState, useContext } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import ChangeValleyModal from '../ChangeValleyModal'
import { ConnectionContext } from '../../contexts/ConnectionContext'
import { getCollectionWithSigner } from '../../api/contracts'
import networks from '../../networks.json'
import { shortenAddress } from '../../utils'

function TokenCard({
  kind,
  valley,
  allValleys,
  contract_token_id,
  forceUpdate,
  collectionApprove,
  setCollectionApprove,
}) {
  const { chainId } = useContext(ConnectionContext)
  const [modalOpen, setModalOpen] = useState(false)
  const [txHash, setTxHash] = useState()
  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)

  function handleClick() {
    if (
      chainId === '5' &&
      valley.chain.toString() === '5' &&
      !collectionApprove
    ) {
      setApprove()
    } else {
      handleModalOpen()
    }
  }

  async function setApprove() {
    const collection = await getCollectionWithSigner(chainId)
    console.log(collection)
    await collection
      .setApprovalForAll(networks[chainId].contracts.erc721, true)
      .then(tx => {
        setTxHash(tx.hash)
        tx.wait()
          .then(() => {
            setTxHash()
            setCollectionApprove(true)
          })
          .catch(err => {
            console.log(err)
            setTxHash()
          })
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <Box className='card'>
      <img className='card__img' src={kind.image_uri} alt='character' />
      <img className='chain__img' src={valley.chain_icon} alt='chain img' />
      <Box className='description'>
        <div className='description__text'>
          Character with high agility and intelligence perks. His homeland is
          EthValley chain, thus he can travel to some other valley
        </div>
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
          {kind.name} (#{contract_token_id})
        </Typography>
        <Box>
          <Box>
            <Typography variant='caption' color='#616572'>
              Attributes:
            </Typography>
            <Typography color='white' marginBottom='20px'>
              20% boost for NFT's level and corresponding area(valley)
            </Typography>
          </Box>
          <Box>
            <Typography variant='caption' color='#616572'>
              Valley:
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: '20px',
              }}
            >
              <Typography color='white'>{valley.name}</Typography>
              <Avatar src={valley.image_uri} alt='chain'></Avatar>
            </Box>
          </Box>

          {txHash ? (
            <button className='card__inner-btn' style={{ width: '100%' }}>
              <a
                href={`${networks[chainId].params.blockExplorerUrls}tx/${txHash}`}
                target='_blank'
              >
                {txHash && shortenAddress(txHash)}
              </a>
            </button>
          ) : (
            <button
              className='card__inner-btn'
              style={{ width: '100%' }}
              onClick={handleClick}
              disabled={valley.chain.toString() !== chainId}
            >
              {chainId === '5' &&
              valley.chain.toString() === '5' &&
              !collectionApprove
                ? 'Approve'
                : 'Travel'}
            </button>
          )}
          <ChangeValleyModal
            open={modalOpen}
            handleClose={handleModalClose}
            allValleys={allValleys}
            tokenId={contract_token_id}
            forceUpdate={forceUpdate}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default TokenCard
