# Créditos de imagem · THE CRIMES LIVE V4.1

O caso educativo **Fraude contra credores** é ficcional. As cenas do jogo são **ilustrações de ambientação**, não documentação de uma pessoa, imóvel ou investigação real.

## Origem da fotografia arquitetônica

- Fotografia base: *A modern, two-story home is lit at night*
- Fotógrafa: **Gul Fatima** (@gulfatimedeveloper)
- Publicação: 8 de abril de 2025
- Fonte: https://unsplash.com/photos/a-modern-two-story-home-is-lit-at-night--qTD1leeLCw
- Licença: https://unsplash.com/license (uso gratuito, inclusive comercial, com atribuição recomendada)
- Arquivo-base local: `assets/the-crimes-v3/global/holding-estate-unsplash.jpg`

A fotografia foi combinada digitalmente com as oito cenas originais do jogo para formar oito arquivos WebP na pasta `assets/the-crimes-v3/scenes/credores`. O objetivo foi criar uma identidade de cena contínua preservando detalhes particulares de cada rodada.

Os retratos, a cidade, o dossiê e demais elementos ilustrativos já existiam no próprio projeto e permaneceram separados dos elementos interativos. Textos, nomes e pontuação da interface são desenhados pelo navegador, não são parte das fotografias.

## Reprocessamento

Executar `python build-v41-scenes.py` no diretório-raiz do repositório com Pillow instalado. A saída será composta pelos 8 arquivos WebP e por `docs/preview/v41/scenes-contact.jpg`.
