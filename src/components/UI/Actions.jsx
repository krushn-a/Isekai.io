import waveIcon from '../../assets/waveIcon.svg'
import danceIcon from '../../assets/danceIcon.svg'
import danceIcon2 from '../../assets/danceIcon2.png'
import { useGame } from 'ecctrl'

export const Actions = () => {
  const action1 = useGame(state => state.action1)
  const action2 = useGame(state => state.action2)
  const action3 = useGame(state => state.action3)

  return (
    <>
      <div className='absolute bottom-40 right-2 flex h-11 mb-3 md:hidden max-md:flex'>
        <a onClick={action1}>
          <img src={waveIcon} className='h-11 mr-2' />
        </a>
        <a onClick={() => (Math.random() > 0.25 ? action3() : action2())}>
          <img src={danceIcon} className='h-11' />
        </a>

      </div>
      <div className='absolute bottom-2 right-2 flex flex-col max-md:hidden'>
        <a onClick={action1} className='py-1'>
          <img src={waveIcon} className='h-11 mr-3' />
        </a>
        <a onClick={action2} className='py-1'>
          <img src={danceIcon} className='h-11 mr-3' />
        </a>
        <a onClick={action3} className='py-1'>
          <img src={danceIcon2} className='h-11 p-1.5 bg-white rounded-full' />
        </a>
      </div>
  </>
  )
}