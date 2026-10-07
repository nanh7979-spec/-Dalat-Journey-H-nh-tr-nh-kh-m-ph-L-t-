-- ==============================================================
-- HÀNH TRÌNH KHÁM PHÁ ĐÀ LẠT (DALAT JOURNEY)
-- SUPABASE POSTGRESQL DATABASE SCHEMA
-- ==============================================================

-- 1. BẢNG TRIPS (Quản lý các chuyến đi)
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  travelers INTEGER DEFAULT 1 CHECK (travelers > 0),
  budget NUMERIC DEFAULT 0 CHECK (budget >= 0),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. BẢNG ITINERARIES (Lịch trình chi tiết theo ngày và giờ)
CREATE TABLE IF NOT EXISTS itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME,
  location TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BẢNG EXPENSES (Quản lý chi phí chi tiết theo danh mục)
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- Di chuyển, Lưu trú, Ăn uống, Vé tham quan, Mua sắm, Khác
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  expense_date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. BẢNG PLACES (Danh bạ 10 địa điểm du lịch Đà Lạt đặc sắc)
CREATE TABLE IF NOT EXISTS places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- Check-in, Thiên nhiên, Văn hóa, Ẩm thực
  description TEXT,
  address TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. BẢNG FAVORITES (Địa điểm yêu thích người dùng lưu lại)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_favorite UNIQUE(place_id)
);

-- 6. BẢNG CHECKLISTS (Checklist chuẩn bị hành lý và thủ tục du lịch)
CREATE TABLE IF NOT EXISTS checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TẠO CÁC CHỈ MỤC INDEX TỐI ƯU HIỆU NĂNG TRUY VẤN
CREATE INDEX IF NOT EXISTS idx_itineraries_trip_id ON itineraries(trip_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_date ON itineraries(date);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_checklists_trip_id ON checklists(trip_id);
CREATE INDEX IF NOT EXISTS idx_favorites_place_id ON favorites(place_id);

-- CẤU HÌNH ROW LEVEL SECURITY (RLS) MỞ CHO PUBLIC TRUY VẤN ĐÁNH GIÁ
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all access on trips" ON trips FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on itineraries" ON itineraries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on places" ON places FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on favorites" ON favorites FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on checklists" ON checklists FOR ALL USING (true) WITH CHECK (true);
