FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY index.js ./
RUN mkdir -p /app/data
ENV PORT=3768
EXPOSE 3768
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget -qO- http://127.0.0.1:3768/health || exit 1
CMD ["npm","start"]
