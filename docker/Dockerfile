FROM node:lts-alpine@sha256:d1b3b4da11eefd5941e7f0b9cf17783fc99d9c6fc34884a665f40a06dbdfc94f AS pnpm

WORKDIR /app

RUN npm install -g corepack corepack enable
RUN corepack enable
RUN corepack prepare pnpm --activate

COPY package.json ./
COPY pnpm-lock.yaml ./

FROM pnpm AS locales

WORKDIR /app

COPY ./sync_locales.js ./
COPY ./src/locales ./src/locales

RUN pnpm locales:sync

FROM pnpm AS deps

WORKDIR /app

RUN pnpm install --frozen-lockfile

FROM deps AS main-app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=locales /app/src/locales ./src/locales
COPY ./* ./
COPY ./src ./src
COPY ./public ./public

RUN pnpm build

FROM deps AS docs

COPY --from=deps /app/node_modules ./node_modules
COPY ./* ./
COPY ./src/assets ./src/assets
COPY ./public ./public
COPY ./docs ./docs

RUN pnpm docs:build


FROM nginx:stable-alpine@sha256:0272e4604ed93c1792f03695a033a6e8546840f86e0de20a884bb17d2c924883 AS production-cloud

LABEL maintainer="Discord Analytics"
LABEL org.opencontainers.image.title="Discord Analytics Website"
LABEL org.opencontainers.image.description="Official DiscordAnalytics Website docker image"
LABEL org.opencontainers.image.source="https://github.com/DiscordAnalytics/website"
LABEL org.opencontainers.image.vendor="Discord Analytics"
LABEL org.opencontainers.image.licenses="AGPL"

COPY ./docker/nginx.cloud.conf /etc/nginx/nginx.conf
COPY --from=main-app /app/dist /usr/share/nginx/html
COPY --from=docs /app/docs/.vitepress/dist /usr/share/nginx/html/docs

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

FROM nginx:stable-alpine@sha256:0272e4604ed93c1792f03695a033a6e8546840f86e0de20a884bb17d2c924883 AS production-sh

LABEL maintainer="Discord Analytics"
LABEL org.opencontainers.image.title="Discord Analytics Website"
LABEL org.opencontainers.image.description="Official DiscordAnalytics Website docker image"
LABEL org.opencontainers.image.source="https://github.com/DiscordAnalytics/website"
LABEL org.opencontainers.image.vendor="Discord Analytics"
LABEL org.opencontainers.image.licenses="AGPL"

COPY ./docker/nginx.sh.conf /etc/nginx/nginx.conf
COPY --from=main-app /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
