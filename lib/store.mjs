import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';
export const root=process.env.NOTES_PROJECT_ROOT || (fs.existsSync(path.join(process.cwd(),'data/concepts.json')) ? process.cwd() : path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
const stateFile=process.env.NOTES_STATE_FILE || path.join(root,'runtime','state.json');
const empty=()=>({imports:[],bookmarks:[],attempts:[],history:[]});
export function state(){if(!fs.existsSync(stateFile))return empty();return {...empty(),...JSON.parse(fs.readFileSync(stateFile,'utf8'))};}
export function mutate(fn){const s=state();fn(s);fs.mkdirSync(path.dirname(stateFile),{recursive:true});fs.writeFileSync(stateFile+'.tmp',JSON.stringify(s));fs.renameSync(stateFile+'.tmp',stateFile);return s;}
export function concepts(){return [...JSON.parse(fs.readFileSync(path.join(root,'data/concepts.json'),'utf8')),...state().imports];}
export const departments=['COMMON','IT','CSE','ECE','EEE','MECH','AI','CSBS','CIVIL'];
export function validateRecord(r){
 if(!r||typeof r!=='object'||Array.isArray(r))throw Error('Each record must be an object');
 for(const k of ['department','subject','topic','explanation_en'])if(typeof r[k]!=='string'||!r[k].trim()||r[k].length>60000)throw Error('Missing or invalid '+k);
 if(!departments.includes(r.department))throw Error('Unknown department');
 if(!r.source||typeof r.source.title!=='string'||!r.source.title.trim()||typeof r.source.license!=='string'||!r.source.license.trim())throw Error('Source title and permission/license are required');
 for(const k of ['university','regulation','subject_code'])if(r[k]!=null&&(typeof r[k]!=='string'||r[k].length>200))throw Error('Invalid '+k);
 for(const k of ['semester','unit'])if(r[k]!=null&&(!Number.isInteger(r[k])||r[k]<1||r[k]>(k==='semester'?8:20)))throw Error('Invalid '+k);
 const text=k=>typeof r[k]==='string'?r[k].slice(0,60000):'';
 return {id:'USR-'+randomUUID(),department:r.department,subject:r.subject.trim(),topic:r.topic.trim(),university:r.university||null,regulation:r.regulation||null,semester:r.semester||null,unit:r.unit||null,subject_code:r.subject_code||null,content_type:'concept_note',explanation_en:r.explanation_en.trim(),explanation_thanglish:text('explanation_thanglish'),worked_example:text('worked_example'),formula:text('formula'),common_mistake:text('common_mistake'),quiz:r.quiz&&typeof r.quiz.question==='string'&&typeof r.quiz.answer==='string'?{question:r.quiz.question.slice(0,1000),answer:r.quiz.answer.slice(0,2000)}:null,source:{type:'user_upload',title:r.source.title.slice(0,300),license:r.source.license.slice(0,300),url:typeof r.source.url==='string'?r.source.url.slice(0,1000):null,page:r.source.page??null,review_status:'unreviewed'},split:'unassigned',version:1};
}
export function importRecords(input){
 if(!Array.isArray(input)||!input.length||input.length>5000)throw Error('Import 1 to 5000 records per batch');
 const valid=input.map(validateRecord); // validate the whole batch before writing anything
 const fingerprint=r=>createHash('sha256').update([r.department,r.subject,r.topic,r.explanation_en].join('\n').toLowerCase()).digest('hex');
 const known=new Set(concepts().map(fingerprint));const added=[];
 for(const r of valid){const fp=fingerprint(r);if(!known.has(fp)){known.add(fp);added.push(r);}}
 mutate(s=>s.imports.push(...added));return {added:added.length,duplicates:valid.length-added.length};
}
