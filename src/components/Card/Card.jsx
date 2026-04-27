import { useLangStore } from '../../store/useLangStore'
import './Card.css'

const ACT_LABELS = {
  0: 'Zero Point',
  1: 'Brain of the Firm',
  2: 'Diagnosing the System',
  3: 'Platform for Change',
}

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

export default function Card({ card, isReversed, isRevealed, position, onClick, mini }) {
  const { lang, c, t } = useLangStore()
  const suitLabel = card.suit ? SUIT_LABELS[card.suit][lang] : ''
  const cardName = c(card, 'name')

  if (mini) {
    return (
      <button
        className={`card card--mini ${card.suit ? `card--mini--${card.suit}` : 'card--mini--major'}`}
        onClick={onClick}
        aria-label={`${card.numeral} ${cardName}`}
      >
        <span className="card__mini-numeral">{card.numeral}</span>
        <span className="card__mini-name">{cardName}</span>
      </button>
    )
  }

  return (
    <div
      className={`card ${isRevealed ? 'card--revealed' : ''} ${isReversed && isRevealed ? 'card--reversed' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      aria-label={
        isRevealed
          ? `${cardName}${isReversed ? ` (${t('reversed')})` : ''}`
          : t('hiddenCard')
      }
    >
      <div className="card__inner">
        <div className="card__back">
          <div className="card__back-pattern">
            <div className="card__back-border" />
            <div className="card__back-symbol">&#x2735;</div>
            <span className="card__back-label">TAROT<br />CIBERQUILOMBOLA</span>
          </div>
        </div>

        <div className={`card__front ${card.suit ? `card__front--${card.suit}` : ''}`}>
          <div className="card__header">
            <span className="card__numeral">{card.numeral}</span>
            <span className={`card__act ${card.suit ? `card__act--${card.suit}` : ''}`}>
              {card.suit
                ? `${SUIT_ICONS[card.suit]} ${suitLabel}`
                : ACT_LABELS[card.act]}
            </span>
          </div>
          <h3 className="card__name">{cardName}</h3>
          <p className="card__concept">{c(card, 'concept')}</p>
          {card.classic_pt && (
            <p className="card__classic">{c(card, 'classic')}</p>
          )}
          {position && (
            <div className="card__position">
              <span className="card__position-label">{position}</span>
            </div>
          )}
          <div className="card__footer">
            <p className="card__dito">
              <em>{c(card, 'dito')}</em>
            </p>
            <p className="card__dito-source">— {card.dito_source}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
