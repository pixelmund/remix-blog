import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

let db = new PrismaClient();

async function seed() {
  await db.$connect();

  const user = await db.user.upsert({
    where: {
      username: "remix",
    },
    create: {
      username: "remix",
      email: "remix@remix.com",
      passwordHash: await bcrypt.hash("bf1234", 12),
    },
    update: {},
  });

  await db.post.create({
    data: {
      title: "Hello World",
      content: "Hello World, this is my first post",
      slug: "hello-world",
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });
}

seed()
  .then(() => console.log("Seeded successfully"))
  .catch(console.log)
  .finally(async () => {
    await db.$disconnect();
  });
