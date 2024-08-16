FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache bash

COPY package*.json /app
COPY tsconfig.json /app
RUN npm install

COPY --chown=node:node . /app

RUN mkdir -p ./user

RUN npx tsc -b

CMD ["node", "dist/index.js"]
