// import { INestApplication, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';

// @Injectable()
// export class PrismaService
//   extends PrismaClient
//   implements OnModuleInit, OnModuleDestroy
// {
//   async onModuleInit() {
//     await this.$connect();
//   }

//   async onModuleDestroy() {
//     await this.$disconnect();
//   }

//   async enableShutdownHooks(app: INestApplication) {
//     this.$on('beforeExit' as never, async () => {
//       await app.close();
//     });
//   }
// }

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool, PoolConfig } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleDestroy, OnModuleInit
{
  constructor() {
    const connectionString = process.env.DATABASE_URL || '';
    const pool = new Pool(buildPoolConfig(connectionString));
    const adapter = new PrismaPg(pool);
    super({
      adapter,
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

function buildPoolConfig(connectionString: string): PoolConfig {
  try {
    const url = new URL(connectionString);
    const sslMode = url.searchParams.get('sslmode');
    const shouldUseSsl =
      sslMode === 'require' ||
      sslMode === 'verify-ca' ||
      sslMode === 'verify-full';

    if (!shouldUseSsl) {
      return { connectionString };
    }

    url.searchParams.delete('sslmode');

    return {
      connectionString: url.toString(),
      ssl: { rejectUnauthorized: true },
    };
  } catch {
    return { connectionString };
  }
}
