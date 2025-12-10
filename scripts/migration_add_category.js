const { db } = require('@vercel/postgres');

async function addCategoryColumn() {
  const client = await db.connect();

  try {
    await client.sql`BEGIN`;

    await client.sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(50);`;
    
    await client.sql`UPDATE products SET category = 'Other' WHERE category IS NULL;`;

    await client.sql`COMMIT`;
    console.log('Successfully added category column and updated existing records.');
  } catch (error) {
    await client.sql`ROLLBACK`;
    console.error('Error adding category column:', error);
  } finally {
    await client.end();
  }
}

addCategoryColumn();
