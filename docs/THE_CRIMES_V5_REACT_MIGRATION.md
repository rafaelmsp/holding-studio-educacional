# THE CRIMES LIVE — Reconstrução React V5 (11/11/2026)

## Objetivo
Substituir progressivamente o frontend HTML/JavaScript legado pelo React 19 e aproximar a identidade visual dos modelos cinematográficos aprovados. A versão anterior em `/live/` permanece intacta enquanto a V5 é testada em `/react-live/`.

## Arquitetura implementada
- **React 19 e TypeScript**: Host, telão e jogador em componentes separados (`react-app/src/features`).
- **Vite 7**: compilação estática para `react-live/`, adequada ao GitHub Pages.
- **Tailwind CSS** e CSS modular de arte, **Motion** (framer-motion) e **GSAP**.
- **Zustand**: estado global da interface, com carregamento privado por token.
- **Supabase**: estado real da sala, perguntas, respostas, métricas, ranking, Realtime e Presence. Não houve mudança de schema nem de Edge Function.
- QR Code real; a URL do jogador no modo React aponta para `react-live/?view=player&room=CRIM-NNNN`.

## Art pack integrado como quebra-cabeça

| Camada | Arquivo | Uso |
|---|---|---|
| Cenário | `assets/the-crimes-v5/backgrounds/host-world.webp` | Fundo Host gerado a partir da composição noir cinematográfica |
| Cenário | `assets/the-crimes-v5/backgrounds/screen-frame.webp` | Telão/estúdio |
| Cenário | `assets/the-crimes-v5/backgrounds/join-noir.webp` | Entrada e lobby |
| Cenário | `assets/the-crimes-v5/backgrounds/final-stage.webp` | Pódio e encerramento |
| Molduras | `assets/the-crimes-v5/ui/panel-question.webp` | Painel dinâmico das perguntas |
| Molduras | `assets/the-crimes-v5/ui/panel-ranking.webp` | Ranking Top 5 com dados reais |
| Molduras | `assets/the-crimes-v5/ui/panel-card.webp` | Identidade, pontuação e métricas |
| Botões | `assets/the-crimes-v5/ui/button-{red,gold,cyan,mint,steel}.webp` | Texturas com cliques e textos reais |
| Personagens | `assets/the-crimes-v3/avatars/*.webp` | Os 12 retratos existentes, com filtro masculino/feminino/neutro |
| Conteúdo | `assets/the-crimes-v3/scenes/credores-v42/*.webp` e cinco outros casos | 6 casos × 8 cenas, imagens individuais por etapa |

**Proveniência visual:** `host-world.webp` preserva os bytes do fundo gerado no ChatGPT (SHA-256: `70a40e3d902a2933e045e9d5128d6433cfa9542fe2a9037c5f3f9b78921a5497`). Os demais três fundos presentes no repositório são derivações locais da mesma composição para manter a consistência cromática e permitir a publicação; as três artes independentes originalmente geradas continuam disponíveis no pacote de arte anexo à conversa e não devem ser apresentadas como já importadas. Botões e molduras são texturas gráficas geradas por `build-art-v5.py`.

Todas as informações mudam em React, sem nomes, textos de perguntas, rankings ou pontuações embutidos nas fotografias.

## Comportamento e segurança preservados
- Salas criadas pelo Host, código e QR Code, limitação de participantes e tempo de resposta.
- Tokens de Host/jogador mantidos apenas em sessões locais e validados no servidor; o telão só avança quando possui token de Host.
- Correção, bloqueio e revelação por ação autenticada; o ranking é obtido do Supabase.
- Avatar selecionado pelo jogador permanece associado via Presence e em memória de sessão durante desconexões.
- Rodada avançada com participantes pendentes, sem travar os demais.
- Cronômetro, respostas, pódio, indicadores de risco patrimonial e resultados preservados.
- Sem jogadores de demonstração falsos: vagas livres são marcadas como aguardando.
- Modo tela cheia real no telão.

## Testes realizados
Teste Playwright/Chrome local do build estático em 1440×900 (Host), 1920×1080 (telão), 390×844 e 412×915 (celulares):
1. Criar sala com seis casos disponíveis e 12 retratos.
2. Entrar dois jogadores, escolhendo personagens diferentes.
3. Iniciar, enviar resposta, revelar resposta correta.
4. Avançar com um jogador sem responder e avançar pelo telão autorizado.
5. Encerrar, exibir classificação e estado final no celular.

O cenário passou sem `pageerror`, imagens quebradas ou overflow horizontal; os assets e o build são conferidos também por `react-app/tests/assets.test.cjs`. Não é teste de carga; necessita teste com 30–50 alunos reais e conferência no projetor da sala.

## Verificar localmente
```powershell
cd C:\Temp\the-crimes-ux-model\react-app
npm ci
npm run build
node tests/assets.test.cjs
```

A versão React pode ser servida diretamente como conteúdo estático do repositório em `/react-live/`. O jogo antigo continua sob `/live/`.

## Implantação
A V5 será publicada em um caminho de **prévia**. Não substituir `/live/` até verificar HTML, CSS, JS, WebP, endpoints e fluxo multiplayer no endereço público. O GitHub Pages legado apresentou estado `errored` durante a preparação; isso é externo ao build React local e deve ser confirmado antes da troca.

## Pendências visuais
As três imagens independentes da arte original do telão, entrada e encerramento estão disponíveis no ZIP cinematográfico anexo à conversa. A V5 publicada contém alternativas derivadas do fundo principal — visivelmente coerentes, mas ainda não pixel-equivalentes às três imagens independentes originais. Fazer sua troca somente após a transferência e validação das imagens completas.

Não implementar operações jurídicas ilícitas reais nem dados pessoais de processos reais nas cenas; casos permanecem fictícios e educativos.

## 11/11/2026 — Endurecimento de sincronização pública (V5.1)

Na verificação pelo domínio do GitHub Pages, uma partida chegou ao pódio com Host, telão e dois jogadores, mas o Chrome automatizado registrou falhas intermitentes `ERR_INSUFFICIENT_RESOURCES` em requisições REST/Edge Function. A medida corretiva implementada no frontend:

- Consultas Supabase com **uma requisição em voo por tela** e apenas uma atualização pendente.
- Eventos em rajada agrupados com `debounce` de 160 ms.
- Intervalo de verificação de 6,2 a 6,5 segundos, com Realtime para eventos imediatos.
- Canal de broadcast de controle reutilizado sem tentar `subscribe()` duas vezes.
- Preservação de `room_revision`, token de sessão e fallback de polling.

A V5.1 requer novo teste pelo domínio público. Não considerar esses mecanismos como prova de escalabilidade para 30–50 participantes sem teste de carga na rede real.

**Links de teste:** https://rafaelmsp.github.io/holding-studio-educacional/react-live/ (React V5) e https://rafaelmsp.github.io/holding-studio-educacional/live/?view=host (HTML legado preservado).
