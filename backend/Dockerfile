FROM golang:1.19-alpine

WORKDIR /pocketbase

COPY . .

RUN go mod download

RUN go build -o pocketbase .

EXPOSE 8090

CMD ["./pocketbase"]