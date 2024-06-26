import { usePlayersState } from 'playroomkit'

const randomRange = (min, max) => Math.random() * (max - min) + min

const generateRandomGuestName = () => {
  const names = ['Guest', 'Anonymous', 'Someone']
  return names[Math.round((Math.random() * 10) % (names.length - 1))] + '_' + String(Math.trunc(randomRange(10, 99)))
}

export const PlayerList = () => {
  const allPlayers = usePlayersState('players')

  return (
    <div className='flex flex-row'>
      {allPlayers.map(({ player: p }) => {
        const playerName = p.getState().player_name
        return (
          <div
            className='m-1 h-5 p-4 flex items-center rounded max-md:h-5'
            key={p.id}
            style={{
              backgroundColor: 'white',
            }}
          >
            <span
              className='ml-1 text-orange-500 overflow-hidden whitespace-no-wrap text-xl text-ellipsis max-md:text-xs'
              style={{
                fontFamily: "''",
              }}
            >
              {playerName || generateRandomGuestName()}
            </span>
          </div>
        )
      })}
    </div>
  )
}
