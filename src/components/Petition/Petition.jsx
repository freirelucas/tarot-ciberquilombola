import { useState, useEffect } from 'react'
import { useLangStore } from '../../store/useLangStore'
import './Petition.css'

const API_URL = import.meta.env.VITE_PETITION_API || ''
const STORAGE_KEY = 'tarot-ciberquilombola-petition'

function loadLocalSignatures() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

export default function Petition() {
  const { lang } = useLangStore()
  const [tab, setTab] = useState('petition')
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [signed, setSigned] = useState(false)
  const [signatures, setSignatures] = useState(loadLocalSignatures)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!API_URL) return
    fetch(API_URL)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSignatures(data)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        }
      })
      .catch(() => {})
  }, [])

  async function handleSign(e) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    const entry = { name: name.trim(), city: city.trim() || null, date: new Date().toISOString().slice(0, 10) }
    if (API_URL) {
      try {
        await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(entry), redirect: 'follow' })
        const fresh = await fetch(API_URL).then((r) => r.json())
        if (Array.isArray(fresh)) { setSignatures(fresh); localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh)) }
      } catch {
        const updated = [...signatures, entry]; localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); setSignatures(updated)
      }
    } else {
      const updated = [...signatures, entry]; localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); setSignatures(updated)
    }
    setSigned(true); setLoading(false); setName(''); setCity('')
  }

  const en = lang === 'en'

  return (
    <div className="petition">
      <div className="petition__tabs">
        <button className={`petition__tab ${tab === 'petition' ? 'petition__tab--active' : ''}`} onClick={() => setTab('petition')}>
          {en ? 'Petition' : 'Abaixo-assinado'}
        </button>
        <button className={`petition__tab ${tab === 'manifesto' ? 'petition__tab--active' : ''}`} onClick={() => setTab('manifesto')}>
          {en ? 'Manifesto' : 'Manifesto'}
        </button>
      </div>

      {tab === 'petition' ? (
        <div className="petition__content">
          <h2 className="petition__title">
            {en
              ? <>{`For the publication of `}<em>Platform for Change</em>{` in Portuguese at accessible prices`}</>
              : <>{`Pela publicação de `}<em>Platform for Change</em>{` em português a preços acessíveis`}</>}
          </h2>

          <div className="petition__comparison">
            <div className="petition__price petition__price--beer">
              <span className="petition__price-label">Platform for Change</span>
              <span className="petition__price-author">Stafford Beer, 1975</span>
              <span className="petition__price-value petition__price-value--high">US$ 65–78</span>
              <span className="petition__price-note">{en ? 'New, in English. No Portuguese translation.' : 'Novo, em inglês. Sem tradução para o português.'}</span>
            </div>
            <div className="petition__price petition__price--bispo">
              <span className="petition__price-label">A Terra Dá, A Terra Quer</span>
              <span className="petition__price-author">Antônio Bispo dos Santos, 2023</span>
              <span className="petition__price-value petition__price-value--low">R$ 53</span>
              <span className="petition__price-note">{en ? 'New, in Portuguese. Ubu Editora. ≈ US$ 10' : 'Novo, em português. Editora Ubu. ≈ US$ 10'}</span>
            </div>
          </div>

          <div className="petition__text">
            {en ? (
              <>
                <p>Half a century ago, Stafford Beer published <em>Platform for Change</em> — thirteen arguments for transforming how we organize collective life. The book has never been translated into Portuguese. It costs US$ 65–78 new, inaccessible to most readers in Brazil, Latin America, and Portuguese-speaking Africa.</p>
                <p>Meanwhile, <em>A Terra Dá, A Terra Quer</em> by Antônio Bispo dos Santos — a fundamental work of quilombola thought — costs R$ 53 from Ubu Editora. One world-changing book is accessible. The other is not.</p>
                <p>Beer dreamed of systems that served the people, not the market. Bispo taught us that knowledge that does not circulate rots. <strong>A book locked behind a prohibitive price contradicts its own content.</strong></p>
                <p>We ask the copyright holders of Stafford Beer and Wiley to make possible a Portuguese edition of <em>Platform for Change</em> at prices compatible with the Global South — ideally R$ 50–80.</p>
                <h3>By signing, you authorize:</h3>
                <ul>
                  <li>The organizer to send the list of signatories to Beer&rsquo;s copyright holders and Wiley &amp; Sons;</li>
                  <li>Your name and city (if provided) to be listed publicly;</li>
                  <li>The petition to be sent to Brazilian and Portuguese publishers as a demonstration of demand.</li>
                </ul>
              </>
            ) : (
              <>
                <p>Há meio século, Stafford Beer publicou <em>Platform for Change</em> — treze argumentos para a transformação de como organizamos a vida coletiva. O livro nunca foi traduzido para o português. Custa entre US$ 65 e US$ 78 novo (cerca de R$ 350–420), valor inacessível para a maioria dos leitores brasileiros, latino-americanos e africanos de língua portuguesa.</p>
                <p>Enquanto isso, <em>A Terra Dá, A Terra Quer</em> de Antônio Bispo dos Santos — obra fundamental do pensamento quilombola — custa R$ 53 na Editora Ubu. Um livro que transforma visões de mundo está acessível. O outro, não.</p>
                <p>Beer sonhou com sistemas que servissem ao povo, não ao mercado. Bispo nos ensinou que o saber que não circula apodrece. <strong>Um livro trancado atrás de um preço proibitivo contradiz o próprio conteúdo que carrega.</strong></p>
                <p>Pedimos aos detentores dos direitos autorais de Stafford Beer e à editora Wiley que viabilizem uma edição em português de <em>Platform for Change</em> a preços compatíveis com a realidade do Sul Global — idealmente na faixa de R$ 50–80.</p>
                <h3>Ao assinar, você autoriza:</h3>
                <ul>
                  <li>Que o organizador desta petição endereçe a lista de signatários aos detentores dos direitos autorais de Stafford Beer e à editora Wiley &amp; Sons;</li>
                  <li>Que seu nome e cidade (se informada) sejam listados publicamente como signatário(a);</li>
                  <li>Que a petição seja enviada a editoras brasileiras e portuguesas como demonstração de demanda por uma edição acessível.</li>
                </ul>
              </>
            )}
          </div>

          {signed ? (
            <div className="petition__thanks">
              <p>{en ? 'Signature registered. Thank you for supporting access to systemic knowledge.' : 'Assinatura registrada. Obrigado por apoiar o acesso ao conhecimento sistêmico.'}</p>
              <p className="petition__thanks-note">{API_URL ? (en ? 'Your signature is visible to all visitors.' : 'Sua assinatura é visível para todos os visitantes.') : (en ? 'Saved locally in this browser.' : 'Salva localmente neste navegador.')}</p>
            </div>
          ) : (
            <form className="petition__form" onSubmit={handleSign}>
              <div className="petition__field">
                <label htmlFor="pet-name">{en ? 'Full name *' : 'Nome completo *'}</label>
                <input id="pet-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder={en ? 'Your name' : 'Seu nome'} />
              </div>
              <div className="petition__field">
                <label htmlFor="pet-city">{en ? 'City / Country' : 'Cidade / País'}</label>
                <input id="pet-city" type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder={en ? 'e.g. São Paulo, Brazil' : 'Ex: São Paulo, Brasil'} />
              </div>
              <button type="submit" className="petition__submit" disabled={loading}>
                {loading ? (en ? 'Sending...' : 'Enviando...') : (en ? 'Sign petition' : 'Assinar petição')}
              </button>
            </form>
          )}

          {signatures.length > 0 && (
            <div className="petition__signatures">
              <h3>{signatures.length} {signatures.length > 1 ? (en ? 'signatories' : 'signatários') : (en ? 'signatory' : 'signatário')}</h3>
              <ul>
                {signatures.map((s, i) => (
                  <li key={i}><strong>{s.name}</strong>{s.city && <span> — {s.city}</span>}<span className="petition__sig-date"> ({s.date})</span></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="petition__content petition__manifesto">
          <h2 className="petition__title">
            {en ? 'Manifesto: Cybernetics & Quilombo' : 'Manifesto: Cibernética & Quilombo'}
          </h2>
          <h3 className="petition__manifesto-sub">
            {en ? 'Why Beer and Bispo need to meet in Portuguese' : 'Por que Beer e Bispo precisam se encontrar em português'}
          </h3>

          <blockquote className="petition__quote petition__quote--beer">
            <p>&ldquo;The purpose of a system is what it does.&rdquo;</p>
            <cite>— Stafford Beer, 1974</cite>
          </blockquote>
          <blockquote className="petition__quote petition__quote--bispo">
            <p>&ldquo;Nós não somos o que dizemos que somos. Nós somos o que fazemos.&rdquo;</p>
            <cite>— Antônio Bispo dos Santos</cite>
          </blockquote>

          <div className="petition__manifesto-body">
            {en ? (
              <>
                <p>Two men. Two continents. Two traditions of thought that never met in life — but say the same thing in different languages.</p>
                <p><strong>Stafford Beer</strong> (1926–2002), British cybernetician, spent his life building tools so that complex organizations could know themselves. His Viable System Model is not a theory of control — it is a theory of <em>autonomy</em>: how each part of a system can govern itself without losing coherence with the whole. Beer dreamed of cybernetic socialism in Allende&rsquo;s Chile. The coup destroyed the dream, not the idea.</p>
                <p><strong>Antônio Bispo dos Santos</strong> (1959–2023), farmer and quilombola thinker from Piauí, lived what Beer theorized. Quilombos are viable systems — communities that maintained autonomous existence under extreme oppression, developing oral information circuits, collective work tools, embodied algedonic signals, and identity territories that resisted centuries of colonial violence.</p>
                <p>Beer called <em>homeostasis</em> what Bispo called <em>balance of the earth</em>. Beer spoke of <em>requisite variety</em>; Bispo said <em>&ldquo;the land is not just one&rdquo;</em>. Beer designed <em>algedonic channels</em> so the system&rsquo;s pain could reach the decision center; in quilombos, <em>the drum had been doing this for centuries</em>.</p>
                <p>The problem is simple: <strong>Beer is locked in expensive English. Bispo is accessible in Portuguese.</strong> The dialogue that should happen — between Western cybernetics and quilombola epistemology — cannot happen while one interlocutor costs seven times more than the other.</p>
                <p><em>Platform for Change</em> is not a management book. It is a call to reorganize society using the intelligence of living systems. Each of Beer&rsquo;s thirteen arguments could have been written by Bispo in another language — the language of the earth, of the mutirão, of the terreiro.</p>
                <p className="petition__manifesto-close">Because the purpose of a book is what it does.<br />And a book that cannot be read does nothing.</p>
              </>
            ) : (
              <>
                <p>Dois homens. Dois continentes. Duas tradições de pensamento que nunca se encontraram em vida — mas dizem a mesma coisa em linguagens diferentes.</p>
                <p><strong>Stafford Beer</strong> (1926–2002), ciberneticista britânico, passou a vida construindo ferramentas para que organizações complexas pudessem se conhecer a si mesmas. Seu Modelo de Sistema Viável não é uma teoria de controle — é uma teoria de <em>autonomia</em>: como cada parte de um sistema pode governar a si mesma sem perder coerência com o todo. Beer sonhou com um socialismo cibernético no Chile de Allende. O golpe destruiu o sonho, não a idéia.</p>
                <p><strong>Antônio Bispo dos Santos</strong> (1959–2023), lavrador e pensador quilombola do Piauí, viveu o que Beer teorizou. Os quilombos são sistemas viáveis — comunidades que mantiveram existência autônoma sob condições de opressão extrema, desenvolvendo circuitos de informação oral, ferramentas de trabalho coletivo, sinais algedônicos corporificados e territórios de identidade que resistiram a séculos de violência colonial.</p>
                <p>Beer chamava de <em>homeostase</em> o que Bispo chamava de <em>equilíbrio da terra</em>. Beer falava em <em>variedade requerida</em>; Bispo dizia que <em>&ldquo;a terra não é uma só&rdquo;</em>. Beer projetava <em>canais algedônicos</em> para que a dor do sistema chegasse ao centro de decisão; nos quilombos, <em>o tambor já fazia isso há séculos</em>.</p>
                <p>O problema é simples: <strong>Beer está trancado em inglês caro. Bispo está acessível em português.</strong> O diálogo que deveria acontecer — entre cibernética ocidental e epistemologia quilombola — não pode acontecer enquanto um dos interlocutores custa sete vezes mais que o outro.</p>
                <p><em>Platform for Change</em> não é um livro de gestão. É um chamado para reorganizar a sociedade usando a inteligência dos sistemas vivos. Cada um dos treze argumentos de Beer poderia ter sido escrito por Bispo em outra linguagem — a linguagem da terra, do mutirão, do terreiro.</p>
                <p className="petition__manifesto-close">Porque o propósito de um livro é o que ele faz.<br />E um livro que não pode ser lido não faz nada.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
