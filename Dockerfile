FROM node:12.20-alpine AS builder

WORKDIR /home/node
COPY --chown=node:node . ./

USER node
RUN yarn ci && yarn run build


FROM node:12.20-alpine AS app

WORKDIR /home/node
EXPOSE 8080

COPY --chown=node:node --from=builder /home/node/dist ./dist
COPY --chown=node:node package.json yarn.lock ./

USER node
RUN yarn ci --production && yarn cache clean --all

CMD ["node", "dist/server.js"]