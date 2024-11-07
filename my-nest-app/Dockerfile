# Use Node.js 20 base image for the build stage
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --production --no-cache --timeout=60000000

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a smaller Node.js 20 image to reduce the size of the final image
FROM node:20-alpine AS production

# Set the working directory in the new production image
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Expose the port that NestJS will run on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
