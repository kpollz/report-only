# Website Redesign 2026 — Đặc Tả Kỹ Thuật

**Ngày:** 06/07/2026
**Người soạn:** Team Engineering

---

## Luồng xác thực người dùng

Mô tả bằng **mermaid sequence diagram** — kiểm tra khả năng render sơ đồ tuần tự:

```mermaid
sequenceDiagram
    participant U as Người dùng
    participant F as Frontend
    participant A as API Gateway
    participant DB as PostgreSQL
    U->>F: Nhập email + mật khẩu
    F->>A: POST /login
    A->>DB: Kiểm tra credential
    DB-->>A: OK + user_id
    A-->>F: JWT token
    F-->>U: Chuyển vào Dashboard
    Note over F,A: Token hết hạn sau 24h
```

---

## Ngăn xếp công nghệ

| Lớp | Công nghệ | Lý do |
|---|---|---|
| Frontend | React 19 + Docusaurus | SSG nhanh, SEO tốt |
| API | FastAPI (Python) | Async, dễ tích hợp |
| DB | PostgreSQL 16 | Ổn định, JSONB |
| Storage | MinIO (S3-compatible) | Lưu ảnh & assets |
| CI/CD | GitHub Actions → Pages | Tự động deploy |

---

## Kích thước ảnh chuẩn hóa

Để đảm bảo bố cục nhất quán, ảnh chèn trong report tuân theo quy ước:

<div class="report-row">

![Kiến trúc](./images/sys-architecture.svg)
![Mockup](./images/ui-mockup.svg)

</div>

> Hai ảnh trên đặt **cạnh nhau**, mỗi ảnh chiếm ~48% chiều rộng — minh họa bố cục
> nhiều ảnh trên một hàng.

---

## Sơ đồ trạng thái triển khai

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Review: Submit PR
    Review --> Draft: Request changes
    Review --> Merged: Approve
    Merged --> Deployed: CI build pass
    Deployed --> [*]
```
