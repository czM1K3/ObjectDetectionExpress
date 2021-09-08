FROM node:16-alpine

RUN apk add --no-cache libc6-compat alpine-sdk

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN addgroup -g 1001 -S nodejs
RUN adduser -S ai -u 1001
USER ai

EXPOSE 3000

CMD ["yarn", "start"]