import type {PublicPlayer} from './types';

/** Stable order for podium display. The server rank is authoritative when both ranks exist. */
export function orderPodiumPlayers(players:readonly PublicPlayer[]):PublicPlayer[]{
 const collator=new Intl.Collator('pt-BR',{numeric:true,sensitivity:'base'});
 return [...players].sort((a,b)=>{
   const aRank=Number(a.rank),bRank=Number(b.rank);
   if(a.rank!=null&&b.rank!=null&&Number.isFinite(aRank)&&Number.isFinite(bRank)&&aRank!==bRank)return aRank-bRank;
   const aScore=Number(a.score)||0,bScore=Number(b.score)||0;
   if(aScore!==bScore)return bScore-aScore;
   return collator.compare(a.nickname,b.nickname)||collator.compare(a.player_id,b.player_id);
 });
}
