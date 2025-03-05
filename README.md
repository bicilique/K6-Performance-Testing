# K6 Performance Testing & Monitoring with Grafana 🚀

## Overview
This project integrates **K6**, **Prometheus**, and **Grafana** to perform load testing, collect performance metrics, and visualize the results. 

- 📌 **K6** runs the load tests and generates performance metrics.
- 📡 **Prometheus** stores and retrieves test results.
- 📊 **Grafana** visualizes the collected data.

## Features ✨
- Automated **performance testing** using K6.
- **Real-time monitoring** via Grafana dashboards.
- **Custom dashboards** for better insights.
- **Dockerized setup** for easy deployment.

## Directory Structure 📂
```
K6-PERFORMANCE-TESTING
│── config
│   └── prometheus.yml          # Prometheus configuration
│── data
│   ├── grafana
│   ├── influxdb
│   └── prometheus
│── grafana
│   ├── dashboards
│   │   ├── dashboard-influxdb.json
│   │   ├── dashboard-k6-histogram.json
│   │   ├── dashboard.json
│   ├── grafana-dashboard.yaml
│   ├── grafana-datasource.yaml
│   └── grafana.ini
│── k6
│   └── test.js                 # K6 test script
│── scripts
│── xk6
│   ├── .env                    # Environment variables
│   ├── Dockerfile              # Docker setup
│   ├── k6
│   ├── k6-influxdb.yml
│   ├── xk6-prometheus.yml
│   └── xk6-test.yml
│── .gitignore
│── README.md 📖
│── REPORT.md 📝
```

## Setup 🛠
### Prerequisites
Ensure you have the following installed:
- [Docker](https://www.docker.com/)
- [K6](https://k6.io/)
- [Grafana](https://grafana.com/)
- [Prometheus](https://prometheus.io/)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/bicilique/K6-Performance-Testing.git
   cd k6-performance-testing
   ```
2. Run the setup using Docker:
   ```sh
   docker-compose up -d
   ```

## Running Tests 🚀
To execute the performance test:
```sh
k6 run k6/test.js
```

## Monitoring 📊
1. Open Grafana at `http://localhost:3000`
2. Login (default: **admin/P@ssw0rd**)
3. Import dashboards from `grafana/dashboards/`

## Contributions 🤝
Feel free to submit pull requests to improve this project!

---
Happy testing! 🏋️‍♂️🔥