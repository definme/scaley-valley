import { useReducer } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Resource from '../../components/Resource'
import TokenCard from '../../components/TokenCard'
import React, { useEffect, useState } from 'react'
import { getTokens, getValleys } from '../../api'
import { getCollectionWithSigner } from '../../api/contracts'
import { ConnectionContext } from '../../contexts/ConnectionContext'
import networks from '../../networks.json'
import styles from './MyTokens.module.css'

function MyTokens({ woodBalance, opticBalance, waterBalance }) {
  const [tokens, setTokens] = useState([])
  const [valleys, setValleys] = useState([])
  const [collectionApprove, setCollectionApprove] = useState(false)
  const [forced, forceUpdate] = useReducer(x => x + 1, 0)

  const { userAddress, chainId } = React.useContext(ConnectionContext)

  function getAllTokens() {
    if (userAddress) {
      getTokens(userAddress)
        .then(res => {
          setTokens(res)
        })
        .catch(e => console.log(e))
    }
  }

  function getAllValleys() {
    getValleys()
      .then(res => {
        setValleys(res)
      })
      .catch(e => console.log(e))
  }

  async function getCollectionApprove() {
    const collection = await getCollectionWithSigner(chainId)
    collection
      .isApprovedForAll(userAddress, networks[chainId].contracts.erc721)
      .then(res => {
        setCollectionApprove(res)
      })
      .catch(e => console.log(e))
  }

  useEffect(() => {
    getAllValleys()
  }, [])

  useEffect(() => {
    getAllTokens()
  }, [userAddress, forced])

  useEffect(() => {
    if (userAddress && chainId === '5') getCollectionApprove()
  }, [userAddress, chainId])

  return (
    <>
      <p className={styles.main__title}>My Tokens</p>
      <Typography
        sx={{
          fontFamily: "'Inter', sans-serif",
          fontStyle: 'normal',
          fontWeight: '500',
          fontSize: '15px',
          lineHeight: '18px',
          textAlign: 'center',
          letterSpacing: '0.01em',
          margin: '12px 0 32px 0',
          color: '#616572',
        }}
      >
        {/* Какой-нибудь текст для большего понимания для пользователя. */}
      </Typography>

      <Typography
        sx={{
          fontFamily: "'Inter', sans-serif",
          fontStyle: 'normal',
          fontWeight: '600',
          fontSize: '24px',
          lineHeight: '29px',
          letterSpacing: '0.01em',
          margin: '12px 0 24px 0',
          color: '#FFF',
        }}
      >
        My Resources
      </Typography>
      <div className={styles.resource__container}>
        <Resource
          balance={woodBalance}
          color={'rgba(98,69,54, 0.1)'}
          image={require('../../assets/img/wood.png')}
        />
        <Resource
          balance={waterBalance}
          color={'rgba(59,189,211, 0.1)'}
          image={require('../../assets/img/water.png')}
        />
        <Resource
          balance={opticBalance}
          color={'rgba(255,234,148,0.1)'}
          image={require('../../assets/img/optic.png')}
        />
        <Resource
          balance={0}
          color={'rgba(191,251,233, 0.1)'}
          image={require('../../assets/img/air.png')}
        />
      </div>
      <Typography
        sx={{
          fontFamily: "'Inter', sans-serif",
          fontStyle: 'normal',
          fontWeight: '600',
          fontSize: '24px',
          lineHeight: '29px',
          letterSpacing: '0.01em',
          margin: '0 0 24px 0',
          color: '#FFF',
        }}
      >
        My Characters
      </Typography>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        {tokens.map((token, index) => (
          <TokenCard
            key={index}
            {...token}
            allValleys={valleys}
            forceUpdate={forceUpdate}
            collectionApprove={collectionApprove}
            setCollectionApprove={setCollectionApprove}
          />
        ))}
      </Box>
    </>
  )
}

export default MyTokens
