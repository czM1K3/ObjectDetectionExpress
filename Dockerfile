FROM node:16-buster-slim

RUN apt update
RUN apt install build-essential -y

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN addgroup --gid 1001 nodejs
RUN adduser --uid 1002 ai
USER ai

EXPOSE 3000

CMD ["yarn", "start"]