import fs from 'node:fs';
import path from 'node:path';
import {importRecords} from '../lib/store.mjs';
const [folder,metadataFile]=process.argv.slice(2);if(!folder||!metadataFile){console.error('Usage: node scripts/import_folder.mjs ./licensed-notes ./metadata.json');process.exit(1);}
const meta=JSON.parse(fs.readFileSync(metadataFile,'utf8'));if(meta.permissionConfirmed!==true)throw Error('Metadata must contain permissionConfirmed: true');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):e.isFile()?[path.join(dir,e.name)]:[]);}
let added=0,duplicates=0;for(const file of walk(path.resolve(folder))){if(!/\.(txt|md|json|jsonl)$/i.test(file))continue;const text=fs.readFileSync(file,'utf8');let rows;if(/\.json$/i.test(file))rows=JSON.parse(text);else if(/\.jsonl$/i.test(file))rows=text.split(/\r?\n/).filter(x=>x.trim()).map(x=>JSON.parse(x));else{rows=[];for(let i=0;i<text.length;i+=3000)rows.push({...meta,topic:path.basename(file)+' part '+(i/3000+1),explanation_en:text.slice(i,i+3000),source:{...meta.source,title:path.relative(folder,file)}});}
 const result=importRecords(rows);added+=result.added;duplicates+=result.duplicates;console.log(path.basename(file),result);}
console.log({added,duplicates,note:'Imports are unreviewed; open the dashboard for source review. No model calls were made.'});
