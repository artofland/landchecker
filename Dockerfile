FROM node:16

WORKDIR app

COPY . .

RUN npm i

CMD node index.js