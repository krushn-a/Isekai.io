import { useState } from 'react'
import { getHashValue, getStoreValue, setHashValue, setStoreValue } from './utils/helpers'

function Home({ enterWorld }) {
  const [screen, setScreen] = useState(getHashValue('r') ? 'NAME' : 'LOBBY')
  const [playerName, setPlayerName] = useState(getStoreValue('player_name'))

  return (
    <div className='flex flex-row w-full'>
      <div className='hidden lg:w-6/12 lg:flex'>
        {' '}
        <img
          src='https://res-console.cloudinary.com/da9skd1ks/media_explorer_thumbnails/f594eb6396849b23b4c150a03b57392e/detailed'
          className='h-screen'
        />
      </div>
      <div className='md:top-0 bottom-0 left-0 right-0 mx-auto lg:flex flex-col  w-6/12 items-center justify-center h-screen'>
        <img
          src='https://res-console.cloudinary.com/da9skd1ks/media_explorer_thumbnails/3b1e1e84cee60d4b854d225b3099a1fe/detailed'
          alt='img'
          className='size-72 h-40 absolute md:top-12 lg:top-2 pt-20 '
        />
        {screen === 'LOBBY' && (
          <div className='flex h-full  flex-col items-center justify-center '>
            <p className='hidden lg:flex font-mono mt-1 px-32 ' style={{ fontFamily: 'Inter Tight' }}>
              Welcome to Isekai.io, a virtual world inspired by the popular "Isekai" genre. Here, you can escape the harsh realities of your
              world and build a new life anonymously. Our project aims to provide a safe and engaging space for users to connect, build
              communities, and forge meaningful relationships without revealing their real-world identities. Enjoy our features like
              anonymity, community building, and a virtual chat room where you can interact with others. Get ready to dive into the virtual
              world!
            </p>
            <button
              className='text-gray-900  bg-gradient-to-r from-cyan-500 to-blue-500 font-medium rounded-lg px-5 py-2.5 text-center inline-flex items-center m-4'
              onClick={() => {
                setHashValue('r', 'R' + 'ROOM')
                setScreen('NAME')
              }}
            >
              Enter the world
            </button>
          </div>
        )}
        {screen === 'NAME' && (
          <div className='flex flex-col items-center'>
            <p className='px-32 hidden lg:flex'>
              Welcome to Isekai.io! In this virtual world, you can create a new life and explore endless possibilities. Please follow the
              instructions below to get started:
              <br />
              <br />
              1. Choose a unique name that represents your virtual identity.
              <br />
              2. Enter your chosen name in the input box below.
              <br />
              3. Click the Next button to continue.
            </p>
            <div className='flex mt-80 lg:mt-20 items-center'>
              <div
                className='border border-black border-1 rounded-xl h-12 flex  overflow-hidden py-2 px-6 bg-white '
                style={{
                  borderRight: 'none',
                  borderRadius: '0.5rem 0 0 0.5rem',
                }}
              >
                <Input onChange={setPlayerName} onSubmit={() => {}} value={playerName} />
              </div>
              <button
                className='text-white rounded-xl px-6 py-2  h-12  bg-gradient-to-r from-cyan-500 to-blue-500'
                style={{
                  borderLeft: 'none',
                  borderRadius: '0 0.5rem 0.5rem 0',
                }}
                onClick={() => {
                  setStoreValue('player_name', playerName)
                  enterWorld()
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
        <div className='absolute bottom-5 text-xs gap-2 flex items-center'>
          <p className='text-xs mt-1'>Get ready to dive into virtual world</p>
        </div>
      </div>
    </div>
  )
}

export default Home

const Input = ({ onSubmit, onChange, value }) => (
  <>
    <input
      maxLength={300}
      placeholder='write your name'
      className='flex-1 min-w-0 rounded-xl bg-transparent focus:outline-none focus:border-none input-box text5 font-bold'
      type='text'
      onChange={e => {
        onChange(e.target.value)
      }}
      onKeyDown={e => {
        e.stopPropagation() // avoids moving character while typing
        e.code === 'Enter' && onSubmit()
        e.code === 'Escape' && e.target.blur()
      }}
      value={value}
    />
  </>
)
