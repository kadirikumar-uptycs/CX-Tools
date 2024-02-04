FROM node:21

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 1729

RUN pwd

CMD ["node", "src/server.js"]

