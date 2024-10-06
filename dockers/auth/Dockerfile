FROM rust:1.79 as builder

WORKDIR /app

RUN apt-get update && apt-get install -y pkg-config libssl-dev && apt-get clean


ADD ./auth /app
RUN SQLX_OFFLINE=true cargo build --release


FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y openssl ca-certificates && apt-get clean
WORKDIR /

COPY --from=builder /app/target/release/auth /auth

EXPOSE 8080

ENTRYPOINT ["/auth"]
