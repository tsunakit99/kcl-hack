const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const departments = ['共通', '知能情報工学科', '情報通信工学科', '知的システム工学科', '物理情報工学科', '生命化学情報工学科']; // 事前に用意した学科名

  for (const name of departments) {
    await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
