FROM node:21

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# run this application at PORT 1729
EXPOSE 1729

CMD ["node", "src/server.js"]

