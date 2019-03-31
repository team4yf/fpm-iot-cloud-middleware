FROM node:10.15.3-alpine

ADD ./package.json /app/package.json
ADD ./source /app/source

WORKDIR /app

EXPOSE 5001

EXPOSE 9999

RUN npm i --production

ENTRYPOINT ["node"]

CMD ["source/app.js"]