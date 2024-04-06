import { useJoystickControls } from 'ecctrl'
import { Joystick } from 'playroomkit'
import { useEffect, useRef } from 'react'
import jumpButtonImage from '../assets/chevron-double-up.svg'
import sprintButtonImage from '../assets/chevron-double-right.svg'
import { useFrame } from '@react-three/fiber'

export const PlayroomJoystick = ({ player }) => {
  const setJoystick = useJoystickControls(state => state.setJoystick)
  const resetJoystick = useJoystickControls(state => state.resetJoystick)
  const pressButton1 = useJoystickControls(state => state.pressButton1)
  const releaseAllButtons = useJoystickControls(state => state.releaseAllButtons)
  const joystick = useRef()

  useEffect(() => {
    joystick.current = new Joystick(player, {
      type: 'angular',
      buttons: [
        { id: 'jump', icon: jumpButtonImage },
        { id: 'sprint', icon: sprintButtonImage },
      ],
    })
    const joystickContainer = window.document.querySelector('#joystick')
    joystickContainer.style.display = 'inherits'
    joystickContainer.appendChild(joystick.current.joystick.$element)

    Object.keys(joystick.current.buttons).forEach(btnKey => {
      const button = joystick.current.buttons[btnKey]
      button.$element.addEventListener('touchmove', e => {
        e.stopPropagation()
      })
      joystickContainer.appendChild(button.$element)
    })
  }, [player])

  useFrame(() => {
    if (!joystick.current) return

    if (joystick.current.isPressed('jump')) {
      pressButton1()
    } else {
      releaseAllButtons()
    }
    if (joystick.current.isJoystickPressed()) {
      setJoystick(1, joystick.current.angle() - Math.PI / 2, joystick.current.isPressed('sprint'))
    } else {
      resetJoystick()
    }
  })

  return <></>
}
