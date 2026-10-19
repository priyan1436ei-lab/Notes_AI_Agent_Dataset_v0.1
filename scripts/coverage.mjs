import fs from 'node:fs';
import {concepts} from '../lib/store.mjs';
const file=process.argv[2];if(!file){console.error('Usage: node scripts/coverage.mjs path/to/official-syllabus.json');process.exit(1);}
const syllabus=JSON.parse(fs.readFileSync(file,'utf8'));if(!Array.isArray(syllabus)||!syllabus.length)throw Error('Provide a nonempty topic array');
const keys=['university','regulation','department','semester','subject_code','unit','topic'];const norm=v=>String(v??'').trim().toLowerCase();const rows=concepts();
const report=syllabus.map(s=>{for(const key of keys)if(!s[key]||norm(s[key]).includes('replace'))throw Error('Replace all template values and include '+key);const matched=rows.filter(r=>keys.every(k=>norm(r[k])===norm(s[k])));return {...s,matching_records:matched.length,reviewed_records:matched.filter(r=>r.source.review_status==='reviewed').length,status:matched.some(r=>r.source.review_status==='reviewed')?'reviewed':matched.length?'draft':'missing'};});
console.log(JSON.stringify({topics:report.length,reviewed_topics:report.filter(r=>r.status==='reviewed').length,draft_topics:report.filter(r=>r.status==='draft').length,missing_topics:report.filter(r=>r.status==='missing').length,details:report},null,2));
