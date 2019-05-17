# stage1. use the node-alpine to install dependencies
FROM node:10.15.3-alpine as build-node

ADD ./package.json /tmp/package.json

RUN cd /tmp && npm i --production
# stage2. copy the source
FROM node:10.15.3-alpine

ADD ./package.json /app/package.json
ADD ./source /app/source

WORKDIR /app

EXPOSE 5001

EXPOSE 9999

EXPOSE 18443

# stage3. copy the dependencies from layer1
COPY --from=build-node /tmp/node_modules /app/node_modules

ENTRYPOINT ["node"]

CMD ["source/app.js"]