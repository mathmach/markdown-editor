# backend/Dockerfile

# Usar uma imagem base do Node.js
FROM node:16

# Definir o diretório de trabalho
WORKDIR /usr/src/app

# Copiar os arquivos de package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Expor a porta em que o app vai rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "run", "start"]
