# Etapa de construção
FROM node:20.11-alpine3.18 as build

# Define o diretório de trabalho
WORKDIR /src/

# Copia os arquivos de manifesto de dependência
COPY package.json package-lock.json /src/

# Instala as dependências
RUN npm ci --silent

# Copia o restante do código
COPY . .

# Etapa de desenvolvimento
FROM node:20.11-alpine3.18 as dev

# Define o diretório de trabalho
WORKDIR /src/

# Copia as dependências instaladas da etapa de construção
COPY --from=build /src/node_modules node_modules

# Define o usuário para executar o contêiner
USER node

# Comando padrão para iniciar o aplicativo
CMD npm run start
