# TAROT CIBERQUILOMBOLA

**Diagnóstico sistêmico cruzando o VSM de Stafford Beer com o pensamento quilombola de Antônio Bispo dos Santos.**

> "The purpose of a system is what it does." — Stafford Beer
>
> "A terra não é uma só. Cada terra tem seu jeito de ser terra." — Antônio Bispo dos Santos

## O que é

O Tarot CiberQuilombola **não é adivinhação — é diagnóstico**. Usa os 22 Arcanos Maiores como lentes cibernéticas para examinar sistemas (organizações, projetos, comunidades, relações). Cada carta mapeia a um conceito real da cibernética organizacional de Beer, entrelaçado com o pensamento quilombola de Nego Bispo.

## Funciona sem backend

- 100% no browser via GitHub Pages
- Zero dependências proprietárias (React + Vite + Zustand, todos MIT)
- Dados abertos em `cards.json` — reutilizável por qualquer projeto
- Interpretação local funciona offline
- API da Anthropic é opcional (graceful degradation)

## Modos de leitura

| Modo | Cartas | Descrição |
|------|--------|-----------|
| Diagnóstico Pessoal | 3 | Situação, obstáculo, caminho |
| Modelo de Sistema Viável | 5 | Mapeado a S1–S5 de Beer |
| Sintegridade | 12 | Estrutura icosaédrica não-hierárquica |
| Plataforma para Mudança | 13 | Diagnóstico completo de organização |
| Sinal Algedônico | 1 | Dor ou prazer? Direto ao ponto. |

## Rodar localmente

```bash
npm install
npm run dev
```

Para usar com IA (opcional):
```bash
echo "VITE_ANTHROPIC_API_KEY=sk-ant-..." > .env
npm run dev
```

## Estrutura do Tarot

```
src/
  data/
    cards.json        22 Arcanos Maiores com dados reais de Beer/Bispo
    spreads.json      5 modos de leitura
  components/
    Card/             Carta com flip animation e verso Cybersyn
    Shell/            Interface terminal (header, nav, footer)
    Spread/           Layout de cartas por modo
    Reading/          Interpretação (local ou IA)
  store/
    useReadingStore   Estado da tiragem ativa
    useHistoryStore   Histórico persistido em LocalStorage
  services/
    interpret.js      Anthropic API + fallback local
  styles/
    tokens.css        Design tokens (palette Cybersyn)
    base.css          Reset + tipografia IBM Plex Mono
```

## Referências

- Beer, S. (1972). *Brain of the Firm*. Allen Lane.
- Beer, S. (1985). *Diagnosing the System for Organizations*. Wiley.
- Beer, S. (1975). *Platform for Change*. Wiley.
- Beer, S. (1994). *Beyond Dispute: The Invention of Team Syntegrity*. Wiley.
- Santos, A. B. (2015). *Colonização, Quilombos: Modos e Significações*. INCTI/UnB.

## Contribuir

Contribuições são bem-vindas. Veja `docs/minor-arcana-spec.md` para a especificação dos 56 Arcanos Menores (próxima fase). Abra uma issue para discutir antes de submeter um PR.

## Licença

Código: MIT. Dados (`cards.json`, `spreads.json`): CC-BY-SA 4.0.