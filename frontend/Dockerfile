FROM node:20-alpine

WORKDIR /app

# Копируем только package.json и package-lock.json
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь исходный код
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
