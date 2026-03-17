# SETUP — NT118.Q22 Redshark

> Hướng dẫn cài đặt và triển khai đầy đủ cho dự án `redshark`.
> Domain: `helios.id.vn`

---

## Mục lục

1. [Yêu cầu phần mềm](#1--yêu-cầu-phần-mềm)
2. [Điều kiện tiên quyết cluster](#2--điều-kiện-tiên-quyết-cluster)
3. [Khởi tạo namespace và secret](#3--khởi-tạo-namespace-và-secret)
4. [Cơ sở dữ liệu — LocalStack RDS](#4--cơ-sở-dữ-liệu--localstack-rds)
5. [Cloudflare Tunnel](#5--cloudflare-tunnel)
6. [Monitoring — Grafana + Loki datasource](#6--monitoring--grafana--loki-datasource)
7. [Logging — Loki + Alloy](#7--logging--loki--alloy)
8. [Build và push image](#8--build-và-push-image)
9. [Deploy backend — Helm](#9--deploy-backend--helm)
10. [Frontend — React Native](#10--frontend--react-native)
11. [Backend local dev](#11--backend-local-dev)
12. [Kiểm tra toàn hệ thống](#12--kiểm-tra-toàn-hệ-thống)
13. [Teardown](#13--teardown)

---

## 1 — Yêu cầu phần mềm

Cài đặt các công cụ sau trước khi bắt đầu:

| Công cụ | Phiên bản | Mục đích |
|---|---|---|
| [Git](https://git-scm.com/) | bất kỳ | Version control |
| [JDK 25](https://www.oracle.com/java/technologies/downloads/) | 25 | Build Spring Boot |
| [Android Studio](https://developer.android.com/studio) | bất kỳ | Chạy máy ảo Android |
| [NVM](https://github.com/nvm-sh/nvm) + Node.js 24.13.1 | 24.13.1 | Build React Native |
| [kubectl](https://kubernetes.io/docs/tasks/tools/) | bất kỳ | Tương tác cụm k3s |
| [Helm](https://helm.sh/) | v3+ | Deploy chart redshark |
| [AWS CLI](https://aws.amazon.com/cli/) | v2 | Tương tác LocalStack |
| kubeconfig | — | Truy cập `~/.kube/config` |

### Cài đặt JDK 25

```cmd
java -version
javac -version
```

### Cài đặt Node.js qua NVM

```cmd
nvm install 24.13.1
nvm use 24.13.1
node -v
npm -v
```

> Nếu gặp lỗi phân quyền, chạy Terminal/Command Prompt với quyền Administrator.

---

## 2 — Điều kiện tiên quyết cluster

Cluster k3s phải có các service sau đang chạy trước khi bắt đầu:

```bash
# Từ thư mục ~/main/k3s-homelab/
./k3s.sh status
./k3s.sh health
```

Cần thấy `Running` cho: `localstack`, `cloudflared`, `monitoring`, `logging`.

| Service | Namespace | Mục đích |
|---|---|---|
| LocalStack Pro | `localstack` | PostgreSQL RDS + S3 |
| cloudflared | `cloudflared` | Public HTTPS tunnel |
| kube-prometheus-stack (`mon`) | `monitoring` | Grafana + Prometheus |
| Loki + Alloy (`log`) | `logging` | Log aggregation |

---

## 3 — Khởi tạo namespace và secret

```bash
# Tạo namespace
kubectl create namespace redshark

# Tạo secret kết nối DB (phải khớp với application-k8s.properties)
kubectl create secret generic redshark-secrets \
  --namespace redshark \
  --from-literal=db-username=redshark-user \
  --from-literal=db-password=secret \
  --from-literal=db-name=redshark-database

# Xác nhận
kubectl get secret redshark-secrets -n redshark
```

---

## 4 — Cơ sở dữ liệu — LocalStack RDS

LocalStack Pro chạy trong namespace `localstack`, NodePort `30566`.
Endpoint nội bộ cluster: `localstack.localstack.svc.cluster.local:4566`

### Lấy IP node LocalStack

```bash
LSIP=$(kubectl get pod -n localstack -l app.kubernetes.io/name=localstack \
  -o jsonpath='{.items[0].status.hostIP}')
echo $LSIP
```

### Kiểm tra health

```bash
curl -s http://${LSIP}:30566/_localstack/health | python3 -m json.tool | grep -E '"rds"|"s3"'
```

Kết quả mong đợi: `"rds": "available"`.

### Tạo RDS instance PostgreSQL

```bash
aws --endpoint-url=http://${LSIP}:30566 \
    --region us-east-1 \
    --no-sign-request \
    rds create-db-instance \
      --db-instance-identifier redshark-db \
      --db-instance-class db.t3.micro \
      --engine postgres \
      --master-username redshark-user \
      --master-user-password secret \
      --db-name redshark-database \
      --allocated-storage 20
```

### Xác nhận instance

```bash
aws --endpoint-url=http://${LSIP}:30566 \
    --region us-east-1 \
    --no-sign-request \
    rds describe-db-instances \
      --db-instance-identifier redshark-db \
  | python3 -m json.tool | grep -E '"DBInstanceStatus"|"DBName"'
```

### Phương pháp thay thế: LocalStack Web UI

Thay vì dùng CLI, có thể tạo và kiểm tra RDS instance qua giao diện web:

1. Mở `https://localstack.helios.id.vn` (hoặc app.localstack.cloud → chọn workspace `localstack.helios.id.vn`)
2. **Resource Browser → RDS → Databases**
3. Đổi region sang **`us-east-1`** (góc trên phải)
4. Nhấn **Create instance**
5. Điền các thông số:
   - DB identifier: `redshark-db`
   - Engine: `PostgreSQL`
   - DB instance class: `db.t3.micro`
   - Master username: `redshark-user`
   - Master password: `secret`
   - Initial database name: `redshark-database`
   - Allocated storage: `20`
6. Nhấn **Create** — instance xuất hiện với status `available`

> Spring Boot dùng `ddl-auto=update` — schema tự tạo khi app khởi động lần đầu.

> **Fallback debug:** Nếu không có node IP, dùng port-forward:
> ```bash
> kubectl port-forward svc/localstack 4566:4566 -n localstack
> # Thay ${LSIP}:30566 bằng localhost:4566
> ```

---

## 5 — Cloudflare Tunnel

Cloudflared đã chạy sẵn trong namespace `cloudflared`. Chỉ cần thêm routes trên Dashboard — không cần redeploy.

**Cloudflare Dashboard → Zero Trust → Networks → Tunnels → `redshark-homelab` → Public Hostnames → Add a public hostname**

| Subdomain | Domain | Type | URL (service nội bộ) | Public URL |
|---|---|---|---|---|
| `redshark-api` | `helios.id.vn` | HTTP | `redshark-api.redshark.svc.cluster.local:8080` | `https://redshark-api.helios.id.vn` |
| `localstack` | `helios.id.vn` | HTTP | `localstack.localstack.svc.cluster.local:4566` | `https://localstack.helios.id.vn` |
| `grafana` | `helios.id.vn` | HTTP | `mon-grafana.monitoring.svc.cluster.local:80` | `https://grafana.helios.id.vn` |
| `loki` | `helios.id.vn` | HTTP | `loki.logging.svc.cluster.local:3100` | `https://loki.helios.id.vn` |

### Thêm tunnel LocalStack (chi tiết)

1. Đăng nhập [Cloudflare Dashboard](https://dash.cloudflare.com) → **Zero Trust → Networks → Tunnels**
2. Chọn tunnel **`redshark-homelab`** → tab **Public Hostnames** → **Add a public hostname**
3. Điền thông số:
   - **Subdomain:** `localstack`
   - **Domain:** `helios.id.vn`
   - **Type:** `HTTP`
   - **URL:** `localstack.localstack.svc.cluster.local:4566`
4. Nhấn **Save hostname**
5. Xác nhận:
   ```bash
   curl -s https://localstack.helios.id.vn/_localstack/health | python3 -m json.tool | grep '"rds"'
   ```
   Kết quả mong đợi: `"rds": "available"`

### Xác nhận routes

```bash
curl -s https://grafana.helios.id.vn/api/health
curl -s https://loki.helios.id.vn/ready
curl -s https://localstack.helios.id.vn/_localstack/health | python3 -m json.tool | grep status
```

---

## 6 — Monitoring — Grafana + Loki datasource

Grafana: `https://grafana.helios.id.vn`

### Lấy credentials

```bash
MASTER_IP=$(kubectl get nodes -l node-role.kubernetes.io/control-plane \
  -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')
GRAFANA_PASS=$(kubectl get secret infra-secrets -n monitoring \
  -o jsonpath='{.data.admin-password}' | base64 -d)
```

### Thêm Loki datasource (qua API)

```bash
curl -sf -X POST "http://${MASTER_IP}:30300/api/datasources" \
  -H "Content-Type: application/json" \
  -u "admin:${GRAFANA_PASS}" \
  -d '{
    "name": "Loki-redshark",
    "uid": "loki-redshark-ds",
    "type": "loki",
    "url": "http://loki.logging.svc.cluster.local:3100",
    "access": "proxy",
    "isDefault": false
  }'
```

Kết quả mong đợi: `{"message":"Datasource added",...}`.

### Thêm Loki datasource (qua UI)

1. Đăng nhập Grafana — user `admin`, password từ lệnh trên
2. **Connections → Data sources → Add data source → Loki**
3. URL: `http://loki.logging.svc.cluster.local:3100`
4. **Save & test** → `Data source connected and labels found`

### Xóa datasource (khi cần làm lại)

```bash
curl -sf -X DELETE "http://${MASTER_IP}:30300/api/datasources/uid/loki-redshark-ds" \
  -u "admin:${GRAFANA_PASS}"
```

### LogQL queries (Explore → Datasource: Loki-redshark)

```logql
{namespace="redshark"}
{namespace="redshark", container="api"} |= "ERROR"
{namespace="redshark"} | json | line_format "{{.message}}"
```

### PromQL queries (Explore → Datasource: Prometheus)

```promql
rate(http_server_requests_seconds_count{namespace="redshark"}[5m])
jvm_memory_used_bytes{namespace="redshark"}
rate(http_server_requests_seconds_count{namespace="redshark",status=~"5.."}[5m])
```

---

## 7 — Logging — Loki + Alloy

Alloy chạy DaemonSet trên tất cả node — log namespace `redshark` được thu thập tự động sau khi backend deploy, không cần cấu hình thêm.

```bash
# Kiểm tra Alloy coverage
kubectl get daemonset alloy -n logging

# Loki ready
curl -s http://${MASTER_IP}:30100/ready

# Query log redshark (sau khi backend chạy)
curl -s -G "http://${MASTER_IP}:30100/loki/api/v1/query_range" \
  --data-urlencode 'query={namespace="redshark"}' \
  --data-urlencode 'limit=20' \
  | python3 -m json.tool | grep '"line"' | head -20
```

---

## 8 — Build và push image

```bash
cd ~/main/project/NT118.Q22

# Build JAR
cd api/redshark && ./mvnw clean package -DskipTests -B && cd ../..

# Build Docker image (build context = api/)
docker build -t ghcr.io/helios-ryuu/redshark-api:latest -f api/Dockerfile api/
docker push ghcr.io/helios-ryuu/redshark-api:latest
```

Để dùng tag cụ thể, cập nhật `~/main/k3s-homelab/services/redshark/values.yaml`:

```yaml
image:
  repository: ghcr.io/helios-ryuu/redshark-api
  tag: "v1.0.0"
```

---

## 9 — Deploy backend — Helm

Chart: `~/main/k3s-homelab/services/redshark/` — secret `redshark-secrets` phải tồn tại (Bước 3).

```bash
cd ~/main/k3s-homelab

helm upgrade --install redshark ./services/redshark \
  --namespace redshark \
  --wait --timeout 3m
```

### Theo dõi startup

```bash
kubectl get pods -n redshark -w
kubectl logs -n redshark -l app=redshark-api -f
```

### Kiểm tra kết nối DB từ pod

```bash
kubectl exec -n redshark deploy/redshark-api -- \
  wget -qO- http://localstack.localstack.svc.cluster.local:4566/_localstack/health
```

### Cập nhật image (sau build mới)

```bash
helm upgrade redshark ./services/redshark -n redshark --set image.tag=<new-tag>
```

---

## 10 — Frontend — React Native

> **Yêu cầu:** Android Studio đang chạy với máy ảo Android đã khởi động (hoặc kết nối thiết bị thật).

```bash
cd ~/main/project/NT118.Q22/ui/redshark

npm install
npm run start
```

Nhấn **`a`** để khởi chạy trên máy ảo Android.

---

## 11 — Backend local dev

Backend dùng Spring profiles để phân biệt môi trường. Chạy từ `api/redshark/`:

```bash
cd ~/main/project/NT118.Q22/api/redshark
```

**Profile `local`** — kết nối LocalStack qua tunnel (không cần port-forward):

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

**Profile `k8s`** — test cấu hình cluster từ máy cục bộ (cần port-forward LocalStack):

```bash
kubectl port-forward svc/localstack 4566:4566 -n localstack &
./mvnw spring-boot:run -Dspring-boot.run.profiles=k8s
```

---

## 12 — Kiểm tra toàn hệ thống

```bash
# Backend API
curl -s https://redshark-api.helios.id.vn/actuator/health
curl -s https://redshark-api.helios.id.vn/api/users
curl -s https://redshark-api.helios.id.vn/api/greeting

# LocalStack
curl -s https://localstack.helios.id.vn/_localstack/health | python3 -m json.tool

# Grafana
curl -s https://grafana.helios.id.vn/api/health

# Loki
curl -s https://loki.helios.id.vn/ready
```

### Bảng URL dịch vụ

| Dịch vụ | URL công khai | Service nội bộ |
|---|---|---|
| API Backend | `https://redshark-api.helios.id.vn` | `redshark-api.redshark.svc.cluster.local:8080` |
| LocalStack | `https://localstack.helios.id.vn` | `localstack.localstack.svc.cluster.local:4566` |
| Grafana | `https://grafana.helios.id.vn` | `mon-grafana.monitoring.svc.cluster.local:80` |
| Loki | `https://loki.helios.id.vn` | `loki.logging.svc.cluster.local:3100` |

---

## 13 — Teardown

```bash
# Xóa backend
helm uninstall redshark -n redshark
kubectl delete namespace redshark

# Xóa Loki datasource khỏi Grafana
MASTER_IP=$(kubectl get nodes -l node-role.kubernetes.io/control-plane \
  -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')
GRAFANA_PASS=$(kubectl get secret infra-secrets -n monitoring \
  -o jsonpath='{.data.admin-password}' | base64 -d)
curl -sf -X DELETE "http://${MASTER_IP}:30300/api/datasources/uid/loki-redshark-ds" \
  -u "admin:${GRAFANA_PASS}"

# Xóa RDS instance (CLI)
LSIP=$(kubectl get pod -n localstack -l app.kubernetes.io/name=localstack \
  -o jsonpath='{.items[0].status.hostIP}')
aws --endpoint-url=http://${LSIP}:30566 --region us-east-1 --no-sign-request \
  rds delete-db-instance \
    --db-instance-identifier redshark-db \
    --skip-final-snapshot

# Xóa RDS instance (Web UI)
# 1. Mở https://localstack.helios.id.vn → Resource Browser → RDS → Databases → us-east-1
# 2. Chọn redshark-db → Actions → Delete → xác nhận

# Xóa Cloudflare routes thủ công:
# Dashboard → Zero Trust → Networks → Tunnels → redshark-homelab → Public Hostnames → xóa 4 routes
```
