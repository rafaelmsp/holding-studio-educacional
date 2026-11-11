# THE CRIMES LIVE — CHECKPOINT ATUAL V4.2
Atualizado em 11/11/2026.

**Versão:** V4.2 — cenas limpas, ranking sem falsos jogadores, galeria com capturas reais, CI corrigido.

**Endereços:**
- Jogo: https://rafaelmsp.github.io/holding-studio-educacional/live/?view=host
- Galeria: https://rafaelmsp.github.io/holding-studio-educacional/live/showroom.html

**Tecnologias:** HTML5/CSS/JavaScript + Supabase existente. GitHub Pages.

## Estado de implementação
- 8 novas cenas sem rostos sobrepostos no caso Fraude contra Credores; fotografia licenciada e fonte rastreável.
- Host, Telão e Celular responsivos; 12 personagens e seleção de gênero visual preservados.
- Ranking com posições livres claramente indicadas.
- Link de galeria adicionado ao Host em Ferramentas da Sala.
- Modo Cinema fullscreen real e saída funcional.
- JS `app.js?v=20261111-v42-prod-1`; manifesto `v3-assets.js?v=20261111-9`.
- CI corrigido para a versão correta dos arquivos.

## Testes locais
`node qa-v39.js`: dois jogadores e um Host/telão; envios, revelação, avanço sem resposta, pódio; `ok:true`, `errors:[]`. Sala de teste CRIM-3074.
`node qa-v41-showroom.js`: cinco telas e oito cenas carregadas em 1440/390, sem overflow; `ok:true`.
`node qa-v41-cinema.js`: entra/sai fullscreen, sem JS errors.
Testes V3.8, V4.0, V4.1, V4.2: aprovados.

## Estado de publicação
O commit V4.1 b58b4c1 foi enviado, mas seu build de GitHub Pages ainda estava `building/queued` durante este trabalho. Não afirmar que a V4.2 está online sem verificar deploy e HTTP 200 do showroom e dos assets. A V4.0 era a última versão pública comprovada antes do novo push.

## Documentação principal
`docs/THE_CRIMES_V42_UX_REVIEW.md`
`assets/the-crimes-v3/CREDITS.md`
`docs/preview/v42/`

## Pendências
Homologação em GitHub Pages, 30–50 alunos, celular real e projetor. Os cinco casos além de Fraude contra Credores conservam suas cenas anteriores.
