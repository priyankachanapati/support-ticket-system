import fs from 'node:fs';
import path from 'node:path';

const FORBIDDEN_PATTERNS = [
  'dangerouslySetInnerHTML',
  'innerHTML',
  'insertAdjacentHTML',
  'document.write',
  'eval(',
];

function collectSourceFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(fullPath));
    } else if (
      /\.(js|jsx|ts|tsx)$/.test(entry.name) &&
      !entry.name.endsWith('safe-render.test.js')
    ) {
      files.push(fullPath);
    }
  }
  return files;
}

describe('safe plain-text rendering source scan', () => {
  it('contains no unsafe HTML insertion or dynamic eval APIs in src/', () => {
    const srcRoot = path.resolve(process.cwd(), 'src');
    const files = collectSourceFiles(srcRoot);
    expect(files.length).toBeGreaterThan(0);

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf8');
      for (const pattern of FORBIDDEN_PATTERNS) {
        expect(content).not.toContain(pattern);
      }
    }
  });
});
