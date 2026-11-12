import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const dist=path.join(root,'react-live');
const primary=path.join(root,'live');
const legacy=path.join(root,'legacy-live');
const staging=path.join(root,'.live-react-staging');
const rollback=path.join(root,'.live-react-rollback');

const read=name=>fs.readFileSync(name,'utf8');
const exists=name=>fs.existsSync(name);
const ensure=(test,message)=>{if(!test)throw Error('Deploy guard: '+message)};

ensure(exists(path.join(dist,'index.html')),'React Vite build missing');
ensure(exists(path.join(dist,'showroom.html')),'React gallery missing');
const index=read(path.join(dist,'index.html'));
ensure(index.includes('id="root"')&&index.includes('./bundles/'),'Output index is not React');
ensure(read(path.join(dist,'showroom.html')).includes('data-screen="jogador"'),'Gallery incomplete');
ensure(!exists(rollback),'Rollback directory exists: inspect manually');
if(!exists(legacy)){
  ensure(exists(path.join(primary,'app.js')),'Original HTML not found for backup');
  fs.cpSync(primary,legacy,{recursive:true,errorOnExist:true,force:false});
}
ensure(exists(path.join(legacy,'index.html'))&&exists(path.join(legacy,'app.js')),'Legacy backup incomplete');
if(exists(staging))fs.rmSync(staging,{recursive:true,force:true});
fs.cpSync(dist,staging,{recursive:true});
let moved=false;
try{
 if(exists(primary)){fs.renameSync(primary,rollback);moved=true;}
 fs.renameSync(staging,primary);
 if(moved)fs.rmSync(rollback,{recursive:true,force:true});
}catch(error){
 if(moved&&exists(primary))fs.rmSync(primary,{recursive:true,force:true});
 if(moved&&exists(rollback))fs.renameSync(rollback,primary);
 throw error;
}
ensure(read(path.join(primary,'index.html'))===index,'Primary index not synchronized');
console.log('THE CRIMES LIVE: React deployed to /live/, HTML backup kept in /legacy-live/');
