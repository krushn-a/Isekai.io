import { myPlayer, useMultiplayerState, usePlayersState } from 'playroomkit'
import { useEffect, useRef, useState } from 'react'
import chatIcon from '../../assets/chatIcon.svg'
import closeIcon from '../../assets/closeIcon.svg'
import { isTouchableScreen } from '../../utils/helpers'

function getDistance(position1, position2) {
  if (!position1 || !position2) {
    return Infinity
  }

  const dx = position1[0] - position2[0]
  const dy = position1[1] - position2[1]
  const dz = position1[2] - position2[2]

  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}
export const Chat = () => {
  return (
    <div
      className='flex justify-start md:justify-left md:w-full'
      onTouchMove={e => {
        e.stopPropagation()
      }}
    >
      <ChatWindow />
    </div>
  )
}

const MAX_MESSAGES = 6
const AUTOHIDE_TIMEOUT = 2000

const ChatWindow = () => {
  const [input, setInput] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const [autohide, setAutohide] = useState(true)
  const [myPlayeri, setMyPlayeri] = useState(null)
  const [nearestPlayer, setNearestPlayer] = useState(null)
  const autohideRef = useRef()
  const [messages, setMessages] = useMultiplayerState('messages', [])
  const player = myPlayer()

  // const [distance, setDistance] = useState(0)

  const allPlayers = usePlayersState('withVoiceChat')
  useEffect(() => {
    let myPlayerLocation
    let nearestPlayerName
    let myPlayerName
    let smallestDistance = Infinity

    // First loop to find myPlayerLocation
    allPlayers.forEach(({ player: p }) => {
      if (p.id === p.myId) {
        myPlayerName = p.getState().player_name
        myPlayerLocation = p.getState().position
      }
    })

    // Second loop to find the nearest player
    allPlayers.forEach(({ player: p }) => {
      if (p.id !== p.myId) {
        const otherPlayerLocation = p.getState().position
        const distance = getDistance(myPlayerLocation, otherPlayerLocation)
        if (distance < 3) {
          nearestPlayerName = p.getState().player_name
          console.log(distance)
        }
      }
    })

    setMyPlayeri(myPlayerName)
    setNearestPlayer(nearestPlayerName)
  }, [allPlayers])

  console.log(myPlayeri)
  console.log(nearestPlayer)

  useEffect(() => {
    // hides joystick when chat opens
    const joystickContainer = window.document.querySelector('#joystick')
    joystickContainer.style.display = showChat ? 'none' : ''
  }, [showChat])

  const scheduleAutohideMessages = () => {
    clearTimeout(autohideRef.current)
    autohideRef.current = setTimeout(() => setAutohide(true), AUTOHIDE_TIMEOUT)
  }

  // shows messages list
  const showMessages = () => setAutohide(false)

  const onInputFocus = () => {
    showMessages()
    setInputFocused(true)
  }

  const onInputBlur = () => {
    scheduleAutohideMessages()
    setInputFocused(false)
  }

  const onSubmit = () => {
    // discards empty messages
    if (input.trim().length === 0) return

    // fallback to hash url since sometimes Playroom profile name is empty
    const author = player.getState().player_name

    // pushes new message into shared state
    setMessages([
      { author, message: input, color: player.getProfile().color.hexString, timestamp: Date.now() },
      ...messages.slice(0, MAX_MESSAGES),
    ])

    // clears input
    setInput('')
  }

  return (
    <>
      {!showChat && (
        <div
          className='relative m-5 z-10 px-0 py-0 rounded-xl w-full max-w-[400px] h-[50vh] flex text-lg justify-end gap-4 notosanskr flex-col max-md:text-xs overflow-hidden max-md:mb-3 max-md:ml-3 max-md:min-w-[50vw]'
          onMouseEnter={showMessages}
          onMouseLeave={() => !inputFocused && scheduleAutohideMessages()}
        >
          <div
            className={`absolute  w-full h-full flex justify-end  transition-all duration-500 ${autohide && 'opacity-0'}`}
            style={{
              zIndex: -1,
              background: isTouchableScreen() ? '' : 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <div style={{ paddingBottom: 50 }} className='w-full flex gap-2 p-2 font-bold flex-col-reverse rounded-b-lg max-md:-ml-4'>
              <ListMessages
                myPlayer={myPlayeri}
                nearestPlayer={nearestPlayer}
                messages={[...new Map(messages.map(v => [v.timestamp, v])).values()]
                  .filter(m => m.author === myPlayeri || m.author === nearestPlayer)
                  .filter(m => m.message.trim().length > 0)}
              />
            </div>
          </div>

          <div className=' m-0 h-15 flex  overflow-hidden py-2 px-4 bg-white max-md:hidden'>
            <Input onChange={setInput} onSubmit={onSubmit} value={input} onFocus={onInputFocus} onBlur={onInputBlur} />
          </div>
          <a
            onClick={() => setShowChat(true)}
            className='rounded-full bg-white md:hidden max-md:flex h-10 w-10 ml-1 flex justify-center'
            style={{ backgroundColor: '#fff' }}
          >
            <img src={chatIcon} className='w-6' />
          </a>
        </div>
      )}
      <div
        className='w-[100vw] h-[50vh] absolute bottom-0 left-0 flex flex-col justify-end transition-all overflow-hidden'
        style={{
          // background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 1))',
          zIndex: 200,
          bottom: showChat ? 0 : '-100vh',
        }}
      >
        <a
          onClick={() => setShowChat(false)}
          className=' bg-white h-10 w-10 ml-1 flex justify-center absolute top-0 right-0'
          style={{ backgroundColor: '#fff' }}
        >
          <img src={closeIcon} className='w-6' />
        </a>
        <div
          // style={{ background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))' }}
          className='w-full flex gap-2 font-bold flex-col-reverse h-auto  pb-5 min-h-[75%]'
        >
          <ListMessages
            myPlayer={myPlayeri}
            nearestPlayer={nearestPlayer}
            messages={[...new Map(messages.map(v => [v.timestamp, v])).values()]}
          />
        </div>
        <div className=' h-15 flex gap-4 overflow-hidden py-2 px-6 bg-white border-black border-solid border-2 m-2'>
          <Input onChange={setInput} onSubmit={onSubmit} value={input} />
        </div>
      </div>
    </>
  )
}

const ListMessages = ({ messages }) => (
  <>
    {messages
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(m => (
        <div key={`message_${m.timestamp}`} className='bg5 w-full px-6 rounded-l py-2 h-auto max-md:py-0 max-md:pl-2'>
          <p style={{ color: m.color, wordWrap: 'break-word', lineHeight: '1.5rem', filter: 'brightness(75%) saturate(100%)' }}>
            <span className='text1'>{m.author}</span>
            {''}:<span style={{ filter: 'brightness(50%) saturate(300%)' }}>{m.message}</span>
            {console.log(m.message)}
          </p>
        </div>
      ))}
  </>
)

const Input = ({ onSubmit, onChange, value, onFocus, onBlur }) => (
  <>
    <input
      maxLength={300}
      placeholder='send messages'
      className='flex-1 min-w-0  bg-transparent focus:outline-none focus:border-none input-box text5 font-bold'
      type='text'
      onChange={e => {
        onChange(e.target.value)
      }}
      onKeyDown={e => {
        e.stopPropagation()
        e.code === 'Enter' && onSubmit()
        e.code === 'Escape' && e.target.blur()
      }}
      onFocus={onFocus}
      onBlur={onBlur}
      value={value}
    />
    <button className=' text5 p-2 focus:outline-none focus:border-none' onClick={onSubmit}>
      <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 512 512'
        className='focus:outline-none focus:border-none'
        height='1em'
        width='1em'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M476.59 227.05l-.16-.07L49.35 49.84A23.56 23.56 0 0027.14 52 24.65 24.65 0 0016 72.59v113.29a24 24 0 0019.52 23.57l232.93 43.07a4 4 0 010 7.86L35.53 303.45A24 24 0 0016 327v113.31A23.57 23.57 0 0026.59 460a23.94 23.94 0 0013.22 4 24.55 24.55 0 009.52-1.93L476.4 285.94l.19-.09a32 32 0 000-58.8z'></path>
      </svg>
    </button>
  </>
)
