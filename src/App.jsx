import { useEffect } from 'react'
import { useReadingStore } from './store/useReadingStore'
import Shell from './components/Shell/Shell.jsx'
import Spread from './components/Spread/Spread.jsx'
import Reading from './components/Reading/Reading.jsx'

export default function App() {
  const phase = useReadingStore((s) => s.phase)
  const interpretation = useReadingStore((s) => s.interpretation)

  useEffect(() => {
    if (!interpretation) return
    function handleBeforeUnload(e) {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [interpretation])

  return (
    <Shell>
      <Spread />
      {(phase === 'reading' || phase === 'interpreting') && <Reading />}
    </Shell>
  )
}
