# Data Pipeline Migration — Phase 1: Đánh Giá Hiện Trạng

**Ngày:** 20/06/2026
**Phạm vi:** Khảo sát pipeline ETL hiện tại trước khi di trú lên nền tảng mới

---

## Mục tiêu Phase 1

Đánh giá pipeline hiện tại, đo hiệu năng từng bước và xác định điểm nghẽn (bottleneck).

## Kết quả benchmark

<div class="report-img" style="max-width:600px">

![Thời gian xử lý theo giai đoạn](./images/perf-chart.svg)

*Hình 1 — Bước **Ingest (79s)** là điểm nghẽn lớn nhất*

</div>

## Timeline khảo sát

```mermaid
gantt
    title Kế hoạch Phase 1 - Đánh giá
    dateFormat  YYYY-MM-DD
    section Khảo sát
    Thu thập metrics      :done,    a1, 2026-06-01, 5d
    Phỏng vấn team         :done,    a2, 2026-06-06, 3d
    section Phân tích
    Xác định bottleneck    :active,  b1, 2026-06-10, 4d
    Đề xuất phương án      :         b2, 2026-06-14, 3d
```

## Phân bố nguyên nhân chậm

```mermaid
pie showData
    title Nguyên nhân gây chậm pipeline
    "I/O đọc file thô" : 45
    "Thiếu index DB" : 25
    "Transform tuần tự" : 20
    "Network" : 10
```

---

## Kết luận

Pipeline hiện tại xử lý tuần tự, chưa song song hóa bước Ingest. Đề xuất chuyển sang
kiến trúc message-queue ở **[Phase 2](../phase-2-execution/report.md)**.
