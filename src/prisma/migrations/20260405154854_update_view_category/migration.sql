DROP VIEW IF EXISTS v_category_totals;

CREATE OR REPLACE VIEW v_category_totals AS
SELECT
  u.id                        AS user_id,
  c.id                        AS category_id,
  c.name                      AS category_name,
  c.color                     AS category_color,
  c.icon                      AS category_icon,
  fr.type,
  COALESCE(SUM(fr.amount), 0) AS total,
  COUNT(fr.id)                AS record_count
FROM users u
CROSS JOIN categories c
LEFT JOIN financial_records fr
  ON  fr.user_id     = u.id
  AND fr.category_id = c.id
  AND fr.deleted_at  IS NULL
WHERE u.deleted_at IS NULL
  AND c.deleted_at IS NULL
GROUP BY u.id, c.id, c.name, c.color, c.icon, fr.type;