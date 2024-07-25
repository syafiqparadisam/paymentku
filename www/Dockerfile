FROM node:18.17.1-alpine AS build

# Set the working directory
WORKDIR /app

# Copy source code
COPY . .

# Install the dependencies
RUN npm install



# Mount env variables
RUN --mount=type=secret,id=VITE_API_URL, required=true \
    --mount=type=secret,id=VITE_FRONTEND_URL,required=true \
    --mount=type=secret,id=VITE_SERVICE_ID_EMAILJS,required=true \
    --mount=type=secret,id=VITE_TEMPLATE_ID_HELPING_EMAILJS,required=true \
    --mount=type=secret,id=VITE_PUBLIC_KEY_EMAILJS,required=true \
    VITE_API_URL=$(cat /run/secrets/VITE_API_URL) \
    VITE_PUBLIC_KEY_EMAILJS=$(cat /run/secrets/VITE_PUBLIC_KEY_EMAILJS) \
    VITE_TEMPLATE_ID_HELPING_EMAILJS=$(VITE_TEMPLATE_ID_HELPING_EMAILJS) \
    VITE_SERVICE_ID_EMAILJS=$(cat /run/secrets/VITE_SERVICE_ID_EMAILJS) \
    VITE_FRONTEND_URL=$(cat /run/secrets/VITE_FRONTEND_URL) \
    npm run build

# use nginx to put build website
FROM nginx:1.27-alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Run the app
CMD [ "nginx", "-g", "daemon off;" ]