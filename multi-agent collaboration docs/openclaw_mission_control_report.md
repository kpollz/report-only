# OpenClaw Mission Control — Báo Cáo Từ Code và Tài Liệu Chính Thức

**Nguồn:** github.com/abhi1693/openclaw-mission-control  
**Ngày:** 18/06/2026

---

## 1. Mission Control Là Gì?

Mission Control là **giao diện web và API HTTP** để vận hành OpenClaw. Nó cung cấp control plane (lớp điều khiển) cho boards, tasks, agents, approvals, và kết nốI gateway.

Mô tả chính xác từ repo:

> *"OpenClaw Mission Control is the centralized operations and governance platform for running OpenClaw across teams and organizations, with unified visibility, approval controls, and gateway-aware orchestration."*
>
> *(Mission Control là nền tảng vận hành và quản trị tập trung để chạy OpenClaw xuyên suốt các team và tổ chức, vớI khả năng nhìn thấy thống nhất, kiểm soát phê duyệt, và điều phốI qua gateway.)*

### Bản chất

Mission Control **không phảI** agent. Nó là **lớp quản lý** ngồI trên OpenClaw Gateway:

- Nó không quyết định agent *nghĩ* gì — agent tự lo phần đó
- Nó quyết định agent *làm gì* — giao task, theo dõI tiến độ, phê duyệt
- Hợp đồng vớI agent cực kỳ đơn giản: gọI được, lấy trạng tháI được, hủy được

### Kiến trúc

| Thành phần | Công nghệ | Vai trò |
|-----------|-----------|---------|
| **Frontend** | Next.js | Giao diện web operator |
| **Backend** | FastAPI + SQLModel | API server |
| **Database** | PostgreSQL | Lưu trữ tasks, agents, boards, audit log |
| **Migrations** | Alembic | Quản lý schema database |
| **Message Queue** | Redis (optional) | Rate limiting, background jobs |

---

## 2. Key Concepts (Khái Niệm Cốt Lõi)

### 2.1. Organization (Tổ Chức)

Đơn vị cấp cao nhất. MỗI organization có:
- Nhiều **Board Groups** (nhóm bảng)
- Nhiều **Boards** (bảng công việc)
- Nhiều **Agents** (tác nhân)
- **Users** (ngườI dùng) vớI quyền khác nhau

Dữ liệu giữa các organization **cách ly hoàn toàn**.

### 2.2. Board (Bảng)

Bảng công việc — nơi task được tạo, phân công, và theo dõI.

MỗI board có:
- **Tasks** — công việc cần làm
- **Agents** — agent được gán vào board
- **Memory** — ngữ cảnh board được stream cho agent
- **Approvals** — quy trình phê duyệt

### 2.3. Task (Công Việc)

Task mang đầy đủ liên kết: organization → board → project → goal → parent.

Các trạng tháI:
- **inbox** — mớI tạo, chưa phân công
- **in_progress** — đang thực thI
- **review** — hoàn thành, chờ review
- **done** — hoàn thành
- **blocked** — bị chặn (có dependencies)

### 2.4. Agent (Tác Nhân)

Agent trong Mission Control là **đại diện** của OpenClaw agent (hoặc agent khác) chạy bên ngoàI.

Cách agent xác thực:
- Dùng **X-Agent-Token** header
- Rate limit: **20 requests / 60 seconds / IP**

Agent đăng ký vớI board qua **heartbeat check-in**.

### 2.5. Gateway (Cổng Kết Nối)

Kết nốI Mission Control vớI OpenClaw Gateway qua **WebSocket**:

- **wss://** (bảo mật) cho production
- **ws://** (không bảo mật) cho development
- Hỗ trợ self-signed TLS certificates (toggle trong settings)

Cấu hình gateway:
- Gateway URL (ví dụ: `wss://localhost:18789`)
- Gateway Token (xác thực)
- Workspace Root (ví dụ: `~/.openclaw`)

### 2.6. Approval (Phê Duyệt)

Các hành động nhạy cảm yêu cầu phê duyệt:
- Tạo agent mớI
- Vượt ngân sách
- Thay đổI chiến lược

Có thể cấu hình: `comment_required_for_review` — bắt buộc phảI có comment khi review.

### 2.7. Authentication (Xác Thực)

Hai chế độ:

| Chế độ | Mô tả | Khi nào dùng |
|--------|-------|-------------|
| **local** | Shared bearer token (`LOCAL_AUTH_TOKEN`, tốI thiểu 50 ký tự) | Self-hosted, phát triển |
| **clerk** | Clerk JWT authentication | Production có nhiều user |

### 2.8. Audit và Rate Limiting

- MọI request có **X-Request-Id** header để truy vết
- Audit log đầy đủ: ai làm gì, khi nào
- Rate limit per IP trên các endpoint nhạy cảm

| Endpoint | Limit | Window |
|----------|-------|--------|
| Agent authentication | 20 requests | 60 giây |
| Webhook ingest | 60 requests | 60 giây |

---

## 3. Flow Hoạt Động

### 3.1. Tổng Quan

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Operator      │────▶│  Mission Control │────▶│  OpenClaw       │
│   (NgườI)       │     │  (FastAPI + UI)  │     │  Gateway        │
│                 │◀────│                  │◀────│  (WebSocket)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │                         │
         │                       ▼                         │
         │              ┌──────────────────┐               │
         │              │   PostgreSQL     │               │
         │              │   (Tasks, Logs)  │               │
         │              └──────────────────┘               │
         │                                                 │
         └─────────────────────────────────────────────────┘
                    (Review output, phê duyệt)
```

### 3.2. Flow Chi Tiết — Agent Làm Việc

**Bước 1: Agent đăng ký (Heartbeat Check-in)**

Agent gọI API để đăng ký vớI board:

```
POST /api/v1/agent/heartbeat
Headers: X-Agent-Token: <agent-token>
Body: {"name": "Tessa", "board_id": "<board-id>", "status": "online"}
```

**Bước 2: Agent lấy task**

```
GET /api/v1/agent/boards/<board-id>/tasks?status=inbox&limit=10
Headers: X-Agent-Token: <agent-token>
```

Trả về danh sách task ở trạng tháI `inbox`.

**Bước 3: Agent thực thI task**

Agent (qua OpenClaw Gateway) thực thI task. Quá trình này xảy ra **bên ngoàI** Mission Control — agent tự lo phần suy nghĩ và hành động.

**Bước 4: Agent báo cáo tiến độ**

Agent gọI API cập nhật trạng tháI task (in_progress → review → done).

**Bước 5: Operator review**

Operator xem dashboard:
- Task nào đang làm
- Agent nào đang chạy
- Output của agent
- Phê duyệt hoặc yêu cầu sửa

### 3.3. Flow Chi Tiết — Operator Tạo Task

**Bước 1: Tạo task qua UI hoặc API**

```
POST /api/v1/boards/<board-id>/tasks
Headers: Authorization: Bearer <user-token>
Body: {"title": "Fix login bug", "description": "...", "status": "inbox"}
```

**Bước 2: Task xuất hiện trong board**

**Bước 3: Agent (qua heartbeat) thấy task mớI**

**Bước 4: Agent tự động nhận và thực thI**

### 3.4. Flow Webhook (Tích Hợp Bên NgoàI)

Hệ thống bên ngoàI (GitHub, Stripe...) gửI webhook đến Mission Control:

```
POST /api/v1/webhooks/<webhook-id>
Body: {"event": "push", "repo": "...", "commit": "..."}
```

Mission Control tạo task từ webhook → agent tự động nhận và xử lý.

Rate limit webhook: **60 requests / 60 seconds / IP**

### 3.5. Ví Dụ Thực Tế — Content Pipeline

| Bước | Actor | Hành động | API/Method |
|------|-------|-----------|------------|
| 1 | Operator | Tạo board "Marketing Content" | UI hoặc API |
| 2 | Operator | Tạo task "Viết blog về AI" | POST /tasks |
| 3 | OpenClaw Agent | Heartbeat check-in | POST /agent/heartbeat |
| 4 | OpenClaw Agent | Lấy task | GET /tasks?status=inbox |
| 5 | OpenClaw Agent | Thực thI (viết blog) | Agent tự lo |
| 6 | OpenClaw Agent | Cập nhật status → review | PATCH /tasks/<id> |
| 7 | Operator | Review output trong UI | Dashboard |
| 8 | Operator | Approve → status → done | UI hoặc API |

### 3.6. Tích Hợp VớI OpenClaw

Mission Control kết nốI OpenClaw qua **WebSocket**:

```
[Mission Control] ──wss://──▶ [OpenClaw Gateway] ──▶ [OpenClaw Agent]
       │                                                      │
       │◀────────────────── kết quả ──────────────────────────┘
       ▼
[PostgreSQL] (lưu task, log, audit)
```

Cấu hình trong UI:
- Settings → Gateways → Add Gateway
- Nhập: Gateway URL, Gateway Token, Workspace Root
- Toggle "Allow self-signed TLS" nếu cần
- Save → Mission Control kết nốI vớI OpenClaw Gateway

---

## 4. API Endpoints Chính

| Endpoint | Method | Mô tả | Auth |
|----------|--------|-------|------|
| `/healthz` | GET | Health check | Không cần |
| `/readyz` | GET | Readiness check | Không cần |
| `/api/v1/agent/heartbeat` | POST | Agent đăng ký/check-in | X-Agent-Token |
| `/api/v1/agent/boards/<id>/tasks` | GET | Lấy task cho agent | X-Agent-Token |
| `/api/v1/boards` | GET/POST | List/Tạo board | Bearer Token |
| `/api/v1/boards/<id>/tasks` | GET/POST | List/Tạo task | Bearer Token |
| `/api/v1/tasks/<id>` | GET/PATCH | Xem/Cập nhật task | Bearer Token |
| `/api/v1/webhooks/<id>` | POST | Nhận webhook | Không cần (có verify) |
| `/openapi.json` | GET | OpenAPI schema | Không cần |
| `/docs` | GET | Swagger UI | Không cần |

---

## 5. Kết Luận

**Mission Control phù hợp cho Phase 2 Collab:**

- Đúng bài toán: quản lý nhiều agent, giao task, theo dõI tiến độ
- Tích hợp sẵn vớI OpenClaw (WebSocket gateway)
- Human-in-the-loop: approval controls, audit log
- Self-hosted: MIT license, Docker Compose
- API-first: dễ dàng tích hợp vớI hệ thống khác

**Hạn chế:**

- Docs còn sơ sàI (nhiều phần ghi "TODO", "stubs")
- Code còn đang phát triển active (46 open issues, 41 PRs)
- Chưa có budget control như Paperclip
- Heartbeat-based (agent polling) thay vì real-time push

**Phán quyết:** Lựa chọn tốt nếu bạn đã dùng OpenClaw và muốn một lớp quản lý đơn giản, self-hosted. Nhưng cần sẵn sàng đóng góp code hoặc chờ project ổn định hơn.

---

## Tài Liệu Tham Khảo

1. [GitHub Repository](https://github.com/abhi1693/openclaw-mission-control)
2. [docs/README.md](https://github.com/abhi1693/openclaw-mission-control/blob/master/docs/README.md)
3. [docs/getting-started/README.md](https://github.com/abhi1693/openclaw-mission-control/blob/master/docs/getting-started/README.md)
4. [docs/architecture/README.md](https://github.com/abhi1693/openclaw-mission-control/blob/master/docs/architecture/README.md)
5. [docs/operations/README.md](https://github.com/abhi1693/openclaw-mission-control/blob/master/docs/operations/README.md)
6. [docs/openclaw_gateway_ws.md](https://github.com/abhi1693/openclaw-mission-control/blob/master/docs/openclaw_gateway_ws.md)
7. [docs/reference/api.md](https://github.com/abhi1693/openclaw-mission-control/blob/master/docs/reference/api.md)
8. [backend/README.md](https://github.com/abhi1693/openclaw-mission-control/blob/master/backend/README.md)
