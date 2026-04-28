import { useState, useEffect, useCallback } from 'react'
import cards from '../../data/cards.json'
import { useLangStore } from '../../store/useLangStore'
import Card from '../Card/Card.jsx'
import './Deck.css'

const SUIT_LABELS = {
  aguas: { en: 'Waters', pt: 'Águas' },
  territorios: { en: 'Territories', pt: 'Territórios' },
  ferramentas: { en: 'Tools', pt: 'Ferramentas' },
  tambores: { en: 'Drums', pt: 'Tambores' },
}

const SUIT_ICONS = {
  aguas: '〰',
  territorios: '⌂',
  ferramentas: '⚒',
  tambores: '𝄞',
}

const SUIT_ELEMENTS = {
  aguas: { en: 'Water', pt: 'Água' },
  territorios: { en: 'Earth', pt: 'Terra' },
  ferramentas: { en: 'Fire', pt: 'Fogo' },
  tambores: { en: 'Air', pt: 'Ar' },
}

const JOURNEYS = [
  { en: 'Ancestry', pt: 'Ancestralidade', source: 'Brain of the Firm', desc_en: 'Principles — the architecture of viability', desc_pt: 'Princípios — a arquitetura da viabilidade' },
  { en: 'Earth', pt: 'Terra', source: 'Diagnosing the System', desc_en: 'Laws — the system in its environment', desc_pt: 'Leis — o sistema em seu ambiente' },
  { en: 'Transformation', pt: 'Transformação', source: 'Platform for Change', desc_en: 'Manifestation — change and transcendence', desc_pt: 'Manifestação — mudança e transcendência' },
]

const CROSSROAD_LABELS = {
  aguas: { en: 'North · Water · Orality', pt: 'Norte · Água · Oralidade' },
  territorios: { en: 'South · Earth · Land', pt: 'Sul · Terra · Lugar' },
  ferramentas: { en: 'East · Fire · Craft', pt: 'Leste · Fogo · Ofício' },
  tambores: { en: 'West · Air · Drum', pt: 'Oeste · Ar · Tambor' },
}

const SUITS = ['aguas', 'ferramentas', 'territorios', 'tambores']

const fool = cards.find((c) => c.id === 0)
const majorCards = cards.filter((c) => c.arcana === 'major')
const minorCards = cards.filter((c) => c.arcana === 'minor')

function getNavigationGroup(card) {
  if (card.arcana === 'major') return majorCards
  return minorCards.filter((c) => c.suit === card.suit)
}

export default function Deck() {
  const [selected, setSelected] = useState(null)
  const [touchX, setTouchX] = useState(0)
  const { lang, t, c } = useLangStore()

  const journeyRows = [
    majorCards.filter((c) => c.act === 1),
    majorCards.filter((c) => c.act === 2),
    majorCards.filter((c) => c.act === 3),
  ]
  const minorBySuit = SUITS.map((s) => minorCards.filter((c) => c.suit === s))

  const navigate = useCallback((direction) => {
    if (!selected) return
    const group = getNavigationGroup(selected)
    const idx = group.findIndex((c) => c.id === selected.id)
    if (idx === -1) return
    const next = idx + direction
    if (next >= 0 && next < group.length) setSelected(group[next])
  }, [selected])

  useEffect(() => {
    if (!selected) return
    function handleKey(e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); navigate(-1) }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); navigate(1) }
      else if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected, navigate])

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [selected])

  const group = selected ? getNavigationGroup(selected) : []
  const currentIdx = selected ? group.findIndex((ci) => ci.id === selected.id) : -1

  function handleStoryTap(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const third = rect.width / 3
    if (x < third) navigate(-1)
    else if (x > third * 2) navigate(1)
    else setSelected(null)
  }

  return (
    <div className="deck">
      <section className="deck__section">
        <h2 className="deck__section-title">{t('majorArcana')}</h2>
        <p className="deck__section-sub">
          {lang === 'en' ? '22 cybernetic lenses — Three Journeys around the Zero Point' : '22 lentes cibernéticas — Três Jornadas ao redor do Ponto Zero'}
        </p>

        <div className="deck__roda">
          <div className="deck__fool">
            <Card card={fool} mini onClick={() => setSelected(fool)} />
            <span className="deck__fool-label">{t('pontoZero')}</span>
          </div>

          {journeyRows.map((row, ji) => (
            <div key={ji} className={`deck__journey deck__journey--${ji + 1}`}>
              <div className="deck__journey-label">
                <span className="deck__journey-name">{JOURNEYS[ji][lang]}</span>
                <span className="deck__journey-source">{JOURNEYS[ji].source}</span>
              </div>
              <div className="deck__journey-cards">
                {row.map((card) => (
                  <Card key={card.id} card={card} mini onClick={() => setSelected(card)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="deck__section">
        <h2 className="deck__section-title">{t('minorArcana')}</h2>
        <p className="deck__section-sub">
          {lang === 'en' ? '56 cards in 4 paths — The Crossroads' : '56 cartas em 4 caminhos — A Encruzilhada'}
        </p>

        <div className="deck__crossroads">
          <div className="deck__cross-center" title={lang === 'en' ? 'Exu — Lord of the Crossroads' : 'Exu — Senhor da Encruzilhada'}>
            <span className="deck__cross-symbol">✦</span>
            <span className="deck__cross-label">Exu</span>
          </div>
          {minorBySuit.map((suitCards, si) => (
            <div key={SUITS[si]} className={`deck__path deck__path--${SUITS[si]}`}>
              <div className="deck__path-header">
                <span className="deck__path-icon">{SUIT_ICONS[SUITS[si]]}</span>
                <span className="deck__path-name">{SUIT_LABELS[SUITS[si]][lang]}</span>
                <span className="deck__path-direction">{CROSSROAD_LABELS[SUITS[si]][lang]}</span>
              </div>
              <div className="deck__path-cards">
                {suitCards.map((card) => (
                  <Card key={card.id} card={card} mini onClick={() => setSelected(card)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === STORY-STYLE DETAIL === */}
      {selected && (
        <div
          className="deck__story"
          onClick={handleStoryTap}
          onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchX
            if (dx > 60) navigate(-1)
            else if (dx < -60) navigate(1)
          }}
        >
          {/* Progress bar */}
          <div className="deck__story-progress">
            {group.map((_, i) => (
              <div key={i} className={`deck__story-dot ${i === currentIdx ? 'deck__story-dot--active' : i < currentIdx ? 'deck__story-dot--done' : ''}`} />
            ))}
          </div>

          {/* Scrollable content */}
          <div className="deck__story-scroll" onClick={(e) => e.stopPropagation()}>
            <div className="deck__story-header">
              <span className="deck__story-numeral">{selected.numeral}</span>
              <div className="deck__story-title">
                <h3 className="deck__story-name">{c(selected, 'name')}</h3>
                {selected.suit && (
                  <span className={`deck__story-suit deck__detail-suit--${selected.suit}`}>
                    {SUIT_ICONS[selected.suit]} {SUIT_LABELS[selected.suit][lang]} · {SUIT_ELEMENTS[selected.suit][lang]}
                  </span>
                )}
              </div>
            </div>

            <p className="deck__story-concept">{c(selected, 'concept')}</p>
            <p className="deck__story-classic">{c(selected, 'classic')}</p>

            <p className="deck__story-question">{c(selected, 'diagnostic_question')}</p>

            {selected.anchor_beer && (
              <blockquote className="deck__story-quote">
                <p>&ldquo;{selected.anchor_beer}&rdquo;</p>
                <cite>— {selected.beer_url
                  ? <a href={selected.beer_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>{selected.beer_source}</a>
                  : selected.beer_source}</cite>
              </blockquote>
            )}
            {selected.anchor_bispo && (
              <blockquote className="deck__story-quote deck__story-quote--bispo">
                <p>&ldquo;{selected.anchor_bispo}&rdquo;</p>
                <cite>— {selected.bispo_url
                  ? <a href={selected.bispo_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Bispo</a>
                  : 'Bispo'}</cite>
              </blockquote>
            )}

            {selected.dito_pt && (
              <p className="deck__story-dito">
                <em>{c(selected, 'dito')}</em>
                <span className="deck__story-dito-src">— {selected.dito_url
                  ? <a href={selected.dito_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>{selected.dito_source}</a>
                  : selected.dito_source}</span>
              </p>
            )}
          </div>

          {/* Navigation hint at bottom */}
          <div className="deck__story-hint">
            ← {lang === 'en' ? 'tap sides · swipe' : 'toque nas laterais · deslize'} →
          </div>
        </div>
      )}
    </div>
  )
}
