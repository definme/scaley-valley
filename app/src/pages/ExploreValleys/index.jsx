import { useState, useEffect } from 'react'
import Container from '@mui/material/Container'
import Valley from '../../components/Valley'
import { getValleys } from '../../api'

function ExploreValleys() {
  const [valleys, setValleys] = useState([])

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

  return (
    <Container>
      {valleys.map((valley, idx) => (
        <Valley key={idx} {...valley} />
      ))}
    </Container>
  )
}

export default ExploreValleys
