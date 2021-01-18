FROM nginx:alpine

WORKDIR /usr/src

RUN mkdir -p /run/nginx

COPY ./ ./

CMD ["sh", "-c", "nginx -g 'daemon off;'"]
