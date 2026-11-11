# THE CRIMES LIVE — UX V3.8 · Entrada e personagens

## Objetivo
Aplicar o padrão visual premium das referências aprovadas ao fluxo de entrada do jogador, preservando o backend V3.7.0, os casos, as rodadas e a sincronização.

## Composição
- `live/ux-personas.js`: catálogo de 12 perfis e avatares locais (SVG procedurais, sem dependência externa).
- `live/ux-v38.css`: tela de entrada responsiva, filtros de personagens, painel de prévia e acabamento nas telas de Host, telão e jogador.
- `live/app.js`: seleção antes do join, restauração de avatar local, presença online com avatar cosmético.
- `live/index.html`: carregamento dos dois novos assets antes do app.

## Fluxo do jogador
1. Abrir o link da sala no celular.
2. Informar apelido (2 a 24 caracteres).
3. Escolher filtro visual Masculino / Feminino / Neutro.
4. Selecionar uma personagem da categoria (4 opções por filtro).
5. Revisar função, estilo e avatar.
6. Clicar ENTRAR NA PARTIDA.
7. Perfil salvo no `localStorage` da sessão e enviado ao Presence como metadado cosmético.
8. Seguir a partida e o ranking existentes.

## Compatibilidade e restrições
- Nenhuma tabela, migração, endpoint ou regra de pontuação alterada.
- Identidade e avatar não afetam score ou resultado.
- O avatar é armazenado por navegador e exposto somente enquanto o jogador estiver presente no canal realtime; não é um identificador de autoridade.
- A versão atual usa desenhos vetoriais estilizados, não os retratos fotográficos dos conceitos; a substituição por retratos finais requer novo asset pass.
- A UX de Host/Telão/Gameplay conserva estrutura V3.7.0, com melhorias cosméticas iniciais; a recriação estrutural integral dos conceitos permanece uma etapa posterior.
- O filtro de gênero é uma preferência visual de catálogo, não uma declaração de identidade pessoal do jogador.

## QA inicial
- Navegadores independentes: Host 1440×900, telão 1920×1080, jogador 390×844.
- Uma sala online criada; filtro Feminino → Perita; entrada na partida; perfil persistido; ranking com avatar; gameplay aberto.
- Sem erros JavaScript observados nas três telas e sem overflow horizontal.
