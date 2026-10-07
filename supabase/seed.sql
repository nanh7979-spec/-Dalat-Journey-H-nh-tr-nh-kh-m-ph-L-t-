-- ==============================================================
-- DỮ LIỆU MẪU ĐÀ LẠT (DALAT JOURNEY SEED DATA)
-- ==============================================================

-- 1. NẠP 10 ĐỊA ĐIỂM DU LỊCH ĐẶC TRƯNG ĐÀ LẠT
INSERT INTO places (id, name, category, description, address, image_url) VALUES
('018f3a5b-1111-7000-8000-000000000001', 'Hồ Xuân Hương', 'Check-in', 'Trái tim thơ mộng của thành phố Đà Lạt với mặt nước phẳng lặng soi bóng rừng thông. Thích hợp cho việc đạp xe, đi dạo sáng sớm và ngắm hoàng hôn buông xuống mặt hồ lãng mạn.', 'Trung tâm Phường 1, TP. Đà Lạt, Lâm Đồng', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'),
('018f3a5b-1111-7000-8000-000000000002', 'Quảng trường Lâm Viên', 'Check-in', 'Biểu tượng hiện đại của xứ sở sương mù nổi bật với khối nụ hoa Atiso bằng kính màu độc đáo và khối bông hoa Dã Quỳ khổng lồ, điểm dừng chân check-in không thể bỏ lỡ.', 'Đường Trần Quốc Toản, Phường 10, TP. Đà Lạt, Lâm Đồng', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80'),
('018f3a5b-1111-7000-8000-000000000003', 'Ga Đà Lạt', 'Văn hóa', 'Nhà ga cổ kính nhất Đông Dương xây dựng từ năm 1932 theo phong cách Art Deco kết hợp mái chóp nhà rông Tây Nguyên, lưu giữ đầu tàu hơi nước cổ và toa xe gỗ lịch sử.', 'Số 1 đường Quang Trung, Phường 9, TP. Đà Lạt, Lâm Đồng', 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80'),
('018f3a5b-1111-7000-8000-000000000004', 'Chợ Đà Lạt', 'Ẩm thực', 'Tụ điểm ẩm thực và văn hóa sôi động nhất về đêm. Nơi thưởng thức bánh tráng nướng giòn rụm, sữa đậu nành nóng hổi, khoai lang nướng thơm lừng và chọn mua đặc sản dâu tây tươi.', 'Đường Nguyễn Thị Minh Khai, Phường 1, TP. Đà Lạt, Lâm Đồng', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'),
('018f3a5b-1111-7000-8000-000000000005', 'Đồi chè Cầu Đất', 'Thiên nhiên', 'Biển mây bềnh bồng cuộn trôi trên những thảm chè xanh ngát ngút ngàn hơn 100 năm tuổi. Tọa độ săn mây ngắm bình minh tuyệt mỹ với tuabin gió khổng lồ giữa núi rừng.', 'Thôn Cầu Đất, Xã Xuân Trường, TP. Đà Lạt, Lâm Đồng', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80'),
('018f3a5b-1111-7000-8000-000000000006', 'Núi Langbiang', 'Thiên nhiên', 'Nóc nhà của cao nguyên Lâm Viên với độ cao 2.167m, nơi lưu truyền thiên tình sử son sắt của chàng K’lang và nàng H’biang, tầm nhìn bao quát toàn cảnh suối Vàng suối Bạc.', 'Thị trấn Lạc Dương, Huyện Lạc Dương, Lâm Đồng (cách trung tâm Đà Lạt 12km)', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'),
('018f3a5b-1111-7000-8000-000000000007', 'Thung lũng Tình yêu', 'Check-in', 'Thắng cảnh nên thơ bậc nhất nép mình bên sườn đồi thông xanh ngắt và hồ Đa Thiện trong vắt, quy tụ nhiều công trình tiểu cảnh nghệ thuật hoa cỏ rực rỡ bốn mùa.', 'Số 3 - 5 - 7 đường Mai Anh Đào, Phường 8, TP. Đà Lạt, Lâm Đồng', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80'),
('018f3a5b-1111-7000-8000-000000000008', 'Thiền viện Trúc Lâm', 'Văn hóa', 'Một trong những thiền viện lớn nhất Việt Nam tọa lạc trên núi Phụng Hoàng, thanh tịnh trầm mặc hướng tầm nhìn xuống mặt hồ Tuyền Lâm mênh mông xanh như ngọc bích.', 'Đường Hoa Cẩm Tú Cầu, Phường 3, TP. Đà Lạt, Lâm Đồng', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'),
('018f3a5b-1111-7000-8000-000000000009', 'Thác Datanla', 'Thiên nhiên', 'Dòng thác hùng vĩ đổ xuống từ vách đá cheo leo giữa hẻm vực sâu trong vắt. Nổi tiếng với đường trượt máng Alpine Coaster xuyên rừng thông uốn lượn dài nhất Đông Nam Á.', 'Quốc lộ 20 Đèo Prenn, Phường 3, TP. Đà Lạt, Lâm Đồng', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80'),
('018f3a5b-1111-7000-8000-000000000010', 'Vườn hoa Đà Lạt', 'Check-in', 'Bảo tàng hoa ngoài trời rộng lớn hội tụ hơn 300 loài hoa quý hiếm của xứ ôn đới và nhiệt đới: cẩm tú cầu, hoa hồng Pháp, phong lan, mimosa rực rỡ suốt bốn mùa.', 'Đường Trần Quốc Toản, Phường 8, TP. Đà Lạt, Lâm Đồng', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80')
ON CONFLICT (id) DO NOTHING;

-- 2. NẠP CHUYẾN ĐI MẪU "Khám phá Đà Lạt 3 ngày 2 đêm"
INSERT INTO trips (id, name, start_date, end_date, travelers, budget, note) VALUES
('018f3a5b-2222-7000-8000-000000000001', 'Khám phá Đà Lạt 3 ngày 2 đêm', '2026-10-05', '2026-10-07', 2, 5000000, 'Chuyến đi ngắm hoa dã quỳ và tận hưởng không khí se lạnh mùa thu cùng bạn thân.')
ON CONFLICT (id) DO NOTHING;

-- 3. NẠP LỊCH TRÌNH THEO ĐÚNG ĐỀ BÀI CHO CHUYẾN ĐI
INSERT INTO itineraries (trip_id, date, time, location, note) VALUES
('018f3a5b-2222-7000-8000-000000000001', '2026-10-05', '08:00', 'Ăn sáng bánh mì xíu mại', 'Thưởng thức bánh mì xíu mại chén Hoàng Diệu nóng hổi với ly sữa đậu nành.'),
('018f3a5b-2222-7000-8000-000000000001', '2026-10-05', '09:30', 'Ga Đà Lạt', 'Check-in sống ảo bên đầu tàu hơi nước cổ và toa xe gỗ xưa.'),
('018f3a5b-2222-7000-8000-000000000001', '2026-10-05', '14:00', 'Hồ Xuân Hương', 'Đi dạo hóng gió mát quanh hồ và ghé quán cà phê ven hồ thư giãn.'),
('018f3a5b-2222-7000-8000-000000000001', '2026-10-05', '16:00', 'Quán cà phê ngắm hoàng hôn', 'Uống trà atiso ấm ngắm thung lũng thông trong ánh hoàng hôn chiều tà.'),
('018f3a5b-2222-7000-8000-000000000001', '2026-10-05', '19:00', 'Chợ Đà Lạt', 'Ăn bánh tráng nướng, dâu tây lắc và mua quà lưu niệm len.');

-- 4. NẠP CÁC KHOẢN CHI PHÍ THEO ĐÚNG ĐỀ BÀI
INSERT INTO expenses (trip_id, category, amount, expense_date, note) VALUES
('018f3a5b-2222-7000-8000-000000000001', 'Lưu trú', 1200000, '2026-10-05', 'Homestay nhà gỗ view đồi thông 2 đêm'),
('018f3a5b-2222-7000-8000-000000000001', 'Ăn uống', 500000, '2026-10-05', 'Bánh mì xíu mại sáng và lẩu gà lá é buổi trưa'),
('018f3a5b-2222-7000-8000-000000000001', 'Di chuyển', 600000, '2026-10-05', 'Thuê xe máy tay ga 3 ngày và đổ xăng đầy bình');

-- 5. NẠP CHECKLIST BAN ĐẦU THEO ĐÚNG ĐỀ BÀI
INSERT INTO checklists (trip_id, item, completed) VALUES
('018f3a5b-2222-7000-8000-000000000001', 'CCCD', true),
('018f3a5b-2222-7000-8000-000000000001', 'Điện thoại', true),
('018f3a5b-2222-7000-8000-000000000001', 'Sạc điện thoại', true),
('018f3a5b-2222-7000-8000-000000000001', 'Sạc dự phòng', false),
('018f3a5b-2222-7000-8000-000000000001', 'Áo khoác', true),
('018f3a5b-2222-7000-8000-000000000001', 'Giày phù hợp', true),
('018f3a5b-2222-7000-8000-000000000001', 'Đồ dùng cá nhân', false),
('018f3a5b-2222-7000-8000-000000000001', 'Thuốc cá nhân', false),
('018f3a5b-2222-7000-8000-000000000001', 'Đặt phòng khách sạn', true),
('018f3a5b-2222-7000-8000-000000000001', 'Kiểm tra vé xe', true);

-- 6. NẠP YÊU THÍCH MẪU
INSERT INTO favorites (place_id) VALUES
('018f3a5b-1111-7000-8000-000000000001'),
('018f3a5b-1111-7000-8000-000000000005')
ON CONFLICT (place_id) DO NOTHING;
