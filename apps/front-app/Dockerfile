FROM node:20-alpine

RUN npm install -g pnpm@10.4.1

WORKDIR /app

COPY ../../pnpm-workspace.yaml ./
COPY ../../package.json ./

COPY ../../packages/ui ./packages/ui
COPY ../../packages/typescript-config ./packages/typescript-config
COPY ../../packages/eslint-config ./packages/eslint-config

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

EXPOSE 3000

ENV NODE_ENV=development

CMD ["pnpm", "run", "build"]
CMD ["pnpm", "run", "start"]

