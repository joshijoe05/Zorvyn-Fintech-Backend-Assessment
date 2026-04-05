DROP VIEW IF EXISTS v_financial_summary;
DROP VIEW IF EXISTS v_category_totals;
DROP VIEW IF EXISTS v_monthly_trends;
DROP VIEW IF EXISTS v_weekly_trends;
DRop VIEW IF EXISTS v_recent_activity;


-- =============================================================================
-- VIEW 2: v_financial_summary
-- One row per user — total income, expenses, net balance, record count.
--
-- VIEWER  → WHERE user_id = their own id  (one row back)
-- ANALYST → no filter                      (all users' rows)
-- ADMIN   → no filter or WHERE user_id=?   (all or one user)
-- =============================================================================
CREATE OR REPLACE VIEW v_financial_summary AS
SELECT
  u.id                                                                      AS user_id,
  u.name                                                                    AS user_name,
  u.email                                                                   AS user_email,
  COALESCE(SUM(CASE WHEN fr.type = 'INCOME'  THEN fr.amount ELSE 0 END), 0) AS total_income,
  COALESCE(SUM(CASE WHEN fr.type = 'EXPENSE' THEN fr.amount ELSE 0 END), 0) AS total_expenses,
  COALESCE(
    SUM(CASE WHEN fr.type = 'INCOME'  THEN fr.amount ELSE 0 END) -
    SUM(CASE WHEN fr.type = 'EXPENSE' THEN fr.amount ELSE 0 END),
    0
  )                                                                          AS net_balance,
  COUNT(fr.id)                                                               AS record_count
FROM users u
LEFT JOIN financial_records fr
  ON fr.user_id  = u.id
  AND fr.deleted_at IS NULL
WHERE u.deleted_at IS NULL
GROUP BY u.id;


-- =============================================================================
-- VIEW 3: v_category_totals
-- One row per user + category + type combination.
--
-- VIEWER  → WHERE user_id = their id  (their category breakdown)
-- ANALYST → no filter                  (all users' breakdown)
-- ADMIN   → no filter or WHERE user_id=?
-- =============================================================================
CREATE OR REPLACE VIEW v_financial_summary AS
SELECT
  u.id                                                                      AS user_id,
  u.name                                                                    AS user_name,
  u.email                                                                   AS user_email,
  COALESCE(SUM(CASE WHEN fr.type = 'INCOME'  THEN fr.amount ELSE 0 END), 0) AS total_income,
  COALESCE(SUM(CASE WHEN fr.type = 'EXPENSE' THEN fr.amount ELSE 0 END), 0) AS total_expenses,
  COALESCE(
    SUM(CASE WHEN fr.type = 'INCOME'  THEN fr.amount ELSE 0 END) -
    SUM(CASE WHEN fr.type = 'EXPENSE' THEN fr.amount ELSE 0 END),
    0
  )                                                                          AS net_balance,
  COUNT(fr.id)                                                               AS record_count
FROM users u
LEFT JOIN financial_records fr
  ON fr.user_id  = u.id
  AND fr.deleted_at IS NULL
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.name, u.email;


-- =============================================================================
-- VIEW 4: v_monthly_trends
-- One row per user + month combination.
--
-- VIEWER  → WHERE user_id = their id
-- ANALYST → no filter (all users)
-- ADMIN   → no filter or WHERE user_id=?
-- =============================================================================
CREATE OR REPLACE VIEW v_monthly_trends AS
SELECT
  fr.user_id,
  DATE_TRUNC('month', fr.date)::DATE                                         AS period_start,
  TO_CHAR(DATE_TRUNC('month', fr.date), 'YYYY-MM')                           AS period_label,
  COALESCE(SUM(CASE WHEN fr.type = 'INCOME'  THEN fr.amount ELSE 0 END), 0)  AS total_income,
  COALESCE(SUM(CASE WHEN fr.type = 'EXPENSE' THEN fr.amount ELSE 0 END), 0)  AS total_expenses,
  COALESCE(
    SUM(CASE WHEN fr.type = 'INCOME'  THEN fr.amount ELSE 0 END) -
    SUM(CASE WHEN fr.type = 'EXPENSE' THEN fr.amount ELSE 0 END),
    0
  )                                                                           AS net_balance,
  COUNT(*)                                                                    AS record_count
FROM financial_records fr
WHERE fr.deleted_at IS NULL
GROUP BY fr.user_id, DATE_TRUNC('month', fr.date);


-- =============================================================================
-- VIEW 5: v_weekly_trends
-- One row per user + ISO week combination.
-- =============================================================================
CREATE OR REPLACE VIEW v_weekly_trends AS
SELECT
  fr.user_id,
  DATE_TRUNC('week', fr.date)::DATE                                           AS period_start,
  TO_CHAR(DATE_TRUNC('week', fr.date), 'IYYY-"W"IW')                         AS period_label,
  COALESCE(SUM(CASE WHEN fr.type = 'INCOME'  THEN fr.amount ELSE 0 END), 0)  AS total_income,
  COALESCE(SUM(CASE WHEN fr.type = 'EXPENSE' THEN fr.amount ELSE 0 END), 0)  AS total_expenses,
  COALESCE(
    SUM(CASE WHEN fr.type = 'INCOME'  THEN fr.amount ELSE 0 END) -
    SUM(CASE WHEN fr.type = 'EXPENSE' THEN fr.amount ELSE 0 END),
    0
  )                                                                           AS net_balance,
  COUNT(*)                                                                    AS record_count
FROM financial_records fr
WHERE fr.deleted_at IS NULL
GROUP BY fr.user_id, DATE_TRUNC('week', fr.date);