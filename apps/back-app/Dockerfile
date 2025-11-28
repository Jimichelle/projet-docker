FROM node:20-alpine

RUN npm install -g pnpm@10.19.0

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 3008

CMD ["pnpm", "run", "dev"]

