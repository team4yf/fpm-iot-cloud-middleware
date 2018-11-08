FROM node:8.11.1

ADD ./package-lock.json /app/package-lock.json
ADD ./nodemon.json /app/nodemon.json
ADD ./package.json /app/package.json

WORKDIR /app

EXPOSE 1883

RUN npm i -g nodemon \
    && npm i --production

ENTRYPOINT ["nodemon"]

CMD ["source/app.js"]