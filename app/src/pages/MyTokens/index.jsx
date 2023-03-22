import { useReducer } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Resource from '../../components/Resource'
import TokenCard from '../../components/TokenCard'
import React, { useEffect, useState } from 'react'
import { getTokens, getValleys } from '../../api'
import { ConnectionContext } from '../../contexts/ConnectionContext'

function MyTokens({ woodBalance, opticBalance, waterBalance }) {
  const [tokens, setTokens] = useState([])
  const [valleys, setValleys] = useState([])
  const [forced, forceUpdate] = useReducer(x => x + 1, 0)

  const { userAddress } = React.useContext(ConnectionContext)

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

  useEffect(() => {
    getAllValleys()
  }, [])

  useEffect(() => {
    getAllTokens()
  }, [userAddress, forced])

  return (
    <>
      <Typography
        sx={{
          fontFamily: "'Inter', sans-serif",
          fontStyle: 'normal',
          fontWeight: '600',
          fontSize: '40px',
          lineHeight: '48px',
          textAlign: 'center',
          letterSpacing: '0.01em',
          color: 'white',
          marginTop: '135px',
        }}
      >
        My Tokens
      </Typography>
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '32px',
          paddingBottom: '32px',
          borderBottom: '1px solid #323334',
        }}
      >
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
      </Box>

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
          />
        ))}
      </Box>
    </>
  )
}

export default MyTokens
