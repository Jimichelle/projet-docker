FROM node:20-alpine AS builder

RUN npm install -g pnpm@10.19.0

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build


FROM node:20-alpine AS runner

RUN npm install -g pnpm@10.19.0

WORKDIR /app

COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist

RUN pnpm install --prod

EXPOSE 3008

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]