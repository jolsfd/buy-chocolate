# Buy chocolate

## Deploy

To deploy the singe page application run:
```
cd ./frontend
npm run build
```

To build the docker image:
```
cd ./backend
docker build . -t pocketbase
```

And to run it in production:

```
docker run -p 127.0.0.1:8090:8090 -v /var/buy-chocolate:/pocketbase/pb_data pocketbase
```

Finally start the reverse proxy with caddy-server:
```
sudo caddy run
```