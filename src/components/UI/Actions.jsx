import waveIcon from '../../assets/waveIcon.svg'
import instructionsBtnWave from '../../assets/instructionsBtnWave.svg'
import { useGame } from 'ecctrl'

export const Actions = () => {
  const action1 = useGame(state => state.action1)

  return (
    <>
      <div className='absolute bottom-40 right-2 flex h-11 mb-3 md:hidden max-md:flex'>
        <a onClick={action1}>
          <img src={waveIcon} className='h-11 mr-2' />
        </a>
      </div>
      <div className='absolute bottom-0 right-2 flex h-11 mb-3 max-md:hidden'>
        <a onClick={action1}>
          <img src={instructionsBtnWave} className='h-11 mr-3' />
        </a>
      </div>
    </>
  )
}
