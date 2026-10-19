import fs from 'node:fs';
import path from 'node:path';
import {root,concepts} from '../lib/store.mjs';
const rows=concepts();const dir=path.join(root,'exports');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'all-notes.jsonl'),rows.map(r=>JSON.stringify(r)).join('\n')+'\n');
// Train/validation/test partitions group by content origin so chunks from one document cannot leak across splits.
// Starter remains train-only; future evaluation should use independently reviewed held-out material.
const buckets={train:[],validation:[],test:[]};const {createHash}=await import('node:crypto');for(const r of rows){const key=[r.source.title,r.source.url||'',r.university||'',r.regulation||''].join('|');const n=parseInt(createHash('sha256').update(key).digest('hex').slice(0,8),16)%100;const split=r.source.type==='synthetic'?'train':n<80?'train':n<90?'validation':'test';buckets[split].push({...r,split});}for(const [name,items] of Object.entries(buckets))fs.writeFileSync(path.join(dir,name+'.jsonl'),items.map(r=>JSON.stringify(r)).join('\n')+(items.length?'\n':''));console.log(Object.fromEntries(Object.entries(buckets).map(([k,v])=>[k,v.length])));console.log('Exported to exports/. Inspect and review before training. Starter-only exports have no held-out evaluation data.');
