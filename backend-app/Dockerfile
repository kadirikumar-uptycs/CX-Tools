FROM node:21

WORKDIR /backend-app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 17291

CMD ["npm", "build"]