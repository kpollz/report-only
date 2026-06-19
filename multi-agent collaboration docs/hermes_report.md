# Nghiên Cứu: Hermes Agent

**Mục đích:** Đánh giá Hermes Agent cho Phase 1 (Nuôi dạy Agent)  
**Ngày:** 18/06/2026

---

## 1. Hermes Agent Là Gì?

Hermes Agent là trợ lý AI tự cải thiện, mã nguồn mở, do Nous Research phát triển. Khác với các agent thông thường chỉ "nhớ" những gì đã xảy ra, Hermes **tự tạo skill** từ kinh nghiệm, **tự cập nhật memory**, và **càng dùng càng thông minh** — không cần ngườI can thiệp.

Tóm lại: **Một "nhân viên ảo" biết tự học, càng làm việc càng giỏi, chạy trên máy bạn hoặc VPS $5/tháng.**

---

## 2. Triết Lý và Câu Chuyện Ra ĐờI

### Nous Research — NgườI Tạo Ra Hermes

Nous Research hình thành từ 2022 như một tập thể internet-native trên Discord và Twitter, chính thức hóa năm 2023 vớI các founder: **Jeff Quesnelle, Karan Malhotra, Teknium, Shivani Mitra**. Họ định vị mình là **"open-source-first, decentralization-focused lab"** — xây dựng AI do ngườI dùng kiểm soát, không tập trung vào vài công ty lớn.

Trước Hermes Agent, Nous Research đã phát triển nhiều dòng công việc song song:

- **Hermes model series** — các mô hình ngôn ngữ mã nguồn mở
- **DisTrO** — huấn luyện model phân tán qua mạng Internet
- **WorldSim, Doomscroll** — môi trường mô phỏng đa agent
- **Forge API** — cải thiện multi-step reasoning

### Sự Ra ĐờI CủA Hermes Agent

**Tháng 2/2026**, Hermes Agent ra đờI như **sự tổng hợp logic** của tất cả dòng công việc trước đó. Không có một "khoảnh khắc khai sáng" đơn lẻ như OpenClaw (giọng nóI ở Marrakesh), mà là kết quả của quá trình phát triển liên tục.

Điểm khác biệt cốt lõi: Nous Research nhận ra hầu hết agent chỉ **lưu trữ những gì đã xảy ra** (log), nhưng không **lưu trữ những gì hiệu quả** (procedural knowledge). Hermes được thiết kế để **"tự viết cookbook"** — mỗI lần hoàn thành task phức tạp, nó tự tạo skill để lần sau làm tốt hơn.

> *"The agent that grows with you."* — Tagline của Hermes Agent

### Triết Lý

**Không phảI lưu những gì đã xảy ra, mà lưu những gì hiệu quả**

- **Self-improving loop** — vòng lặp tự cải thiện là tính năng cốt lõi, không phảI add-on
- **Progressive disclosure** — skill chỉ load khi cần, không làm phình context
- **Cache-aware memory** — memory tự quản lý, không làm tăng token cost theo thờI gian
- **Zero telemetry** — mặc định không gửI dữ liệu ra ngoàI, không phảI toggle
- **Model-agnostic** — hỗ trợ 400+ models, không lock-in vào một nhà cung cấp

---

## 3. Tính Năng, Ưu và Nhược Điểm

### 5 Trụ Cột Kiến Trúc

| Trụ cột | Mô tả |
|---------|-------|
| **Memory** | 2 file `user.md` (ngườI dùng) + `memory.md` (môi trường), load mỗI phiên. GiớI hạn 3.575 ký tự — bắt buộc chọn lọc thay vì tích lũy |
| **Skills** | Markdown + YAML front matter. Progressive disclosure: chỉ load tên và tóm tắt, nộI dung đầy đủ chỉ khi cần. Tự tạo, tự cập nhật |
| **Soul** | Định nghĩa tính cách agent, tự tiến hóa qua feedback |
| **Crons** | Tự động hóa theo lịch bằng ngôn ngữ tự nhiên. "MỗI đêm 12h push code lên GitHub" — một câu là đủ |
| **Self-improving loop** | Kết quả của 4 trụ cột trên: agent tự đánh giá, tự tạo skill, tự cập nhật memory, càng dùng càng tốt |

### Hệ Thống Memory 4 Lớp

| Lớp | Chức năng | Khi nào dùng |
|-----|----------|-------------|
| **Prompt memory** (`user.md` + `memory.md`) | Luôn load, không cần agent quyết định | Thông tin quan trọng dùng mọI phiên |
| **Session search** (FTS5 SQLite) | Tìm kiếm chủ động qua query | Chủ đề cụ thể từng xuất hiện trước đây |
| **Skills** (procedural memory) | Cách làm việc đã học | Task tương tự từng làm |
| **Honcho** (user modeling) | Mô hình ngườI dùng theo thờI gian | Phản hồI cá nhân hóa theo phong cách làm việc |

### Các Tính Năng Khác

| Tính năng | Mô tả |
|-----------|-------|
| **Self-evolving skills** | Tự viết và tinh chỉnh skill từ kinh nghiệm. MỗI lần dùng lạI skill đều có thể cải thiện |
| **Contained sub-agents** | Tạo agent con cô lập cho từng sub-task, ngăn lẫn lộn context |
| **Scheduled automations** | Cron scheduler tích hợp sẵn, đặt lịch bằng ngôn ngữ tự nhiên |
| **Gateway đa kênh** | Telegram, Discord, Slack, WhatsApp, Signal, Email, CLI — tất cả từ một process |
| **6 terminal backends** | Local, Docker, SSH, Singularity, Modal, Daytona (serverless) |
| **Session persistence** | SQLite + FTS5, tìm kiếm cuộc trò chuyện từ tháng trước |
| **Model fallback** | Nếu provider down, tự động chuyển sang provider backup |
| **Context compression** | Tự động nén khi sắp đầy context, giữ lineage để truy vết |
| **Zero telemetry** | Không gửI dữ liệu ra ngoàI, thiết kế mặc định |

### Ưu Điểm

- **Tự học thực sự** — không cần ngườI viết skill, agent tự tạo từ kinh nghiệm
- **Memory thông minh** — 4 lớp phân biệt, cache-aware, không tăng token cost
- **Progressive disclosure** — skill chỉ load khi cần, chạy nhẹ dù có nhiều skill
- **Reliable by design** — Nous Research test kỹ mọI skill và tool trước khi ship
- **Model-agnostic** — 400+ models, dễ dàng chuyển đổI
- **Serverless option** — Modal/Daytona: ngủ khi không dùng, tự thức khi có task, chi phí gần bằng 0 khi idle

### Nhược Điểm

- **Phức tạp hơn OpenClaw** — nhiều lớp memory, nhiều cơ chế tự động, cần thờI gian hiểu
- **Không phảI "plug and play"** — cần cấu hình user.md, memory.md trước khi dùng hiệu quả
- **Không có multi-agent orchestration mạnh** — tập trung vào single-agent tự cải thiện
- **Serverless cần setup** — Modal/Daytona tiết kiệm nhưng cần cấu hình riêng
- **Cộng đồng nhỏ hơn OpenClaw** — 46K-140K sao (con số khác nhau theo thờI điểm), ít tài liệu hơn

---

## 4. Cách Nuôi Dạy — Phương Pháp và Lưu Ý

### Phương Pháp

Hermes **tự học**, nhưng bạn cần "khởi động" đúng cách để vòng lặp tự cải thiện hoạt động:

**1. Onboarding (10 phút)**

Nói tên, mục tiêu, cấu trúc team, dự án đang làm. Hermes tự ghi vào `user.md` và `memory.md`. Đây là bước bắt buộc — mọI phiên sau đều dựa trên thông tin này.

**2. Để agent tự làm, rồI sửa**

- Giao task phức tạp, để agent tự tìm cách
- Khi agent làm sai → sửa và nói rõ "đừng làm vậy nữa"
- Khi agent làm đúng → khen và bảo "ghi lạI cách này"
- Agent tự đánh giá: ≥5 tool calls, hoặc sửa lỗI, hoặc workflow không rõ ràng → tự tạo skill

**3. Kiểm tra memory định kỳ**

- Đọc `memory.md` và `user.md` hàng tuần
- Xóa context cũ không còn áp dụng — memory cũ gây lỗI như memory thiếu
- Nói "chuck that in memory" hoặc "đừng bao giờ làm vậy nữa, ghi vào user.md"

**4. Kết nốI GitHub ngay từ đầu**

- Setup cron: "mỗI đêm 12h push thay đổI lên GitHub"
- Một câu tạo ra skill + cron job + backup an toàn
- MọI thay đổI memory và skill đều được lưu lịch sử

**5. Quan sát và feedback**

- Khi agent gọI skill → để ý skill nào
- Khi agent không gọI skill lẽ ra phảI gọI → bảo cập nhật YAML front matter
- **Tích cực = compound** — sửa càng nhiều, agent càng tốt. Thụ động = cải thiện chậm

### Điểm Cần Lưu Ý

| Lưu ý | Lý do |
|-------|-------|
| **Active feedback** | "Automatic does not mean magic" — phảI chủ động sửa, chỉ định lưu memory |
| **Stale memory** | Nguyên nhân số 1 gây lỗI agent — xóa context cũ định kỳ |
| **Scope API keys** | MỗI agent dùng key riêng, không dùng key cá nhân — như giao cho nhân viên mớI |
| **Bắt đầu onboarding** | Không bỏ qua bước này — mọI phiên sau phụ thuộc user.md và memory.md |
| **Không passive** | NgồI chờ agent tự tốt là sai lầm — phảI tương tác và sửa liên tục |

### Những Gì Cần Chuẩn Bị

- VPS $5/tháng hoặc máy cá nhân (Mac, Linux, WSL2)
- API key LLM (OpenRouter, OpenAI, hoặc local qua Ollama)
- Tài khoản messaging (Telegram Bot recommended)
- ThờI gian 2-3 tuần để onboarding + vòng lặp tự cải thiện bắt đầu chạy

---

## 5. Tương Tác VớI Hệ Thống Collab

### Chiều 1: Nhận Task Từ Platform

Platform gửI task đến Hermes qua **webhook** hoặc **WebSocket**. Gateway nhận → agent loop xử lý.

### Chiều 2: GửI Kết Quả Về Platform

Agent hoàn thành → gọI API platform để cập nhật trạng tháI, đính kèm output.

### Các Cách Kết NốI

| Cách | Độ phức tạp | Phù hợp |
|------|------------|---------|
| **Webhook** | Thấp | Platform gửI task → Hermes xử lý |
| **WebSocket / RPC** | Trung bình | Real-time 2 chiều |
| **MCP Server** | Trung bình | Hermes gọI tools của platform |
| **Polling API** | Thấp | Đơn giản nhưng chậm hơn |
| **Plugin hooks** | Cao | Tùy biến logic tại pre/post LLM call, session start/end |

### Điểm Đặc Biệt Khi Tích Hợp Collab

- **Session routing** — cuộc trò chuyện bắt đầu trên Telegram có thể tiếp tục trên CLI, vì session gắn với ID không phảI platform
- **Cron ticking** — automation chạy theo lịch và gửI kết quả về đúng platform đã chỉ định
- **Plugin hooks** — 4 điểm chèn logic tùy chỉnh: `pre_llm_call`, `post_llm_call`, `on_session_start`, `on_session_end`

---

## 6. Kết Luận

**Hermes phù hợp cho Phase 1 Nuôi Dạy:**

- **Tự học thực sự** — giảm gánh nặng ngườI dùng phảI viết skill thủ công
- **Memory thông minh** — 4 lớp phân biệt, không tăng chi phí theo thờI gian
- **Progressive disclosure** — chạy nhẹ dù có nhiều skill
- **Zero telemetry** — bảo mật tốt, dữ liệu thuộc về bạn

**So sánh nhanh vớI OpenClaw:**

| Tiêu chí | Hermes | OpenClaw |
|----------|--------|----------|
| Tự học | **Có** — tự tạo skill | Không — phảI tự viết |
| Memory | 4 lớp, cache-aware | File text đơn giản |
| Setup | Phức tạp hơn | Đơn giản hơn |
| Cộng đồng | Nhỏ hơn | **Lớn hơn** |
| Serverless | Modal/Daytona | Không có |
| Reliability | Test kỹ trước khi ship | Phụ thuộc cộng đồng |

**Phán quyết:** Chọn Hermes nếu bạn muốn agent **tự học** và giảm thờI gian can thiệp thủ công. Chọn OpenClaw nếu bạn muốn **kiểm soát tuyệt đốI** những gì agent biết. Cả hai đều khả thI cho Phase 1.

---

## Tài Liệu Tham Khảo

1. [Hermes Agent GitHub](https://github.com/nousresearch/hermes-agent)
2. [Turing Post — Hermes Agent vs OpenClaw](https://www.turingpost.com/p/hermes)
3. [NVIDIA Blog — Hermes Self-Improving AI](https://blogs.nvidia.com/blog/rtx-ai-garage-hermes-agent-dgx-spark/)
4. [MindStudio — 5 Pillar Architecture](https://www.mindstudio.ai/blog/hermes-agent-5-pillar-architecture-memory-skills-soul-crons)
5. [Daily AI Insights — Inside Hermes Agent](https://mranand.substack.com/p/inside-hermes-agent-how-a-self-improving)
6. [Tosea AI — How to Use Hermes Agent](https://tosea.ai/blog/hermes-agent-self-improving-ai-guide)
