const { execSync } = require('child_process');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const schemaBase = './prisma/schema-base.prisma';
const modelsPattern = './prisma/models/*.prisma';
const output = './prisma/schema.prisma';

try {
  execSync(
    `npx prisma-import -s "${schemaBase}" -s "${modelsPattern}" -o "${output}" -f`,
    { stdio: 'inherit', cwd: projectRoot, shell: true }
  );
  console.log('✅ Prisma schema merged successfully');
} catch (error) {
  console.error('❌ Failed to merge Prisma schema:', error.message);
  process.exit(1);
}

