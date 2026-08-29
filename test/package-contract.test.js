import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

test('the packed package exposes only the noaa-current-stations CLI and extractBundle', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'noaa-current-stations-'));
  const packed = mkdtempSync(join(root, 'packed-'));
  const installed = mkdtempSync(join(root, 'installed-'));
  const env = { ...process.env, npm_config_cache: join(root, 'npm-cache') };
  t.after(() => rmSync(root, { force: true, recursive: true }));

  execFileSync('npm', ['pack', '--pack-destination', packed], { cwd: process.cwd(), env, stdio: 'pipe' });
  const tarball = join(packed, readdirSync(packed).find((file) => file.endsWith('.tgz')));
  execFileSync('npm', ['install', '--ignore-scripts', '--no-save', tarball], { cwd: installed, env, stdio: 'pipe' });

  const bin = join(installed, 'node_modules', '.bin');
  const command = join(bin, 'noaa-current-stations');
  assert.equal(existsSync(command), true);
  assert.equal(existsSync(join(bin, 'current-stations')), false);

  const help = spawnSync(command, ['--help'], { encoding: 'utf8' });
  assert.match(help.stdout, /^noaa-current-stations/m);

  const check = join(installed, 'package-contract.mjs');
  writeFileSync(check, "import { extractBundle } from '@openwaters/noaa-current-stations';\nif (typeof extractBundle !== 'function') process.exit(1);\n");
  assert.equal(spawnSync(process.execPath, [check]).status, 0);
});
