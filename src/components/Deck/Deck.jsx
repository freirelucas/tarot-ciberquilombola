import { useState, useEffect, useCallback } from 'react'
import cards from '../../data/cards.json'
import { useLangStore } from '../../store/useLangStore'
import Card from '../Card/Card.jsx'
import './Deck.css'

const SUIT_LABELS = {
  circuitos: { en: 'Circuits', pt: 'Circuitos' },
  territorios: { en: 'Territories', pt: 'Territórios' },
  ferramentas: { en: 'Tools', pt: 'Ferramentas' },
  sinais: { en: 'Signals', pt: 'Sinais' },
}

const SUIT_ICONS = {
  circuitos: '↻',
  territorios: '⌂',
  ferramentas: '⚒',
  sinais: '☲',
}

const JOURNEYS = [
  { en: 'Person', pt: 'Pessoa', source: 'Brain of the Firm', desc_en: 'The self as viable system', desc_pt: 'O eu como sistema viável' },
  { en: 'Nature', pt: 'Natureza', source: 'Diagnosing the System', desc_en: 'The system in its environment', desc_pt: 'O sistema em seu ambiente' },
  { en: 'Spirit', pt: 'Espírito', source: 'Platform for Change', desc_en: 'Transformation and transcendence', desc_pt: 'Transformação e transcendência' },
]

const CROSSROAD_LABELS = {
  circuitos: { en: 'North · Orality', pt: 'Norte · Oralidade' },
  territorios: { en: 'South · Land', pt: 'Sul · Terra' },
  ferramentas: { en: 'East · Craft', pt: 'Leste · Ofício' },
  sinais: { en: 'West · Drum', pt: 'Oeste · Tambor' },
}

const SUITS = ['circuitos', 'ferramentas', 'territorios', 'sinais']

const fool = cards.find((c) => c.id === 0)
const majorCards = cards.filter((c) => c.arcana === 'major')
const minorCards = cards.filter((c) => c.arcana === 'minor')

function getNavigationGroup(card) {
  if (card.arcana === 'major') return majorCards
  return minorCards.filter((c) => c.suit === card.suit)
}

export default function Deck() {
  const [selected, setSelected] = useState(null)
  const { lang, t, c } = useLangStore()

  const journeyRows = [
    majorCards.filter((c) => c.act === 1),
    majorCards.filter((c) => c.act === 2),
    majorCards.filter((c) => c.act === 3),
  ]
  const minorBySuit = SUITS.map((s) => minorCards.filter((c) => c.suit === s))

  function getPositionLabel(card) {
    if (card.id === 0) return t('pontoZero')
    if (card.arcana === 'major') {
      const j = JOURNEYS[card.act - 1]
      return j ? `${j[lang]} · ${j.source}` : ''
    }
    return `${SUIT_ICONS[card.suit]} ${SUIT_LABELS[card.suit][lang]}`
  }

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

  const group = selected ? getNavigationGroup(selected) : []
  const currentIdx = selected ? group.findIndex((ci) => ci.id === selected.id) : -1
  const hasPrev = currentIdx > 0
  const hasNext = currentIdx < group.length - 1

  return (
    <div className="deck">
      {/* === MAJOR ARCANA — RODA === */}
      <section className="deck__section">
        <h2 className="deck__section-title">{t('majorArcana')}</h2>
        <p className="deck__section-sub">
          {lang === 'en' ? '22 cybernetic lenses — Three Journeys around the Zero Point' : '22 lentes cibernéticas — Três Jornadas ao redor do Ponto Zero'}
        </p>

        <div className="deck__roda">
          {/* The Fool at center */}
          <div className="deck__fool">
            <Card card={fool} mini onClick={() => setSelected(fool)} />
            <span className="deck__fool-label">{t('pontoZero')}</span>
          </div>

          {/* Three journeys as concentric arcs */}
          {journeyRows.map((row, ji) => (
            <div key={ji} className={`deck__journey deck__journey--${ji + 1}`}>
              <div className="deck__journey-label">
                <span className="deck__journey-name">{JOURNEYS[ji][lang]}</span>
                <span className="deck__journey-source">{JOURNEYS[ji].source}</span>
                <span className="deck__journey-desc">{lang === 'en' ? JOURNEYS[ji].desc_en : JOURNEYS[ji].desc_pt}</span>
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

      {/* === MINOR ARCANA — ENCRUZILHADA === */}
      <section className="deck__section">
        <h2 className="deck__section-title">{t('minorArcana')}</h2>
        <p className="deck__section-sub">
          {lang === 'en' ? '56 cards in 4 paths — The Crossroads' : '56 cartas em 4 caminhos — A Encruzilhada'}
        </p>

        <div className="deck__crossroads">
          <div className="deck__cross-center">✦</div>
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

      {/* === DETAIL PANEL === */}
      {selected && (
        <div className="deck__overlay" onClick={() => setSelected(null)}>
          <div className="deck__detail" onClick={(e) => e.stopPropagation()}>
            <button className="deck__detail-close" onClick={() => setSelected(null)}>&times;</button>

            <div className="deck__detail-nav">
              <button className="deck__detail-arrow" onClick={() => navigate(-1)} disabled={!hasPrev}>&#x2190;</button>
              <span className="deck__detail-pos">{getPositionLabel(selected)} — {currentIdx + 1}/{group.length}</span>
              <button className="deck__detail-arrow" onClick={() => navigate(1)} disabled={!hasNext}>&#x2192;</button>
            </div>

            <div className="deck__detail-header">
              <span className="deck__detail-numeral">{selected.numeral}</span>
              <h3 className="deck__detail-name">{c(selected, 'name')}</h3>
              {selected.suit && (
                <span className={`deck__detail-suit deck__detail-suit--${selected.suit}`}>
                  {SUIT_ICONS[selected.suit]} {SUIT_LABELS[selected.suit][lang]}
                </span>
              )}
            </div>
            <p className="deck__detail-concept">{c(selected, 'concept')}</p>
            <p className="deck__detail-classic">{c(selected, 'classic')}</p>
            <div className="deck__detail-body">
              <p className="deck__detail-question">{c(selected, 'diagnostic_question')}</p>
              <p className="deck__detail-algedonic"><strong>{t('algedonicSignal')}:</strong> {c(selected, 'algedonic')}</p>
              <p className="deck__detail-reversal"><strong>{t('reversalLabel')}:</strong> {c(selected, 'reversal')}</p>
              {selected.anchor_beer && (
                <blockquote className="deck__detail-quote">
                  <p>&ldquo;{selected.anchor_beer}&rdquo;</p>
                  <cite>
                    — {selected.beer_url
                      ? <a href={selected.beer_url} target="_blank" rel="noopener noreferrer">{selected.beer_source}</a>
                      : selected.beer_source}
                  </cite>
                </blockquote>
              )}
              {selected.anchor_bispo && (
                <blockquote className="deck__detail-quote deck__detail-quote--bispo">
                  <p>&ldquo;{selected.anchor_bispo}&rdquo;</p>
                  <cite>
                    — {selected.bispo_url
                      ? <a href={selected.bispo_url} target="_blank" rel="noopener noreferrer">Antônio Bispo dos Santos</a>
                      : 'Antônio Bispo dos Santos'}
                  </cite>
                </blockquote>
              )}
              <p className="deck__detail-dito">
                <em>{c(selected, 'dito')}</em> —{' '}
                {selected.dito_url
                  ? <a href={selected.dito_url} target="_blank" rel="noopener noreferrer">{selected.dito_source}</a>
                  : selected.dito_source}
              </p>

              {/* References section */}
              <div className="deck__detail-refs">
                <span className="deck__detail-refs-title">{lang === 'en' ? 'Sources' : 'Fontes'}</span>
                <ul>
                  {selected.beer_url && (
                    <li><a href={selected.beer_url} target="_blank" rel="noopener noreferrer">{selected.beer_source}</a></li>
                  )}
                  {selected.bispo_url && (
                    <li><a href={selected.bispo_url} target="_blank" rel="noopener noreferrer">Bispo dos Santos — {selected.bispo_url.includes('ubu') ? 'A Terra Dá, A Terra Quer (Ubu)' : 'Colonização, Quilombos (INCTI/UnB)'}</a></li>
                  )}
                  {selected.dito_url && (
                    <li><a href={selected.dito_url} target="_blank" rel="noopener noreferrer">{selected.dito_source}</a></li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
