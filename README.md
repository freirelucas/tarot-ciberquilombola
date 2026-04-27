# TAROT CIBERQUILOMBOLA

**Systemic diagnosis crossing Stafford Beer's VSM with Antônio Bispo dos Santos' quilombola thought.**

> "The purpose of a system is what it does." — Stafford Beer
>
> "Nós somos o começo, o meio e o começo." — Antônio Bispo dos Santos

🌐 **Live:** [freirelucas.github.io/tarot-ciberquilombola](https://freirelucas.github.io/tarot-ciberquilombola/)

## What it is

The Tarot CiberQuilombola **is not divination — it is diagnosis**. It uses 78 cards as cybernetic lenses to examine systems (organizations, projects, communities, relationships). Each card maps to a real concept from Beer's organizational cybernetics, interwoven with the quilombola thought of Nego Bispo.

## The Deck — 78 cards

### Major Arcana — 22 cards, 3 Journeys (Ouspensky)

The Fool (0) stands at the center as Zero Point. The remaining 21 cards are arranged in three concentric journeys:

| Journey | Cards | Source | Principle |
|---------|-------|--------|-----------|
| Ancestry | I–VII | Brain of the Firm | Architecture of viability |
| Earth | VIII–XIV | Diagnosing the System | Laws of the environment |
| Transformation | XV–XXI | Platform for Change | Manifestation and change |

### Minor Arcana — 56 cards, The Crossroads of Exu

Four suits arranged as a crossroads, each mapped to an element:

| Suit | Element | Direction | VSM Aspect | Quilombo |
|------|---------|-----------|------------|----------|
| Waters (Águas) | Water | North | Information & Feedback | Orality |
| Territories (Territórios) | Earth | South | Environment & Identity | Land & Place |
| Tools (Ferramentas) | Fire | East | Operation & Action | Collective work |
| Drums (Tambores) | Air | West | Communication & Algedonia | Drum & Song |

Each suit: Ace through 10 (progressive complexity) + Page, Knight, Queen, King (court).

## Reading Modes

| Mode | Cards | Description |
|------|-------|-------------|
| Personal Diagnosis | 3 | Situation, obstacle, path |
| Viable System Model | 5 | Mapped to Beer's S1–S5 |
| Algedonic Signal | 1 | Pain or pleasure? Direct diagnosis. |

## Sources

All 78 cards have verified, linked sources:

- **26** Yoruba proverbs (owe ifá) — [Ile Orixá](https://ileorixa.com.br/wp/proverbios-da-cultura-yoruba/), [Alaketuodé](https://alaketuode2.blogspot.com/), [O Candomblé](https://ocandomble.com/)
- **25** Nego Bispo quotes — published books and documented lectures ([Fundação Palmares](https://www.gov.br/palmares/pt-br), [UFMG](https://ufmg.br/), [Brasil de Fato](https://www.brasildefato.com.br/))
- **15** Mestre Pastinha quotes — *Capoeira Angola* (1964), [Fundação Palmares](https://www.gov.br/palmares/pt-br)
- **12** Jongo pontos — Jongo da Serrinha, named masters ([pontosdejongo](https://pontosdejongo.blogspot.com/))
- **Beer citations** — published works linked to [Archive.org](https://archive.org/)

Zero fabricated content. Empty fields = research still needed, not invented.

## Run locally

```bash
npm install
npm run dev
```

Optional AI interpretation:
```bash
echo "VITE_ANTHROPIC_API_KEY=sk-ant-..." > .env
npm run dev
```

## Project Structure

```
src/
  data/
    cards.json          78 cards with Beer, Bispo, jongo, iorubá sources
    spreads.json        3 reading modes (bilingual)
  components/
    Card/               Card with flip animation, mini mode for deck
    Shell/              Layout, navigation, language toggle (EN/PT)
    Spread/             Card layout by reading mode
    Reading/            Interpretation (local or AI) + download
    Deck/               Deck browser: Wheel + Crossroads layout
    Petition/           Petition for Platform for Change translation
    About/              Project info, contact, disclaimer
  store/
    useReadingStore     Active reading state (Zustand)
    useLangStore        Language toggle EN/PT
  services/
    interpret.js        Anthropic API + local fallback (bilingual)
  styles/
    tokens.css          Design tokens (Cybersyn palette)
    base.css            Reset + IBM Plex Mono
```

## Petition

This project includes a petition for the publication of *Platform for Change* in Portuguese at accessible prices. Goal: gather signatures before the [ASC conference in Ouro Preto, August 2026](https://asc-cybernetics.org/2026-conference/).

## Important Notice

This is a **100% personal project**. No institutional affiliation. It does not represent any university, research institute, public agency, publisher, or organization.

## References

- Beer, S. (1972). [*Brain of the Firm*](https://archive.org/details/brainoffirmmanag0000beer). Allen Lane.
- Beer, S. (1979). [*Heart of Enterprise*](https://archive.org/details/heartofenterpris0000beer). Wiley.
- Beer, S. (1985). [*Diagnosing the System for Organizations*](https://archive.org/details/diagnosingsystem0000beer). Wiley.
- Beer, S. (1975). [*Platform for Change*](https://archive.org/details/platformforchan000beer). Wiley.
- Beer, S. (1994). [*Beyond Dispute*](https://archive.org/details/beyonddisputeinv0000beer). Wiley.
- Santos, A. B. (2015). [*Colonização, Quilombos*](http://cga.libertar.org/wp-content/uploads/2017/07/BISPO-Antonio.-Colonizacao_Quilombos.pdf). INCTI/UnB.
- Santos, A. B. (2023). [*A Terra Dá, A Terra Quer*](https://www.ubueditora.com.br/a-terra-da-a-terra-quer.html). Ubu/Piseagrama.
- Pastinha, V. F. (1964). [*Capoeira Angola*](https://portalcapoeira.com/download/capoeira-angola-por-mestre-pastinha/). Gráfica Loreto.
- Lara, S. H. & Pacheco, G. (2007). [*Memória do Jongo*](https://www.cecult.ifch.unicamp.br/pf-cecult/public-files/publicacoes/101/memoria_do_jongo.pdf). CECULT/Unicamp.
- IPHAN. (2005). [*Jongo, patrimônio imaterial brasileiro*](http://portal.iphan.gov.br/uploads/publicacao/Jongo_patrimonio_imaterial_brasileiro.pdf).

## Contact

**Lucas Freire Silva** — [lucasfreire@gmail.com](mailto:lucasfreire@gmail.com)

## License

Code: MIT. Data (`cards.json`, `spreads.json`): CC-BY-SA 4.0.
