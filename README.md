# Buy chocolate 🍫

## TODO

* no error message when new turnstile token
* help
* legal
* replace text placeholders
* delete users collections or block evrything

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
docker build . -t vite
docker run -t vite

# get the container name
docker ps --all
docker cp CONTAINER_NAME:/vite/dist ./dist

docker stop CONTAINER_NAME
docker rm CONTAINER_NAME
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

Change config in ```/etc/caddy/Caddyfile```:
**Make sure you change the path before ```/home/USER/buy-chocolate/frontend/dist/```**
```
sudo systemctl restart caddy
```

## Partial shutdown

To block create requests change to api rule in the admin dashboard to "Block evrything"
