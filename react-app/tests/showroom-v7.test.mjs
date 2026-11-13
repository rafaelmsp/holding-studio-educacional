import {test} from 'node:test';
import assert from 'node:assert/strict';
import {STAGES,showroomQuestion} from '../src/features/showroomStages.ts';

test('the demo has eight different legal investigation questions',()=>{
 assert.equal(STAGES.length,8);
 const prompts=Array.from({length:8},(_,i)=>showroomQuestion(i+1).text);
 assert.equal(new Set(prompts).size,8,'repeating one generic question over eight scenes is not acceptable');
});
test('each demo stage has exactly four options and one correct answer',()=>{
 for(let i=1;i<=8;i++){
  const q=showroomQuestion(i);
  assert.equal(q.round,i);
  assert.equal(q.id,'SHOWROOM-V7-'+i);
  assert.equal(q.options.length,4);
  assert.equal(q.options.filter(o=>o.kind==='correct').length,1);
  assert.equal(q.options[q.correctIndex].kind,'correct');
  assert.ok(q.explanation.length>=90,'explanation should add contextual value');
 }
});
test('simulated answer labels cover all option positions and do not mutate real game data',()=>{
 assert.deepEqual(STAGES.map(x=>x.answer),[0,1,2,3,0,1,2,3]);
 assert.equal(showroomQuestion(0).round,1);
 assert.equal(showroomQuestion(9).round,8);
 assert.ok(!JSON.stringify(STAGES).includes('sessionToken'));
});
