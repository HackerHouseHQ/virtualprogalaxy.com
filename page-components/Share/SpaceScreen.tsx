import React from 'react'
import { Canvas } from '@react-three/fiber'
import { lazy, Suspense } from 'react'
import { CameraPosition } from '../../components/ThreeJS'
import { useState, useEffect } from 'react'
import ControlPanel from '../../components/ThreeJS/ControlPanel/ControlPanel'
import { useSpring, animated, config } from '@react-spring/three'

import { useHotkeys } from '@mantine/hooks'
const SkyComponent = lazy(() => import('../../components/ThreeJS/sky'))
import * as THREE from 'three'
import { AnimationLoader } from 'three'
import { useRecoilValue } from 'recoil'
import { currentBrowserIndex } from '../../utils/recoil/browser'
import { usePrevious } from '@mantine/hooks'
const from = new THREE.Euler(0, 0, 0)
const to = new THREE.Euler(-Math.PI, 0, 0)

export default function SpaceScreen() {
   const [isBrowser, setIsBrowser] = useState(true)
   useEffect(() => {
      if (typeof window !== 'undefined') {
         {
            setIsBrowser(true)
         }
      }
   }, [])

   const curIndex = useRecoilValue(currentBrowserIndex)
   const previousValue = usePrevious(curIndex)
   const [toogle, setToogle] = useState(0)
   useEffect(() => {
      console.log(previousValue, curIndex)
      if (toogle != curIndex)
         setToogle((toogle) => toogle + (curIndex - previousValue))
   }, [curIndex])
   const rotation = useSpring({
      x: (toogle * Math.PI) / 2,
      y: (toogle * Math.PI) / 2,
      z: (toogle * Math.PI) / 2,
      config: config.wobbly,
   })
   useHotkeys([
      [
         'ctrl+q',
         () => {
            setToogle((toogle) => toogle - 4)
            console.log('KKK')
            console.log(toogle)
         },
      ],
   ])
   return (
      <div
         style={{
            position: 'relative',
            width: '100%',
            height: '100%',
         }}>
         {/* {isBrowser ? ( */}
         <Canvas
            camera={{
               fov: 50,
            }}>
            <animated.perspectiveCamera rotation-y={rotation.y}>
               <SkyComponent />
               <group>
                  <CameraPosition />
               </group>
               <Light />
            </animated.perspectiveCamera>
         </Canvas>
         <ControlPanel />
      </div>
   )
}

function Light() {
   return (
      <>
         {/* <pointLight distance={10} intensity={10} color="white" position={[0, 4.5, 0]} /> */}
      </>
   )
}
