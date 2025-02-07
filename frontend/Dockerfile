FROM public.ecr.aws/docker/library/node:22.13.0-alpine3.21 AS dependency_installer
RUN apk update \
  && apk add --no-cache --virtual .build_deps \
  busybox \
  g++ \
  gcc \
  libc6-compat \
  make \
  openssl \
  python3 \
  tar \
  && npm install --global --omit=optional --ignore-scripts npm@11.1.0
# install packages in the parent directory first
WORKDIR /app
COPY package*.json ./
RUN npm_config_nodedir=/usr/local \
  && npm_config_devdir=/tmp/.gyp \
  && npm_config_python=python3 \
  npm install --omit=optional --ignore-scripts --build-from-source

FROM public.ecr.aws/docker/library/node:22.13.0-alpine3.21 AS builder
ARG GIT_SHA
WORKDIR /app
COPY . .
COPY --from=dependency_installer /app/node_modules ./node_modules
ENV NEXT_TELEMETRY_DISABLED=1 \
  PATH=/app/node_modules/.bin:/app/node_modules/next/dist/bin:${PATH} \
  GIT_SHA=${GIT_SHA} \
  NODE_ENV=production
RUN next build


FROM public.ecr.aws/docker/library/node:22.13.0-alpine3.21
ARG GIT_SHA
EXPOSE 3000
# Metadata about the build file
LABEL Description="DTCC Hackatho: Team Broadridge 605 Studios" \
  Maintainer="605 Studios Team" \
  Maintainer_Email="saitharun.adike@605studios.xyz;augustine.glarence@605studios.xyz" \
  Business_Unit="Hackathon" \
  GIT_SHA=${GIT_SHA}
# update the package
RUN apk update \
  && apk add --no-cache --virtual .build_deps \
  ca-certificates \
  curl \
  openssl \
  tzdata \
  && rm -rf /var/cache/apk/*
# As node user, upgrade the npm, install global modules, if any (e.g. pm2) and add
# the global node_modules to the PATH.
USER 1000:0
# Set environment variables
# Uncomment the below only if the npm version is to be upgraded. This image carries the latest version of npm
# # NPM_CONFIG_PREFIX contains global dependencies, if any, that are installed by the non-root user
# # [Optional] Add the value of NPM_CONFIG_PREFIX to PATH, if we want to run npm global bin without specifying the path.
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global \
  PATH=/home/node/.npm-global/bin:${PATH} \
  NEXT_SHARP_PATH=/home/node/.npm-global/lib/node_modules/sharp \
  no_proxy=.local,.internal,localhost \
  GIT_SHA=${GIT_SHA} \
  TZ=Etc/UTC \
  NEXT_TELEMETRY_DISABLED=1 \
  NODE_ENV=production \
  # max size of your Node.js program
  NODE_OPTIONS=--max-old-space-size=1024 \
  HOSTNAME=0.0.0.0 \
  PORT=3000
RUN npm install --global --omit=optional --ignore-scripts npm@11.1.0 sharp
# Copy the files, install npm modules and add .npm
WORKDIR /app/standalone
COPY --chown=1000:0 --chmod=755 ./public ./public
COPY --from=builder --chown=1000:0 --chmod=755 ./app/.next/standalone ./
COPY --from=builder --chown=1000:0 --chmod=755 ./app/.next/static ./.next/static

# As a root user update the permissions for root to execute
USER 0
RUN chgrp -R 0 /app && chmod -R u+rwX,g+rX,o+rX /app
USER 1000:0
# Health check
HEALTHCHECK --interval=90s --timeout=30s --start-period=30s --retries=5 \
  CMD ["CMD-SHELL", "curl --fail http://127.0.0.1:3000/ || exit 1"]
CMD ["node", "server.js"]
