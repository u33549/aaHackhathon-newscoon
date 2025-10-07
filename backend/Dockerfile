FROM node:18-alpine

WORKDIR /app

# Package.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Tüm backend kodlarını kopyala
COPY . .

# Port'u expose et
EXPOSE 3000

# Uygulamayı başlat
CMD ["npm", "start"]
