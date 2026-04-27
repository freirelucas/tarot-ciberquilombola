import { useState } from 'react'
import { useReadingStore } from '../../store/useReadingStore'
import { useLangStore } from '../../store/useLangStore'
import spreads from '../../data/spreads.json'
import Petition from '../Petition/Petition.jsx'
import Deck from '../Deck/Deck.jsx'
import About from '../About/About.jsx'
import './Shell.css'

export default function Shell({ children }) {
  const { mode, setMode, reset, phase } = useReadingStore()
  const { lang, toggleLang, t } = useLangStore()
  const [view, setView] = useState('tarot')

  const spreadName = (s) => lang === 'en' ? s.name_en : s.name_pt

  return (
    <div className="shell">
      <header className="shell__header">
        <div className="shell__title-group">
          <h1 className="shell__title cursor-blink">{t('title')}</h1>
          <p className="shell__subtitle">{t('subtitle')}</p>
        </div>
        <button className="shell__lang" onClick={toggleLang} aria-label="Toggle language">
          {lang === 'en' ? 'PT' : 'EN'}
        </button>
      </header>

      <nav className="shell__nav">
        {spreads.map((spread) => (
          <button
            key={spread.id}
            className={`shell__nav-btn ${view === 'tarot' && mode === spread.id ? 'shell__nav-btn--active' : ''}`}
            onClick={() => {
              if (view !== 'tarot') setView('tarot')
              if (phase !== 'idle' && mode !== spread.id) {
                if (!window.confirm(t('abandonReading'))) return
                reset()
              }
              setMode(spread.id)
            }}
          >
            <span className="shell__nav-count">{spread.card_count}</span>
            <span className="shell__nav-label">{spreadName(spread)}</span>
          </button>
        ))}
        <button
          className={`shell__nav-btn shell__nav-btn--baralho ${view === 'baralho' ? 'shell__nav-btn--active' : ''}`}
          onClick={() => setView(view === 'baralho' ? 'tarot' : 'baralho')}
        >
          <span className="shell__nav-count">78</span>
          <span className="shell__nav-label">{t('baralho')}</span>
        </button>
        <button
          className={`shell__nav-btn shell__nav-btn--manifesto ${view === 'manifesto' ? 'shell__nav-btn--active' : ''}`}
          onClick={() => setView(view === 'manifesto' ? 'tarot' : 'manifesto')}
        >
          <span className="shell__nav-count">&#x270D;</span>
          <span className="shell__nav-label">{t('manifesto')}</span>
        </button>
        <button
          className={`shell__nav-btn shell__nav-btn--about ${view === 'about' ? 'shell__nav-btn--active' : ''}`}
          onClick={() => setView(view === 'about' ? 'tarot' : 'about')}
        >
          <span className="shell__nav-count">?</span>
          <span className="shell__nav-label">{lang === 'en' ? 'About' : 'Sobre'}</span>
        </button>
      </nav>

      <main className="shell__main">
        {view === 'baralho' ? <Deck /> : view === 'manifesto' ? <Petition /> : view === 'about' ? <About /> : children}
      </main>

      <footer className="shell__footer">
        <div className="shell__quote">
          <p>&ldquo;The purpose of a system is what it does.&rdquo;</p>
          <cite>— Stafford Beer</cite>
        </div>
        <div className="shell__quote">
          <p>&ldquo;{t('quoteBispo')}&rdquo;</p>
          <cite>— Antônio Bispo dos Santos</cite>
        </div>
      </footer>
    </div>
  )
}
