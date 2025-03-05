# Use the latest Go version required by xk6
FROM golang:1.22 AS builder

WORKDIR /xk6

# Install xk6
RUN go install go.k6.io/xk6/cmd/xk6@latest

# Build a custom k6 binary with all required extensions
RUN xk6 build \
    --with github.com/avitalique/xk6-file@latest  \
    --with github.com/szkiba/xk6-prometheus@latest \
    --with github.com/grafana/xk6-sql@latest \
    --with github.com/grafana/xk6-sql-driver-ramsql@latest

# Create final runtime image
FROM alpine:latest

WORKDIR /k6
COPY --from=builder /xk6/k6 /usr/bin/k6

ENTRYPOINT ["k6"]
