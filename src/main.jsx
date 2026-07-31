import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const MESSAGE = [
  'Welcome to come see me.',
  '假如你每日卖十扇笼炊饼，你从明日为始，只做五扇笼出去卖；每日迟出早归，不要和人吃酒',
].join('\n')

function App() {
  const [visibleText, setVisibleText] = useState('')

  useEffect(() => {
    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setVisibleText(MESSAGE.slice(0, index))
      if (index === MESSAGE.length) window.clearInterval(timer)
    }, 92)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <main className="page" aria-label="Personal website">
      <p className="type-line" aria-label={MESSAGE}>
        <span aria-hidden="true">{visibleText}</span>
        <span className="cursor" aria-hidden="true" />
      </p>
    </main>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
