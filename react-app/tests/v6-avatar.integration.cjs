const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('src/services/api.ts','utf8');
const base=source.match(/const SUPABASE_URL='([^']+)'/)?.[1];
const key=source.match(/const SUPABASE_KEY='([^']+)'/)?.[1];
assert.ok(base&&key,'Supabase publishable endpoint not configured');
const endpoint=base+'/functions/v1/the-crimes-live-v3-staging';
const id=()=>Math.random().toString(36).slice(2,11);
async function invoke(action,payload={}){
 const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',apikey:key},body:JSON.stringify({action,...payload})});
 const data=await response.json();
 return {response,data};
}
async function run(){
 const health=await invoke('health');
 assert.equal(health.response.status,200,'Staging function health');
 assert.equal(health.data.ok,true,'Healthy staging function');
 const created=await invoke('createRoom',{caseKey:'credores',maxPlayers:2,questionTimeSec:60,correctionPolicy:'host_reveal'});
 assert.equal(created.data.ok,true,'Create test room');
 const {code,adminToken}=created.data;
 assert.ok(/^CRIM-[0-9]{4}$/.test(code),'Valid room code');
 const joined=await invoke('join',{code,nickname:'QA_V6_'+id(),avatarId:'perita'});
 assert.equal(joined.data.ok,true,'Join with chosen character');
 const {sessionToken,playerId}=joined.data;
 assert.ok(sessionToken&&playerId,'Expected authenticated player session');
 const own=await invoke('playerState',{code,sessionToken});
 assert.equal(own.data.player?.avatar_id,'perita','Private player avatar was persisted');
 const publicUrl=base+'/rest/v1/game_player_public?select=player_id,avatar_id&player_id=eq.'+encodeURIComponent(playerId);
 const publicResponse=await fetch(publicUrl,{headers:{apikey:key}});
 assert.equal(publicResponse.status,200,'Public RLS read access');
 const rows=await publicResponse.json();
 assert.equal(rows?.[0]?.avatar_id,'perita','Public ranking reflects chosen avatar');
 const resumed=await invoke('join',{code,nickname:'Ignored',sessionToken,avatarId:'advogada'});
 assert.equal(resumed.data.ok,true,'Authenticated reconnect updates avatar');
 const refreshed=await invoke('playerState',{code,sessionToken});
 assert.equal(refreshed.data.player?.avatar_id,'advogada','Reconnect avatar persisted');
 const invalid=await invoke('join',{code,nickname:'Invalid_'+id(),avatarId:'intruso'});
 assert.equal(invalid.response.status,400,'Invalid avatar rejected by whitelist');
 const publicAgain=await fetch(publicUrl,{headers:{apikey:key}});
 const latest=await publicAgain.json();
 assert.equal(latest?.[0]?.avatar_id,'advogada','Public ranking updated after reconnection');
 console.log('V6 STAGING INTEGRATION OK: create room, player auth, avatar persisted, public ranking, reconnect and validation.');
 const finished=await invoke('finish',{code,adminToken,expectedRevision:0,requestId:'test-'+id()});
 if(finished.data.ok!==true)console.log('V6 NOTE: test room left in waiting state; cleanup can be done by administrator.');
}
run().catch(e=>{console.error('V6 STAGING FAILURE',e.message);process.exitCode=1;});
