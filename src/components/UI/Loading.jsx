import { useEffect, useState } from 'react'


export const Loading = ({ show }) => {
  const [hide, setHide] = useState(false)
  useEffect(() => {
    if (!show) {
      setTimeout(() => setHide(true), 5500)
    }
  }, [show])
  return (
    <>
      {!hide && (
        <div
          style={{
            width: '100vw',
            height: '100vh',
            transition: 'all 3s linear',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 100,
            opacity: show ? 1 : 0,
          }}
        >
          <div className='flex flex-col items-center justify-center h-screen bg-gray-100' style={{ opacity: 'inherit' }}>
            

            <div className='lds-ellipsis' style={{ visibility: show ? 'visible' : 'hidden' }}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
