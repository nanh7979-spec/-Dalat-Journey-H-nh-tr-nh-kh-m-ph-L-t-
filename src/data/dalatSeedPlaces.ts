import { Place } from '../types/database';

export const INITIAL_DALAT_PLACES: Omit<Place, 'is_favorite'>[] = [
  {
    id: '018f3a5b-1111-7000-8000-000000000001',
    name: 'Hồ Xuân Hương',
    category: 'Check-in',
    description: 'Trái tim thơ mộng của thành phố Đà Lạt với mặt nước phẳng lặng soi bóng rừng thông. Thích hợp cho việc đạp xe, đi dạo sáng sớm và ngắm hoàng hôn buông xuống mặt hồ lãng mạn.',
    address: 'Trung tâm Phường 1, TP. Đà Lạt, Lâm Đồng',
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-01-01T08:00:00Z'
  },
  {
    id: '018f3a5b-1111-7000-8000-000000000002',
    name: 'Quảng trường Lâm Viên',
    category: 'Check-in',
    description: 'Biểu tượng hiện đại của xứ sở sương mù nổi bật với khối nụ hoa Atiso bằng kính màu độc đáo và khối bông hoa Dã Quỳ khổng lồ, điểm dừng chân check-in không thể bỏ lỡ.',
    address: 'Đường Trần Quốc Toản, Phường 10, TP. Đà Lạt, Lâm Đồng',
    image_url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-01-01T08:05:00Z'
  },
  {
    id: '018f3a5b-1111-7000-8000-000000000003',
    name: 'Ga Đà Lạt',
    category: 'Văn hóa',
    description: 'Nhà ga cổ kính nhất Đông Dương xây dựng từ năm 1932 theo phong cách Art Deco kết hợp mái chóp nhà rông Tây Nguyên, lưu giữ đầu tàu hơi nước cổ và toa xe gỗ lịch sử.',
    address: 'Số 1 đường Quang Trung, Phường 9, TP. Đà Lạt, Lâm Đồng',
    image_url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-01-01T08:10:00Z'
  },
  {
    id: '018f3a5b-1111-7000-8000-000000000004',
    name: 'Chợ Đà Lạt',
    category: 'Ẩm thực',
    description: 'Tụ điểm ẩm thực và văn hóa sôi động nhất về đêm. Nơi thưởng thức bánh tráng nướng giòn rụm, sữa đậu nành nóng hổi, khoai lang nướng thơm lừng và chọn mua đặc sản dâu tây tươi.',
    address: 'Đường Nguyễn Thị Minh Khai, Phường 1, TP. Đà Lạt, Lâm Đồng',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-01-01T08:15:00Z'
  },
  {
    id: '018f3a5b-1111-7000-8000-000000000005',
    name: 'Đồi chè Cầu Đất',
    category: 'Thiên nhiên',
    description: 'Biển mây bềnh bồng cuộn trôi trên những thảm chè xanh ngát ngút ngàn hơn 100 năm tuổi. Tọa độ săn mây ngắm bình minh tuyệt mỹ với tuabin gió khổng lồ giữa núi rừng.',
    address: 'Thôn Cầu Đất, Xã Xuân Trường, TP. Đà Lạt, Lâm Đồng',
    image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-01-01T08:20:00Z'
  },
  {
    id: '018f3a5b-1111-7000-8000-000000000006',
    name: 'Núi Langbiang',
    category: 'Thiên nhiên',
    description: 'Nóc nhà của cao nguyên Lâm Viên với độ cao 2.167m, nơi lưu truyền thiên tình sử son sắt của chàng K’lang và nàng H’biang, tầm nhìn bao quát toàn cảnh suối Vàng suối Bạc.',
    address: 'Thị trấn Lạc Dương, Huyện Lạc Dương, Lâm Đồng (cách trung tâm Đà Lạt 12km)',
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-01-01T08:25:00Z'
  },
  {
    id: '018f3a5b-1111-7000-8000-000000000007',
    name: 'Thung lũng Tình yêu',
    category: 'Check-in',
    description: 'Thắng cảnh nên thơ bậc nhất nép mình bên sườn đồi thông xanh ngắt và hồ Đa Thiện trong vắt, quy tụ nhiều công trình tiểu cảnh nghệ thuật hoa cỏ rực rỡ bốn mùa.',
    address: 'Số 3 - 5 - 7 đường Mai Anh Đào, Phường 8, TP. Đà Lạt, Lâm Đồng',
    image_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-01-01T08:30:00Z'
  },
  {
    id: '018f3a5b-1111-7000-8000-000000000008',
    name: 'Thiền viện Trúc Lâm',
    category: 'Văn hóa',
    description: 'Một trong những thiền viện lớn nhất Việt Nam tọa lạc trên núi Phụng Hoàng, thanh tịnh trầm mặc hướng tầm nhìn xuống mặt hồ Tuyền Lâm mênh mông xanh như ngọc bích.',
    address: 'Đường Hoa Cẩm Tú Cầu, Phường 3, TP. Đà Lạt, Lâm Đồng',
    image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-01-01T08:35:00Z'
  },
  {
    id: '018f3a5b-1111-7000-8000-000000000009',
    name: 'Thác Datanla',
    category: 'Thiên nhiên',
    description: 'Dòng thác hùng vĩ đổ xuống từ vách đá cheo leo giữa hẻm vực sâu trong vắt. Nổi tiếng với đường trượt máng Alpine Coaster xuyên rừng thông uốn lượn dài nhất Đông Nam Á.',
    address: 'Quốc lộ 20 Đèo Prenn, Phường 3, TP. Đà Lạt, Lâm Đồng',
    image_url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-01-01T08:40:00Z'
  },
  {
    id: '018f3a5b-1111-7000-8000-000000000010',
    name: 'Vườn hoa Đà Lạt',
    category: 'Check-in',
    description: 'Bảo tàng hoa ngoài trời rộng lớn hội tụ hơn 300 loài hoa quý hiếm của xứ ôn đới và nhiệt đới: cẩm tú cầu, hoa hồng Pháp, phong lan, mimosa rực rỡ suốt bốn mùa.',
    address: 'Đường Trần Quốc Toản, Phường 8, TP. Đà Lạt, Lâm Đồng',
    image_url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-01-01T08:45:00Z'
  }
];

export const INITIAL_CHECKLIST_TEMPLATE = [
  'CCCD',
  'Điện thoại',
  'Sạc điện thoại',
  'Sạc dự phòng',
  'Áo khoác',
  'Giày phù hợp',
  'Đồ dùng cá nhân',
  'Thuốc cá nhân',
  'Đặt phòng khách sạn',
  'Kiểm tra vé xe'
];
