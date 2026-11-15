FROM node:22-alpine
WORKDIR /app
COPY package.json server.json LICENSE README.md ./
COPY bin ./bin
ENTRYPOINT ["node", "bin/avatarsay-mcp.mjs"]
