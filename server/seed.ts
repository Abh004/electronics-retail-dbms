import 'dotenv/config';

// --- NEW PRE-FLIGHT CHECK ---
// Check for DATABASE_URL *before* importing the 'db' file.
// This prevents the silent crash.
if (!process.env.DATABASE_URL) {
  console.error("  ❌ Error: DATABASE_URL not found.");
  console.error("     Please ensure your .env file exists and contains the DATABASE_URL.");
  process.exit(1); // Exit immediately
}

console.log("✅ DATABASE_URL found. Connecting...");

// Now it's safe to import these
import { db, pool } from './db';
import { brands } from '@shared/schema';


const brandData = [
  { name: 'JBL', discounts: '5.00' },
  { name: 'HP', discounts: '2.50' },
  { name: 'Lenovo' }, // Default discount (0.00) will be used
  { name: 'Apple' },
  { name: 'Samsung' },
  { name: 'Sony' },
];

async function seed() {
  console.log('🌱 Seeding brands...');

  // This will insert the data.
  // 'onConflictDoNothing' is important: it means if you run this
  // script again, it won't crash or create duplicates
  // because the 'name' column is unique.
  await db.insert(brands)
    .values(brandData)
    .onConflictDoNothing({
      target: brands.name,
    });

  console.log('   Brands seeded successfully.');
}

// Run the seed function
seed()
  .then(() => {
    console.log('✨ Seeding complete.');
  })
  .catch((err) => {
    // This will catch any *database* errors (like wrong password)
    console.error('   ❌ Error seeding database:', err.message);
    process.exit(1);
  })
  .finally(async () => {
    // End the pool connection so the script exits
    await pool.end();
    process.exit(0);
  });