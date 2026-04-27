import { useState, useEffect, useRef } from 'react'
import { marked } from 'marked'
import { useReadingStore } from '../../store/useReadingStore'
import { useLangStore } from '../../store/useLangStore'
import { interpret } from '../../services/interpret'
import './Reading.css'

marked.setOptions({ breaks: true, gfm: true })

export default function Reading() {
  const { spread, drawnCards, reversed, interpretation, setInterpretation, setPhase, phase, reset } =
    useReadingStore()
  const { lang, t } = useLangStore()
  const [apiKey, setApiKey] = useState('')
  const [showApiInput, setShowApiInput] = useState(false)
  const autoRan = useRef(false)

  const posLabel = (i) => lang === 'en' ? spread.positions[i].label_en : spread.positions[i].label_pt

  useEffect(() => {
    if (phase === 'reading' && !interpretation && !autoRan.current && spread && drawnCards.length > 0) {
      autoRan.current = true
      setPhase('interpreting')
      interpret(drawnCards, reversed, spread, null, lang)
        .then((result) => setInterpretation(result.text))
        .catch(() => setInterpretation(lang === 'en' ? 'Error generating interpretation.' : 'Erro ao gerar interpretação.'))
    }
  }, [phase, interpretation, spread, drawnCards, reversed, lang, setInterpretation, setPhase])

  useEffect(() => {
    autoRan.current = false
  }, [spread])

  if (!spread || drawnCards.length === 0) return null

  async function handleAiInterpret() {
    setPhase('interpreting')
    try {
      const result = await interpret(drawnCards, reversed, spread, apiKey, lang)
      setInterpretation(result.text)
    } catch {
      setInterpretation(lang === 'en' ? 'Error generating interpretation. Try again.' : 'Erro ao gerar interpretação. Tente novamente.')
    }
  }

  function handleDownloadPdf() {
    const sName = lang === 'en' ? spread.name_en : spread.name_pt
    const dateStr = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR')
    const modeLabel = lang === 'en' ? 'Mode' : 'Modo'
    const dateLabel = lang === 'en' ? 'Date' : 'Data'
    const cardsLabel = lang === 'en' ? 'Cards' : 'Cartas'
    const diagLabel = lang === 'en' ? 'Diagnosis' : 'Diagnóstico'

    const cardsHtml = drawnCards.map((c, i) => {
      const rev = reversed[i] ? ` (${t('reversed')})` : ''
      const name = lang === 'en' ? c.name_en : c.name_pt
      return `<li><strong>${posLabel(i)}:</strong> ${c.numeral} ${name}${rev}</li>`
    }).join('')

    const diagHtml = marked.parse(interpretation)

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>Tarot CiberQuilombola — ${sName}</title>
<style>
  body { font-family: 'Courier New', monospace; max-width: 700px; margin: 40px auto; padding: 20px; color: #222; line-height: 1.7; }
  h1 { font-size: 18px; letter-spacing: 0.1em; border-bottom: 2px solid #48B890; padding-bottom: 8px; }
  h2 { font-size: 14px; color: #48B890; margin-top: 24px; }
  h3 { font-size: 13px; color: #B07A1A; margin-top: 16px; }
  .meta { font-size: 12px; color: #666; }
  ul { padding-left: 20px; }
  li { margin-bottom: 4px; font-size: 13px; }
  blockquote { border-left: 3px solid #48B890; padding-left: 12px; margin: 12px 0; color: #555; font-style: italic; }
  hr { border: none; border-top: 1px dashed #ccc; margin: 24px 0; }
  .footer { font-size: 10px; color: #999; text-align: center; margin-top: 40px; border-top: 1px solid #eee; padding-top: 12px; }
</style></head><body>
<h1>TAROT CIBERQUILOMBOLA</h1>
<p class="meta"><strong>${modeLabel}:</strong> ${sName} &nbsp;|&nbsp; <strong>${dateLabel}:</strong> ${dateStr}</p>
<h2>${cardsLabel}</h2>
<ul>${cardsHtml}</ul>
<hr>
<h2>${diagLabel}</h2>
${diagHtml}
<div class="footer">Tarot CiberQuilombola — Beer × Bispo<br>freirelucas.github.io/tarot-ciberquilombola</div>
</body></html>`

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(html)
      printWindow.document.close()
      setTimeout(() => printWindow.print(), 300)
    }
  }

  return (
    <div className="reading">
      {phase === 'interpreting' && !interpretation && (
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
            <button className="reading__btn reading__btn--download" onClick={handleDownloadPdf}>
              &#x2B73; {t('downloadReading')} (PDF)
            </button>

            {!showApiInput ? (
              <button className="reading__btn reading__btn--api" onClick={() => setShowApiInput(true)}>
                &#x2728; {t('aiDiagnosis')}
              </button>
            ) : (
              <div className="reading__api-input">
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
                  onClick={handleAiInterpret}
                  disabled={!apiKey}
                >
                  &#x2728; {t('interpretWithClaude')}
                </button>
              </div>
            )}

            <button className="reading__btn reading__btn--reset" onClick={reset}>
              {t('newReading')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
