import { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ResourceCard from '../../components/ResourceCard'
import { getResources } from '../../api'

function BuyResource({ renewResources }) {
  const [resources, setResources] = useState([])

  function getAllResources() {
    getResources()
      .then(res => {
        setResources(res)
      })
      .catch(e => console.log(e))
  }

  useEffect(() => {
    getAllResources()
  }, [])

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
        Buy resources
      </Typography>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'start',
          justifyContent: 'center',
          mt: '70px',
        }}
      >
        {resources.map((resource, index) => (
          <ResourceCard
            key={index}
            {...resource}
            renewResources={renewResources}
          />
        ))}
      </Box>
    </Box>
  )
}

export default BuyResource
