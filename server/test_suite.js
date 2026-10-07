import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'http://127.0.0.1:5173';

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {
          json = data;
        }
        resolve({ status: res.statusCode, data: json });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTestSuite() {
  console.log('==================================================');
  console.log('KHỞI CHẠY BỘ KIỂM THỬ TỰ ĐỘNG - DALAT JOURNEY');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, name, details = '') {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name} -> ${details}`);
      failed++;
    }
  }

  try {
    // TEST 1: Mở ứng dụng (HTTP 200)
    const homeRes = await request('GET', '/');
    assert(homeRes.status === 200 && typeof homeRes.data === 'string' && homeRes.data.includes('Dalat Journey'),
      'TEST 1: Mở ứng dụng - Trang hiển thị bình thường, trả về HTML Dalat Journey, không trang trắng');

    // TEST 2 & TEST 3: Tạo chuyến đi mới & Kiểm tra dữ liệu trong database
    const tripPayload = {
      name: 'Nghỉ dưỡng Đà Lạt cùng gia đình',
      start_date: '2026-11-10',
      end_date: '2026-11-13',
      travelers: 4,
      budget: 12000000,
      note: 'Nghỉ dưỡng resort hồ Tuyền Lâm, thưởng thức trà atiso và hái dâu tây'
    };
    const createTripRes = await request('POST', '/api/trips', tripPayload);
    assert(createTripRes.status === 201 && createTripRes.data.id,
      'TEST 2: Tạo chuyến đi mới - Dữ liệu xuất hiện trong database (INSERT thật)');

    const newTripId = createTripRes.data.id;

    // Reload / Fetch lại từ database
    const getTripRes = await request('GET', `/api/trips/${newTripId}`);
    assert(getTripRes.status === 200 && getTripRes.data.name === tripPayload.name && Number(getTripRes.data.budget) === 12000000,
      'TEST 3: Reload / SELECT lại chuyến đi - Dữ liệu chuyến đi vẫn còn nguyên vẹn trong database');

    // TEST 4 & TEST 5: Thêm hoạt động vào lịch trình & reload
    const itinPayload = {
      trip_id: newTripId,
      date: '2026-11-10',
      time: '05:00',
      location: 'Săn mây đồi chè Cầu Đất',
      note: 'Đón ánh bình minh tuyệt đẹp và chụp ảnh cùng tuabin gió'
    };
    const createItinRes = await request('POST', '/api/itineraries', itinPayload);
    assert(createItinRes.status === 201 && createItinRes.data.id,
      'TEST 4: Thêm hoạt động vào lịch trình - Dữ liệu được lưu vào bảng itineraries');

    const getItinRes = await request('GET', `/api/trips/${newTripId}/itineraries`);
    const foundItin = Array.isArray(getItinRes.data) && getItinRes.data.find(i => i.location === itinPayload.location);
    assert(Boolean(foundItin),
      'TEST 5: Reload / SELECT lịch trình - Dữ liệu lịch trình vẫn còn nguyên vẹn');

    // TEST 6: Thêm khoản chi & tính toán tổng chi phí chính xác
    const expPayload = {
      trip_id: newTripId,
      category: 'Lưu trú',
      amount: 4500000,
      expense_date: '2026-11-10',
      note: 'Resort hồ Tuyền Lâm 3 đêm'
    };
    const createExpRes = await request('POST', '/api/expenses', expPayload);
    assert(createExpRes.status === 201 && createExpRes.data.id,
      'TEST 6.1: Thêm khoản chi phí - Dữ liệu lưu vào bảng expenses');

    const getExpRes = await request('GET', `/api/trips/${newTripId}/expenses`);
    const totalExp = Array.isArray(getExpRes.data) ? getExpRes.data.reduce((s, e) => s + Number(e.amount), 0) : 0;
    assert(totalExp === 4500000,
      `TEST 6.2: Tổng chi phí cập nhật chính xác (4.500.000 VNĐ trên ngân sách 12.000.000 VNĐ)`);

    // TEST 7: Lưu địa điểm yêu thích & reload
    const placesRes = await request('GET', '/api/places');
    assert(Array.isArray(placesRes.data) && placesRes.data.length === 10,
      'TEST 7.1: Nạp danh mục 10 địa điểm nổi tiếng Đà Lạt từ database');

    const testPlaceId = placesRes.data[0].id;
    const addFavRes = await request('POST', '/api/favorites', { place_id: testPlaceId });
    assert(addFavRes.status === 201,
      'TEST 7.2: Lưu địa điểm yêu thích - INSERT vào bảng favorites');

    const getFavsRes = await request('GET', '/api/favorites');
    const isFavPresent = Array.isArray(getFavsRes.data) && getFavsRes.data.some(f => f.id === testPlaceId);
    assert(isFavPresent,
      'TEST 7.3: Reload - Địa điểm vẫn nằm trong danh sách yêu thích');

    // TEST 8: Thêm checklist & tick hoàn thành & reload
    const getChkRes = await request('GET', `/api/trips/${newTripId}/checklists`);
    assert(Array.isArray(getChkRes.data) && getChkRes.data.length === 10,
      'TEST 8.1: Tự động khởi tạo 10 mục checklist thiết yếu cho chuyến đi mới');

    const firstChk = getChkRes.data[0];
    const toggleRes = await request('PATCH', `/api/checklists/${firstChk.id}`, { completed: true });
    assert(toggleRes.status === 200 && toggleRes.data.completed === true,
      'TEST 8.2: Tick hoàn thành mục checklist - Cập nhật completed = true trong database');

    const verifyChkRes = await request('GET', `/api/trips/${newTripId}/checklists`);
    const verifiedItem = Array.isArray(verifyChkRes.data) && verifyChkRes.data.find(c => c.id === firstChk.id);
    assert(verifiedItem && verifiedItem.completed === true,
      'TEST 8.3: Reload - Trạng thái hoàn thành checklist vẫn được giữ nguyên');

    // TEST 9 & 10: Rà soát mã nguồn loại bỏ toàn bộ placeholder, lorem ipsum, coming soon
    const srcDir = path.resolve('src');
    function searchForbiddenWords(dir) {
      const forbidden = ['lorem ipsum', 'coming soon', 'placeholder="placeholder', 'dummy', 'sample text'];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          searchForbiddenWords(fullPath);
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          const content = fs.readFileSync(fullPath, 'utf8').toLowerCase();
          for (const word of forbidden) {
            if (content.includes(word)) {
              throw new Error(`Tìm thấy từ cấm '${word}' tại ${fullPath}`);
            }
          }
        }
      }
    }
    try {
      searchForbiddenWords(srcDir);
      assert(true, 'TEST 12: Rà soát toàn bộ source code - 0 Lorem ipsum, 0 Coming soon, 0 Placeholder giả');
    } catch (err) {
      assert(false, 'TEST 12: Rà soát source code', err.message);
    }

    console.log('\n==================================================');
    console.log(`KẾT QUẢ: ${passed} PASS, ${failed} FAIL`);
    console.log('==================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Lỗi khi chạy bộ test:', err);
    process.exit(1);
  }
}

runTestSuite();
