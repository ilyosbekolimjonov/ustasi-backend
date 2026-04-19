import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const regions = [
  ['Qoraqalpogiston Respublikasi', 'Республика Каракалпакстан', 'Republic of Karakalpakstan'],
  ['Andijon', 'Андижан', 'Andijan'],
  ['Buxoro', 'Бухара', 'Bukhara'],
  ['Fargona', 'Фергана', 'Fergana'],
  ['Jizzax', 'Джизак', 'Jizzakh'],
  ['Xorazm', 'Хорезм', 'Khorezm'],
  ['Namangan', 'Наманган', 'Namangan'],
  ['Navoiy', 'Навои', 'Navoi'],
  ['Qashqadaryo', 'Кашкадарья', 'Kashkadarya'],
  ['Samarqand', 'Самарканд', 'Samarkand'],
  ['Sirdaryo', 'Сырдарья', 'Syrdarya'],
  ['Surxondaryo', 'Сурхандарья', 'Surkhandarya'],
  ['Toshkent viloyati', 'Ташкентская область', 'Tashkent Region'],
  ['Toshkent shahri', 'Город Ташкент', 'Tashkent City'],
] as const;

function buildPool() {
  const connectionString = process.env.DATABASE_URL || '';
  const url = new URL(connectionString);
  const sslMode = url.searchParams.get('sslmode');

  if (sslMode === 'require' || sslMode === 'verify-ca' || sslMode === 'verify-full') {
    url.searchParams.delete('sslmode');
    return new Pool({
      connectionString: url.toString(),
      ssl: { rejectUnauthorized: true },
    });
  }

  return new Pool({ connectionString });
}

async function main() {
  const pool = buildPool();
  const prisma = new PrismaClient({
    adapter: new PrismaPg(pool),
  });

  try {
    for (const [nameUz, nameRu, nameEn] of regions) {
      const existing = await prisma.region.findFirst({
        where: { nameEn },
        select: { id: true },
      });

      if (existing) {
        await prisma.region.update({
          where: { id: existing.id },
          data: { nameUz, nameRu, nameEn },
        });
      } else {
        await prisma.region.create({
          data: { nameUz, nameRu, nameEn },
        });
      }
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

void main();
