import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import ResourceCard from '../../components/ResourceCard'
import { getResources } from '../../api'

function BuyResource() {
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
        <ResourceCard key={index} {...resource} />
      ))}
    </Box>
  )
}

export default BuyResource
