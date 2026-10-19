import {concepts} from './store.mjs';
const stop=new Set('a an the is are to of for in on and or with what how explain please me easy simple concept notes pannu sollu la oda intha enna about tell'.split(' '));
export function tokens(s){return (s.toLowerCase().match(/[\p{L}\p{N}]+/gu)||[]).filter(t=>t.length>1&&!stop.has(t));}
export function search(query,filters={},limit=5){
 let rows=concepts().filter(r=>(!filters.department||r.department===filters.department||r.department==='COMMON')&&(!filters.semester||r.semester===Number(filters.semester))&&(!filters.regulation||r.regulation===filters.regulation)&&(!filters.university||r.university===filters.university)&&(!filters.reviewedOnly||r.source.review_status==='reviewed'));
 const words=[...new Set(tokens(query))];if(!words.length)return [];
 const docs=rows.map(r=>tokens([r.topic,r.topic,r.topic,r.subject,r.explanation_en,r.explanation_thanglish,r.worked_example].join(' ')));
 const avg=docs.reduce((s,d)=>s+d.length,0)/(docs.length||1);const n=docs.length;
 const df=new Map(words.map(w=>[w,docs.filter(d=>d.includes(w)).length]));
 return rows.map((r,i)=>{const d=docs[i];let score=0;for(const w of words){const tf=d.filter(t=>t===w).length;if(tf){const idf=Math.log(1+(n-df.get(w)+0.5)/(df.get(w)+0.5));score+=idf*(tf*2.2)/(tf+1.2*(0.25+0.75*d.length/(avg||1)));}}const title=tokens(r.topic);const hits=words.filter(w=>title.includes(w)).length;score+=hits*2;return {...r,relevance:Math.round(score*100)/100,titleHits:hits};}).filter(r=>r.relevance>0).sort((a,b)=>b.relevance-a.relevance).slice(0,limit);
}
export function groundedAnswer(query,filters,language='English',mode='explain'){
 const hits=search(query,filters,3);
 // Conservative gate: do not pretend incidental body-word overlap answers an unrelated question.
 if(!hits.length||(!hits[0].titleHits&&hits[0].relevance<3))return {answer:'I could not find a strong matching note. Try a specific topic name or import notes for this subject. I will not invent a syllabus answer.',sources:[],mode:'retrieval',grounded:false};
 const r=hits[0];const content=language==='Thanglish'&&r.explanation_thanglish?r.explanation_thanglish:r.explanation_en;
 let answer=mode==='revision'?`${r.topic}\n\n${content}\n\nKey relation: ${r.formula||'Not supplied'}\nRemember: ${r.common_mistake||'Review the original source.'}`:mode==='quiz'?(r.quiz?`${r.quiz.question}\n\nThink first. Open this concept in the library to reveal and record your answer.`:'No authored practice question is available for this note.'):`${r.topic}\n\n${content}\n\nWorked example\n${r.worked_example||'No worked example supplied.'}\n\nFormula / key relation\n${r.formula||'Not supplied.'}\n\nCommon mistake\n${r.common_mistake||'Not supplied.'}`;
 if(language==='Thanglish'&&!r.explanation_thanglish)answer+='\n\nThanglish translation is not available in retrieval mode. Connect a model for translation.';
 return {answer,sources:hits.map(h=>({id:h.id,topic:h.topic,...h.source})),mode:'retrieval',grounded:true};
}
