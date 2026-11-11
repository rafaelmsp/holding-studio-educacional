# THE CRIMES LIVE — CHECKPOINT V4.0
Atualizado em **11/11/2026**.

## Versão ativa
- **V4.0 — UX Premium Cinematográfica e Layout de Apresentação**
- Repositório: `rafaelmsp/holding-studio-educacional` (branch `main`)
- Host: https://rafaelmsp.github.io/holding-studio-educacional/live/?view=host
- Arquivo JS: `live/app.js?v=20261111-v4-prod-1`
- Estilos: `live/v3-premium.css`, `live/ux-v38.css`, `live/ux-v39.css`, `live/ux-v40.css`
- SVG de marca: `assets/the-crimes-v3/ui/detective-mark.svg`
- Avatares WebP: `assets/the-crimes-v3/avatars/*.webp`
- Registro completo: `docs/THE_CRIMES_V40_UX_REVIEW.md`
- Screenshots de QA: `docs/preview/v40/`

## Feito e conferido
- Header com marca, sala ativa, caso, pessoas online e status.
- Host com Top 5 real, tabela e métricas em detalhes expandíveis e ações prioritárias.
- Host 1440×900: dock acaba em y=813, trilho de rodadas em y=870; sem overflow horizontal.
- Telão 1920×1080: cena + texto, ranking, controles autorizados e relógio inferior sincronizado.
- Celular 390×844 / 412×915: identidade, foto, relógio, quatro opções e botão Responder sem sobreposição.
- Entrada desktop: formulário e prévia de personagem em duas colunas, largura 1370px.
- Teste funcional (sala CRIM-2989): jogador 2 avança para MISSÃO 02/08 mesmo sem responder à primeira, controle autorizado pelo telão avança para rodada 3, pódio no final.
- 0 erros de JavaScript no QA local, sem X-overflow nas telas verificadas.

## Preservado
48 perguntas, 6 casos, Supabase, room_revision, round_key, idempotência, Host autorizado, Presence, pontuação, exposição, regras de correção, cronômetro, replay e QR Code.

## Limitações/pendências
- As fotos originais dos modelos conceituais (mansão/estátua/cidade) ainda não foram transformadas em assets independentes da interface. V4.0 usa imagens cinematográficas existentes e DOM real, não uma cópia visual exata pixel a pixel.
- Teste de carga 30–50 jogadores e QA multi-browser permanecem pendentes.
- As salas criadas no QA são temporárias e não devem ser apresentadas como partidas reais.

## Próximas ações sugeridas
Conferir a versão publicada na aula com projetor; avaliar detalhes de tipografia e fotografias por caso; testar turma maior em rede real.
