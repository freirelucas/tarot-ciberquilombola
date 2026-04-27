import { useState, useEffect, useCallback } from 'react'
import cards from '../../data/cards.json'
import Card from '../Card/Card.jsx'
import './Deck.css'

const SUIT_LABELS = {
  circuitos: 'Circuitos',
  territorios: 'Territórios',
  ferramentas: 'Ferramentas',
  sinais: 'Sinais',
}

const SUIT_ICONS = {
  circuitos: '↻',
  territorios: '⌂',
  ferramentas: '⚒',
  sinais: '☲',
}

const ROW_LABELS = [
  { label: 'Tese', source: 'Brain of the Firm' },
  { label: 'Antítese', source: 'Diagnosing the System' },
  { label: 'Síntese', source: 'Platform for Change' },
]

const SUITS = ['circuitos', 'territorios', 'ferramentas', 'sinais']

const fool = cards.find((c) => c.id === 0)
const majorCards = cards.filter((c) => c.arcana === 'major')
const minorCards = cards.filter((c) => c.arcana === 'minor')

function getNavigationGroup(card) {
  if (card.arcana === 'major') return majorCards
  return minorCards.filter((c) => c.suit === card.suit)
}

function getPositionLabel(card) {
  if (card.id === 0) return 'Ponto Zero'
  if (card.arcana === 'major') {
    const row = ROW_LABELS[card.act - 1]
    return row ? `${row.label} · ${row.source}` : ''
  }
  return `${SUIT_ICONS[card.suit]} ${SUIT_LABELS[card.suit]}`
}

export default function Deck() {
  const [selected, setSelected] = useState(null)

  const majorRows = [
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
    if (next >= 0 && next < group.length) {
      setSelected(group[next])
    }
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
  const currentIdx = selected ? group.findIndex((c) => c.id === selected.id) : -1
  const hasPrev = currentIdx > 0
  const hasNext = currentIdx < group.length - 1

  return (
    <div className="deck">
      {/* Major Arcana */}
      <section className="deck__section">
        <h2 className="deck__section-title">Arcanos Maiores</h2>
        <p className="deck__section-sub">22 lentes cibernéticas — Ouspensky em 3 × 7</p>

        <div className="deck__fool">
          <Card card={fool} mini onClick={() => setSelected(fool)} />
          <span className="deck__fool-label">Ponto Zero</span>
        </div>

        <div className="deck__triangle">
          {majorRows.map((row, ri) => (
            <div key={ri} className="deck__row">
              <span className="deck__row-label">
                {ROW_LABELS[ri].label} <span className="deck__row-source">· {ROW_LABELS[ri].source}</span>
              </span>
              <div className="deck__row-cards">
                {row.map((card) => (
                  <Card
                    key={card.id}
                    card={card}
                    mini
                    onClick={() => setSelected(card)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Minor Arcana */}
      <section className="deck__section">
        <h2 className="deck__section-title">Arcanos Menores</h2>
        <p className="deck__section-sub">56 cartas em 4 naipes — o quadrado operacional</p>

        <div className="deck__square">
          {minorBySuit.map((suitCards, si) => (
            <div key={SUITS[si]} className={`deck__suit deck__suit--${SUITS[si]}`}>
              <div className="deck__suit-header">
                <span className="deck__suit-icon">{SUIT_ICONS[SUITS[si]]}</span>
                <span className="deck__suit-name">{SUIT_LABELS[SUITS[si]]}</span>
              </div>
              <div className="deck__suit-cards">
                {suitCards.map((card) => (
                  <Card key={card.id} card={card} mini onClick={() => setSelected(card)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detail panel with navigation */}
      {selected && (
        <div className="deck__overlay" onClick={() => setSelected(null)}>
          <div className="deck__detail" onClick={(e) => e.stopPropagation()}>
            <button className="deck__detail-close" onClick={() => setSelected(null)}>
              &times;
            </button>

            {/* Navigation arrows */}
            <div className="deck__detail-nav">
              <button
                className="deck__detail-arrow"
                onClick={() => navigate(-1)}
                disabled={!hasPrev}
                aria-label="Carta anterior"
              >
                &#x2190;
              </button>
              <span className="deck__detail-pos">
                {getPositionLabel(selected)} — {currentIdx + 1}/{group.length}
              </span>
              <button
                className="deck__detail-arrow"
                onClick={() => navigate(1)}
                disabled={!hasNext}
                aria-label="Próxima carta"
              >
                &#x2192;
              </button>
            </div>

            <div className="deck__detail-header">
              <span className="deck__detail-numeral">{selected.numeral}</span>
              <h3 className="deck__detail-name">{selected.name_pt}</h3>
              {selected.suit && (
                <span className={`deck__detail-suit deck__detail-suit--${selected.suit}`}>
                  {SUIT_ICONS[selected.suit]} {SUIT_LABELS[selected.suit]}
                </span>
              )}
            </div>
            <p className="deck__detail-concept">{selected.concept_pt}</p>
            {selected.classic_pt && (
              <p className="deck__detail-classic">{selected.classic_pt}</p>
            )}
            <div className="deck__detail-body">
              <p className="deck__detail-question">{selected.diagnostic_question_pt}</p>
              <p className="deck__detail-algedonic">
                <strong>Sinal algedônico:</strong> {selected.algedonic_pt}
              </p>
              <p className="deck__detail-reversal">
                <strong>Reversa:</strong> {selected.reversal_pt}
              </p>
              {selected.anchor_beer && (
                <blockquote className="deck__detail-quote">
                  <p>&ldquo;{selected.anchor_beer}&rdquo;</p>
                  <cite>— {selected.beer_source}</cite>
                </blockquote>
              )}
              {selected.anchor_bispo && (
                <blockquote className="deck__detail-quote deck__detail-quote--bispo">
                  <p>&ldquo;{selected.anchor_bispo}&rdquo;</p>
                  <cite>— Antônio Bispo dos Santos</cite>
                </blockquote>
              )}
              <p className="deck__detail-dito">
                <em>{selected.dito_pt}</em> — {selected.dito_source}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
