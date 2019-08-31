FROM node:alpine

WORKDIR /usr/app

RUN apk update; \
    apk add --update \
      openssh-client \
      git

COPY package.json yarn.lock ./

RUN npm i -g yarn && \
    yarn

COPY . .
