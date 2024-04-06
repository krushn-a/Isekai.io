import { useState } from 'react'
import { getHashValue, getStoreValue, setHashValue, setStoreValue } from './utils/helpers'

function Home({ enterWorld }) {
  const [screen, setScreen] = useState(getHashValue('r') ? 'NAME' : 'LOBBY')
  const [playerName, setPlayerName] = useState(getStoreValue('player_name') )

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100 ' >
      <img src='../src/assets/logo.svg' className='size-72'/>
      {screen === 'LOBBY' && (
        <div className='flex'>
          <button
            className=' text-white text-lg h-16 w-52 rounded-lg px-3 py-2 m-1 bg-gradient-to-r from-purple-500 to-pink-500'
            onClick={() => {
              setHashValue('r', 'R' + 'HCVF')
              setScreen('NAME')
            }}
          >
            Enter the world 
          </button>
          
        </div>
      )}
      {screen === 'NAME' && (
        <div className='flex mt-20 items-center'>
          <div className='border border-black border-1 rounded-3xl h-12 flex gap-4 overflow-hidden py-2 px-6 bg-white '>
            <Input onChange={setPlayerName} onSubmit={() => {}} value={playerName} />
          </div>
          <button
            className='text-white rounded-lg px-3 py-2 m-3  bg-gradient-to-r from-cyan-500 to-blue-500'
            onClick={() => {
              setStoreValue('player_name', playerName)
              enterWorld()
            }}
          >
            Next
          </button>
        </div>
      )}
      <div className='absolute bottom-5 text-xs gap-2 flex items-center'>
        <p className='text-xs mt-1'>Get ready to dive into virtual world</p>
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
