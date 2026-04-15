import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env['DATABASE_URL'] });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  console.log('Seeding database...');

  const admin = await prisma.user.upsert({
    where: { email: 'formateur@example.com' },
    update: {},
    create: { email: 'formateur@example.com', name: 'Formateur', role: 'ADMIN' },
  });

  const contacts = await Promise.all([
    prisma.contact.upsert({ where: { id: 'seed_c1' }, update: {}, create: { id: 'seed_c1', name: 'Marie Dupont', company: 'Cabinet MD', status: 'PROSPECT', tags: ['RH', 'Leadership'], assigneeId: admin.id } }),
    prisma.contact.upsert({ where: { id: 'seed_c2' }, update: {}, create: { id: 'seed_c2', name: 'Jean Lefebvre', status: 'PROSPECT', tags: [], lastContact: new Date(Date.now() - 86400000 * 2) } }),
    prisma.contact.upsert({ where: { id: 'seed_c3' }, update: {}, create: { id: 'seed_c3', name: 'Sophie Martin', company: 'Startup XYZ', status: 'CONTACTED', tags: [], lastContact: new Date(Date.now() - 86400000) } }),
    prisma.contact.upsert({ where: { id: 'seed_c4' }, update: {}, create: { id: 'seed_c4', name: 'Pierre Bernard', company: 'PME Conseil', status: 'QUALIFIED', tags: ['Management'], lastContact: new Date() } }),
    prisma.contact.upsert({ where: { id: 'seed_c5' }, update: {}, create: { id: 'seed_c5', name: 'Claire Rousseau', company: 'Banque Verte', status: 'PROPOSAL', tags: [], lastContact: new Date(Date.now() - 86400000 * 5) } }),
    prisma.contact.upsert({ where: { id: 'seed_c6' }, update: {}, create: { id: 'seed_c6', name: 'Thomas Garnier', company: 'Industrie 4.0', status: 'WON', tags: [], lastContact: new Date(Date.now() - 86400000 * 10) } }),
  ]);

  await Promise.all([
    prisma.session.upsert({ where: { id: 'seed_s1' }, update: {}, create: { id: 'seed_s1', title: 'Leadership & Management', contactId: contacts[0].id, date: new Date(Date.now() + 86400000 * 2), duration: 180, status: 'CONFIRMED' } }),
    prisma.session.upsert({ where: { id: 'seed_s2' }, update: {}, create: { id: 'seed_s2', title: 'Prise de parole en public', contactId: contacts[3].id, date: new Date(Date.now() + 86400000 * 5), duration: 120, status: 'PLANNED' } }),
    prisma.session.upsert({ where: { id: 'seed_s3' }, update: {}, create: { id: 'seed_s3', title: 'Intelligence émotionnelle', contactId: contacts[5].id, date: new Date(Date.now() - 86400000 * 3), duration: 240, status: 'DONE' } }),
  ]);

  console.log(`Seed complete — ${contacts.length} contacts, 3 sessions.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
