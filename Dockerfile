FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
COPY data ./data
COPY .well-known ./.well-known
COPY server.json llms.txt llms-full.txt openapi.yaml ./
RUN npm run build && npm prune --omit=dev
USER node
ENTRYPOINT ["node", "dist/index.js"]
