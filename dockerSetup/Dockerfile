FROM node:18-alpine

WORKDIR /app

# GitHub'dan proje indir
RUN apk add --no-cache git \
    && git clone https://github.com/u33549/aaHackhathon-newscoon.git /tmp/repo \
    && cp -r /tmp/repo/backend/* /app/ \
    && rm -rf /tmp/repo

# Bağımlılıkları yükle
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]

