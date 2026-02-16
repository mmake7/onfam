require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { Pool } = require('pg');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

// ─────────────────────────────────────────────
// Supabase Storage 설정
// ─────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const STORAGE_BUCKET = 'contents';

// multer 설정 (메모리 스토리지 - Vercel 서버리스 호환)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('허용되지 않는 파일 형식입니다. (jpg, png, webp, gif만 가능)'));
    }
  },
});

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────
// PostgreSQL 연결 풀
// ─────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost')
    ? false
    : { rejectUnauthorized: false },
});

// ─────────────────────────────────────────────
// DDL: 전체 스키마 정의
// ─────────────────────────────────────────────
const SCHEMA_SQL = `
-- ============================================
-- 1. ENUM 타입 정의
-- ============================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE program_status AS ENUM ('open', 'closed', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE enrollment_status AS ENUM ('pending', 'paid', 'cancelled', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('ready', 'done', 'cancelled', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- 2. 회원 테이블 (users)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  phone         VARCHAR(20),
  role          user_role    NOT NULL DEFAULT 'user',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users (role);

-- ============================================
-- 3. 콘텐츠 관리 테이블 (contents)
-- ============================================
CREATE TABLE IF NOT EXISTS contents (
  id           SERIAL PRIMARY KEY,
  page_key     VARCHAR(50)  NOT NULL,
  section_key  VARCHAR(100) NOT NULL,
  title_ko     VARCHAR(500),
  title_en     VARCHAR(500),
  body_ko      TEXT,
  body_en      TEXT,
  image_url    VARCHAR(1000),
  sort_order   INTEGER      NOT NULL DEFAULT 0,
  is_published BOOLEAN      NOT NULL DEFAULT TRUE,
  updated_by   INTEGER      REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contents_page    ON contents (page_key);
CREATE INDEX IF NOT EXISTS idx_contents_section ON contents (page_key, section_key);
CREATE INDEX IF NOT EXISTS idx_contents_sort    ON contents (page_key, sort_order);

-- ============================================
-- 4. 교육 프로그램 테이블 (programs)
-- ============================================
CREATE TABLE IF NOT EXISTS programs (
  id               SERIAL PRIMARY KEY,
  title_ko         VARCHAR(500)   NOT NULL,
  title_en         VARCHAR(500),
  description_ko   TEXT,
  description_en   TEXT,
  price            INTEGER        NOT NULL DEFAULT 0,
  max_capacity     INTEGER        NOT NULL DEFAULT 0,
  current_capacity INTEGER        NOT NULL DEFAULT 0,
  start_date       DATE,
  end_date         DATE,
  location         VARCHAR(500),
  status           program_status NOT NULL DEFAULT 'open',
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_capacity CHECK (current_capacity >= 0 AND current_capacity <= max_capacity),
  CONSTRAINT chk_dates    CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
  CONSTRAINT chk_price    CHECK (price >= 0)
);

CREATE INDEX IF NOT EXISTS idx_programs_status ON programs (status);
CREATE INDEX IF NOT EXISTS idx_programs_dates  ON programs (start_date, end_date);

-- ============================================
-- 5. 교육 신청 테이블 (enrollments)
-- ============================================
CREATE TABLE IF NOT EXISTS enrollments (
  id          SERIAL            PRIMARY KEY,
  user_id     INTEGER           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  program_id  INTEGER           NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  status      enrollment_status NOT NULL DEFAULT 'pending',
  payment_key VARCHAR(255),
  amount      INTEGER           NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ       NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_enrollment_amount CHECK (amount >= 0)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user    ON enrollments (user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_program ON enrollments (program_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status  ON enrollments (status);

-- ============================================
-- 6. 결제 내역 테이블 (payments)
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id               SERIAL         PRIMARY KEY,
  enrollment_id    INTEGER        NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  user_id          INTEGER        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  toss_payment_key VARCHAR(255),
  order_id         VARCHAR(255)   NOT NULL UNIQUE,
  amount           INTEGER        NOT NULL DEFAULT 0,
  method           VARCHAR(50),
  status           payment_status NOT NULL DEFAULT 'ready',
  approved_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_payment_amount CHECK (amount >= 0)
);

CREATE INDEX IF NOT EXISTS idx_payments_enrollment ON payments (enrollment_id);
CREATE INDEX IF NOT EXISTS idx_payments_user       ON payments (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order      ON payments (order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status     ON payments (status);

-- ============================================
-- 7. 게시판 테이블 (posts)
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id         SERIAL      PRIMARY KEY,
  user_id    INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category   VARCHAR(50) NOT NULL DEFAULT 'general',
  title      VARCHAR(500) NOT NULL,
  body       TEXT,
  view_count INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_view_count CHECK (view_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_posts_user     ON posts (user_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts (category);
CREATE INDEX IF NOT EXISTS idx_posts_created  ON posts (created_at DESC);

-- ============================================
-- 8. updated_at 자동 갱신 트리거
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['users','contents','programs','enrollments','posts'])
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_%s_updated_at ON %I;
       CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION update_updated_at();',
      t, t, t, t
    );
  END LOOP;
END $$;
`;

// ─────────────────────────────────────────────
// API: 스키마 초기화
// ─────────────────────────────────────────────
app.post('/api/db/init', async (req, res) => {
  try {
    await pool.query(SCHEMA_SQL);
    res.json({ success: true, message: '스키마가 성공적으로 생성되었습니다.' });
  } catch (err) {
    console.error('Schema init error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────
// API: DB 연결 테스트
// ─────────────────────────────────────────────
app.get('/api/db/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS server_time, current_database() AS db_name');
    res.json({ success: true, ...result.rows[0] });
  } catch (err) {
    console.error('Health check error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────
// API: 전체 스키마 조회 (시각화용)
// ─────────────────────────────────────────────
app.get('/api/db/schema', async (req, res) => {
  try {
    // 테이블 목록
    const tables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    // 컬럼 정보
    const columns = await pool.query(`
      SELECT table_name, column_name, data_type, is_nullable,
             column_default, character_maximum_length
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `);

    // FK 관계
    const foreignKeys = await pool.query(`
      SELECT
        tc.table_name      AS from_table,
        kcu.column_name    AS from_column,
        ccu.table_name     AS to_table,
        ccu.column_name    AS to_column,
        tc.constraint_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu
        ON tc.constraint_name = ccu.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name
    `);

    // 인덱스 정보
    const indexes = await pool.query(`
      SELECT tablename, indexname, indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `);

    res.json({
      success: true,
      tables: tables.rows,
      columns: columns.rows,
      foreignKeys: foreignKeys.rows,
      indexes: indexes.rows,
    });
  } catch (err) {
    console.error('Schema query error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────
// API: Mermaid ER 다이어그램 생성
// ─────────────────────────────────────────────
app.get('/api/db/erd', async (req, res) => {
  try {
    const columns = await pool.query(`
      SELECT table_name, column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `);

    const foreignKeys = await pool.query(`
      SELECT
        tc.table_name   AS from_table,
        kcu.column_name AS from_column,
        ccu.table_name  AS to_table,
        ccu.column_name AS to_column
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu
        ON tc.constraint_name = ccu.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
    `);

    // Mermaid 문법 생성
    let mermaid = 'erDiagram\n';

    // 테이블별 컬럼 그룹핑
    const tableMap = {};
    for (const col of columns.rows) {
      if (!tableMap[col.table_name]) tableMap[col.table_name] = [];
      const nullable = col.is_nullable === 'YES' ? '' : ' PK/NOT NULL';
      tableMap[col.table_name].push(`    ${col.data_type} ${col.column_name}`);
    }

    // 관계 추가
    for (const fk of foreignKeys.rows) {
      mermaid += `  ${fk.to_table} ||--o{ ${fk.from_table} : "${fk.from_column}"\n`;
    }

    mermaid += '\n';

    // 테이블 정의 추가
    for (const [table, cols] of Object.entries(tableMap)) {
      mermaid += `  ${table} {\n`;
      for (const col of cols) {
        mermaid += `  ${col}\n`;
      }
      mermaid += '  }\n\n';
    }

    res.json({ success: true, mermaid });
  } catch (err) {
    console.error('ERD generation error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────
// JWT 헬퍼 함수
// ─────────────────────────────────────────────
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// 인증 미들웨어
// ─────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: '인증 토큰이 필요합니다.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ success: false, error: '유효하지 않은 토큰입니다.' });
  }

  req.user = decoded;
  next();
}

function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: '관리자 권한이 필요합니다.' });
  }
  next();
}

// ─────────────────────────────────────────────
// AUTH API: 회원가입
// ─────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // 입력 검증
    if (!email || !password) {
      return res.status(400).json({ success: false, error: '이메일과 비밀번호는 필수입니다.' });
    }

    if (!name) {
      return res.status(400).json({ success: false, error: '이름은 필수입니다.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: '비밀번호는 6자 이상이어야 합니다.' });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: '유효한 이메일 형식이 아닙니다.' });
    }

    // 이메일 중복 체크
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, error: '이미 등록된 이메일입니다.' });
    }

    // 비밀번호 해싱
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // 사용자 생성
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, phone, role, created_at`,
      [email, passwordHash, name, phone || null]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: '회원가입 성공',
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
});

// ─────────────────────────────────────────────
// AUTH API: 로그인
// ─────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: '이메일과 비밀번호는 필수입니다.' });
    }

    // 사용자 조회
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 비밀번호 검증
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: '로그인 성공',
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
});

// ─────────────────────────────────────────────
// AUTH API: 로그아웃
// ─────────────────────────────────────────────
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: '로그아웃 성공. 클라이언트에서 토큰을 삭제하세요.' });
});

// ─────────────────────────────────────────────
// AUTH API: 내 정보 조회
// ─────────────────────────────────────────────
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, phone, role, created_at, updated_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: '사용자를 찾을 수 없습니다.' });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
});

// ─────────────────────────────────────────────
// CRUD API: Users
// ─────────────────────────────────────────────
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, phone, role, created_at, updated_at FROM users ORDER BY id'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, phone, role, created_at, updated_at FROM users WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { email, password_hash, name, phone, role } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, phone, role)
       VALUES ($1, $2, $3, $4, COALESCE($5::user_role, 'user'))
       RETURNING id, email, name, phone, role, created_at`,
      [email, password_hash, name, phone, role]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────
// 공개 API: Contents 조회 (인증 불필요)
// GET /api/contents?page=home&section=hero
// GET /api/contents?page_key=home&section_key=hero (별칭 지원)
// ─────────────────────────────────────────────
app.get('/api/contents', async (req, res) => {
  const { page, section, page_key, section_key, limit, offset } = req.query;
  const pageVal = page || page_key;
  const sectionVal = section || section_key;
  try {
    let query = 'SELECT id, page_key, section_key, title_ko, title_en, body_ko, body_en, image_url, sort_order, created_at, updated_at FROM contents WHERE is_published = TRUE';
    const params = [];
    let paramIdx = 1;

    if (pageVal) {
      query += ` AND page_key = $${paramIdx++}`;
      params.push(pageVal);
    }
    if (sectionVal) {
      query += ` AND section_key = $${paramIdx++}`;
      params.push(sectionVal);
    }

    query += ' ORDER BY page_key, sort_order';

    // 페이지네이션 지원
    if (limit) {
      const limitNum = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);
      query += ` LIMIT $${paramIdx++}`;
      params.push(limitNum);
    }
    if (offset) {
      const offsetNum = Math.max(parseInt(offset, 10) || 0, 0);
      query += ` OFFSET $${paramIdx++}`;
      params.push(offsetNum);
    }

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 단일 콘텐츠 조회 (공개)
app.get('/api/contents/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contents WHERE id = $1 AND is_published = TRUE',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: '콘텐츠를 찾을 수 없습니다.' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────
// 관리자 API: Contents 전체 조회 (비공개 포함)
// ─────────────────────────────────────────────
app.get('/api/admin/contents', authMiddleware, adminMiddleware, async (req, res) => {
  const { page, section } = req.query;
  try {
    let query = 'SELECT * FROM contents';
    const params = [];
    const conditions = [];
    let paramIdx = 1;

    if (page) {
      conditions.push(`page_key = $${paramIdx++}`);
      params.push(page);
    }
    if (section) {
      conditions.push(`section_key = $${paramIdx++}`);
      params.push(section);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY page_key, sort_order';

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────
// 관리자 API: 콘텐츠 생성
// POST /api/admin/contents
// ─────────────────────────────────────────────
app.post('/api/admin/contents', authMiddleware, adminMiddleware, async (req, res) => {
  const { page_key, section_key, title_ko, title_en, body_ko, body_en, image_url, sort_order, is_published } = req.body;

  // 필수 필드 검증
  if (!page_key || !section_key) {
    return res.status(400).json({ success: false, error: 'page_key와 section_key는 필수입니다.' });
  }

  // 문자열 길이 검증
  if (page_key.length > 50) {
    return res.status(400).json({ success: false, error: 'page_key는 50자 이하여야 합니다.' });
  }
  if (section_key.length > 100) {
    return res.status(400).json({ success: false, error: 'section_key는 100자 이하여야 합니다.' });
  }
  if (title_ko && title_ko.length > 500) {
    return res.status(400).json({ success: false, error: 'title_ko는 500자 이하여야 합니다.' });
  }
  if (title_en && title_en.length > 500) {
    return res.status(400).json({ success: false, error: 'title_en은 500자 이하여야 합니다.' });
  }
  if (image_url && image_url.length > 1000) {
    return res.status(400).json({ success: false, error: 'image_url은 1000자 이하여야 합니다.' });
  }

  try {
    // sort_order 자동 계산: 해당 page_key 내 최대값 + 1
    let finalSortOrder = sort_order;
    if (finalSortOrder === undefined || finalSortOrder === null) {
      const maxResult = await pool.query(
        'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM contents WHERE page_key = $1',
        [page_key]
      );
      finalSortOrder = maxResult.rows[0].next_order;
    }

    const result = await pool.query(
      `INSERT INTO contents (page_key, section_key, title_ko, title_en, body_ko, body_en, image_url, sort_order, is_published, updated_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [page_key, section_key, title_ko || null, title_en || null, body_ko || null, body_en || null, image_url || null, finalSortOrder, is_published ?? true, req.user.id]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────
// 관리자 API: 콘텐츠 정렬 순서 변경
// PUT /api/admin/contents/reorder
// Body: { items: [{ id: 1, sort_order: 0 }, { id: 2, sort_order: 1 }, ...] }
// ※ 반드시 /:id 라우트보다 먼저 등록해야 합니다
// ─────────────────────────────────────────────
app.put('/api/admin/contents/reorder', authMiddleware, adminMiddleware, async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'items 배열이 필요합니다. [{ id, sort_order }, ...]' });
  }

  // 유효성 검증
  for (const item of items) {
    if (!item.id || typeof item.sort_order !== 'number') {
      return res.status(400).json({ success: false, error: '각 항목에 id와 sort_order(숫자)가 필요합니다.' });
    }
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const item of items) {
      await client.query(
        'UPDATE contents SET sort_order = $1, updated_by = $2, updated_at = NOW() WHERE id = $3',
        [item.sort_order, req.user.id, item.id]
      );
    }

    await client.query('COMMIT');

    // 업데이트된 결과 반환
    const ids = items.map(i => i.id);
    const result = await pool.query(
      `SELECT * FROM contents WHERE id = ANY($1) ORDER BY sort_order`,
      [ids]
    );

    res.json({ success: true, message: '정렬 순서가 변경되었습니다.', data: result.rows });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
});

// ─────────────────────────────────────────────
// 관리자 API: 콘텐츠 수정
// PUT /api/admin/contents/:id
// 한국어/영어 콘텐츠 동시 수정 가능
// ─────────────────────────────────────────────
app.put('/api/admin/contents/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;

  // ID 형식 검증
  if (!id || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ success: false, error: '유효한 콘텐츠 ID가 필요합니다.' });
  }

  const { page_key, section_key, title_ko, title_en, body_ko, body_en, image_url, sort_order, is_published } = req.body;

  // 문자열 길이 검증 (제공된 필드만)
  if (page_key !== undefined && page_key.length > 50) {
    return res.status(400).json({ success: false, error: 'page_key는 50자 이하여야 합니다.' });
  }
  if (section_key !== undefined && section_key.length > 100) {
    return res.status(400).json({ success: false, error: 'section_key는 100자 이하여야 합니다.' });
  }
  if (title_ko !== undefined && title_ko && title_ko.length > 500) {
    return res.status(400).json({ success: false, error: 'title_ko는 500자 이하여야 합니다.' });
  }
  if (title_en !== undefined && title_en && title_en.length > 500) {
    return res.status(400).json({ success: false, error: 'title_en은 500자 이하여야 합니다.' });
  }
  if (image_url !== undefined && image_url && image_url.length > 1000) {
    return res.status(400).json({ success: false, error: 'image_url은 1000자 이하여야 합니다.' });
  }

  try {
    // 기존 콘텐츠 확인
    const existing = await pool.query('SELECT * FROM contents WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: '콘텐츠를 찾을 수 없습니다.' });
    }

    const current = existing.rows[0];

    const result = await pool.query(
      `UPDATE contents SET
        page_key     = $1,
        section_key  = $2,
        title_ko     = $3,
        title_en     = $4,
        body_ko      = $5,
        body_en      = $6,
        image_url    = $7,
        sort_order   = $8,
        is_published = $9,
        updated_by   = $10,
        updated_at   = NOW()
       WHERE id = $11
       RETURNING *`,
      [
        page_key     ?? current.page_key,
        section_key  ?? current.section_key,
        title_ko     !== undefined ? title_ko : current.title_ko,
        title_en     !== undefined ? title_en : current.title_en,
        body_ko      !== undefined ? body_ko : current.body_ko,
        body_en      !== undefined ? body_en : current.body_en,
        image_url    !== undefined ? image_url : current.image_url,
        sort_order   !== undefined ? sort_order : current.sort_order,
        is_published !== undefined ? is_published : current.is_published,
        req.user.id,
        id
      ]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────
// 관리자 API: 콘텐츠 삭제
// DELETE /api/admin/contents/:id
// ─────────────────────────────────────────────
app.delete('/api/admin/contents/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;

  // ID 형식 검증
  if (!id || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ success: false, error: '유효한 콘텐츠 ID가 필요합니다.' });
  }

  try {
    const result = await pool.query('DELETE FROM contents WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: '콘텐츠를 찾을 수 없습니다.' });
    }
    res.json({ success: true, message: '콘텐츠가 삭제되었습니다.', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────
// 관리자 API: 초기 콘텐츠 시드 데이터
// POST /api/admin/contents/seed
// ─────────────────────────────────────────────
app.post('/api/admin/contents/seed', authMiddleware, adminMiddleware, async (req, res) => {
  const seedData = [
    // Home page
    { page_key: 'home', section_key: 'hero', sort_order: 0, title_ko: '기업 성장을 위한 최적의 솔루션', title_en: 'Optimal Solutions for Business Growth', body_ko: '전문적인 컨설팅과 교육 프로그램으로 기업의 지속 가능한 성장을 지원합니다.', body_en: 'We support sustainable business growth through professional consulting and education programs.', image_url: null },
    { page_key: 'home', section_key: 'services', sort_order: 1, title_ko: '주요 서비스', title_en: 'Key Services', body_ko: '경영 컨설팅, 교육 프로그램, 디지털 전환 지원 등 다양한 서비스를 제공합니다.', body_en: 'We provide various services including management consulting, education programs, and digital transformation support.', image_url: null },
    { page_key: 'home', section_key: 'cta', sort_order: 2, title_ko: '지금 시작하세요', title_en: 'Get Started Now', body_ko: '무료 상담을 통해 귀사에 맞는 최적의 솔루션을 찾아보세요.', body_en: 'Find the optimal solution for your company through a free consultation.', image_url: null },
    // About page
    { page_key: 'about', section_key: 'hero', sort_order: 0, title_ko: '회사 소개', title_en: 'About Us', body_ko: '우리는 기업의 성장과 혁신을 돕는 전문 컨설팅 기업입니다.', body_en: 'We are a professional consulting firm that helps businesses grow and innovate.', image_url: null },
    { page_key: 'about', section_key: 'mission', sort_order: 1, title_ko: '미션 & 비전', title_en: 'Mission & Vision', body_ko: '고객 중심의 혁신적인 솔루션으로 지속 가능한 미래를 만들어갑니다.', body_en: 'Creating a sustainable future with customer-centered innovative solutions.', image_url: null },
    { page_key: 'about', section_key: 'team', sort_order: 2, title_ko: '팀 소개', title_en: 'Our Team', body_ko: '다양한 분야의 전문가들이 함께합니다.', body_en: 'Experts from various fields work together.', image_url: null },
    // Solutions page
    { page_key: 'solutions', section_key: 'hero', sort_order: 0, title_ko: '솔루션', title_en: 'Solutions', body_ko: '기업의 다양한 과제를 해결하는 맞춤형 솔루션을 제공합니다.', body_en: 'We provide customized solutions to address various business challenges.', image_url: null },
    { page_key: 'solutions', section_key: 'consulting', sort_order: 1, title_ko: '경영 컨설팅', title_en: 'Management Consulting', body_ko: '전략 수립부터 실행까지 체계적인 컨설팅 서비스를 제공합니다.', body_en: 'We provide systematic consulting services from strategy development to execution.', image_url: null },
    { page_key: 'solutions', section_key: 'education', sort_order: 2, title_ko: '교육 프로그램', title_en: 'Education Programs', body_ko: '실무 중심의 교육 프로그램으로 임직원 역량을 강화합니다.', body_en: 'Strengthen employee capabilities with practice-oriented education programs.', image_url: null },
    // Contact page
    { page_key: 'contact', section_key: 'hero', sort_order: 0, title_ko: '문의하기', title_en: 'Contact Us', body_ko: '궁금하신 점이 있으시면 언제든지 연락해 주세요.', body_en: 'Please feel free to contact us anytime with your questions.', image_url: null },
    { page_key: 'contact', section_key: 'info', sort_order: 1, title_ko: '연락처 정보', title_en: 'Contact Information', body_ko: '이메일: info@company.com | 전화: 02-1234-5678', body_en: 'Email: info@company.com | Phone: 02-1234-5678', image_url: null },
    // Program page
    { page_key: 'program', section_key: 'hero', sort_order: 0, title_ko: '교육 프로그램', title_en: 'Education Programs', body_ko: '전문 역량 강화를 위한 다양한 교육 프로그램을 운영합니다.', body_en: 'We operate various education programs to strengthen professional capabilities.', image_url: null },
    // Community page
    { page_key: 'community', section_key: 'hero', sort_order: 0, title_ko: '커뮤니티', title_en: 'Community', body_ko: '최신 소식과 정보를 공유합니다.', body_en: 'Share the latest news and information.', image_url: null },
  ];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const inserted = [];
    for (const item of seedData) {
      // 중복 체크: 같은 page_key + section_key가 이미 있으면 건너뛰기
      const exists = await client.query(
        'SELECT id FROM contents WHERE page_key = $1 AND section_key = $2',
        [item.page_key, item.section_key]
      );
      if (exists.rows.length > 0) continue;

      const result = await client.query(
        `INSERT INTO contents (page_key, section_key, title_ko, title_en, body_ko, body_en, image_url, sort_order, is_published, updated_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE, $9)
         RETURNING *`,
        [item.page_key, item.section_key, item.title_ko, item.title_en, item.body_ko, item.body_en, item.image_url, item.sort_order, req.user.id]
      );
      inserted.push(result.rows[0]);
    }

    await client.query('COMMIT');
    res.status(201).json({
      success: true,
      message: `${inserted.length}개의 시드 콘텐츠가 생성되었습니다.`,
      data: inserted
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
});

// ─────────────────────────────────────────────
// 관리자 API: 이미지 업로드
// POST /api/admin/upload
// Supabase Storage에 이미지 파일 업로드 후 공개 URL 반환
// ─────────────────────────────────────────────
app.post('/api/admin/upload', authMiddleware, adminMiddleware, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, error: '파일 크기는 5MB 이하여야 합니다.' });
      }
      return res.status(400).json({ success: false, error: err.message });
    }
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
}, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: '파일이 업로드되지 않았습니다.' });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ success: false, error: 'Supabase Storage가 설정되지 않았습니다.' });
  }

  try {
    const ext = req.file.originalname.split('.').pop() || 'jpg';
    const filePath = `contents/${req.user.id}_${Date.now()}.${ext}`;

    const uploadRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${filePath}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': req.file.mimetype,
          'x-upsert': 'true',
        },
        body: req.file.buffer,
      }
    );

    if (!uploadRes.ok) {
      const errorBody = await uploadRes.text();
      console.error('Supabase upload error:', uploadRes.status, errorBody);
      return res.status(500).json({ success: false, error: '파일 업로드에 실패했습니다.' });
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${filePath}`;

    res.json({
      success: true,
      message: '이미지가 업로드되었습니다.',
      data: {
        url: publicUrl,
        path: filePath,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: '파일 업로드 중 오류가 발생했습니다.' });
  }
});

// ─────────────────────────────────────────────
// 관리자 API: 이미지 삭제
// DELETE /api/admin/upload
// Supabase Storage에서 이미지 파일 삭제
// Body: { path: "contents/1_1234567890.jpg" }
// ─────────────────────────────────────────────
app.delete('/api/admin/upload', authMiddleware, adminMiddleware, async (req, res) => {
  const { path: filePath } = req.body;

  if (!filePath) {
    return res.status(400).json({ success: false, error: '삭제할 파일 경로가 필요합니다.' });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ success: false, error: 'Supabase Storage가 설정되지 않았습니다.' });
  }

  try {
    const deleteRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${filePath}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );

    if (!deleteRes.ok) {
      const errorBody = await deleteRes.text();
      console.error('Supabase delete error:', deleteRes.status, errorBody);
      return res.status(500).json({ success: false, error: '파일 삭제에 실패했습니다.' });
    }

    res.json({ success: true, message: '이미지가 삭제되었습니다.' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ success: false, error: '파일 삭제 중 오류가 발생했습니다.' });
  }
});

// ─────────────────────────────────────────────
// CRUD API: Programs
// ─────────────────────────────────────────────
app.get('/api/programs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM programs ORDER BY start_date DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/programs/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM programs WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Program not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/programs', async (req, res) => {
  const { title_ko, title_en, description_ko, description_en, price, max_capacity, start_date, end_date, location, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO programs (title_ko, title_en, description_ko, description_en, price, max_capacity, start_date, end_date, location, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10::program_status, 'open'))
       RETURNING *`,
      [title_ko, title_en, description_ko, description_en, price ?? 0, max_capacity ?? 0, start_date, end_date, location, status]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────
// CRUD API: Enrollments
// ─────────────────────────────────────────────
app.get('/api/enrollments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, u.name AS user_name, u.email AS user_email, p.title_ko AS program_title
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN programs p ON e.program_id = p.id
      ORDER BY e.created_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/enrollments', async (req, res) => {
  const { user_id, program_id, amount } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 프로그램 정원 확인
    const program = await client.query(
      'SELECT max_capacity, current_capacity, status FROM programs WHERE id = $1 FOR UPDATE',
      [program_id]
    );
    if (program.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Program not found' });
    }
    const p = program.rows[0];
    if (p.status !== 'open') {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, error: '모집이 마감된 프로그램입니다.' });
    }
    if (p.current_capacity >= p.max_capacity) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, error: '정원이 초과되었습니다.' });
    }

    // 신청 생성
    const enrollment = await client.query(
      `INSERT INTO enrollments (user_id, program_id, amount)
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, program_id, amount ?? 0]
    );

    // 현재 인원 증가
    await client.query(
      'UPDATE programs SET current_capacity = current_capacity + 1 WHERE id = $1',
      [program_id]
    );

    await client.query('COMMIT');
    res.status(201).json({ success: true, data: enrollment.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
});

// ─────────────────────────────────────────────
// CRUD API: Payments
// ─────────────────────────────────────────────
app.get('/api/payments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.name AS user_name, u.email AS user_email
      FROM payments p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/payments', async (req, res) => {
  const { enrollment_id, user_id, toss_payment_key, order_id, amount, method } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO payments (enrollment_id, user_id, toss_payment_key, order_id, amount, method)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [enrollment_id, user_id, toss_payment_key, order_id, amount, method]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────
// CRUD API: Posts
// ─────────────────────────────────────────────
app.get('/api/posts', async (req, res) => {
  const { category } = req.query;
  try {
    let query = `
      SELECT p.*, u.name AS author_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
    `;
    const params = [];
    if (category) {
      query += ' WHERE p.category = $1';
      params.push(category);
    }
    query += ' ORDER BY p.created_at DESC';
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    // 조회수 증가 + 조회
    const result = await pool.query(
      `UPDATE posts SET view_count = view_count + 1 WHERE id = $1
       RETURNING *, (SELECT name FROM users WHERE id = posts.user_id) AS author_name`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Post not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/posts', async (req, res) => {
  const { user_id, category, title, body } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO posts (user_id, category, title, body)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, category ?? 'general', title, body]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────
// 서버 시작
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/db/health`);
  console.log(`Init schema:  POST http://localhost:${PORT}/api/db/init`);
  console.log(`View schema:  http://localhost:${PORT}/api/db/schema`);
  console.log(`View ERD:     http://localhost:${PORT}/api/db/erd`);
});
