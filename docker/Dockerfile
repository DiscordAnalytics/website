FROM alpine:3.23 AS locales

WORKDIR /app
RUN apk add --no-cache jq

COPY sync_locales.sh ./
COPY src/locales ./src/locales

RUN chmod +x ./sync_locales.sh
RUN ./sync_locales.sh


FROM node:lts-alpine AS deps

WORKDIR /app

RUN npm install -g corepack corepack enable
RUN corepack enable
RUN corepack prepare pnpm --activate

COPY package.json ./
COPY pnpm-lock.yaml ./

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


FROM nginx:stable-alpine AS production-cloud

LABEL maintainer="Discord Analytics"
LABEL org.opencontainers.image.title="Discord Analytics Website"
LABEL org.opencontainers.image.description="Official DiscordAnalytics Website docker image"
LABEL org.opencontainers.image.source="https://github.com/DiscordAnalytics/website"
LABEL org.opencontainers.image.vendor="Discord Analytics"
LABEL org.opencontainers.image.licenses="AGPL"

COPY /app/docker/nginx.cloud.conf /etc/nginx/nginx.conf
COPY --from=main-app /app/dist /usr/share/nginx/html
COPY --from=docs /app/docs/.vitepress/dist /usr/share/nginx/html/docs

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

FROM nginx:stable-alpine AS production-sh

LABEL maintainer="Discord Analytics"
LABEL org.opencontainers.image.title="Discord Analytics Website"
LABEL org.opencontainers.image.description="Official DiscordAnalytics Website docker image"
LABEL org.opencontainers.image.source="https://github.com/DiscordAnalytics/website"
LABEL org.opencontainers.image.vendor="Discord Analytics"
LABEL org.opencontainers.image.licenses="AGPL"

COPY /app/nginx.sh.conf /etc/nginx/nginx.conf
COPY --from=main-app /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
