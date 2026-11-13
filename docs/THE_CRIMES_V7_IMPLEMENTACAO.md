# THE CRIMES LIVE — implementação V7

Data: 12/11/2026. Base: V6.2 (`e4742ac`). Trabalho isolado no PR #4.

## Mudanças

- Host com composição própria no celular, menu com foco contido, Escape, fundo inerte e bloqueio de rolagem enquanto aberto.
- Compartilhamento nativo do link da sala, com alternativa de cópia. QR continua gerado a partir da URL efetiva.
- Novas artes limpas para desktop e celular, além de detetive realista com transparência. Nenhum texto, resultado, QR ou controle foi gravado nessas imagens.
- Sistema visual compartilhado em `v7-console.css`: ciano para informação, ouro para ações e vitória, verde para acerto, foco visível e movimento reduzido.
- Rodada desktop com cena, questão e telemetria em três colunas; remoção de áreas repetidas para manter controles no primeiro viewport.
- Tempo usa o mesmo relógio sincronizado; a indicação de revelação segue o estado efetivo da sala.
- Jogador com respostas selecionadas em ciano e correção em verde somente após revelação. Personagens e sessões existentes preservados.
- Pódio 2–1–3 com medalhas fora do texto, revelação 3→2→1 e retorno único ao lobby. Métricas permanecem calculadas das respostas registradas.
- Doze retratos e 48 cenas existentes foram preservados. Nenhuma mudança de schema, permissões ou backend.

## Arte de produção

| Arquivo | Origem | Aplicação |
| --- | --- | --- |
| `assets/the-crimes-v7/backgrounds/desktop.webp` | Geração de imagem, 12/11/2026 | Host e telão |
| `assets/the-crimes-v7/backgrounds/mobile.webp` | Geração de imagem, 12/11/2026 | Host móvel e jogador |
| `assets/the-crimes-v7/backgrounds/round.webp` | Geração de imagem, 12/11/2026 | Rodada e telão |
| `assets/the-crimes-v7/backgrounds/player.webp` | Geração de imagem, 12/11/2026 | Jogador no celular |
| `assets/the-crimes-v7/backgrounds/podium.webp` | Geração de imagem, 12/11/2026 | Final da partida |
| `assets/the-crimes-v7/props/detective.webp` | Geração com transparência, 12/11/2026 | Identidade do cabeçalho |
| `assets/the-crimes-v6/portraits/*` | Arte existente | Pódio, IDs preservados |
| Catálogo de cenas e avatares | Arte existente | Seis casos, oito cenas por caso |

Os prompts solicitaram cidade noturna fotorrealista, azul-marinho, luz ciano, reflexos dourados/vermelhos, Justiça de bronze e objetos jurídicos nas bordas, com centro livre para UI real. O retrato foi solicitado como recorte transparente, chapéu e sobretudo, iluminação vermelha/ciano, sem armas nem texto.

## Verificação

`npm run build`, testes de métricas, contratos V5/V6/V6.2, integridade de assets e preservação da rota React/backup.

A nova suíte `react-app/tests/v7-browser.cjs` usa Playwright no GitHub Actions. Intercepta explicitamente o backend com fixtures: **não equivale a uma partida real no Supabase**. Verifica 360/390/412/1672/1920 px, imagens, erros JS, overflow horizontal, menu, Escape, compartilhamento, detalhes do caso, seleção e envio, oito respostas e finalização. Capturas e resultados são artefatos da execução.

O navegador conectado não estava disponível e o Chromium local não pôde iniciar; a alternativa foi executar os testes em runner Linux do GitHub.

## Comparação com as referências

| Ponto | Correção | Limite |
| --- | --- | --- |
| Composição Host | Colunas de convite e jogadores, navegação própria no celular | Arte nova, não é reprodução literal dos pixels do conceito |
| Rodada | Cena / pergunta / tempo e ranking | Textos e cenas vêm do caso real, não do exemplo na imagem |
| Leitura | Serif nos títulos, sans nos controles; escala própria no celular | Fontes do sistema variam entre dispositivos |
| Paleta | Marinho, ciano, ouro, vermelho e verde semântico | Iluminação de cada cena original foi preservada |
| Elementos gráficos | Fundos limpos e detetive recortado, botões e frames reutilizáveis | Não há um novo pacote completo de props e 12 retratos refeitos |
| Pódio | 2–1–3, retratos persistidos e medalhas reposicionadas | Resultados dependem das respostas reais disponíveis |

Não declarar equivalência visual integral ou V7 totalmente homologada sem revisão das capturas mais recentes. Permanecem distintos: teste automatizado com fixtures, comparação artística e homologação com professor/celulares reais. Leitura física do QR e desempenho em aparelhos reais não foram comprovados nesta execução. O teste contra o Supabase real passou no workflow 43353812683: três jogadores, resposta, revelação, pódio com avatares persistidos, reinício e oito rodadas; log `ERRORS []`. O pacote final ainda precisa passar por seus próprios checks após a integração das últimas artes.
