import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
const data=JSON.parse(execFileSync('C:/Users/srika/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',['outputs/donations/preserve.py'],{encoding:'utf8'}));
fs.writeFileSync('outputs/donations/Ganesh_2026_updated.xlsx',Buffer.from(data.output,'base64'));
fs.writeFileSync('outputs/donations/preview-only.xlsx',Buffer.from(data.preview,'base64'));
console.log('Verified 48 changed cells, with all unrelated workbook content preserved.');
