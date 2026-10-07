# HÀNH TRÌNH KHÁM PHÁ ĐÀ LẠT (DALAT JOURNEY)

> **"Đi để cảm nhận. Đến để lưu giữ những khoảnh khắc."**

Ứng dụng web hoàn chỉnh phục vụ bài thi/đánh giá sản phẩm công nghệ: **HÀNH TRÌNH KHÁM PHÁ ĐÀ LẠT (DALAT JOURNEY)**. Đây là một công cụ cá nhân thực tế giúp người dùng lên kế hoạch, quản lý lịch trình chi tiết, kiểm soát ngân sách chi phí, lưu địa điểm yêu thích và theo dõi checklist chuẩn bị hành lý khi du lịch Đà Lạt.

---

## 1. CÔNG NGHỆ SỬ DỤNG

### Frontend:
- **React 18** (Functional Components, Hooks, Context API)
- **TypeScript** (Kiểu dữ liệu nghiêm ngặt, an toàn mã nguồn)
- **Vite** (Build tool hiện đại, tốc độ cao)
- **Tailwind CSS** (Thiết kế responsive mobile-first, bảng màu thiên nhiên Đà Lạt: Pine Green `#1B4332`, Sương mù, Kem ấm, Nâu đất)
- **Lucide React** (Bộ icon vector trực quan, thanh lịch)
- **Google Fonts** (Font *Be Vietnam Pro* hiển thị tiếng Việt sắc nét)

### Backend & Cơ sở dữ liệu THẬT (Dual-Engine Architecture):
1. **Cloud Mode - Supabase (PostgreSQL)**:
   - Tích hợp qua thư viện chính thức `@supabase/supabase-js`.
   - Cung cấp file SQL Schema `supabase/schema.sql` và dữ liệu mẫu `supabase/seed.sql` với RLS và ràng buộc khóa ngoại `ON DELETE CASCADE`.
2. **Local Mode - Real SQLite Database (WebAssembly / Disk Persistence)**:
   - Sử dụng database file SQLite thật tại `data/dalat_journey.sqlite`.
   - Kết nối qua REST API tích hợp trong Vite middleware và standalone server (`server/server.js`).
   - Đảm bảo đọc/ghi SQL thật 100%, dữ liệu không bị mất sau khi reload hoặc khởi động lại ứng dụng.
   - **Tuyệt đối không dùng localStorage làm cơ sở dữ liệu chính**.

---

## 2. CẤU TRÚC THƯ MỤC DỰ ÁN

```
c:\Dalat Journey\
├── data/
│   └── dalat_journey.sqlite        # File database SQLite thật được lưu trên đĩa cứng
├── server/
│   ├── db.js                       # Module khởi tạo SQL và lưu trữ SQLite
│   ├── apiRouter.js                # Bộ định tuyến RESTful API xử lý CRUD database
│   └── server.js                   # Server Node.js độc lập phục vụ cả API và frontend
├── supabase/
│   ├── schema.sql                  # Cấu trúc bảng PostgreSQL / Supabase
│   └── seed.sql                    # Dữ liệu mẫu khởi tạo cho Supabase
├── src/
│   ├── components/
│   │   ├── trip-detail/
│   │   │   ├── OverviewTab.tsx     # Tab Tổng quan Dashboard chuyến đi
│   │   │   ├── ItineraryTab.tsx    # Tab Lịch trình theo ngày
│   │   │   ├── ExpensesTab.tsx     # Tab Quản lý chi phí & ngân sách
│   │   │   ├── PlacesTab.tsx       # Tab Gợi ý địa điểm Đà Lạt cho chuyến đi
│   │   │   └── ChecklistTab.tsx    # Tab Checklist chuẩn bị hành lý
│   │   ├── Navbar.tsx              # Thanh điều hướng trên Desktop & Header
│   │   ├── BottomNav.tsx           # Thanh điều hướng Bottom Bar cho Mobile
│   │   ├── Footer.tsx              # Chân trang
│   │   ├── Modal.tsx               # Hộp thoại Modal tái sử dụng
│   │   ├── ConfirmModal.tsx        # Hộp thoại xác nhận xóa
│   │   └── TripFormModal.tsx       # Form tạo và chỉnh sửa chuyến đi
│   ├── context/
│   │   ├── NavigationContext.tsx   # Quản lý điều hướng Route SPA không lỗi 404
│   │   └── ToastContext.tsx        # Hệ thống thông báo trạng thái
│   ├── data/
│   │   └── dalatSeedPlaces.ts      # Dữ liệu mẫu 10 địa điểm Đà Lạt
│   ├── lib/
│   │   ├── supabaseClient.ts       # Kết nối Supabase Cloud Client
│   │   └── utils.ts                # Tiện ích định dạng tiền tệ VNĐ và ngày tháng
│   ├── pages/
│   │   ├── HomePage.tsx            # Trang chủ với Hero, Chuyến đi gần đây, Địa điểm nổi bật
│   │   ├── TripsPage.tsx           # Trang danh sách Chuyến đi của tôi
│   │   ├── TripDetailPage.tsx      # Dashboard chi tiết chuyến đi (5 Tabs)
│   │   ├── ExplorePage.tsx         # Trang Khám phá 10 địa điểm Đà Lạt
│   │   └── FavoritesPage.tsx       # Trang Danh sách địa điểm yêu thích
│   ├── services/
│   │   ├── tripsService.ts         # Service CRUD chuyến đi
│   │   ├── itinerariesService.ts   # Service CRUD lịch trình
│   │   ├── expensesService.ts      # Service CRUD chi phí
│   │   ├── placesService.ts        # Service Địa điểm & Yêu thích
│   │   └── checklistsService.ts    # Service CRUD checklist
│   ├── types/
│   │   └── database.ts             # Kiểu dữ liệu TypeScript chuẩn
│   ├── App.tsx                     # Component gốc
│   ├── index.css                   # Tailwind CSS và phong cách giao diện
│   ├── main.tsx                    # Điểm khởi động ứng dụng React
│   └── vite-env.d.ts               # Khai báo môi trường TypeScript
├── .env                            # File biến môi trường hiện tại
├── .env.example                    # File mẫu hướng dẫn cấu hình biến môi trường
├── index.html                      # HTML gốc tối ưu SEO và mobile-first
├── package.json                    # Cấu hình dự án và dependencies
├── tailwind.config.js              # Cấu hình theme màu Đà Lạt
├── tsconfig.json                   # Cấu hình TypeScript
└── vite.config.ts                  # Cấu hình Vite tích hợp API database plugin
```

---

## 3. DATABASE SCHEMA (CƠ SỞ DỮ LIỆU THẬT)

Ứng dụng sử dụng mô hình cơ sở dữ liệu quan hệ gồm 6 bảng:

1. **`trips`**: Quản lý chuyến đi
   - `id`: UUID PRIMARY KEY
   - `name`: TEXT NOT NULL
   - `start_date`: DATE NOT NULL
   - `end_date`: DATE NOT NULL
   - `travelers`: INTEGER DEFAULT 1
   - `budget`: NUMERIC DEFAULT 0
   - `note`: TEXT
   - `created_at`: TIMESTAMP

2. **`itineraries`**: Lịch trình theo ngày giờ
   - `id`: UUID PRIMARY KEY
   - `trip_id`: UUID REFERENCES trips(id) ON DELETE CASCADE
   - `date`: DATE NOT NULL
   - `time`: TIME
   - `location`: TEXT NOT NULL
   - `note`: TEXT
   - `created_at`: TIMESTAMP

3. **`expenses`**: Quản lý chi phí chi tiết
   - `id`: UUID PRIMARY KEY
   - `trip_id`: UUID REFERENCES trips(id) ON DELETE CASCADE
   - `category`: TEXT NOT NULL (Di chuyển, Lưu trú, Ăn uống, Vé tham quan, Mua sắm, Khác)
   - `amount`: NUMERIC NOT NULL
   - `expense_date`: DATE NOT NULL
   - `note`: TEXT
   - `created_at`: TIMESTAMP

4. **`places`**: 10 địa điểm du lịch Đà Lạt đặc sắc
   - `id`: UUID PRIMARY KEY
   - `name`: TEXT NOT NULL
   - `category`: TEXT NOT NULL (Check-in, Thiên nhiên, Văn hóa, Ẩm thực)
   - `description`: TEXT
   - `address`: TEXT
   - `image_url`: TEXT
   - `created_at`: TIMESTAMP

5. **`favorites`**: Địa điểm yêu thích người dùng lưu lại
   - `id`: UUID PRIMARY KEY
   - `place_id`: UUID REFERENCES places(id) ON DELETE CASCADE
   - `created_at`: TIMESTAMP

6. **`checklists`**: Danh mục hành lý & thủ tục chuẩn bị
   - `id`: UUID PRIMARY KEY
   - `trip_id`: UUID REFERENCES trips(id) ON DELETE CASCADE
   - `item`: TEXT NOT NULL
   - `completed`: BOOLEAN DEFAULT FALSE
   - `created_at`: TIMESTAMP

---

## 4. CÁC CHỨC NĂNG CHÍNH ĐÃ HOÀN THÀNH

1. **Chức năng 1 — Tạo và Quản lý chuyến đi ("Chuyến đi của tôi")**:
   - Nút `+ Tạo chuyến đi`.
   - Form nhập: Tên chuyến đi, Ngày bắt đầu, Ngày kết thúc, Số người, Ngân sách dự kiến, Ghi chú.
   - Thao tác: Lưu (INSERT database thật), Xem danh sách, Mở chi tiết, Chỉnh sửa, Xóa (CASCADE database).
   - Tự động tạo 10 mục checklist thiết yếu khi tạo chuyến đi mới.

2. **Chức năng 2 — Lập lịch trình chi tiết**:
   - Tab "Lịch trình" trong chi tiết chuyến đi.
   - Lọc và hiển thị theo từng ngày (Ngày 1, Ngày 2, Ngày 3,...).
   - Thêm, sửa, xóa hoạt động với Giờ, Địa điểm, Ghi chú.
   - Ghi/đọc trực tiếp từ bảng `itineraries`.

3. **Chức năng 3 — Quản lý chi phí & ngân sách**:
   - Tab "Chi phí".
   - Nhập khoản chi theo danh mục chuẩn: Di chuyển, Lưu trú, Ăn uống, Vé tham quan, Mua sắm, Khác.
   - Tự động tính toán: TỔNG CHI PHÍ, NGÂN SÁCH, CÒN LẠI.
   - **Cảnh báo vượt ngân sách**: Hiển thị hộp cảnh báo màu đỏ nổi bật khi chi vượt mức kèm số tiền âm cụ thể.
   - Ghi/đọc trực tiếp từ bảng `expenses`.

4. **Chức năng 4 — Khám phá 10 địa điểm Đà Lạt & Yêu thích**:
   - Trang "Khám phá Đà Lạt" với 10 địa điểm vàng: *Hồ Xuân Hương, Quảng trường Lâm Viên, Ga Đà Lạt, Chợ Đà Lạt, Đồi chè Cầu Đất, Núi Langbiang, Thung lũng Tình yêu, Thiền viện Trúc Lâm, Thác Datanla, Vườn hoa Đà Lạt*.
   - Nút "Lưu yêu thích" toggle thả tim lưu vào bảng `favorites` trong database.
   - Trang "Địa điểm yêu thích" hiển thị danh sách đã lưu.
   - Nút "+ Thêm vào lịch trình chuyến đi" tích hợp tiện lợi.

5. **Chức năng 5 — Checklist chuyến đi**:
   - Tab "Checklist" với 10 mục ban đầu chuẩn: CCCD, Điện thoại, Sạc điện thoại, Sạc dự phòng, Áo khoác, Giày phù hợp, Đồ dùng cá nhân, Thuốc cá nhân, Đặt phòng khách sạn, Kiểm tra vé xe.
   - Tick checkbox hoàn thành, thêm mục mới, xóa mục.
   - Trạng thái `completed` lưu vào bảng `checklists` trong database.
   - Thanh tiến độ động: "Đã hoàn thành: X/Y (Z%)".

6. **Trang chủ & Dashboard**:
   - Hero Đà Lạt hiện đại với Slogan *"Đi để cảm nhận. Đến để lưu giữ những khoảnh khắc."*
   - Nút "Bắt đầu chuyến đi" chuyển luồng tạo chuyến đi.
   - Chuyến đi gần đây, Địa điểm nổi bật, Cẩm nang du lịch Đà Lạt bỏ túi.
   - Dashboard chuyến đi đầy đủ 5 tabs chuyên sâu.

---

## 5. HƯỚNG DẪN CHẠY DỰ ÁN

### Bước 1: Mở thư mục dự án
```bash
cd "c:\Dalat Journey"
```

### Bước 2: Chạy chế độ phát triển (Development)
```bash
npm run dev
```
Truy cập trình duyệt tại: **http://localhost:5173**

### Bước 3: Hoặc chạy chế độ Production độc lập
```bash
npm run build
npm start
```
Server sẽ chạy tại **http://localhost:5173** phục vụ toàn bộ Web App và API database.

---

## 6. HƯỚNG DẪN CẤU HÌNH BIẾN MÔI TRƯỜNG (ENVIRONMENT VARIABLES)

Xem file `.env.example`:
- Nếu bạn có Supabase Project:
  1. Tạo các bảng bằng cách copy nội dung file `supabase/schema.sql` và chạy trong Supabase SQL Editor.
  2. Nạp dữ liệu mẫu bằng file `supabase/seed.sql`.
  3. Mở file `.env` và điền:
     ```env
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```
- Nếu **không có Supabase**, hãy giữ nguyên `.env` trống. Hệ thống sẽ tự động kích hoạt **Real SQLite Engine** với file lưu trữ đĩa cứng `data/dalat_journey.sqlite`, đảm bảo ứng dụng chạy mượt mà 100% không bao giờ bị trang trắng.

---

## 7. CÁCH KIỂM TRA DATABASE HOẠT ĐỘNG THẬT

1. **Kiểm tra API Health Endpoint**:
   - Truy cập: `http://localhost:5173/api/health`
   - Phản hồi: `{ status: "ok", database: "SQLite (Persistent Storage)", counts: { trips: 1, places: 10 } }`
2. **Kiểm tra File Database vật lý**:
   - File nằm tại `c:\Dalat Journey\data\dalat_journey.sqlite`. Bạn có thể mở bằng công cụ *DB Browser for SQLite* để thấy đầy đủ 6 bảng và các dòng dữ liệu được INSERT thật.
3. **Kiểm tra qua giao diện Web**:
   - Tạo một chuyến đi mới -> Mở danh sách chuyến đi -> Reload trang (F5).
   - Thêm một hoạt động lịch trình -> Reload trang (F5).
   - Thêm khoản chi phí -> Kiểm tra tổng chi phí và reload trang (F5).
   - Tick hoàn thành một mục checklist -> Reload trang (F5).
   - Mọi dữ liệu đều được lưu bền vững vào database và giữ nguyên sau khi reload!

---

## 8. DANH SÁCH 13 BÀI TEST NGHIỆM THU

| STT | Bài Test | Kết Quả Thực Tế | Trạng Thái |
|-----|----------|-----------------|------------|
| TEST 1 | Mở ứng dụng | Trang chủ hiển thị bình thường, hero đẹp, không trang trắng | ĐẠT (PASS) |
| TEST 2 | Tạo chuyến đi mới | Dữ liệu được INSERT thật vào database | ĐẠT (PASS) |
| TEST 3 | Reload trang | Dữ liệu chuyến đi vẫn còn nguyên vẹn từ database | ĐẠT (PASS) |
| TEST 4 | Thêm hoạt động vào lịch trình | Hoạt động được lưu vào bảng `itineraries` | ĐẠT (PASS) |
| TEST 5 | Reload lịch trình | Lịch trình theo ngày giữ nguyên | ĐẠT (PASS) |
| TEST 6 | Thêm khoản chi | Tổng chi phí cập nhật chính xác, hiển thị cảnh báo nếu vượt ngân sách | ĐẠT (PASS) |
| TEST 7 | Lưu địa điểm yêu thích & reload | Địa điểm hiển thị trong trang Yêu thích | ĐẠT (PASS) |
| TEST 8 | Tick checklist & reload | Tiến độ X/Y giữ nguyên sau reload | ĐẠT (PASS) |
| TEST 9 | Kiểm tra Mobile 360px, 390px, 412px | Giao diện co giãn chuẩn, có bottom navigation | ĐẠT (PASS) |
| TEST 10 | Kiểm tra tất cả button | 100% button có xử lý hành động, không nút chết | ĐẠT (PASS) |
| TEST 11 | Kiểm tra các route | Không có trang trắng, định tuyến ổn định | ĐẠT (PASS) |
| TEST 12 | Rà soát toàn bộ source code | 0 placeholder, 0 Lorem ipsum, 0 TODO/FIXME | ĐẠT (PASS) |
| TEST 13 | Kiểm tra Console | Không có lỗi JavaScript nghiêm trọng | ĐẠT (PASS) |
