# Hướng dẫn: chạy local & deploy sang repo thật

Website này (Docusaurus) đọc **thẳng** các thư mục report ở gốc repo — không copy,
không transform. Mỗi folder gốc = 1 dự án; folder con lồng bao nhiêu tầng cũng
thành sidebar tự động. Ảnh nằm cạnh file `.md`. Mermaid dùng code fence.

Đã kiểm chứng trên bản build thật: nesting nhiều tầng ✅, ảnh (bundle PNG + inline
SVG) ✅, ảnh căn giữa/resize/cạnh nhau ✅, mermaid (flowchart/sequence/gantt/pie/
ER/state/quadrant) ✅, `<details>`, bảng, dark mode ✅.

---

## 1. Chạy thử ở máy local

```bash
cd website
npm install          # cài dependencies (chỉ lần đầu)
npm start            # mở http://localhost:3000, tự reload khi sửa report
```

Build production + xem thử y hệt lúc deploy:

```bash
npm run build        # xuất ra website/build
npm run serve        # phục vụ bản build tại http://localhost:3000
```

---

## 2. Những file CẦN COPY sang repo thật

Repo thật của bạn đã có sẵn các folder report ở gốc (format y hệt repo mock này).
Bạn chỉ cần bổ sung **phần website + workflow**. Copy đúng các mục sau:

```
website/
├── package.json            ← khai báo dependencies (đã gồm mermaid + elk)
├── package-lock.json       ← BẮT BUỘC copy (CI dùng `npm ci`)
├── docusaurus.config.js    ← cấu hình chính (đọc report ở ../, bật mermaid)
├── sidebars.js             ← sidebar tự sinh từ cây folder
├── .gitignore              ← bỏ qua node_modules/, build/
├── SETUP.md                ← file hướng dẫn này (tùy chọn)
└── src/
    └── css/
        └── custom.css      ← theme + CSS cho .report-img / .report-row

.github/
└── workflows/
    └── deploy.yml          ← GitHub Action build + deploy lên Pages
```

**KHÔNG copy:** `website/node_modules/` và `website/build/` — hai thư mục này tự
sinh lại (`npm install` / `npm run build`), đã nằm trong `.gitignore`.

Lệnh gợi ý (chạy từ gốc repo mock, thay `ĐƯỜNG_DẪN_REPO_THẬT`):

```bash
# copy thư mục website (trừ node_modules & build)
rsync -av --exclude node_modules --exclude build \
  website/ ĐƯỜNG_DẪN_REPO_THẬT/website/

# copy workflow
mkdir -p ĐƯỜNG_DẪN_REPO_THẬT/.github/workflows
cp .github/workflows/deploy.yml ĐƯỜNG_DẪN_REPO_THẬT/.github/workflows/
```

> Các folder report mock (`Website Redesign 2026/`, `Security Audit/`, ...) **KHÔNG
> cần copy** — chúng chỉ là dữ liệu test. Repo thật đã có report của bạn rồi.

---

## 3. Deploy lên GitHub Pages

1. Copy file như mục 2, rồi commit & push lên nhánh `main`.
2. Trên GitHub: **Settings → Pages → Build and deployment → Source = "GitHub
   Actions"** (chỉ làm 1 lần).
3. Xong. Mỗi lần push `main`, Action tự build và publish. URL có dạng:
   `https://<tên-user-hoặc-org>.github.io/<tên-repo>/`

`url` và `baseUrl` được workflow tự suy ra từ tên repo (xem `deploy.yml`), nên
**không cần sửa** `docusaurus.config.js` khi mang sang repo khác.

> Nếu dùng **custom domain** hoặc **user/org page** (`<org>.github.io` — repo tên
> đúng dạng đó), đặt `BASE_URL: /` trong `deploy.yml`.

---

## 4. Tùy chỉnh (tùy chọn)

| Muốn đổi | Sửa ở đâu |
|---|---|
| Tên site, tagline | `docusaurus.config.js` → `title`, `tagline` |
| Màu chủ đạo | `src/css/custom.css` → biến `--ifm-color-primary-*` |
| Kích thước ảnh mặc định | `src/css/custom.css` → `.report-img`, `.report-row` |
| Thêm công thức toán ($...$) | cài `remark-math` + `rehype-katex`, thêm vào `docs` |

---

## 5. Lưu ý khi mang sang repo thật

- **File `.md` khác ở gốc repo cũng thành trang.** Website coi mọi `.md` dưới gốc
  (trừ `website/`, `node_modules/`) là report. Nếu repo thật có `CONTRIBUTING.md`,
  `CHANGELOG.md`... mà bạn không muốn hiển thị, thêm chúng vào mảng `exclude`
  trong `docusaurus.config.js`.
- **Ảnh phải dùng cú pháp `![]()`**, không dùng thẻ `<img src="./...">` thô (xem
  README ở gốc). Nếu report cũ đang dùng `<img>` relative, đổi sang pattern
  `<div class="report-img">` + `![]()`.
- **Ký tự `<`, `{`, `<script>` trong văn xuôi** không làm vỡ build (đã cấu hình
  `markdown.format: 'detect'` = CommonMark).
- **Link hỏng / ảnh thiếu** chỉ cảnh báo (`warn`), không làm fail build. Muốn chặt
  chẽ hơn, đổi `onBrokenLinks` sang `'throw'` trong config.
