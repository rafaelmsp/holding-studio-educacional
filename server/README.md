# The Crimes Live — servidor

Servidor em tempo real do modo multiplayer do The Crimes.

## Stack

- Node.js 22+
- Express
- Socket.IO
- QR Code
- persistência JSON local

## Executar

```bash
cp .env.example .env
npm install
npm start
```

Healthcheck:

```text
GET /health
```

## Docker

```bash
cp .env.example .env
docker compose up -d --build
```

## Produção

O GitHub Pages é HTTPS, então o servidor precisa ser publicado atrás de HTTPS/WSS.

Configure no `.env`:

```text
PUBLIC_SERVER_URL=https://live.seudominio.com.br
PUBLIC_PLAYER_URL=https://rafaelmsp.github.io/holding-studio-educacional/live/?view=player
ALLOWED_ORIGINS=https://rafaelmsp.github.io
```

Um proxy reverso deve encaminhar HTTP e upgrade WebSocket para a porta 3768.

O servidor calcula score, classificação e estado patrimonial. O navegador do aluno não é fonte confiável para esses valores.

## Persistência

As salas, respostas e eventos são gravados em:

```text
./data/the-crimes-live.json
```

Cada resposta registra classificação e símbolo. Escolhas 🔴 podem alterar o estado narrativo `ocultouBens`, mas nunca geram bônus acadêmico.
