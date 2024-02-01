FROM node:20.11.0-alpine

WORKDIR /usr/app

COPY ./src/ ./src/

COPY package*.json nodemon.json startup.sh .env ./

RUN apk update && apk upgrade \
    && apk add --no-cache vim \ 
    && npm install --production

EXPOSE 3000

ENTRYPOINT ["sh","/usr/app/startup.sh"]
