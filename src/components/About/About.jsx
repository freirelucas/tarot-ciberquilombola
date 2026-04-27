import { useLangStore } from '../../store/useLangStore'
import './About.css'

export default function About() {
  const { lang } = useLangStore()

  if (lang === 'pt') return (
    <div className="about">
      <h2 className="about__title">Sobre o Projeto</h2>

      <section className="about__section">
        <h3>O que é</h3>
        <p>
          O Tarot CiberQuilombola é uma ferramenta de <strong>diagnóstico sistêmico</strong> que
          cruza a cibernética organizacional de Stafford Beer (Viable System Model) com o
          pensamento quilombola de Antônio Bispo dos Santos (Nego Bispo). Não é adivinhação —
          é um instrumento de reflexão sobre sistemas vivos.
        </p>
      </section>

      <section className="about__section">
        <h3>Motivação</h3>
        <p>
          <em>Platform for Change</em> de Stafford Beer nunca foi traduzido para o português.
          Custa entre US$ 65–78 novo (R$ 350–420). Enquanto isso, <em>A Terra Dá, A Terra Quer</em> de
          Antônio Bispo dos Santos custa R$ 53 na Ubu Editora.
        </p>
        <p>
          O diálogo entre cibernética ocidental e epistemologia quilombola não pode acontecer
          enquanto um dos interlocutores custa sete vezes mais que o outro. Este projeto é um
          passo concreto para viabilizar esse encontro.
        </p>
      </section>

      <section className="about__section about__section--highlight">
        <h3>Abaixo-assinado</h3>
        <p>
          Este projeto inclui uma petição pela publicação de <em>Platform for Change</em> em
          português a preços acessíveis. O objetivo é reunir assinaturas antes do congresso
          da <strong>American Society for Cybernetics (ASC)</strong> em <strong>Ouro Preto, Minas Gerais,
          <a href="https://asc-cybernetics.org/2026-conference/" target="_blank" rel="noopener noreferrer">agosto de 2026</a></strong> — e apresentar a demanda diretamente à comunidade internacional
          de cibernética.
        </p>
      </section>

      <section className="about__section">
        <h3>Aviso importante</h3>
        <p>
          Este é um <strong>projeto 100% pessoal</strong>. Não tem nenhuma afiliação institucional —
          não representa nenhuma universidade, instituto de pesquisa, órgão público, editora ou
          organização. É uma iniciativa individual motivada pela convicção de que o pensamento
          sistêmico deve ser acessível a quem mais precisa dele.
        </p>
      </section>

      <section className="about__section">
        <h3>Fontes</h3>
        <p>
          As citações de Beer vêm de obras publicadas (linkadas no Archive.org). As citações de
          Bispo vêm de livros e palestras documentadas. Os pontos de jongo são do acervo do
          Jongo da Serrinha (mestres nomeados). Os provérbios iorubá vêm de compilações
          documentadas da tradição do Ifá. Todas as fontes têm URL verificável em cada carta.
        </p>
      </section>

      <section className="about__section">
        <h3>Tecnologia</h3>
        <p>
          100% no navegador, zero backend, código aberto. React + Vite + Zustand.
          Interpretação local funciona offline. API da Anthropic é opcional.
          Dados abertos em <code>cards.json</code>.
        </p>
      </section>

      <section className="about__contact">
        <h3>Contato</h3>
        <p>
          <strong>Lucas Freire Silva</strong>
        </p>
        <p>
          <a href="mailto:lucasfreire@gmail.com">lucasfreire@gmail.com</a>
        </p>
        <p>
          <a href="https://github.com/freirelucas/tarot-ciberquilombola" target="_blank" rel="noopener noreferrer">
            github.com/freirelucas/tarot-ciberquilombola
          </a>
        </p>
      </section>
    </div>
  )

  return (
    <div className="about">
      <h2 className="about__title">About the Project</h2>

      <section className="about__section">
        <h3>What it is</h3>
        <p>
          The Tarot CiberQuilombola is a <strong>systemic diagnosis</strong> tool crossing
          Stafford Beer&rsquo;s organizational cybernetics (Viable System Model) with the
          quilombola thought of Antônio Bispo dos Santos (Nego Bispo). It is not divination —
          it is an instrument for reflection on living systems.
        </p>
      </section>

      <section className="about__section">
        <h3>Motivation</h3>
        <p>
          Stafford Beer&rsquo;s <em>Platform for Change</em> has never been translated into Portuguese.
          It costs US$ 65–78 new. Meanwhile, Antônio Bispo dos Santos&rsquo; <em>A Terra Dá,
          A Terra Quer</em> costs R$ 53 (~US$ 10) from Ubu Editora.
        </p>
        <p>
          The dialogue between Western cybernetics and quilombola epistemology cannot happen
          while one interlocutor costs seven times more than the other. This project is a
          concrete step toward making that encounter possible.
        </p>
      </section>

      <section className="about__section about__section--highlight">
        <h3>Petition</h3>
        <p>
          This project includes a petition for the publication of <em>Platform for Change</em> in
          Portuguese at accessible prices. The goal is to gather signatures before the
          <strong> American Society for Cybernetics (ASC)</strong> conference in <strong>Ouro Preto,
          Minas Gerais, Brazil, <a href="https://asc-cybernetics.org/2026-conference/" target="_blank" rel="noopener noreferrer">August 2026</a></strong> — and present the demand directly to the
          international cybernetics community.
        </p>
      </section>

      <section className="about__section">
        <h3>Important notice</h3>
        <p>
          This is a <strong>100% personal project</strong>. It has no institutional affiliation —
          it does not represent any university, research institute, public agency, publisher,
          or organization. It is an individual initiative driven by the conviction that
          systemic thinking should be accessible to those who need it most.
        </p>
      </section>

      <section className="about__section">
        <h3>Sources</h3>
        <p>
          Beer citations come from published works (linked to Archive.org). Bispo citations
          come from published books and documented lectures. Jongo pontos are from the Jongo
          da Serrinha archive (named masters). Yoruba proverbs come from documented compilations
          of the Ifá tradition. All sources have a verifiable URL on each card.
        </p>
      </section>

      <section className="about__section">
        <h3>Technology</h3>
        <p>
          100% in-browser, zero backend, open source. React + Vite + Zustand.
          Local interpretation works offline. Anthropic API is optional.
          Open data in <code>cards.json</code>.
        </p>
      </section>

      <section className="about__contact">
        <h3>Contact</h3>
        <p>
          <strong>Lucas Freire Silva</strong>
        </p>
        <p>
          <a href="mailto:lucasfreire@gmail.com">lucasfreire@gmail.com</a>
        </p>
        <p>
          <a href="https://github.com/freirelucas/tarot-ciberquilombola" target="_blank" rel="noopener noreferrer">
            github.com/freirelucas/tarot-ciberquilombola
          </a>
        </p>
      </section>
    </div>
  )
}
