##
## Build
##
FROM golang:1.22 AS build

WORKDIR /app
ADD ./back /app
COPY ./back/go.mod ./
COPY ./back/go.sum ./
RUN go mod download

COPY ./back/*.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

##
## Deploy
##
FROM alpine

RUN apk --no-cache add ca-certificates curl

RUN mkdir /app

WORKDIR /app/

# Copy the Pre-built binary file from the previous stage
COPY --from=build /app/main .
COPY ./back/migrations /app/migrations
COPY ./back/templates /app/templates

# Expose port 8080
EXPOSE 8080

# Run Executable
CMD ["./main"]
