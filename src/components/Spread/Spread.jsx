import { useReadingStore } from '../../store/useReadingStore'
import { useLangStore } from '../../store/useLangStore'
import Card from '../Card/Card.jsx'
import './Spread.css'

export default function Spread() {
  const { spread, drawnCards, reversed, revealed, phase, drawCards, revealCard, reset } =
    useReadingStore()
  const { lang, t } = useLangStore()

  if (!spread) {
    return (
      <div className="spread__empty">
        <p className="spread__prompt">{t('selectMode')}</p>
      </div>
    )
  }

  const sName = lang === 'en' ? spread.name_en : spread.name_pt
  const sDesc = lang === 'en' ? spread.description_en : spread.description_pt
  const posLabel = (i) => lang === 'en' ? spread.positions[i].label_en : spread.positions[i].label_pt
  const hasCards = drawnCards.length > 0

  return (
    <div className="spread">
      <div className="spread__info">
        <h2 className="spread__title">{sName}</h2>
        <p className="spread__description">{sDesc}</p>
      </div>

      {!hasCards && (
        <button className="spread__draw-btn" onClick={drawCards}>
          &#x2735; {t('draw')} {spread.card_count} {spread.card_count === 1 ? t('card') : t('cards')}
        </button>
      )}

      {hasCards && (
        <div className={`spread__grid spread__grid--${spread.id}`}>
          {drawnCards.map((card, i) => (
            <div key={card.id} className="spread__slot">
              <Card
                card={card}
                isReversed={reversed[i]}
                isRevealed={!!revealed[i]}
                position={posLabel(i)}
                onClick={() => !revealed[i] && revealCard(i)}
              />
              <span className="spread__slot-label">{posLabel(i)}</span>
            </div>
          ))}
        </div>
      )}

      {hasCards && phase === 'drawing' && (
        <p className="spread__hint">{t('clickToReveal')}</p>
      )}

      {hasCards && (
        <button className="spread__reset-btn" onClick={reset}>
          &#x21BB; {t('restart')}
        </button>
      )}
    </div>
  )
}
