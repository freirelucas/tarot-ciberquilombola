import { create } from 'zustand'

const strings = {
  en: {
    title: 'TAROT CIBERQUILOMBOLA',
    subtitle: 'systemic diagnosis · Beer × Bispo',
    baralho: 'Deck',
    manifesto: 'Manifesto',
    pontoZero: 'Zero Point',
    majorArcana: 'Major Arcana',
    minorArcana: 'Minor Arcana',
    majorSub: '22 cybernetic lenses — Ouspensky in 3 × 7',
    minorSub: '56 cards in 4 suits — the operational square',
    tese: 'Ancestry',
    antitese: 'Earth',
    sintese: 'Transformation',
    selectMode: 'Select a reading mode above to begin the diagnosis.',
    draw: 'DRAW',
    card: 'CARD',
    cards: 'CARDS',
    clickToReveal: 'Click each card to reveal it.',
    restart: 'Restart',
    localDiagnosis: 'Local Diagnosis',
    aiDiagnosis: 'AI Diagnosis',
    interpretWithClaude: 'Interpret with Claude',
    apiKeyLabel: 'Anthropic API Key (never stored):',
    processing: 'Processing systemic diagnosis...',
    saveHistory: 'Save to History',
    savedHistory: 'Saved to local history',
    newReading: 'New Reading',
    downloadReading: 'Download Reading',
    or: 'or',
    abandonReading: 'Abandon current reading?',
    hiddenCard: 'Hidden card — click to reveal',
    reversed: 'reversed',
    algedonicSignal: 'Algedonic signal',
    reversalLabel: 'Reversal',
    diagnosticQuestion: 'Diagnostic question',
    petition: 'Petition',
    petitionTitle: 'For the publication of Platform for Change in Portuguese at accessible prices',
    signPetition: 'Sign petition',
    sending: 'Sending...',
    signatureThanks: 'Signature registered. Thank you for supporting access to systemic knowledge.',
    signatureNote: 'Your signature is visible to all visitors.',
    signatureNoteLocal: 'Saved locally in this browser.',
    fullName: 'Full name *',
    cityCountry: 'City / Country',
    signatories: 'signatories',
    signatory: 'signatory',
    quoteBeeer: 'The purpose of a system is what it does.',
    quoteBispo: 'The land is not just one. Each land has its way of being land.',
    manifestoTab: 'Manifesto',
    manifestoTitle: 'Manifesto: Cybernetics & Quilombo',
    manifestoSub: 'Why Beer and Bispo need to meet in Portuguese',
  },
  pt: {
    title: 'TAROT CIBERQUILOMBOLA',
    subtitle: 'diagnóstico sistêmico · Beer × Bispo',
    baralho: 'Baralho',
    manifesto: 'Manifesto',
    pontoZero: 'Ponto Zero',
    majorArcana: 'Arcanos Maiores',
    minorArcana: 'Arcanos Menores',
    majorSub: '22 lentes cibernéticas — Ouspensky em 3 × 7',
    minorSub: '56 cartas em 4 naipes — o quadrado operacional',
    tese: 'Ancestralidade',
    antitese: 'Terra',
    sintese: 'Transformação',
    selectMode: 'Selecione um modo de leitura acima para começar o diagnóstico.',
    draw: 'SORTEAR',
    card: 'CARTA',
    cards: 'CARTAS',
    clickToReveal: 'Clique em cada carta para revelá-la.',
    restart: 'Recomeçar',
    localDiagnosis: 'Diagnóstico Local',
    aiDiagnosis: 'Diagnóstico com IA',
    interpretWithClaude: 'Interpretar com Claude',
    apiKeyLabel: 'Anthropic API Key (nunca é armazenada):',
    processing: 'Processando diagnóstico sistêmico...',
    saveHistory: 'Salvar no Histórico',
    savedHistory: 'Salvo no histórico local',
    newReading: 'Nova Leitura',
    downloadReading: 'Baixar Leitura',
    or: 'ou',
    abandonReading: 'Abandonar leitura atual?',
    hiddenCard: 'Carta oculta — clique para revelar',
    reversed: 'reversa',
    algedonicSignal: 'Sinal algedônico',
    reversalLabel: 'Reversa',
    diagnosticQuestion: 'Pergunta diagnóstica',
    petition: 'Petição',
    petitionTitle: 'Pela publicação de Platform for Change em português a preços acessíveis',
    signPetition: 'Assinar petição',
    sending: 'Enviando...',
    signatureThanks: 'Assinatura registrada. Obrigado por apoiar o acesso ao conhecimento sistêmico.',
    signatureNote: 'Sua assinatura é visível para todos os visitantes.',
    signatureNoteLocal: 'Salva localmente neste navegador.',
    fullName: 'Nome completo *',
    cityCountry: 'Cidade / País',
    signatories: 'signatários',
    signatory: 'signatário',
    quoteBeer: 'The purpose of a system is what it does.',
    quoteBispo: 'A terra não é uma só. Cada terra tem seu jeito de ser terra.',
    manifestoTab: 'Manifesto',
    manifestoTitle: 'Manifesto: Cibernética & Quilombo',
    manifestoSub: 'Por que Beer e Bispo precisam se encontrar em português',
  },
}

function cardField(card, field, lang) {
  const enKey = field + '_en'
  const ptKey = field + '_pt'
  if (lang === 'en') return card[enKey] || card[ptKey] || ''
  return card[ptKey] || card[enKey] || ''
}

export const useLangStore = create((set, get) => ({
  lang: 'en',

  toggleLang() {
    set({ lang: get().lang === 'en' ? 'pt' : 'en' })
  },

  setLang(lang) {
    set({ lang })
  },

  t(key) {
    return strings[get().lang]?.[key] || strings.en[key] || key
  },

  c(card, field) {
    return cardField(card, field, get().lang)
  },
}))
