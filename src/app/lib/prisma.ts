// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = global as unknown as {
//   prisma: PrismaClient | undefined;
// };

// // 既にグローバルに存在しない場合のみ新しいPrismaClientを作成
// if (!globalForPrisma.prisma) {
//   globalForPrisma.prisma = new PrismaClient();
// }

// const prisma = globalForPrisma.prisma;

// export default prisma;

// prisma.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
