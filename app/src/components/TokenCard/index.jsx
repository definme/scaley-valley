import React, { useState, useContext } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import ChangeValleyModal from '../ChangeValleyModal'
import { ConnectionContext } from '../../contexts/ConnectionContext'

function TokenCard({ kind, valley, allValleys, contract_token_id, forceUpdate }) {
  const { chainId } = useContext(ConnectionContext)
  const [modalOpen, setModalOpen] = useState(false)
  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)

  return (
    <Box className='card'>
      <img className='card__img' src={kind.image_uri} alt='character' />
      <img
        className='chain__img'
        src={kind.payment_resource?.spend_resource_chain?.image_uri}
        alt='chain img'
      />
      <Box className='description'>
        <div className='description__text'>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur
          dignissimos dolore dolorem, earum eum ipsa laboriosam, modi neque,
          odit quibusdam quis voluptatem voluptates? Accusamus aperiam commodi
          pariatur quos temporibus? Illum.
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
          {kind.name}
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
          <button
            className='card__inner-btn'
            style={{ width: '100%' }}
            onClick={handleModalOpen}
            disabled={valley.chain.toString() !== chainId}
          >
            Travel
          </button>
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
