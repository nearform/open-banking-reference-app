FROM node:12-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

CMD [ "node", "dist" ]
