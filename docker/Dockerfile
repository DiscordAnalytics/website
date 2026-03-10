FROM node:lts-alpine AS locales

WORKDIR /app

COPY sync_locales.js ./
COPY src/locales ./src/locales

RUN node ./sync_locales.js

FROM node:lts-alpine AS deps

WORKDIR /app

RUN npm install -g corepack \
  && corepack enable \
  && corepack prepare pnpm --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

FROM deps AS build-app

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=locales /app/src/locales ./src/locales

COPY package.json pnpm-lock.yaml ./
COPY src ./src
COPY public ./public

RUN pnpm build

FROM deps AS build-docs

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY package.json pnpm-lock.yaml ./
COPY src/assets ./src/assets
COPY public ./public
COPY docs ./docs

RUN pnpm docs:build

FROM nginx:stable-alpine AS production

LABEL maintainer="Discord Analytics"
LABEL org.opencontainers.image.title="Discord Analytics Website"
LABEL org.opencontainers.image.description="Official DiscordAnalytics Website docker image"
LABEL org.opencontainers.image.source="https://github.com/DiscordAnalytics/website"
LABEL org.opencontainers.image.vendor="Discord Analytics"
LABEL org.opencontainers.image.licenses="AGPL"

ARG ENV=cloud

COPY /app/docker/nginx.cloud.conf /etc/nginx/nginx.conf
COPY /app/nginx.sh.conf /etc/nginx/nginx.sh.conf
RUN if [ "$ENV" = "sh" ]; then mv /etc/nginx/nginx.sh.conf /etc/nginx/nginx.conf; fi

COPY --from=build-app /app/dist /usr/share/nginx/html

COPY --from=build-docs /app/docs/.vitepress/dist /usr/share/nginx/html/docs
RUN [ "$ENV" = "sh" ] && rm -rf /usr/share/nginx/html/docs

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
