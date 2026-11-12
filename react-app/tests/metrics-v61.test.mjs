import test from 'node:test';
import assert from 'node:assert/strict';
import {answeredAttempts,accuracyPercent} from '../src/services/score.ts';

test('rodadas sem resposta não contam como tentativas',()=>{
 const sample={correct:4,gray:1,risky:1,criminal:0,unanswered:2};
 assert.equal(answeredAttempts(sample),6);
 assert.equal(accuracyPercent(sample),67);
});
test('aluno com zero respostas',()=>{
 assert.equal(answeredAttempts({unanswered:8}),0);
 assert.equal(accuracyPercent({unanswered:8}),0);
 assert.equal(accuracyPercent(null),0);
});
test('pontuação perfeita',()=>{
 assert.equal(answeredAttempts({correct:8,unanswered:0}),8);
 assert.equal(accuracyPercent({correct:8}),100);
});
test('dados inválidos nunca criam tentativas negativas',()=>{
 assert.equal(answeredAttempts({correct:-2,gray:0,risky:1,unanswered:7}),1);
});
