FROM node:8.11.1

ADD ./yarn.lock /app/yarn.lock
ADD ./nodemon.json /app/nodemon.json
ADD ./package.json /app/package.json

WORKDIR /app

EXPOSE 1883

RUN npm i -g yarn \
    # && yarn config set registry http://registry.npm.taobao.org \
    && yarn install --production \
    && npm i -g nodemon

# RUN npm i --production --registry=https://registry.npm.taobao.org

ENTRYPOINT ["nodemon"]

CMD ["source/app.js"]