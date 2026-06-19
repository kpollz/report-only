# Nghiên Cứu: OpenClaw

**Mục đích:** Đánh giá OpenClaw cho Phase 1 (Nuôi dạy Agent)  
**Ngày:** 18/06/2026

---

## 1. OpenClaw Là Gì?

OpenClaw là trợ lý AI cá nhân, mã nguồn mở, chạy trên máy tính của bạn. Bạn nhắn tin với nó qua Telegram, Slack, WhatsApp, Discord... và nó sẽ thực hiện công việc — đọc file, chạy code, duyệt web, gửi email, lên lịch họp.

Tóm lại: **Một "nhân viên ảo" sống trong máy tính, làm việc qua chat.**

---

## 2. Triết Lý và Câu Chuyện Ra ĐờI

### Khoảnh Khắc Khai Sáng — Giọng NóI Ở Marrakesh

Peter Steinberger bắt đầu bằng một prototype cực kỳ đơn giản: kết nốI WhatsApp với Claude Code CLI. Gửi tin nhắn text từ điện thoại, AI nhận lệnh, chạy trên máy tính, trả kết quả về điện thoại. prototype mất đúng **1 giờ** để viết.

Cú "khai sáng" đến trong một chuyến đi **Marrakesh**. Steinberger thử gửi một **tin nhắn thoại (voice message)** qua WhatsApp cho AI. Ông không kỳ vọng gì vì chưa hề lập trình tính năng xử lý âm thanh.

Kết quả khiến ông sửng sốt. Con AI trên máy tính của ông đã **tự động** thực hiện chuỗi hành động sau:

1. **Nhận diện file âm thanh không đuôI** — tự đọc header để nhận dạng định dạng
2. **Tự gọI FFmpeg** để convert file sang định dạng phù hợp
3. **Tự mò vào file cấu hình** tìm OpenAI API key, dùng curl gửI file sang API Whisper
4. **Chuyển giọng nói thành văn bản** và gửI ngược lạI WhatsApp

Steinberger **chưa từng dạy hay lập trình** quy trình này. LLM tự suy luận logic từ môi trường thực thi có sẵn.

> *"I was annoyed that [an autonomous AI agent] didn't exist, so I just prompted it into existence."* — Peter Steinberger, Lex Fridman Podcast

### Triết Lý Từ Khoảnh Khắc Đó

Từ trải nghiệm ở Marrakesh, Steinberger định hình triết lý rõ ràng:

**LLM không thiếu trí tuệ, chúng thiếu "tay chân"**

Định kiến lúc bấy giờ: AI chỉ biết chat (Chatbot wrappers). Steinberger nhận ra AI cần không phảI thêm dữ liệu, mà là **môi trường thực thi** — quyền đọc/ghi file, chạy terminal, gọI công cụ hệ thống.

**Agentic OS — không phảI Chatbot**

OpenClaw không phảI phần mềm chatbot. Nó là **hệ điều hành thu nhỏ** cho AI: quản lý bộ nhớ, phiên làm việc, môi trường cô lập (sandbox) để AI tự do "thử và sai" với dòng lệnh.

**No MCPs, No Plan Mode**

Steinberger cực kỳ ghét bắt AI lập kế hoạch quá phức tạp trước khi làm. Triết lý OpenClaw: **cứ để AI tương tác trực tiếp với CLI**, lỗI thì tự đọc menu help để sửa sai và đi tiếp. Không plan mode, không orchestration phức tạp.

**The Mother Test**

Giao diện tương tác phải ở nơi ngườI dùng phổ thông hay ở nhất: WhatsApp, iMessage, Telegram. Nếu một ngườI mẹ nhắn tin nhờ AI đặt vé máy bay mà không cần biết code — đó mới là thành công.

### Lịch Sử

| ThờI điểm | Sự kiện |
|-----------|---------|
| **11/2025** | Phát hành **Warelay** (WhatsApp Relay) — prototype 1 giờ |
| **CuốI 11/2025** | Đổi tên **Clawd** → Anthropic gửI cease-and-desist |
| **27/01/2026** | Đổi tên **Moltbot** |
| **30/01/2026** | Đổi tên **OpenClaw** — Steinberger gọI Sam Altman xin phép dùng chữ "Open" |
| **02/2026** | 247.000 sao GitHub, 2 triệu lượt truy cập/tuần |
| **14/02/2026** | Steinberger gia nhập OpenAI, dự án chuyển sang Foundation |

---

## 3. Tính Năng, Ưu và Nhược Điểm

### Tính Năng Chính

| Tính năng | Mô tả |
|-----------|-------|
| **24 kênh messaging** | WhatsApp, Telegram, Slack, Discord, Signal, iMessage, WeChat... |
| **Execution environment** | AI có quyền đọc/ghi file, chạy terminal, gọI công cụ hệ thống |
| **Self-modifying** | Agent tự đọc, tự sửa code của chính mình |
| **Skill ecosystem** | 13.700+ skills, cài 1 lệnh, dễ tự tạo |
| **Memory dạng file** | SOUL.md (tính cách), MEMORY.md (trí nhớ) — file text thuần |
| **Sandbox** | Chạy code trong Docker, cách ly hệ thống |
| **Heartbeat** | Tự động "thức dậy" theo chu kỳ kiểm tra việc cần làm |
| **Webhook** | Nhận tín hiệu từ hệ thống bên ngoàI |

### Ưu Điểm

- **Môi trường thực thi thực sự** — AI không chỉ chat, mà có "tay chân" làm việc
- **Mã nguồn mở** — không bị khóa vào nhà cung cấp
- **Chạy local** — dữ liệu ở máy bạn
- **Self-modifying** — agent tự cải tiến code của mình
- **Dễ tích hợp** — webhook, MCP, API đều có sẵn

### Nhược Điểm

- **Không tự học** — khác Hermes, phảI tự viết skill, tự cập nhật memory
- **Yêu cầu kỹ thuật** — cần biết cài VPS, cấu hình
- **Bảo mật** — nhiều instance chạy không auth, cần cấu hình cẩn thận
- **Chi phí VPS** — ~$5-20/tháng để chạy 24/7

---

## 4. Cách Nuôi Dạy — Phương Pháp và Lưu Ý

### Phương Pháp

**1. Định nghĩa tính cách (SOUL.md)**

Viết file mô tả phong cách làm việc: ngắn gọn hay chi tiết, chủ động hay chờ hỏi, ưu tiên tool nào. Càng cụ thể, agent càng "giống" bạn.

**2. Dạy qua skill**

MỗI task lặp lạI → viết thành skill (2 file: cấu hình + hướng dẫn). Cài skill có sẵn từ ClawHub nếu phù hợp.

Nguyên tắc: **Code trước, conversation sau** — viết script cho việc cần độ tin cậy cao.

**3. Dạy qua memory**

Thông tin quan trọng → ghi vào MEMORY.md. Agent đọc memory mỗI phiên. Sửa memory khi agent hiểu sai — như sửa nhân viên mớI.

**4. Dạy bằng cách dùng**

Chat thường xuyên, agent học từ ngữ cảnh. Sửa khi sai, khen khi đúng — tương tác liên tục.

### Điểm Cần Lưu Ý

| Lưu ý | Lý do |
|-------|-------|
| **Kiểm soát memory** | Agent có thể quên nếu không ghi xuống file — commit định kỳ |
| **Phân quyền rõ ràng** | Đừng cho agent quyền xóa dữ liệu ngay từ đầu — test kỹ trước |
| **Dùng sandbox** | Code chạy trong Docker, không ảnh hưởng máy host |
| **Bắt đầu đơn giản** | Một skill, một tool — chạy ổn rồI mớI mở rộng |
| **Review định kỳ** | Đọc lạI SOUL.md và MEMORY.md, tinh chỉnh liên tục |

### Những Gì Cần Chuẩn Bị

- VPS/cloud instance chạy 24/7
- API key LLM (OpenAI, Anthropic, hoặc local model)
- Tài khoản messaging (Telegram Bot, Slack App...) để giao tiếp
- ThờI gian 1-2 tuần để cấu hình và dạy skill đầu tiên

---

## 5. Tương Tác VớI Hệ Thống Collab

### Chiều 1: Nhận Task Từ Platform

Platform gửI task đến OpenClaw qua **webhook** hoặc **WebSocket**. OpenClaw nhận → đánh thức agent → agent xử lý.

### Chiều 2: GửI Kết Quả Về Platform

Agent hoàn thành → gọI API của platform để cập nhật trạng tháI task, đính kèm output, đánh dấu "chờ review".

### Các Cách Kết NốI

| Cách | Độ phức tạp | Phù hợp |
|------|------------|---------|
| **Webhook** | Thấp | Platform gửI task → OpenClaw xử lý |
| **WebSocket / RPC** | Trung bình | Real-time 2 chiều |
| **MCP Server** | Trung bình | OpenClaw gọI tools của platform |
| **Polling API** | Thấp | Đơn giản nhưng chậm hơn |

---

## 6. Kết Luận

**OpenClaw phù hợp cho Phase 1 Nuôi Dạy:**

- Triết lý "AI cần tay chân" hoàn toàn phù hợp vớI bài toán — agent không chỉ chat mà phảI làm việc thực sự
- Self-modifying: agent tự cải tiến khi có môi trường thực thi
- Dễ tích hợp Phase 2 qua webhook/MCP

**Nhưng cần nhớ:**

- OpenClaw **không tự học** — bạn phảI chủ động dạy qua skill và memory
- Cần kỹ năng cơ bản về VPS, API
- Bảo mật cần cấu hình cẩn thận

**Phán quyết:** Đáng thử. Bắt đầu vớI một agent cho một role, chạy 2-3 tuần, đo hiệu quả, rồI quyết định mở rộng.

---

## Tài Liệu Tham Khảo

1. [Lex Fridman Podcast — Peter Steinberger](https://www.youtube.com/watch?v=YFjfBk8HI5o)
2. [joelclaw.com — OpenClaw Peter Steinberger Lex Fridman](https://joelclaw.com/openclaw-peter-steinberger-lex-fridman)
3. [GitHub — Explain OpenClaw: Lex Fridman Interview](https://github.com/centminmod/explain-openclaw/blob/master/09-social-media-coverage/lex-fridman-interview.md)
4. [Wikipedia — OpenClaw](https://en.wikipedia.org/wiki/OpenClaw)
5. [Reddit — OpenClaw Creator: Software Development is Now Like...](https://www.reddit.com/r/theprimeagen/comments/1sointq/openclaw_creator_software_development_is_now_like/)
6. [Paolo's Substack — OpenClaw System Architecture Overview](https://ppaolo.substack.com/p/openclaw-system-architecture-overview)
7. [AI Maker — OpenClaw Review Setup Guide](https://aimaker.substack.com/p/openclaw-review-setup-guide)
8. [Reddit — Everyone Talks About Clawdbot OpenClaw But Heres...](https://www.reddit.com/r/ChatGPT/comments/1qtl529/everyone_talks_about_clawdbot_openclaw_but_heres/)
9. [Startup Stash — Software 3.0: 9 Lessons From Peter Steinberger](https://blog.startupstash.com/software-3-0-9-lessons-from-peter-steinbergers-openclaw-revolution-even-if-you-can-t-code-c345868c2edf)
10. [WebSearchAPI — OpenClaw State of the Claw](https://websearchapi.ai/blog/openclaw-state-of-the-claw-peter-steinberger)
11. [Fast Company — How Peter Steinberger Built OpenClaw](https://www.fastcompany.com/91550800/how-peter-steinberger-built-openclaw)
12. [YouTube — Peter Steinberger Interview](https://www.youtube.com/watch?v=AcwK1Uuwc0U)
13. [YouTube — OpenClaw Growth](https://www.youtube.com/watch?v=zgNvts_2TUE)
14. [YouTube — OpenClaw Case Studies](https://www.youtube.com/watch?v=9jgcT0Fqt7U&t=833)
