const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
const bcrypt = require('bcryptjs');

// 1. Manually set DATABASE_URL if it's not being picked up correctly from process.env
const dbUrl = "postgresql://postgres:assist@localhost:5432/mlforge";

// 2. Setup connection pool
const pool = new pg.Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);

// 3. Initialize Prisma with the adapter
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = 'himanshu2168.be21@gmail.com';
    const password = 'MLForge@2026';

    console.log('--- Initializing SuperAdmin Creation ---');
    console.log(`Target Email: ${email}`);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.upsert({
            where: { email: email },
            update: {
                role: 'SUPERADMIN',
                password: hashedPassword,
                emailVerified: new Date(),
            },
            create: {
                email: email,
                name: 'Himanshu Gupta',
                role: 'SUPERADMIN',
                password: hashedPassword,
                emailVerified: new Date(),
            },
        });

        console.log('\n✅ SUCCESS: User created/updated as SUPERADMIN');
        console.log('-------------------------------------------');
        console.log(`- Email:    ${user.email}`);
        console.log(`- Role:     ${user.role}`);
        console.log(`- Status:   VERIFIED`);
        console.log(`- Password: [SECURELY_ENCRYPTED]`);
        console.log('-------------------------------------------');

    } catch (error) {
        console.error('\n❌ ERROR during SuperAdmin creation:');
        console.error(error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
