# build stage
FROM node:15.5-alpine3.11 AS build

RUN apk update \
 && yarn config set script-shell /bin/bash

RUN apk add --no-cache python make g++

COPY ./package.json /build/
RUN yarn --cwd /build install

# runtime stage
FROM node:15.5-alpine3.11 AS runtime

RUN yarn config set script-shell /bin/bash

RUN apk add --no-cache bash curl \
 && mkdir /sockets /log

COPY .bashrc /root/.bashrc

COPY --from=build /build /build/

COPY ./config /build/config/
#COPY ./test /build/test/
COPY ./src /build/src/

STOPSIGNAL HUP

HEALTHCHECK --interval=5m --timeout=5s --retries=3 \
  CMD curl http://127.0.0.1/health_check -fs > dev/null || exit 1

COPY ./container_entrypoint /init
ENTRYPOINT ["/init"]
