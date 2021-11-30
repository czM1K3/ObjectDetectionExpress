FROM node:16-buster-slim AS builder

RUN apt update
RUN apt install -y build-essential \
    wget \
    python3 \
    make \
    gcc \
    libc6-dev

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:16-buster-slim AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --gid 1001 nodejs
RUN adduser --uid 1002 ai

COPY --from=builder /app/node_modules ./node_modules
COPY . .

USER ai

EXPOSE 3000

CMD ["yarn", "start"]
