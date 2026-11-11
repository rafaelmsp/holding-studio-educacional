# THE CRIMES LIVE — CINEMATIC UX V3.9.0
Atualizado em 11/11/2026.

## Entrega funcional
Reorganizada a interface real do jogo, sem usar uma imagem estática com botões falsos.

- **Entrada:** nome, filtros de personagem, prévia, 12 retratos cinematográficos em WebP.
- **Host:** central em duas colunas, cabeçalho com código/QR/caso, pergunta e cena lado a lado, monitoramento de jogadores e dock de comandos administradores na parte inferior.
- **Telão:** composição 16:9 com cena cinematográfica independente, texto e alternativas maiores, ranking ao vivo, trilho das 8 rodadas, correção visual e barra de ações quando autorizada.
- **Celular:** identidade do jogador com retrato, foto do caso, perguntas, respostas selecionáveis, botão responder e indicadores legíveis.
- **Lobby:** imagem de investigação e QR real preservados.
- **Resultado:** pódio, classificação e resultados individuais sobre cenários de tribunal.
- **Movimento:** zoom lento da cena e animação suave nos comandos, com `prefers-reduced-motion` respeitado.

## Tecnologias
HTML/CSS/JavaScript existente; backend e realtime Supabase mantidos sem migrações. As imagens são arquivos WebP locais da própria coleção visual do jogo, derivados das cenas existentes. Não existe dependência de serviços de imagem externos no runtime.

## Segurança e integridade
- `room_revision`, `round_key`, `requestId`, Presence, 48 perguntas, pontuação e correção permanecem intactos.
- QR e comandos administrativos continuam sendo os controles reais, vinculados às ações existentes.
- O filtro de personagens é exclusivamente visual; não afeta a pontuação.
- Os resultados são calculados pelo servidor; as telas não inventam métricas.
- O asset dos avatares não é fonte de autorização ou identidade real.

## Arquivos
`live/ux-v39.css`
`live/ux-personas.js`
`live/app.js`
`live/index.html`
`assets/the-crimes-v3/avatars/*.webp`
`tests/live-ux-v38.test.js`

## Execução
Host: `https://rafaelmsp.github.io/holding-studio-educacional/live/?view=host`

Jogador: usar o QR gerado pelo Host ou `?view=player&room=CRIM-XXXX` com o código real.

Telão: abrir pelo botão **ABRIR TELÃO** do Host no mesmo navegador/perfil para habilitar controles administrativos. Uma aba aberta sem token administrativo exibirá a partida, mas não poderá controlá-la.

## QA
A validação automatizada exercita Host (1440×900), Telão (1920×1080), celular (390×844 e 412×915), entrada de dois jogadores, estado ao vivo, revelação, avanço, resultado e ausência de rolagem horizontal. Retornos HTTP 409 podem ocorrer em conflitos de revisão concorrente e são tratados pelo cliente como proteção autoritativa; não são resultado de falha visual.

## Limitações
Retângulos de retrato são fotografias recortadas das cenas, não imagens individualmente modeladas com os trajes exatos das referências. A fidelidade de cada mockup ainda pode receber ajustes de detalhe; o jogo está funcional e as telas remodeladas sem reescrever o backend. Teste com 30–50 jogadores simultâneos continua recomendado antes de eventos grandes.
