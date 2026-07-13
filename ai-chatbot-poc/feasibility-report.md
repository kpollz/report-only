# AI Chatbot POC — Báo Cáo Khả Thi

**Ngày:** 08/07/2026
**Người nhận:** Ban Lãnh Đạo
**Kết luận nhanh:** 🟢 Khả thi, đề xuất triển khai thí điểm

---

## Bối cảnh

Đánh giá tính khả thi của chatbot hỗ trợ khách hàng dựa trên LLM, thay thế 60% câu
hỏi lặp lại cho team CSKH.

## Định vị phương án

Đánh giá 4 phương án theo trục **Chi phí** và **Chất lượng** (mermaid quadrant):

```mermaid
quadrantChart
    title Định vị các phương án chatbot
    x-axis "Chi phí thấp" --> "Chi phí cao"
    y-axis "Chất lượng thấp" --> "Chất lượng cao"
    quadrant-1 "Nên chọn"
    quadrant-2 "Cân nhắc"
    quadrant-3 "Loại bỏ"
    quadrant-4 "Đắt đỏ"
    "Rule-based": [0.2, 0.25]
    "Fine-tune nội bộ": [0.75, 0.7]
    "RAG + API": [0.4, 0.85]
    "Thuê ngoài": [0.85, 0.55]
```

## Hiệu năng dự kiến

<div class="report-img" style="max-width:560px">

![Benchmark thời gian phản hồi](./images/perf-chart.svg)

</div>

## Bảng đánh giá

| Tiêu chí | RAG + API | Fine-tune | Rule-based |
|---|---|---|---|
| Độ chính xác | Cao | Cao | Thấp |
| Chi phí khởi tạo | Trung bình | Cao | Thấp |
| Thời gian triển khai | 3 tuần | 8 tuần | 2 tuần |
| Bảo trì | Dễ | Khó | Dễ |

> ✅ **Đề xuất:** Chọn phương án **RAG + API** — cân bằng tốt giữa chất lượng và chi
> phí. Chi tiết benchmark xem tại [Phụ lục](./appendix/benchmark-details.md).
