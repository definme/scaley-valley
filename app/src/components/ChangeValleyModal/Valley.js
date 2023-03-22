import { useContext, useState } from 'react'
import { utils } from 'ethers'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { ConnectionContext } from '../../contexts/ConnectionContext'
import { getERC721WithSigner } from '../../api/contracts'
import networks from '../../networks.json'
import { shortenAddress } from '../../utils'
import { getTokenById } from '../../api'

export default function Valley({ valley, tokenId, forceUpdate, handleClose }) {
  const { userAddress, chainId } = useContext(ConnectionContext)
  const [txHash, setTxHash] = useState()
  const [success, setSuccess] = useState()

  async function handleChangeChain() {
    const ERC721 = await getERC721WithSigner(chainId)

    ERC721.transferRemote(
      valley.chain,
      utils.hexZeroPad(userAddress, 32),
      tokenId,
      { value: utils.parseUnits('15000000', 'gwei') }
    )
      .then(tx => {
        setTxHash(tx.hash)
        tx.wait()
          .then(() => {
            setTimeout(function testTx() {
              getTokenById(tokenId)
                .then(res => {
                  if (res[0].valley.name === valley.name) {
                    forceUpdate()
                    handleClose()
                  } else {
                    setTimeout(testTx, 5000)
                  }
                })
                .catch(e => {
                  console.log(e)
                })
            }, 1000)
          })
          .catch(() => setSuccess('FAILED'))
      })
      .catch(e => console.log(e))
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
      }}
    >
      <img src={valley.image_uri} width='100px' alt='valley' />

      {txHash ? (
        <Button>
          <a
            href={`${networks[chainId].params.blockExplorerUrls}tx/${txHash}`}
            target='_blank'
          >
            {success ? success : txHash && shortenAddress(txHash)}
          </a>
        </Button>
      ) : (
        <Button onClick={handleChangeChain}>{valley.name}</Button>
      )}
      <Typography variant='caption' display='block' gutterBottom>
        {valley.description}
      </Typography>
    </Box>
  )
}
