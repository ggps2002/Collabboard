# Use Node.js official lightweight image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the package files first (to leverage Docker cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

RUN npm install eslint

# Build the Next.js app
RUN npm run build

# Expose port 3000 for the Next.js app
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
