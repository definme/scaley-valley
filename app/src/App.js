import { useState, useEffect, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { utils } from 'ethers'
import * as PushAPI from '@pushprotocol/restapi'
import { NotificationItem } from '@pushprotocol/uiweb'
import { createSocketConnection, EVENTS } from '@pushprotocol/socket'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Header from './components/Header'
import { BuyCharacter, BuyResource, ExploreValleys, MyTokens } from './pages'
import { getERC20RecourceWithProvider } from './api/contracts'
import { ConnectionContext } from './contexts/ConnectionContext'
import Footer from './components/Footer'
import { getSigner } from './api/contracts'
import { CHANNEL_ADDRESS } from './constants'

function App() {
  const { userAddress, chainId } = useContext(ConnectionContext)
  const [woodBalance, setWoodBalance] = useState(0)
  const [opticBalance, setOpticBalance] = useState(0)
  const [waterBalance, setWaterBalance] = useState(0)
  const [notifications, setNotifications] = useState()
  const [userSubscribed, setUserSubscribed] = useState(true)
  const [pushSocket, setPushSocket] = useState()

  async function subscribeNotifications() {
    await PushAPI.channels.subscribe({
      signer: await getSigner(),
      onSuccess: () => {
        getSubscribeNotifications()
      },
      onError: () => {
        console.error('opt in error')
      },
      env: 'staging',
      userAddress: `eip155:5:${userAddress}`,
      channelAddress: `eip155:5:${CHANNEL_ADDRESS}`,
    })
  }

  async function getSubscribeNotifications() {
    await PushAPI.channels
      .getSubscribers({
        channel: `eip155:5:${CHANNEL_ADDRESS}`,
        env: 'staging',
      })
      .then(res => {
        const arr = res.subscribers.map(el => utils.getAddress(el))
        if (arr.includes(userAddress)) {
          setUserSubscribed(true)
        } else {
          setUserSubscribed(false)
        }
      })
  }

  async function getNotifications() {
    await PushAPI.user
      .getFeeds({
        user: `eip155:5:${userAddress}`,
        env: 'staging',
        limit: 1,
        page: 1,
      })
      .then(res => {
        setNotifications(res[0])
      })
  }

  async function getPushSocket() {
    const pushSDKSocket = createSocketConnection({
      user: `eip155:5:${userAddress}`,
      env: 'staging',
      socketOptions: { autoConnect: true },
    })
    setPushSocket(pushSDKSocket)
  }

  async function getWoodBalance() {
    const zksyncERC20 = await getERC20RecourceWithProvider('280')
    zksyncERC20
      .balanceOf(userAddress)
      .then(res => {
        setWoodBalance(Number(utils.formatEther(res)))
      })
      .catch(e => console.log(e))
  }

  async function getOpticBalance() {
    const optiERC20 = await getERC20RecourceWithProvider('420')
    optiERC20
      .balanceOf(userAddress)
      .then(res => {
        setOpticBalance(Number(utils.formatEther(res)))
      })
      .catch(e => console.log(e))
  }

  async function getWaterBalance() {
    const gnosisERC20 = await getERC20RecourceWithProvider('10200')
    gnosisERC20
      .balanceOf(userAddress)
      .then(res => {
        setWaterBalance(Number(utils.formatEther(res)))
      })
      .catch(e => console.log(e))
  }

  async function getMainnetERC20Balance() {
    const mainERC20 = await getERC20RecourceWithProvider('5')
    mainERC20
      .balanceOf(userAddress)
      .then(res => {
        const main = Number(utils.formatEther(res))
        console.log('Mainnet:', main)
      })
      .catch(e => console.log(e))
  }

  function renewResources() {
    getWoodBalance()
    getOpticBalance()
    getWaterBalance()
  }

  useEffect(() => {
    if (userAddress) {
      renewResources()
      getMainnetERC20Balance()
      getSubscribeNotifications()
      getPushSocket()
    }
  }, [userAddress])

  useEffect(() => {
    pushSocket?.on(EVENTS.USER_FEEDS, getNotifications)
  }, [pushSocket])

  useEffect(() => {
    if (notifications) {
      setTimeout(() => {
        setNotifications()
      }, '10000')
    }
  }, [notifications])

  return (
    <>
      {!userSubscribed && chainId === '5' && (
        <button
          className='notifications-button'
          onClick={subscribeNotifications}
        >
          <img
            src={require('./assets/img/push.jpeg')}
            width='100%'
            height='auto'
            alt='push'
          />
        </button>
      )}
      <Box sx={{ padding: '0 24px' }}>
        {notifications && (
          <div className='notifications-container'>
            <NotificationItem
              notificationTitle={notifications.title}
              notificationBody={notifications.message}
              cta={notifications.cta}
              app={notifications.app}
              icon={notifications.icon}
              image={notifications.image}
              url={notifications.url}
              chainName={notifications.blockchain}
            />
          </div>
        )}
        <Header />
        <Container
          disableGutters
          sx={{
            marginTop: '100px',
            minHeight: '60vh',
          }}
        >
          <Box sx={{ my: 4 }}>
            <Routes>
              <Route
                exact
                path='/'
                element={<BuyCharacter renewResources={renewResources} />}
              />
              <Route
                path='/resources'
                element={<BuyResource renewResources={renewResources} />}
              />
              <Route path='/valleys' element={<ExploreValleys />} />
              <Route
                path='/my-tokens'
                element={
                  <MyTokens
                    woodBalance={woodBalance}
                    opticBalance={opticBalance}
                    waterBalance={waterBalance}
                  />
                }
              />
              <Route path='*' element={<BuyCharacter />} />
            </Routes>
          </Box>
        </Container>
        <Footer />
      </Box>
    </>
  )
}

export default App
