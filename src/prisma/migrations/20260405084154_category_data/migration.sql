

INSERT INTO categories (id, name, description, color, icon, is_system, created_by, created_at, updated_at)
VALUES
  (
    'c1000000-0000-0000-0000-000000000001',
    'Salary',
    'Regular employment income',
    '#22c55e',
    NULL,
    true, NULL, NOW(), NOW()
  ),
  (
    'c1000000-0000-0000-0000-000000000002',
    'Freelance',
    'Income from freelance or contract work',
    '#3b82f6',
    NULL,
    true, NULL, NOW(), NOW()
  ),
  (
    'c1000000-0000-0000-0000-000000000003',
    'Investments',
    'Returns from stocks, bonds, or other investments',
    '#8b5cf6',
    NULL,
    true, NULL, NOW(), NOW()
  ),
  (
    'c1000000-0000-0000-0000-000000000004',
    'Business',
    'Revenue from business activities',
    '#f59e0b',
    NULL,
    true, NULL, NOW(), NOW()
  ),
  (
    'c1000000-0000-0000-0000-000000000005',
    'Other Income',
    'Gifts, bonuses, or any other income source',
    '#06b6d4',
    NULL,
    true, NULL, NOW(), NOW()
  ),

  (
    'c1000000-0000-0000-0000-000000000006',
    'Housing',
    'Rent, mortgage, maintenance and utilities',
    '#ef4444',
    NULL,
    true, NULL, NOW(), NOW()
  ),
  (
    'c1000000-0000-0000-0000-000000000007',
    'Food & Dining',
    'Groceries, restaurants and takeaways',
    '#f97316',
    NULL,
    true, NULL, NOW(), NOW()
  ),
  (
    'c1000000-0000-0000-0000-000000000008',
    'Transport',
    'Fuel, public transit, ride sharing and vehicle costs',
    '#eab308',
    NULL,
    true, NULL, NOW(), NOW()
  ),
  (
    'c1000000-0000-0000-0000-000000000009',
    'Healthcare',
    'Medical bills, insurance and pharmacy',
    '#ec4899',
    NULL,
    true, NULL, NOW(), NOW()
  ),
  (
    'c1000000-0000-0000-0000-000000000010',
    'Entertainment',
    'Streaming, events, hobbies and leisure',
    '#a855f7',
    NULL,
    true, NULL, NOW(), NOW()
  ),
  (
    'c1000000-0000-0000-0000-000000000011',
    'Shopping',
    'Clothing, electronics and general purchases',
    '#6366f1',
    NULL,
    true, NULL, NOW(), NOW()
  ),
  (
    'c1000000-0000-0000-0000-000000000012',
    'Education',
    'Tuition, courses, books and learning materials',
    '#0ea5e9',
    NULL,
    true, NULL, NOW(), NOW()
  )

ON CONFLICT (id) DO NOTHING;