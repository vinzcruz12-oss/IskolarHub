# Database Setup Guide

## Prerequisites

- XAMPP installed and running (Apache + MySQL)
- MySQL port: 3306
- Web root: `C:\xampp\htdocs\`

## Database Details

- **Database Name:** `iskolarhub`
- **Username:** `root`
- **Password:** `` (empty)
- **Host:** `localhost`

## Setup Steps

### Fresh Installation

1. Open **phpMyAdmin** in your browser:
   ```
   http://localhost/phpmyadmin
   ```

2. Click **New** to create a new database.

3. Enter database name: `iskolarhub`

4. Click **Create**.

5. Select the `iskolarhub` database, then click **Import**.

6. Import files in this order:
   - First: `database/schema.sql`
   - Second: `database/seeds.sql`

### Updating an Existing Database

If you already have an `iskolarhub` database from a previous version:

1. Open **phpMyAdmin**.
2. Select the `iskolarhub` database.
3. Click **Import**.
4. Import `database/migrate.sql` to update table structures.
5. Then import `database/seeds.sql` to add sample data.

## Verify Setup

After importing, verify the following tables exist:

- `students`
- `scholarships`
- `admins`

## Default Admin Account

After running `seeds.sql`, you can log in with:

- **Username:** `admin`
- **Password:** `admin123`
- **Username:**

## Troubleshooting

### "Database has not been initialized"

The database `iskolarhub` does not exist. Follow the **Fresh Installation** steps above.

### "Required table 'students' was not found"

The tables were not imported correctly. Re-import `database/schema.sql`.

### "Database connection failed"

Ensure XAMPP MySQL service is running and the credentials in `config/database.php` are correct.
