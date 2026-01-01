FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm install --production=false
RUN npm run prisma:generate

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app /app
COPY src ./src
EXPOSE 4000
CMD ["node", "src/server.js"]
