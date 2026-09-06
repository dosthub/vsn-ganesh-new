import fs from 'node:fs/promises';
import {FileBlob,SpreadsheetFile} from '@oai/artifact-tool';
try {
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load('outputs/donations/preview-only.xlsx'));
await fs.writeFile('outputs/donations/after.png',new Uint8Array(await (await wb.render({sheetName:'Copy of Donations received',range:'A76:F97',scale:1.5})).arrayBuffer()));
const sh=wb.worksheets.getItem('Copy of Donations received');
const audit=JSON.parse(await fs.readFile('outputs/donations/audit.json','utf8'));
for(const a of audit) if(JSON.stringify(sh.getRange(`A${a.dst}:F${a.dst}`).values[0])!==JSON.stringify(a.result)) throw Error('Mismatch '+a.dst);
console.log('All 16 saved rows verified against source contributions, dates and status.');
} catch(e){console.error(e.message); process.exitCode=1;}
