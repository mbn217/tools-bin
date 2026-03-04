FROM node:22-alpine AS build

WORKDIR /app

COPY client/package.json client/package-lock.json* ./client/
RUN cd client && npm install

COPY client/ ./client/
RUN cd client && npx vite build

FROM node:22-alpine

WORKDIR /app

COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm install --omit=dev

COPY server/ ./server/
COPY --from=build /app/client/dist ./client/dist

EXPOSE 3001

CMD ["node", "server/index.js"]
