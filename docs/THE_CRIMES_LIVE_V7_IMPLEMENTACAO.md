# THE CRIMES LIVE V7 — Implementação sobre V6.2

**Data:** 12/11/2026  
**Fonte:** Plano de UX V7 aprovado (`Markdown colado(1).md`), cinco Golden Masters descritos, V6.2 como base.  
**Branch:** `feat/the-crimes-v7-cinematic`  
**Nota:** a pasta `live/` foi gerada no workspace isolado da branch; publicação no GitHub Pages só ocorre após revisão/merge.

## Escopo implementado

- Tema V7 com tokens, efeitos e interface responsiva (`react-app/src/design` e `styles/v7.css`).
- Dez backgrounds limpos sem UI rasterizada; 12 retratos; 12 avatares; molduras, botões, FX, manifest e script reprodutível (`assets/the-crimes-v7`, `scripts/build-v7-art.py`).
- Host mobile: menu em gaveta com foco/Escape, QR real, copiar/compartilhar link, lista de presença, caso e dock fixo para controle.
- Host desktop: lobby com sala, QR, jogadores reais, progressão e controle centralizado.
- Telão: cena, quatro alternativas, relógio sincronizado, placar e revelação mediante evento real.
- Jogador mobile: avatar persistido, seleção distinta da correção, CTA, reconexão e narrativa por oito marcos.
- Pódio 2–1–3 com retratos persistentes, ranking/estatísticas reais, e reinício exclusivo do Host.
- Recuperação do token de Host após recarregar, sincronização de rodada em tela e no celular, acessibilidade e movimento reduzido.
- Showroom V7 interativo (`?view=showroom`), marcado explicitamente como demonstração com dados exemplificativos.
- CI atualizada e contratos de regressão preservados.

## Evidências executadas

| Verificação | Resultado |
|---|---|
| TypeScript, build Vite | 🟢 Passaram |
| Teste V7: backgrounds, 12 personas, 48 cenas, rotas | 🟢 5/5 |
| Testes legados V5.1 / V6 / V6.2 | 🟢 Passaram |
| Testes de métricas | 🟢 4/4 |
| Teste de assets versão atualizada | 🟢 Passou |
| Browser real: 8 respostas, 8 revelações, Host reload, pódio, reinício | 🟢 8/8 |
| Showroom: 4 abas, estados e mobile | 🟢 Passou |

Capturas da execução: `docs/preview/v7/01_*.png` a `08_*.png`; resultado estruturado: `docs/preview/v7/qa-v7-result.json`.

## Progress Tracker Pro (pesos originais)

| Etapa | Peso | Situação verificada |
|---|---:|---|
| 01 Auditoria V6.2 | 10% | 🟢 concluída |
| 02 Assets e manifest | 20% | 🟢 concluída |
| 03 Design system/showroom | 15% | 🟢 concluída |
| 04 Host mobile/desktop | 15% | 🟡 funcional, aguarda validação contra GM-01/02 |
| 05 Rodada/telão/jogador | 15% | 🟡 funcional 8/8, aguarda GM-03/04 |
| 06 Pódio | 10% | 🟡 funcional, aguarda GM-05 |
| 07 Visual diff, E2E, performance | 10% | 🟡 E2E passou; falta visual diff e carga |
| 08 PR, deploy e smoke público | 5% | 🟡 pendente |

**Progresso comprovado, com os portais estritos definidos no MD original: 45%.** Não somar etapas que ainda dependem de comparação visual, aprovação humana ou smoke público, mesmo com os componentes implementados.

## Como rodar

```powershell
cd C:\Dev\the-crimes-live-v7\react-app
npm ci
npm run typecheck
npm run test:v7
npm run build
cd ..
python -m http.server 8148 --bind 127.0.0.1
# http://127.0.0.1:8148/react-live/?view=showroom
```

Para testar com Supabase real, manter o servidor HTTP ativo e executar `npm run test:v7:browser` em `react-app`; esse teste cria uma sala real de QA.

## Limites e próximos portais de aceite

- Os **cinco PNG originais Golden Master não estavam disponíveis como arquivos** nesta execução. As screenshots geradas devem ser comparadas com eles em 390×844, 412×915, 1672×941 e 1920×1080, usando overlay e revisão humana.
- Testes em 360×800, zoom 200%, iOS/Android reais, leitura por câmera do QR, carga 50–100 jogadores, WCAG completo e FPS em hardware modesto exigem rodada adicional.
- Só promover a branch principal após CI, comparação visual e smoke público. Mudança em clone/branch **não comprova alteração no site publicado**.
- Nenhuma chave privilegiada ou segredo foi incluído; esquema do Supabase preservado; as 48 cenas são individuais. Não usar dados fictícios do showroom como resultado de sala real.
