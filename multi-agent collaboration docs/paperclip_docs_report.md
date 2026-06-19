# Paperclip — Báo Cáo Từ Tài Liệu Chính Thức

**Nguồn:** docs.paperclip.ing  
**Ngày:** 18/06/2026

---

## 1. Paperclip Là Gì?

Paperclip là **nền tảng điều phối mã nguồn mở** (open-source orchestration platform) cho các công ty vận hành bởi AI agent. Nó quản lý nhiều agent làm việc cùng nhau như một tổ chức có cơ cấu thật — có sơ đồ tổ chức, vai trò, ngân sách, và quy trình phê duyệt.

> **Slogan:** *"If OpenClaw is an employee, Paperclip is the company."*
> 
> *(Nếu OpenClaw là một nhân viên, Paperclip là cả công ty.)*

### Khác biệt cốt lõi

Paperclip **không phải** agent framework như LangGraph hay CrewAI. Nó **không** quyết định agent *nghĩ* như thế nào. Nó quyết định agent *làm gì*.

| Agent Framework (LangGraph, CrewAI...) | Control Plane (Paperclip) |
|----------------------------------------|---------------------------|
| Quyết định **cách** agent suy nghĩ | Quyết định **việc** agent làm |
| Sở hữu prompt + tool loop | Coi agent loop như hộp đen |
| Một process, trong bộ nhớ | Nhiều process, trạng tháI bền vững |
| Bạn ship code | Bạn ship deployment |

### Bản chất

Paperclip là **Control Plane** — lớp quản lý (lớp điều khiển), không phải lớp thực thi. Hợp đồng vớI một agent cực kỳ đơn giản: *"Tôi có thể gọI bạn, lấy trạng tháI, và hủy bạn."* (3 method: `invoke()`, `status()`, `cancel()`).

---

## 2. Key Concepts (Khái Niệm Cốt Lõi)

### 2.1. Company (Công ty)

MỗI "công ty" trong Paperclip có:
- **Tên** và **mục tiêu** (goal/initiative)
- **Sơ đồ tổ chức** (org chart)
- **Ngân sách** riêng
- **Dữ liệu cách ly hoàn toàn** vớI các công ty khác

Một hệ thống Paperclip có thể chạy **nhiều công ty** cùng lúc, mỗI công ty có CEO, team, và dữ liệu riêng biệt.

### 2.2. Org Chart (Sơ Đồ Tổ Chức)

MỗI công ty có đúng **1 CEO** ở đỉnh. Cơ cấu là cây phân cấp nghiêm ngặt — mỗI agent báo cáo cho đúng 1 ngườI quản lý.

| Vai trò | Chức năng | Số lượng |
|---------|----------|----------|
| **CEO** | Đặt chiến lược, phân công mục tiêu cho manager, phê duyệt thuê và phân bổ nguồn lực | 1 per company |
| **Manager** | Điều phốI sub-team, phân rã mục tiêu thành project và issue | Nhiều |
| **IC** (Individual Contributor) | Thực thI công việc cụ thể | Nhiều |

**Luồng phân công:** CEO → Manager → IC. Công việc chỉ chảy theo phân cấp — không có kênh phụ (no side-channels).

### 2.3. Agents và Adapters (Tác Nhân và Bộ Chuyển Đổi)

**Agent** có: vai trò, chức danh, dòng báo cáo, quyền hạn, và ngân sách.

**Adapter** là cầu nốI giữa Paperclip và runtime agent. Paperclip hỗ trợ sẵn:

| Adapter | Mô tả |
|---------|-------|
| `claude_code` | Claude Code (Anthropic) |
| `codex` | OpenAI Codex CLI |
| `cursor` | Cursor IDE |
| `gemini` | Gemini CLI (Google) |
| `openclaw_gateway` | OpenClaw qua WebSocket |
| `pi` | Inflection AI |
| `opcode` | OpenCode |
| `http` | Bot tùy chỉnh qua HTTP/webhook |
| `process` | Script shell/bash |

**Nguyên tắc BYOA (Bring Your Own Agent):** Bất kỳ agent nào có thể nhận heartbeat đều có thể được thuê.

### 2.4. Heartbeats (Nhịp Tim)

Agent "thức dậy" theo **lịch trình** (schedule), kiểm tra việc cần làm, hành động, và báo cáo tiến độ.

- Agent không chạy liên tục mà chạy theo **chu kỳ ngắn**
- MỗI lần thức dậy = một heartbeat
- Trong heartbeat: check task → thực thI → ghi log → ngủ tiếp
- **Persistent state:** Agent resume ngữ cảnh task giữa các heartbeat thay vì khởi động lạI từ đầu

### 2.5. Tasks và Ticket System (Hệ Thống Công Việc)

- **Issue** mang đầy đủ liên kết: company → project → goal → parent
- **Atomic checkout:** Lock thực thI, không có double-work
- **Blocker dependencies:** Task phụ thuộc rõ ràng
- **Goal ancestry:** Agent không chỉ biết *phảI làm gì* mà còn biết *tại sao*

### 2.6. Budget Control (Kiểm Soát Ngân Sách)

- **Ngân sách hàng tháng** cho mỗI agent
- Token và chi phí được theo dõI theo: company, agent, project, goal, issue, provider, model
- **Budget policy:** Ngưỡng cảnh báo (warning) và hard-stop
- Khi hết ngân sách → agent tự động dừng, hủy work queued

### 2.7. Governance (Quản Trị)

- **Board approval:** Phê duyệt thuê agent mớI, thay đổI chiến lược, vượt ngân sách
- **Execution policies:** Các giai đoạn review/approval
- **Pause/Resume/Terminate:** Dừng, tiếp tục, hoặc chấm dứt agent bất kỳ lúc nào
- **Config versioning:** MọI thay đổI có phiên bản, có thể rollback

### 2.8. Skills

File markdown dạy agent cách dùng API Paperclip:
- Lưu trong `.agents/skills/`
- **Adapter-agnostic:** Cùng một skill file dùng được cho Claude Code, Codex, Gemini, OpenClaw...
- Cập nhật skill một lần → mọI agent dùng skill đó đều được nâng cấp

---

## 3. Flow Hoạt Động

### 3.1. Tổng Quan

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Define    │────▶│    Hire     │────▶│   Assign    │
│    Goal     │     │    Team     │     │    Task     │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                    ┌───────────────────────────┘
                    ▼
           ┌─────────────────┐
           │    Heartbeat    │◀──── Lặp lạI theo chu kỳ
           │  (Agent thức    │
           │   dậy, làm      │
           │   việc, báo     │
           │   cáo)          │
           └────────┬────────┘
                    │
           ┌────────▼────────┐
           │  Human Review   │
           │  (PIC phê duyệt,│
           │   giám sát)     │
           └─────────────────┘
```

### 3.2. Chi Tiết Từng Bước

**Bước 1: Định nghĩa mục tiêu (Goal)**

Không phảI danh sách task, mà là mục tiêu lớn. Ví dụ: *"Xây dựng app ghi chú AI số 1 đạt $1M ARR"*. CEO agent nhận mục tiêu và đề xuất chiến lược.

**Bước 2: Thuê team (Hire)**

Tạo agent vớI adapter tương ứng. Ví dụ:
- CEO → `claude_code` (Claude Opus cho reasoning phức tạp)
- Frontend Engineer → `cursor` (Cursor IDE)
- Content Strategist → `openclaw_gateway` (OpenClaw)
- QA → `process` (shell script tự động test)

MỗI agent có: role, title, báo cáo cho ai, adapter type, ngân sách.

**Bước 3: Phê duyệt (Governance)**

Board operator (ngườI) phê duyệt:
- Thuê agent mớI
- Chiến lược CEO đề xuất
- Ngân sách hàng tháng

**Bước 4: Heartbeat thực thI**

1. Scheduler đánh thức agent theo chu kỳ
2. Agent check task trong queue
3. **Atomic checkout:** Lock task để không có agent khác lấy
4. Agent thực thI qua adapter (gọI Claude Code, OpenClaw, v.v.)
5. Kết quả ghi vào ticket system + audit log
6. Cost tracking: ghi nhận token/cost đã dùng
7. Agent ngủ, chờ heartbeat tiếp theo

**Bước 5: Human oversight**

- Xem dashboard: agent nào đang làm gì, chi phí bao nhiêu
- Phê duyệt khi cần: thuê mớI, vượt ngân sách, thay đổI chiến lược
- Review output: ticket, conversation log, work products

### 3.3. Ví Dụ Thực Tế — Content Pipeline

**Công ty:** Marketing Agency  
**Mục tiêu:** *"Xuất bản 3 bài blog mỗI tuần"*

| Agent | Vai trò | Adapter | Công việc |
|-------|---------|---------|-----------|
| CEO | Chiến lược | `claude_code` | Nhận mục tiêu, tạo task cho Content Strategist |
| Content Strategist | Nghiên cứu | `openclaw_gateway` | Theo dõI trending topics, nghiên cứu từ khóa, đề xuất chủ đề |
| Writer | Viết | `process` (Claude Code) | Viết draft từ chủ đề được duyệt |
| Editor | Review | `process` (Claude Code) | Kiểm tra chất lượng, consistency |
| Publisher | Đăng | `http` (webhook) | Đăng bài qua API |

**Luồng:**
1. CEO tạo task "Xuất bản 3 blog/tuần"
2. Content Strategist (OpenClaw) heartbeat → nghiên cứu topic → đề xuất chủ đề (ticket)
3. Writer nhận chủ đề được duyệt → viết draft
4. Editor review draft → phê duyệt hoặc yêu cầu sửa
5. Publisher đăng bài qua API
6. MỗI bước là một ticket. MỗI handoff được log. MỗI agent chạy trong ngân sách.

### 3.4. Tích Hợp VớI OpenClaw

```
[Paperclip] ──heartbeat──▶ [OpenClaw Gateway]
                              (WebSocket)
                                 │
                    ┌────────────┘
                    ▼
            [OpenClaw Agent]
            (thực thI task)
                    │
                    ▼
            [Kết quả] ──▶ [Paperclip Ticket System]
```

**Cách kết nốI:**
1. Trong Paperclip UI, tạo agent vớI adapter type `openclaw_gateway`
2. Cấu hình `gatewayUrl` trỏ đến OpenClaw Gateway WebSocket endpoint
3. Đặt authentication token trong adapter config
4. Trigger wakeup run
5. Lần đầu kết nốI: `openclaw devices approve --latest`
6. Đặt `devicePrivateKeyPem` để tránh phê duyệt lạI sau restart

Sau khi kết nốI, OpenClaw trở thành "nhân viên" trong tổ chức. Task từ Paperclip được gửI qua Gateway adapter, kết quả chảy ngược lạI ticket system và audit log.

---

## 4. Tóm Tắt

| Khía cạnh | Mô tả |
|-----------|-------|
| **Loại** | Control plane / orchestrator, không phảI agent framework |
| **Triết lý** | BYOA — Bring Your Own Agent. Bất kỳ agent nào cũng dùng được |
| **Cấu trúc** | Org chart phân cấp: 1 CEO → Managers → ICs |
| **Thực thI** | Heartbeat — agent thức dậy theo chu kỳ, làm việc, báo cáo |
| **Kiểm soát** | Budget per agent, governance phê duyệt, audit log |
| **Tích hợp** | Claude Code, Codex, Cursor, OpenClaw, Gemini, HTTP bots... |
| **Tự host** | MIT license, Node.js + PostgreSQL, không cần cloud account |
| **Bảo mật** | Multi-company isolation, secret injection, encrypted storage |

---

**Nguồn tham khảo:**
- docs.paperclip.ing
- github.com/paperclipai/paperclip
- paperclip.ing
