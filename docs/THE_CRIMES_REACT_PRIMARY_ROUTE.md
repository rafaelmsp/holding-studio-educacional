# THE CRIMES LIVE — React como página principal

Data: 11/11/2026

## Páginas

- Host React: https://rafaelmsp.github.io/holding-studio-educacional/live/?view=host
- Telão: abrir pela Central do Host após criar a sala
- Jogadores: link ou QR Code da sala
- Galeria cinematográfica: https://rafaelmsp.github.io/holding-studio-educacional/live/showroom.html
- Versão HTML anterior preservada: https://rafaelmsp.github.io/holding-studio-educacional/legacy-live/
- Versão React paralela: https://rafaelmsp.github.io/holding-studio-educacional/react-live/

## Correção

O endereço principal /live/ carregava a tela HTML antiga, sobrepondo o formulário de criação de sala e os painéis do Host. Agora o HTML principal é o bundle React V5.1. Antes da sala existir o React exibe apenas a seleção dos seis casos e configurações; a Central do Host aparece depois de criar uma sala autorizada.

A aplicação HTML anterior está completa em legacy-live. A troca não altera dados ou regras no Supabase.

## Rebuild

O comando npm run build em react-app gera react-live e sincroniza automaticamente a cópia em live através de react-app/scripts/publish-primary.mjs, com estágio e rollback. Os testes de interface V4 foram apontados para legacy-live e um teste novo verifica o isolamento da rota principal.

## Verificação

Conferir HTTP 200 para /live/, /live/showroom.html e seus bundles, criar uma sala, abrir telão, entrar com dois jogadores pelo celular e avançar rodadas. Ainda é necessário testar a aplicação com uma turma de 30 a 50 usuários simultâneos.
