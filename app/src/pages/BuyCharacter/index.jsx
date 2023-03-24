import { useContext } from 'react'
import CustomCard from '../../components/CustomCard'
import Box from '@mui/material/Box'
import { useState, useEffect } from 'react'
import { getCharacters, getTokens } from '../../api'
import Typography from '@mui/material/Typography'
import { ConnectionContext } from '../../contexts/ConnectionContext'

function BuyCharacter({ renewResources }) {
  const { userAddress } = useContext(ConnectionContext)
  const [characters, setCharacters] = useState([])
  const [myCharactersLength, setMyCharactersLength] = useState(0)

  function getAllCharacters() {
    getCharacters()
      .then(res => {
        setCharacters(res)
      })
      .catch(e => console.log(e))
  }

  function getMyCharactersLength() {
    getTokens(userAddress)
      .then(res => {
        setMyCharactersLength(res.length)
      })
      .catch(e => console.log(e))
  }

  useEffect(() => {
    getAllCharacters()
  }, [])

  useEffect(() => {
    if (userAddress) getMyCharactersLength()
  }, [userAddress])

  return (
    <Box>
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
        Buy character
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
          margin: '12px 0 68px 0',
          color: '#616572',
        }}
      >
        You can buy one character for 1 network.
      </Typography>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {characters.map((character, index) => (
          <CustomCard
            key={index}
            description='Character with high agility and intelligence perks. His homeland is EthValley chain, thus he can travel to some other valley'
            {...character}
            myCharactersLength={myCharactersLength}
            renewResources={renewResources}
          />
        ))}
      </Box>
    </Box>
  )
}

export default BuyCharacter
