FROM node:14-alpine as base

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "node", "server.js" ]
