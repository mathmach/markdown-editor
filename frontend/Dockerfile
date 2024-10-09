# frontend/Dockerfile

# Usar uma imagem base do Node.js
FROM node:16 AS build

# Definir o diretório de trabalho
WORKDIR /usr/src/app

# Copiar os arquivos de package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Construir a aplicação
RUN npm run build

# Usar uma imagem base do Nginx para servir a aplicação
FROM nginx:alpine

# Copiar os arquivos de build para o Nginx
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expor a porta em que o Nginx vai rodar
EXPOSE 80

COPY nginx.conf /etc/nginx/
COPY ./docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
