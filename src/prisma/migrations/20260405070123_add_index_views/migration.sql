DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_fr_user_id;
DROP INDEX IF EXISTS idx_fr_category_id;
DROP INDEX IF EXISTS idx_fr_date;
DROP INDEX IF EXISTS idx_fr_type;
DROP INDEX IF EXISTS idx_fr_composite;


CREATE UNIQUE INDEX idx_users_email_unique
  ON users(email)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_users_role_status_active
  ON users(role, status)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_fr_user_id
  ON financial_records(user_id)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_fr_category_id
  ON financial_records(category_id)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_fr_date
  ON financial_records(date)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_fr_type
  ON financial_records(type)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_fr_composite
  ON financial_records(user_id, type, date)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX idx_categories_name_unique
  ON categories(name)
  WHERE deleted_at IS NULL;


-- VIEWS
CREATE OR REPLACE VIEW v_financial_records_detail AS
SELECT
  fr.id,
  fr.amount,
  fr.type,
  fr.date,
  fr.notes,
  fr.created_at,
  fr.updated_at,

  c.id           AS category_id,
  c.name         AS category_name,
  c.color        AS category_color,
  c.icon         AS category_icon,

  u.id           AS user_id,
  u.name         AS user_name,
  u.email        AS user_email,
  u.role         AS user_role

FROM financial_records fr
JOIN categories c ON c.id = fr.category_id AND c.deleted_at IS NULL
JOIN users      u ON u.id = fr.user_id      AND u.deleted_at IS NULL
WHERE fr.deleted_at IS NULL;



-- Returns a single row with total_income, total_expenses, net_balance.
CREATE OR REPLACE VIEW v_financial_summary AS
SELECT
  COALESCE(SUM(CASE WHEN type = 'INCOME'  THEN amount ELSE 0 END), 0) AS total_income,
  COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS total_expenses,
  COALESCE(
    SUM(CASE WHEN type = 'INCOME'  THEN amount ELSE 0 END) -
    SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END),
    0
  )                                                                     AS net_balance,
  COUNT(*)                                                              AS record_count
FROM financial_records
WHERE deleted_at IS NULL;


-- Per-category aggregates split by record type — powers the category breakdown widget.
-- Orders by total DESC so the top categories appear first.
CREATE OR REPLACE VIEW v_category_totals AS
SELECT
  c.id           AS category_id,
  c.name         AS category_name,
  c.color        AS category_color,
  c.icon         AS category_icon,
  fr.type,
  COALESCE(SUM(fr.amount), 0)   AS total,
  COUNT(fr.id)                  AS record_count
FROM categories c
LEFT JOIN financial_records fr
  ON fr.category_id = c.id
  AND fr.deleted_at IS NULL
WHERE c.deleted_at IS NULL
GROUP BY c.id, c.name, c.color, c.icon, fr.type
ORDER BY total DESC;


-- Monthly aggregated income, expenses, and net balance.
-- Powers the time-series chart on the dashboard.
-- DATE_TRUNC('month', date) groups by calendar month.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_monthly_trends AS
SELECT
  DATE_TRUNC('month', date)::DATE                                         AS period_start,
  TO_CHAR(DATE_TRUNC('month', date), 'YYYY-MM')                           AS period_label,
  COALESCE(SUM(CASE WHEN type = 'INCOME'  THEN amount ELSE 0 END), 0)     AS total_income,
  COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0)     AS total_expenses,
  COALESCE(
    SUM(CASE WHEN type = 'INCOME'  THEN amount ELSE 0 END) -
    SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END),
    0
  )                                                                        AS net_balance,
  COUNT(*)                                                                 AS record_count
FROM financial_records
WHERE deleted_at IS NULL
GROUP BY DATE_TRUNC('month', date)
ORDER BY period_start DESC;


-- Weekly aggregated income, expenses, and net balance.
-- DATE_TRUNC('week', date) groups by ISO week (Monday–Sunday).
-- Powers the "weekly view" toggle on the dashboard trend chart.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_weekly_trends AS
SELECT
  DATE_TRUNC('week', date)::DATE                                           AS period_start,
  TO_CHAR(DATE_TRUNC('week', date), 'IYYY-"W"IW')                         AS period_label,
  COALESCE(SUM(CASE WHEN type = 'INCOME'  THEN amount ELSE 0 END), 0)     AS total_income,
  COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0)     AS total_expenses,
  COALESCE(
    SUM(CASE WHEN type = 'INCOME'  THEN amount ELSE 0 END) -
    SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END),
    0
  )                                                                        AS net_balance,
  COUNT(*)                                                                 AS record_count
FROM financial_records
WHERE deleted_at IS NULL
GROUP BY DATE_TRUNC('week', date)
ORDER BY period_start DESC;


-- The 10 most recently created non-deleted records, fully joined.
-- The LIMIT is baked in — this view always returns exactly ≤10 rows.
-- Powers the "Recent Activity" feed on the dashboard.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_recent_activity AS
SELECT
  fr.id,
  fr.amount,
  fr.type,
  fr.date,
  fr.notes,
  fr.created_at,

  c.id           AS category_id,
  c.name         AS category_name,
  c.color        AS category_color,
  c.icon         AS category_icon,

  u.id           AS user_id,
  u.name         AS user_name

FROM financial_records fr
JOIN categories c ON c.id = fr.category_id AND c.deleted_at IS NULL
JOIN users      u ON u.id = fr.user_id      AND u.deleted_at IS NULL
WHERE fr.deleted_at IS NULL
ORDER BY fr.created_at DESC
LIMIT 10;