import bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Role, User } from '../auth/entities/auth.entity.js';
import { Category, Event, Image, Review, Tag } from '../app.entity.js';

process.loadEnvFile('.env.development');

const SALT_ROUNDS = 10;

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_username,
  password: process.env.DB_password,
  database: 'test',
  entities: [Role, User, Category, Tag, Event, Image, Review],
  synchronize: true,
});

const seedUsers = [
  { name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { name: 'Assistant', email: 'assistant@example.com', password: 'assistant123', role: 'assistant' },
];

async function seed() {
  await dataSource.initialize();
  const roles = dataSource.getRepository(Role);
  const users = dataSource.getRepository(User);

  for (const { role: roleName, ...data } of seedUsers) {
    let role = await roles.findOneBy({ name: roleName });
    if (!role) role = await roles.save(roles.create({ name: roleName }));

    const password = await bcrypt.hash(data.password, SALT_ROUNDS);
    const existing = await users.findOneBy({ email: data.email });
    if (existing) {
      await users.update(existing.id, { name: data.name, password, role });
      console.log(`updated: ${data.email} (${roleName})`);
      continue;
    }
    await users.save(users.create({ ...data, password, role }));
    console.log(`created: ${data.email} (${roleName})`);
  }

  await dataSource.destroy();
}

seed().catch(async (err) => {
  console.error(err);
  if (dataSource.isInitialized) await dataSource.destroy();
  process.exit(1);
});
