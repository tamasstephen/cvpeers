FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production
RUN ls -la /app/dist

FROM nginx:alpine
COPY --from=build /app/dist/angular-cv/browser/ /usr/share/nginx/html
COPY --from=build /app/dist/angular-cv/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Make sure nginx can access the files
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    ls -la /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
