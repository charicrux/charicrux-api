# About

This API is the beta release api running on a docker instance on AWS for the Beta Charicrux app.
API uses the Nest.js progressive framework alongside docker and nginx.

# Run Project Locally

Note: Need to have Docker Locally Installed.

1. npm install
2. Create a ".env" file using the ".template.env" file as a guide
3. docker-compose --file=docker-compose-dev.yml up mongodb
4. npm run start:dev
