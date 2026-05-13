import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'public', 'icons', 'source.svg');
const outDir = path.join(root, 'public', 'icons');

let sharp;
try {
  ({ default: sharp } = await import('sharp'));
} catch (error) {
  console.warn('Skipping PWA icon generation: optional devDependency "sharp" is not installed.', error?.message || error);
  process.exit(0);
}

const generateIcon = async ({ size, filename, maskable = false }) => {
  const padding = maskable ? Math.round(size * 0.12) : 0;
  const input = await sharp(source)
    .resize(size - padding * 2, size - padding * 2, { fit: 'contain' })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: '#050b14',
    },
  })
    .composite([{ input, left: padding, top: padding }])
    .png()
    .toFile(path.join(outDir, filename));
};

await fs.mkdir(outDir, { recursive: true });
await Promise.all([
  generateIcon({ size: 192, filename: 'icon-192.png' }),
  generateIcon({ size: 512, filename: 'icon-512.png' }),
  generateIcon({ size: 512, filename: 'maskable-512.png', maskable: true }),
]);
