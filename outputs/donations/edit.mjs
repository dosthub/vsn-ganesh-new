import fs from 'node:fs/promises';
import {FileBlob, SpreadsheetFile, Workbook} from '@oai/artifact-tool';
try {
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load('C:/Users/srika/Downloads/Ganesh 2026.xlsx'));
const sh=wb.worksheets.getItem('Copy of Donations received ');
const pairs=[[3,167],[5,111],[6,90],[7,154],[9,127],[10,121],[11,97],[13,102],[14,66],[15,76],[16,151],[17,128],[18,162],[19,131],[22,185],[23,83]];
const audit=[];
for(const [src,dst] of pairs){
 sh.getRange(`C${dst}:D${dst}`).copyFrom(sh.getRange(`C${src}:D${src}`),'values');
 sh.getRange(`F${dst}`).copyFrom(sh.getRange(`F${src}`),'values');
 audit.push({src,dst,source:sh.getRange(`A${src}:F${src}`).values[0],result:sh.getRange(`A${dst}:F${dst}`).values[0]});
}
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!',options:{useRegex:true,maxResults:20},maxChars:2000})).ndjson);
await fs.writeFile('outputs/donations/audit.json',JSON.stringify(audit,null,2));
await (await SpreadsheetFile.exportXlsx(wb)).save('outputs/donations/authored.xlsx');
console.log(JSON.stringify({updated:audit.length,total:audit.reduce((s,a)=>s+a.result[2],0)}));
} catch(e) { console.error(e.message); process.exitCode=1; }
