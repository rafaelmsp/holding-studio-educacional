import {test} from 'node:test';
import assert from 'node:assert/strict';
import {orderPodiumPlayers} from '../src/services/ranking.ts';

const p=(id,nickname,score,rank)=>({player_id:id,nickname,score,rank});
test('authoritative server ranks win over point ordering',()=>{
 const players=[p('b','Beto',900,2),p('c','Carlos',850,3),p('a','Ana',800,1)];
 assert.deepEqual(orderPodiumPlayers(players).map(x=>x.player_id),['a','b','c']);
});
test('score ties resolve by locale-aware nickname and then immutable ID',()=>{
 const players=[p('z','Érica',500,null),p('q','Ana',500,null),p('r','Ana',500,null),p('s','Bruna',500,null)];
 assert.deepEqual(orderPodiumPlayers(players).map(x=>x.player_id),['q','r','s','z']);
 assert.deepEqual(orderPodiumPlayers([...players].reverse()).map(x=>x.player_id),['q','r','s','z']);
});
test('zero, one, two and three entrants work without mutating the input',()=>{
 for(let n=0;n<=3;n++){
  const entrants=[p('3','C',300,3),p('1','A',100,1),p('2','B',200,2)].slice(0,n);
  const previous=JSON.stringify(entrants);
  assert.equal(orderPodiumPlayers(entrants).length,n);
  assert.equal(JSON.stringify(entrants),previous);
 }
});
