FROM node:20-alpine

RUN npm install -g pnpm@10.4.1

WORKDIR /app

COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./

COPY packages/ui ./packages/ui
COPY packages/typescript-config ./packages/typescript-config
COPY packages/eslint-config ./packages/eslint-config

COPY apps/front-app ./apps/front-app

RUN pnpm install --filter front-app...

WORKDIR /app/apps/front-app

RUN pnpm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["pnpm", "run", "start"]