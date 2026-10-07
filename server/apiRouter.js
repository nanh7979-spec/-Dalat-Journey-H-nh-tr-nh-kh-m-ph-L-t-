import { getDb, saveDb, formatResults } from './db.js';
import crypto from 'node:crypto';

function generateId() {
  return crypto.randomUUID();
}

export async function handleApiRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = req.method;

  // Set JSON headers
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // Parse body helper
  const getBody = () => new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });

  const send = (statusCode, data) => {
    res.statusCode = statusCode;
    res.end(JSON.stringify(data));
  };

  try {
    const db = await getDb();

    // 0. HEALTH CHECK
    if (pathname === '/api/health' && method === 'GET') {
      const tripsCount = formatResults(db.exec("SELECT COUNT(*) as c FROM trips"))[0]?.c || 0;
      const placesCount = formatResults(db.exec("SELECT COUNT(*) as c FROM places"))[0]?.c || 0;
      return send(200, {
        status: 'ok',
        database: 'SQLite (Persistent Storage)',
        counts: { trips: tripsCount, places: placesCount }
      });
    }

    // 1. TRIPS
    if (pathname === '/api/trips' && method === 'GET') {
      const results = db.exec("SELECT * FROM trips ORDER BY start_date ASC, created_at DESC");
      return send(200, formatResults(results));
    }

    if (pathname === '/api/trips' && method === 'POST') {
      const body = await getBody();
      if (!body.name || !body.start_date || !body.end_date) {
        return send(400, { error: 'Tên chuyến đi, ngày bắt đầu và kết thúc là bắt buộc' });
      }
      const id = body.id || generateId();
      const travelers = Number(body.travelers) || 1;
      const budget = Number(body.budget) || 0;
      const note = body.note || '';
      const createdAt = new Date().toISOString();

      const stmt = db.prepare("INSERT INTO trips (id, name, start_date, end_date, travelers, budget, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
      stmt.run([id, body.name, body.start_date, body.end_date, travelers, budget, note, createdAt]);
      stmt.free();

      // Tự động tạo 10 checklist thiết yếu ban đầu cho chuyến đi mới
      const defaultChecklist = [
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
      const stmtChk = db.prepare("INSERT INTO checklists (id, trip_id, item, completed, created_at) VALUES (?, ?, ?, 0, ?)");
      for (const item of defaultChecklist) {
        stmtChk.run([generateId(), id, item, createdAt]);
      }
      stmtChk.free();

      saveDb(db);
      return send(201, { id, name: body.name, start_date: body.start_date, end_date: body.end_date, travelers, budget, note, created_at: createdAt });
    }

    // Trip by ID
    const tripIdMatch = pathname.match(/^\/api\/trips\/([a-zA-Z0-9_-]+)$/);
    if (tripIdMatch) {
      const tripId = tripIdMatch[1];
      if (method === 'GET') {
        const stmt = db.prepare("SELECT * FROM trips WHERE id = ?");
        stmt.bind([tripId]);
        let trip = null;
        if (stmt.step()) {
          trip = stmt.getAsObject();
        }
        stmt.free();
        if (!trip) return send(404, { error: 'Không tìm thấy chuyến đi' });
        return send(200, trip);
      }

      if (method === 'PUT') {
        const body = await getBody();
        const travelers = Number(body.travelers) || 1;
        const budget = Number(body.budget) || 0;
        const stmt = db.prepare("UPDATE trips SET name = ?, start_date = ?, end_date = ?, travelers = ?, budget = ?, note = ? WHERE id = ?");
        stmt.run([body.name, body.start_date, body.end_date, travelers, budget, body.note || '', tripId]);
        stmt.free();
        saveDb(db);
        return send(200, { success: true });
      }

      if (method === 'DELETE') {
        // Cascade delete itineraries, expenses, checklists
        db.run("DELETE FROM itineraries WHERE trip_id = ?", [tripId]);
        db.run("DELETE FROM expenses WHERE trip_id = ?", [tripId]);
        db.run("DELETE FROM checklists WHERE trip_id = ?", [tripId]);
        db.run("DELETE FROM trips WHERE id = ?", [tripId]);
        saveDb(db);
        return send(200, { success: true });
      }
    }

    // 2. ITINERARIES
    const tripItinerariesMatch = pathname.match(/^\/api\/trips\/([a-zA-Z0-9_-]+)\/itineraries$/);
    if (tripItinerariesMatch && method === 'GET') {
      const tripId = tripItinerariesMatch[1];
      const stmt = db.prepare("SELECT * FROM itineraries WHERE trip_id = ? ORDER BY date ASC, time ASC");
      stmt.bind([tripId]);
      const rows = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      return send(200, rows);
    }

    if (pathname === '/api/itineraries' && method === 'POST') {
      const body = await getBody();
      if (!body.trip_id || !body.date || !body.location) {
        return send(400, { error: 'Chuyến đi, ngày và địa điểm là bắt buộc' });
      }
      const id = body.id || generateId();
      const createdAt = new Date().toISOString();
      const stmt = db.prepare("INSERT INTO itineraries (id, trip_id, date, time, location, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
      stmt.run([id, body.trip_id, body.date, body.time || null, body.location, body.note || null, createdAt]);
      stmt.free();
      saveDb(db);
      return send(201, { id, trip_id: body.trip_id, date: body.date, time: body.time, location: body.location, note: body.note, created_at: createdAt });
    }

    const itinIdMatch = pathname.match(/^\/api\/itineraries\/([a-zA-Z0-9_-]+)$/);
    if (itinIdMatch) {
      const id = itinIdMatch[1];
      if (method === 'PUT') {
        const body = await getBody();
        const stmt = db.prepare("UPDATE itineraries SET date = ?, time = ?, location = ?, note = ? WHERE id = ?");
        stmt.run([body.date, body.time || null, body.location, body.note || null, id]);
        stmt.free();
        saveDb(db);
        return send(200, { success: true });
      }
      if (method === 'DELETE') {
        const stmt = db.prepare("DELETE FROM itineraries WHERE id = ?");
        stmt.run([id]);
        stmt.free();
        saveDb(db);
        return send(200, { success: true });
      }
    }

    // 3. EXPENSES
    const tripExpensesMatch = pathname.match(/^\/api\/trips\/([a-zA-Z0-9_-]+)\/expenses$/);
    if (tripExpensesMatch && method === 'GET') {
      const tripId = tripExpensesMatch[1];
      const stmt = db.prepare("SELECT * FROM expenses WHERE trip_id = ? ORDER BY expense_date DESC, created_at DESC");
      stmt.bind([tripId]);
      const rows = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      return send(200, rows);
    }

    if (pathname === '/api/expenses' && method === 'POST') {
      const body = await getBody();
      if (!body.trip_id || !body.category || body.amount === undefined || !body.expense_date) {
        return send(400, { error: 'Chuyến đi, danh mục, số tiền và ngày là bắt buộc' });
      }
      const id = body.id || generateId();
      const amount = Number(body.amount) || 0;
      const createdAt = new Date().toISOString();
      const stmt = db.prepare("INSERT INTO expenses (id, trip_id, category, amount, expense_date, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
      stmt.run([id, body.trip_id, body.category, amount, body.expense_date, body.note || null, createdAt]);
      stmt.free();
      saveDb(db);
      return send(201, { id, trip_id: body.trip_id, category: body.category, amount, expense_date: body.expense_date, note: body.note, created_at: createdAt });
    }

    const expIdMatch = pathname.match(/^\/api\/expenses\/([a-zA-Z0-9_-]+)$/);
    if (expIdMatch) {
      const id = expIdMatch[1];
      if (method === 'PUT') {
        const body = await getBody();
        const amount = Number(body.amount) || 0;
        const stmt = db.prepare("UPDATE expenses SET category = ?, amount = ?, expense_date = ?, note = ? WHERE id = ?");
        stmt.run([body.category, amount, body.expense_date, body.note || null, id]);
        stmt.free();
        saveDb(db);
        return send(200, { success: true });
      }
      if (method === 'DELETE') {
        const stmt = db.prepare("DELETE FROM expenses WHERE id = ?");
        stmt.run([id]);
        stmt.free();
        saveDb(db);
        return send(200, { success: true });
      }
    }

    // 4. PLACES & FAVORITES
    if (pathname === '/api/places' && method === 'GET') {
      const results = db.exec(`
        SELECT p.*, (CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END) as is_favorite
        FROM places p
        LEFT JOIN favorites f ON p.id = f.place_id
        ORDER BY p.created_at ASC
      `);
      const places = formatResults(results).map(p => ({
        ...p,
        is_favorite: Boolean(p.is_favorite)
      }));
      return send(200, places);
    }

    if (pathname === '/api/favorites' && method === 'GET') {
      const results = db.exec(`
        SELECT p.*, 1 as is_favorite, f.created_at as favorited_at
        FROM places p
        INNER JOIN favorites f ON p.id = f.place_id
        ORDER BY f.created_at DESC
      `);
      const favs = formatResults(results).map(p => ({
        ...p,
        is_favorite: true
      }));
      return send(200, favs);
    }

    if (pathname === '/api/favorites' && method === 'POST') {
      const body = await getBody();
      if (!body.place_id) return send(400, { error: 'place_id là bắt buộc' });
      const id = generateId();
      const createdAt = new Date().toISOString();
      const stmt = db.prepare("INSERT OR IGNORE INTO favorites (id, place_id, created_at) VALUES (?, ?, ?)");
      stmt.run([id, body.place_id, createdAt]);
      stmt.free();
      saveDb(db);
      return send(201, { id, place_id: body.place_id, created_at: createdAt });
    }

    const favPlaceMatch = pathname.match(/^\/api\/favorites\/([a-zA-Z0-9_-]+)$/);
    if (favPlaceMatch && method === 'DELETE') {
      const placeId = favPlaceMatch[1];
      const stmt = db.prepare("DELETE FROM favorites WHERE place_id = ? OR id = ?");
      stmt.run([placeId, placeId]);
      stmt.free();
      saveDb(db);
      return send(200, { success: true });
    }

    // 5. CHECKLISTS
    const tripChecklistsMatch = pathname.match(/^\/api\/trips\/([a-zA-Z0-9_-]+)\/checklists$/);
    if (tripChecklistsMatch && method === 'GET') {
      const tripId = tripChecklistsMatch[1];
      const stmt = db.prepare("SELECT * FROM checklists WHERE trip_id = ? ORDER BY created_at ASC");
      stmt.bind([tripId]);
      const rows = [];
      while (stmt.step()) {
        const obj = stmt.getAsObject();
        rows.push({
          ...obj,
          completed: Boolean(obj.completed)
        });
      }
      stmt.free();
      return send(200, rows);
    }

    if (pathname === '/api/checklists' && method === 'POST') {
      const body = await getBody();
      if (!body.trip_id || !body.item) {
        return send(400, { error: 'Chuyến đi và nội dung mục là bắt buộc' });
      }
      const id = body.id || generateId();
      const completed = body.completed ? 1 : 0;
      const createdAt = new Date().toISOString();
      const stmt = db.prepare("INSERT INTO checklists (id, trip_id, item, completed, created_at) VALUES (?, ?, ?, ?, ?)");
      stmt.run([id, body.trip_id, body.item, completed, createdAt]);
      stmt.free();
      saveDb(db);
      return send(201, { id, trip_id: body.trip_id, item: body.item, completed: Boolean(completed), created_at: createdAt });
    }

    const chkIdMatch = pathname.match(/^\/api\/checklists\/([a-zA-Z0-9_-]+)$/);
    if (chkIdMatch) {
      const id = chkIdMatch[1];
      if (method === 'PATCH' || method === 'PUT') {
        const body = await getBody();
        const completed = body.completed ? 1 : 0;
        const stmt = db.prepare("UPDATE checklists SET completed = ? WHERE id = ?");
        stmt.run([completed, id]);
        stmt.free();
        saveDb(db);
        return send(200, { success: true, completed: Boolean(completed) });
      }
      if (method === 'DELETE') {
        const stmt = db.prepare("DELETE FROM checklists WHERE id = ?");
        stmt.run([id]);
        stmt.free();
        saveDb(db);
        return send(200, { success: true });
      }
    }

    // Route not found
    return send(404, { error: 'API route not found' });
  } catch (error) {
    console.error('API Error:', error);
    return send(500, { error: error.message || 'Lỗi xử lý cơ sở dữ liệu' });
  }
}
