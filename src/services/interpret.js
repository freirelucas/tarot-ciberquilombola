const SUIT_LABELS = {
  circuitos: { en: 'Circuits', pt: 'Circuitos' },
  territorios: { en: 'Territories', pt: 'Territórios' },
  ferramentas: { en: 'Tools', pt: 'Ferramentas' },
  sinais: { en: 'Signals', pt: 'Sinais' },
}

const SUIT_VSM = {
  circuitos: { en: 'Information & Feedback', pt: 'Informação & Feedback' },
  territorios: { en: 'Environment & Identity', pt: 'Ambiente & Identidade' },
  ferramentas: { en: 'Operation & Action', pt: 'Operação & Ação' },
  sinais: { en: 'Communication & Algedonia', pt: 'Comunicação & Algedonia' },
}

const SYSTEM_PROMPT_EN = `You are the oracle of Tarot CiberQuilombola — a diagnostic system crossing Stafford Beer's organizational cybernetics (Viable System Model) with the quilombola thought of Antônio Bispo dos Santos (Nego Bispo).

The deck has 78 cards:
- 22 Major Arcana — fundamental VSM concepts
- 56 Minor Arcana in 4 suits:
  • Circuits (Information & Feedback / Orality)
  • Territories (Environment & Identity / Land & Place)
  • Tools (Operation & Action / Collective work)
  • Signals (Communication & Algedonia / Drum & Song)

Rules:
- NEVER make predictions. This is DIAGNOSIS, not divination.
- Use direct, concrete, systemic language.
- Connect each card to the cybernetic concept it represents.
- For Minor Arcana, consider the suit as context: it indicates the VSM aspect in focus.
- When there is a Bispo citation, bring quilombola thought as counterpoint.
- Point out contradictions, broken feedback loops, insufficient variety.
- End with a diagnostic question that forces reflection.
- Be brief: maximum 3 paragraphs per card, 1 paragraph of final synthesis.
- Write in English.`

const SYSTEM_PROMPT_PT = `Você é o oráculo do Tarot CiberQuilombola — um sistema de diagnóstico que cruza a cibernética organizacional de Stafford Beer (Viable System Model) com o pensamento quilombola de Antônio Bispo dos Santos (Nego Bispo).

O deck tem 78 cartas:
- 22 Arcanos Maiores — conceitos fundamentais do VSM
- 56 Arcanos Menores em 4 naipes:
  • Circuitos (Informação & Feedback / Oralidade)
  • Territórios (Ambiente & Identidade / Terra & Lugar)
  • Ferramentas (Operação & Ação / Trabalho coletivo)
  • Sinais (Comunicação & Algedonia / Tambor & Canto)

Regras:
- NUNCA faça previsões. Isto é DIAGNÓSTICO, não adivinhação.
- Use linguagem direta, concreta, sistêmica.
- Conecte cada carta ao conceito cibernético que ela representa.
- Para Arcanos Menores, considere o naipe como contexto: ele indica o aspecto do VSM em foco.
- Quando houver citação de Bispo, traga o pensamento quilombola como contraponto.
- Aponte contradições, loops de feedback quebrados, variedade insuficiente.
- Termine com uma pergunta diagnóstica que force reflexão.
- Seja breve: máximo 3 parágrafos por carta, 1 parágrafo de síntese final.
- Escreva em português brasileiro.`

function f(card, field, lang) {
  return card[field + '_' + lang] || card[field + '_' + (lang === 'en' ? 'pt' : 'en')] || ''
}

function buildLocalInterpretation(drawnCards, reversed, spread, lang) {
  const lines = []
  const sName = lang === 'en' ? spread.name_en : spread.name_pt
  const diagLabel = lang === 'en' ? 'Diagnosis' : 'Diagnóstico'
  const suitLabel = lang === 'en' ? 'Suit' : 'Naipe'
  const algeLabel = lang === 'en' ? 'Algedonic signal' : 'Sinal algedônico'
  const revLabel = lang === 'en' ? 'Reversed' : 'Reversa'
  const finalQ = lang === 'en'
    ? '**Final diagnostic question:** Looking at this set of cards as a system: where is the broken feedback loop? What variety is not being absorbed?'
    : '**Pergunta diagnóstica final:** Olhando para este conjunto de cartas como um sistema: onde está o loop de feedback quebrado? Que variedade não está sendo absorvida?'

  lines.push(`## ${diagLabel}: ${sName}\n`)

  drawnCards.forEach((card, i) => {
    const pos = spread.positions[i]
    const posL = lang === 'en' ? pos.label_en : pos.label_pt
    const posD = lang === 'en' ? pos.description_en : pos.description_pt
    const isReversed = reversed[i]
    lines.push(`### ${posL} — ${card.numeral} ${f(card, 'name', lang)}${isReversed ? ` (${revLabel})` : ''}\n`)

    if (card.suit) {
      lines.push(`*${suitLabel}: ${SUIT_LABELS[card.suit][lang]} — ${SUIT_VSM[card.suit][lang]}*\n`)
    }

    lines.push(`**${f(card, 'concept', lang)}**\n`)

    if (isReversed) {
      lines.push(`${f(card, 'reversal', lang)}\n`)
    } else {
      lines.push(`*${posD}*\n`)
      lines.push(`${f(card, 'diagnostic_question', lang)}\n`)
    }

    lines.push(`> ${algeLabel}: ${f(card, 'algedonic', lang)}\n`)

    if (card.anchor_beer) {
      lines.push(`> _"${card.anchor_beer}"_ — Beer\n`)
    }
    if (card.anchor_bispo) {
      lines.push(`> _"${card.anchor_bispo}"_ — Bispo\n`)
    }

    lines.push(`_${f(card, 'dito', lang)}_ — ${card.dito_source}\n`)
    lines.push('')
  })

  lines.push('---\n')
  lines.push(finalQ + '\n')

  return lines.join('\n')
}

export async function interpret(drawnCards, reversed, spread, apiKey, lang = 'en') {
  const localResult = buildLocalInterpretation(drawnCards, reversed, spread, lang)

  if (!apiKey) {
    return { text: localResult, source: 'local' }
  }

  const systemPrompt = lang === 'pt' ? SYSTEM_PROMPT_PT : SYSTEM_PROMPT_EN

  const userPrompt = drawnCards
    .map((card, i) => {
      const pos = spread.positions[i]
      const posL = lang === 'en' ? pos.label_en : pos.label_pt
      const rev = reversed[i] ? (lang === 'en' ? ' [REVERSED]' : ' [REVERSA]') : ''
      const suitInfo = card.suit ? ` [${SUIT_LABELS[card.suit][lang]}]` : ''
      return `Position "${posL}": ${card.numeral} ${f(card, 'name', lang)}${rev}${suitInfo} — ${f(card, 'concept', lang)}`
    })
    .join('\n')

  const promptText = lang === 'en'
    ? `Reading mode: ${spread.name_en}\n\nDrawn cards:\n${userPrompt}\n\nPerform the systemic diagnosis.`
    : `Modo de leitura: ${spread.name_pt}\n\nCartas sorteadas:\n${userPrompt}\n\nFaça o diagnóstico sistêmico.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6-20250514',
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: 'user', content: promptText }],
      }),
    })

    if (!response.ok) {
      return { text: localResult, source: 'local' }
    }

    const data = await response.json()
    const aiText = data.content?.[0]?.text
    if (!aiText) {
      return { text: localResult, source: 'local' }
    }

    return { text: aiText, source: 'api' }
  } catch {
    return { text: localResult, source: 'local' }
  }
}
