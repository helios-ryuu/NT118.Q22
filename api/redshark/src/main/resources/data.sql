-- Seed users table (only insert if empty)
INSERT INTO users (name, age)
SELECT 'Alice', 28
WHERE NOT EXISTS (SELECT 1 FROM users);

INSERT INTO users (name, age)
SELECT 'Bob', 34
WHERE NOT EXISTS (SELECT 1 FROM users LIMIT 1 OFFSET 1);

INSERT INTO users (name, age)
SELECT 'Charlie', 22
WHERE NOT EXISTS (SELECT 1 FROM users LIMIT 1 OFFSET 2);
