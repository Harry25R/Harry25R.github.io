import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { minify } from 'terser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.resolve(__dirname, '../assets/js/src');
const outRoot = path.resolve(__dirname, '../assets/js');

async function listFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(fullPath);
    if (entry.isFile() && entry.name.endsWith('.js')) return fullPath;
    return [];
  }));
  return files.flat();
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function build() {
  const files = await listFiles(srcRoot);
  await ensureDir(outRoot);
  for (const file of files) {
    const source = await fs.readFile(file, 'utf8');
    const relative = path.relative(srcRoot, file);
    const outPath = path.join(outRoot, relative).replace(/\\/g, '/');
    await ensureDir(path.dirname(outPath));
    const result = await minify(source, {
      module: true,
      compress: true,
      mangle: true,
      format: { ecma: 2020 }
    });
    if (!result.code) throw new Error(`Failed to minify ${file}`);
    await fs.writeFile(outPath, result.code, 'utf8');
  }
  // Copy non-module assets if any (none currently), ensure index module exists.
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
