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
Bạn chỉ cần bổ sung **phần website + workflow + trang chủ**. Copy đúng các mục sau:

```
index.mdx                   ← TRANG CHỦ ở GỐC repo (slug '/'): tự liệt kê mọi báo cáo

website/
├── package.json            ← khai báo dependencies (đã gồm mermaid + elk)
├── package-lock.json       ← BẮT BUỘC copy (CI dùng `npm ci`)
├── docusaurus.config.js    ← cấu hình chính (đọc report ở ../, bật mermaid, brand "Report")
├── sidebars.js             ← sidebar tự sinh từ cây folder
├── .gitignore              ← bỏ qua node_modules/, build/
├── SETUP.md                ← file hướng dẫn này (tùy chọn)
└── src/
    ├── components/
    │   └── ReportTree.js   ← component vẽ cây báo cáo cho trang chủ (đọc thẳng sidebar)
    └── css/
        └── custom.css      ← theme + CSS cho .report-img / .report-row / .report-tree

.github/
└── workflows/
    └── deploy.yml          ← GitHub Action build + deploy lên Pages
```

**KHÔNG copy:** `website/node_modules/` và `website/build/` — hai thư mục này tự
sinh lại (`npm install` / `npm run build`), đã nằm trong `.gitignore`.

> **Trang chủ (`index.mdx`)** là cái tự sinh danh sách báo cáo (mở/thu gọn giống
> sidebar). Nó có `slug: /` nên chiếm route trang chủ. **Nếu repo thật của bạn có
> `README.md` ở gốc**, nó cũng mặc định là trang `/` → **trùng route**. Xử lý: đã
> thêm `'README.md'` vào mảng `exclude` trong `docusaurus.config.js` để README chỉ
> làm landing page trên GitHub, không vào site. (Repo bạn không có README thì bỏ
> qua, vô hại.)

Lệnh gợi ý (chạy từ gốc repo mock, thay `ĐƯỜNG_DẪN_REPO_THẬT`):

```bash
# copy thư mục website (trừ node_modules & build)
rsync -av --exclude node_modules --exclude build \
  website/ ĐƯỜNG_DẪN_REPO_THẬT/website/

# copy TRANG CHỦ (index.mdx ở gốc repo)
cp index.mdx ĐƯỜNG_DẪN_REPO_THẬT/index.mdx

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

### GitHub Enterprise Server (GHES)

`SITE_URL`/`BASE_URL` **phải khớp đúng URL mà GHES phục vụ**, nếu lệch thì
Docusaurus render trang "Page Not Found" của chính nó (không phải 404 server).
GHES có 2 quy ước URL tùy cấu hình *subdomain isolation* — **đừng trộn lẫn**:

| Subdomain isolation | URL phục vụ | `SITE_URL` | `BASE_URL` |
|---|---|---|---|
| **BẬT** (host có tiền tố `pages.`) | `https://pages.<HOST>/<owner>/<repo>/` | `https://pages.<HOST>` | `/<owner>/<repo>/` |
| **TẮT** | `https://<HOST>/pages/<owner>/<repo>/` | `https://<HOST>` | `/pages/<owner>/<repo>/` |

Cách nhận biết: nhìn URL thật đang mở được. Có tiền tố `pages.` ở host = BẬT
(khi đó path **không** có `/pages/`). Không có `pages.` ở host mà path bắt đầu
bằng `/pages/` = TẮT.

Ví dụ (isolation BẬT, `pages.github.sec.samsung.net/dtung-vu/report-only/`):

```yaml
      - name: Build website
        working-directory: website
        env:
          SITE_URL: https://pages.github.sec.samsung.net
          BASE_URL: /${{ github.repository_owner }}/${{ github.event.repository.name }}/
          GH_ORG: ${{ github.repository_owner }}
          GH_REPO: ${{ github.event.repository.name }}
        run: npm run build
```

> `baseUrl` bị **bake lúc build** → mỗi lần đổi phải chạy lại workflow và
> hard-refresh trình duyệt. Kiểm tra nhanh: mở `website/build/index.html`, các
> `src=`/`href=` phải bắt đầu bằng đúng `BASE_URL`.

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
