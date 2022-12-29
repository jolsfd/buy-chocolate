FROM golang:1.19-alpine
RUN apk add build-base

WORKDIR /pocketbase

COPY . .

RUN go mod download

RUN go build -o pocketbase .

EXPOSE 8090

CMD ["./pocketbase","serve","--http=0.0.0.0:8090"]