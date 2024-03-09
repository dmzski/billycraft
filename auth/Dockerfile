FROM rust as builder

ENV SQLX_OFFLINE true

WORKDIR /app

RUN apt-get update && apt-get install -y pkg-config libssl-dev && apt-get clean


COPY ./ /app
RUN cargo install sqlx-cli --version 0.7.3
RUN cargo sqlx prepare --check
RUN cargo build --release


FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y openssl ca-certificates && apt-get clean
WORKDIR /

COPY --from=builder /app/target/release/auth /auth

EXPOSE 80

ENTRYPOINT ["/auth"]
