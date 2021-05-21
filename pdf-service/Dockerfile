FROM golang:1.15.5 AS build_base

# Set the Current Working Directory inside the container
WORKDIR /tmp/pdf-service

COPY go.mod .
COPY go.sum .

RUN go mod download

# Copy everything from the current directory to the PWD (Present Working Directory) inside the container
COPY . .

RUN go build -o application ./main.go

# Start fresh from a smaller image
FROM alpine:3.9 
RUN apk add ca-certificates

WORKDIR /app

COPY --from=build_base /tmp/pdf-service/application ./application
COPY .env.prod ./.env

# This container exposes port 8080 to the outside world
EXPOSE 8080


# Run the binary program produced by `go install`
CMD ["./application"]