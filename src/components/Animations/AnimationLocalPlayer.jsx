/**
 * This file is inspired on EcctrlAnimation with custom code to handle animations from different glb sources.
 * Additionally, stores current animation into PLayroom player state
 */

import { useEffect, useRef } from 'react'
import { animationSet, useRPMAnimations } from '../../hooks/useRPMAnimations'
import { useGame } from 'ecctrl'
import * as THREE from 'three'

export function AnimationLocalPlayer(props) {
  const group = useRef()

  const actions = useRPMAnimations(group)

  return (
    <group ref={group} dispose={null} userData={{ camExcludeCollision: true }}>
      <Animator player={props.player} actions={actions} />
      {props.children}
    </group>
  )
}

export const Animator = ({ player, actions }) => {
  const curAnimation = useGame(state => state.curAnimation)
  const resetAnimation = useGame(state => state.reset)
  const initializeAnimationSet = useGame(state => state.initializeAnimationSet)

  useEffect(() => {
    initializeAnimationSet(animationSet)
  }, [])

  useEffect(() => {
    player.setState('curAnimation', curAnimation)
  }, [curAnimation])

  useEffect(() => {
    const action = actions[curAnimation ? curAnimation : animationSet.idle]

    if (curAnimation === animationSet.jump || curAnimation === animationSet.jumpLand || curAnimation === animationSet.action1) {
      action && action.reset().fadeIn(0.23).setLoop(THREE.LoopOnce, undefined).play()
      action && (action.clampWhenFinished = true)
    } else {
      action && action.reset().fadeIn(0.23).play()
    }

    action && action._mixer.addEventListener('finished', () => resetAnimation())

    return () => {
      if (action) {
        action.fadeOut(0.3)
        action._mixer.removeEventListener('finished', () => resetAnimation())
        action._mixer._listeners = []
      }
    }
  }, [curAnimation, actions])

  return <></>
}
