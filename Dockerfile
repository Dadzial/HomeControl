FROM node:20.13.1-alpine as frontend-builder

WORKDIR /HomeControl/frontend

COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps

COPY frontend .
RUN npm run build -- --configuration production

FROM node:20.13.1-alpine as backend-builder

WORKDIR /HomeControl/backend/api

COPY backend/api/package*.json ./
RUN npm install --legacy-peer-deps

COPY backend/api .

RUN npx tsc --skipLibCheck

FROM  node:20.13.1-alpine

WORKDIR /HomeControl

COPY --from=backend-builder /HomeControl/backend/api/package*.json ./backend/

RUN cd backend && \
    npm install --production --legacy-peer-deps \
    mongoose@6.10.0

COPY --from=backend-builder /HomeControl/backend/api/dist ./backend/dist

RUN mkdir -p /frontend/dist/frontend/browser
COPY --from=frontend-builder /HomeControl/frontend/dist/frontend/browser /frontend/dist/frontend/browser

ENV NODE_ENV=production
ENV PORT=3100
EXPOSE 3100

WORKDIR /HomeControl/backend

CMD ["node", "dist/index.js"]
