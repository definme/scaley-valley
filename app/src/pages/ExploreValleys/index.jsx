import Container from '@mui/material/Container'
import Valley from '../../components/Valley'

const valleys = [
  {
    name: 'EtherValley',
    chainNum: 5,
    chain: 'Ethereum',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam odio nunc, euismod in tellus at, vulputate iaculis massa. Sed aliquet placerat orci et rhoncus. Donec in est nec lorem interdum venenatis. Duis dapibus metus vel metus vulputate semper. Sed risus felis, placerat a mi imperdiet, accumsan aliquam lectus. ',
  },
  {
    name: 'PolyValley',
    chainNum: 80001,
    chain: 'Polygon',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam odio nunc, euismod in tellus at, vulputate iaculis massa. Sed aliquet placerat orci et rhoncus. Donec in est nec lorem interdum venenatis. Duis dapibus metus vel metus vulputate semper. Sed risus felis, placerat a mi imperdiet, accumsan aliquam lectus. ',
  },
  {
    name: 'OptiValley',
    chainNum: 420,
    chain: 'Optimism',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam odio nunc, euismod in tellus at, vulputate iaculis massa. Sed aliquet placerat orci et rhoncus. Donec in est nec lorem interdum venenatis. Duis dapibus metus vel metus vulputate semper. Sed risus felis, placerat a mi imperdiet, accumsan aliquam lectus. ',
  },
]

function ExploreValleys() {
  return (
    <Container>
      {valleys.map((valley, idx) => (
        <Valley key={idx} {...valley} />
      ))}
    </Container>
  )
}

export default ExploreValleys
