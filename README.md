# Buy chocolate

## Requirements

You need to install:
* ```npm```
* ```caddy```
* ```docker```

## Environment variables

* Insert secret key in ```main.go```
* Insert origin and site key in ```.env```

## Deploy

To deploy the single page application run:
```
cd ./frontend
npm install
npm run build
```

Or if you want to use docker instead:
```
cd ./frontend
docker build -t vite

# get the container name
docker ps --all
docker cp CONTAINER_NAME:/vite/dist ./dist
```

To build the docker image:
```
cd ./backend
docker build . -t pocketbase
```

And to run it in production:

```
docker run -d -p 127.0.0.1:8090:8090 -v /var/buy-chocolate:/pocketbase/pb_data pocketbase
```

Finally start the reverse proxy with caddy-server:
```
sudo caddy run
```

## Setup

* Create admin account ```http://127.0.0.1:8090/_/```
* Import collections ```pb_schema.json```

## Deploying on a VPS

Installed and running services:
* ```ufw``` (ssh, http, https)
* ```fail2ban```
* ```docker```