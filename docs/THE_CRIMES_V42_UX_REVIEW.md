# THE CRIMES LIVE — UX V4.2 | Revisão Cinematográfica e Integridade Visual

**Data:** 11/11/2026  
**Branch:** `main` — `rafaelmsp/holding-studio-educacional`

## Resumo executivo

A V4.2 corrige dois problemas visuais que persistiam nos modelos V4.0–V4.1 e resolve uma falha no CI. O jogo e a apresentação permanecem funcionais e dinâmicos.

## O que foi corrigido

| Área | Problema anterior | Resultado V4.2 |
|---|---|---|
| Cenários | Fotografias sobrepostas geravam rostos duplicados | Composição sem transparência: mansão nítida na abertura, fotografias de investigação separadas nas próximas rodadas |
| Ranking | Telão e Host vazios quando há menos de cinco jogadores | Posições sem participantes exibem *AGUARDANDO / VAGA LIVRE* sem inventar nomes, avatares, pontos ou status |
| Host | Galeria cinematográfica pouco acessível | Link direto **GALERIA DAS TELAS** em **FERRAMENTAS DA SALA** |
| Publicação | CI conferia `v3-assets.js?v=20261111-7`, enquanto HTML já usava `-8` | CI sincronizado com `v3-assets.js?v=20261111-9` e `app.js?v=20261111-v42-prod-1` |
| Galeria | Capturas ainda eram da V4.1 | Cinco novas capturas reais atualizadas para V4.2, com os oito novos cenários |

## Escopo

- **Host:** layout principal, barras, controles reais, Top 5, 8 rodadas, QR e estado de sala preservados.
- **Telão:** respostas legíveis, ranking real com espaços vagos, Modo Cinema fullscreen e cronômetro funcional.
- **Celular:** nome, personagem, imagem do caso, alternativas, botão RESPONDER e resultado final.
- **Entrada:** filtros Masculino, Feminino e Neutro, 12 retratos e layout responsivo.
- **Cenas:** 8 WebP 1280×720 em `assets/the-crimes-v3/scenes/credores-v42` — 01 estabelecimento da residência, 02 residência + dossiê, 03–08 investigação com fotografia do imóvel como evidência emoldurada.

## Preservação funcional

Nenhum contrato Supabase ou endpoint foi reescrito. Foram mantidos 48 itens educacionais, seis casos, permissões Host, tokens de sessão, Presence, `room_revision`, `round_key`, respostas, correções, pontuação, avanço, ranking e pódio.

## QA

Teste automatizado Chrome:
- Sala local `CRIM-3074`, dois jogadores, Host 1440×900, telão 1920×1080, celular 390×844 e 412×915.
- Host: dock na posição vertical **811 px**, trilho de rodadas **866 px**, sem overflow horizontal.
- Entrada desktop: 1370 px de largura.
- Um jogador respondeu, outro avançou sem responder; revelação e avanço foram testados.
- Avanço autorizado pelo telão até rodada 3 e finalização com pódio.
- Zero `pageerror`, zero conflitos esperados reportados no teste local.
- Telão: botão real de tela cheia; entrada e saída funcionando.
- Galeria: cinco abas e oito fotos carregadas em 1440×900 e 390×844 sem overflow horizontal.
- Testes automatizados V3.8, V4.0, V4.1 e V4.2 aprovados.

## Publicação e acesso

- Jogo: https://rafaelmsp.github.io/holding-studio-educacional/live/?view=host
- Galeria de capturas: https://rafaelmsp.github.io/holding-studio-educacional/live/showroom.html
- Arquivos da galeria: `docs/preview/v42/`

**Atenção:** a disponibilidade pública da V4.2 depende da conclusão do deploy do GitHub Pages. Conferir a versão carregada antes de anunciar o novo frontend como publicado. A V4.1 anterior permaneceu na fila do Pages durante esta implementação.

## Créditos e transparência

A fotografia da residência é de **Gul Fatima**, publicada na Unsplash (https://unsplash.com/photos/a-modern-two-story-home-is-lit-at-night--qTD1leeLCw), licenciada segundo https://unsplash.com/license. Os personagens e situações dos casos são fictícios; as imagens não representam fatos ou pessoas envolvidas em um processo real.

## Próximas tarefas

1. Homologar o Pages com respostas 200 da página `showroom.html`, `ux-v42.css` e dos oito arquivos WebP.
2. Conferir no celular real e no projetor da sala, incluindo legibilidade e modo fullscreen.
3. Testar com 30–50 estudantes simultâneos numa sala controlada.
4. Aplicar direção de arte fotográfica específica aos demais cinco casos sem alterar a lógica jurídica.
