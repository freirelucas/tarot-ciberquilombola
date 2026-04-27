import { useState } from 'react'
import { marked } from 'marked'
import { useReadingStore } from '../../store/useReadingStore'
import { useLangStore } from '../../store/useLangStore'
import { interpret } from '../../services/interpret'
import './Reading.css'

marked.setOptions({ breaks: true, gfm: true })

export default function Reading() {
  const { spread, drawnCards, reversed, interpretation, setInterpretation, setPhase, reset } =
    useReadingStore()
  const { lang, t } = useLangStore()
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [showApiInput, setShowApiInput] = useState(false)

  if (!spread || drawnCards.length === 0) return null

  const posLabel = (i) => lang === 'en' ? spread.positions[i].label_en : spread.positions[i].label_pt

  async function handleInterpret(useApi) {
    setLoading(true)
    setPhase('interpreting')
    try {
      const key = useApi ? apiKey : null
      const result = await interpret(drawnCards, reversed, spread, key, lang)
      setInterpretation(result.text)
    } catch {
      setInterpretation(lang === 'en' ? 'Error generating interpretation. Try again.' : 'Erro ao gerar interpretação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleDownload() {
    const sName = lang === 'en' ? spread.name_en : spread.name_pt
    const lines = []
    lines.push(`# TAROT CIBERQUILOMBOLA`)
    lines.push(`**${lang === 'en' ? 'Mode' : 'Modo'}:** ${sName}`)
    lines.push(`**${lang === 'en' ? 'Date' : 'Data'}:** ${new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR')}\n`)
    lines.push(`## ${lang === 'en' ? 'Cards' : 'Cartas'}\n`)
    drawnCards.forEach((c, i) => {
      const rev = reversed[i] ? ` (${t('reversed')})` : ''
      const name = lang === 'en' ? c.name_en : c.name_pt
      lines.push(`- **${posLabel(i)}:** ${c.numeral} ${name}${rev}`)
    })
    lines.push(`\n---\n`)
    lines.push(`## ${lang === 'en' ? 'Diagnosis' : 'Diagnóstico'}\n`)
    lines.push(interpretation)
    const content = lines.join('\n')
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reading-${spread.id}-${new Date().toISOString().slice(0, 10)}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="reading">
      {!interpretation && !loading && (
        <div className="reading__actions">
          <button className="reading__btn reading__btn--local" onClick={() => handleInterpret(false)}>
            &#x25B6; {t('localDiagnosis')}
          </button>

          <div className="reading__divider">{t('or')}</div>

          {!showApiInput ? (
            <button
              className="reading__btn reading__btn--api"
              onClick={() => setShowApiInput(true)}
            >
              &#x2728; {t('aiDiagnosis')}
            </button>
          ) : (
            <div className="reading__api-input">
              <label htmlFor="api-key" className="reading__api-label">
                {t('apiKeyLabel')}
              </label>
              <input
                id="api-key"
                type="password"
                className="reading__input"
                placeholder="sk-ant-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <button
                className="reading__btn reading__btn--api"
                onClick={() => handleInterpret(true)}
                disabled={!apiKey}
              >
                &#x2728; {t('interpretWithClaude')}
              </button>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="reading__loading">
          <span className="reading__spinner" />
          <p>{t('processing')}</p>
        </div>
      )}

      {interpretation && (
        <div className="reading__result">
          <div
            className="reading__text"
            dangerouslySetInnerHTML={{ __html: marked.parse(interpretation) }}
          />
          <div className="reading__result-actions">
            <button className="reading__btn reading__btn--download" onClick={handleDownload}>
              &#x2B73; {t('downloadReading')}
            </button>
            <button className="reading__btn reading__btn--reset" onClick={reset}>
              {t('newReading')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
