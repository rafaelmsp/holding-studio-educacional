export type RoomStatus='waiting'|'running'|'paused'|'finished';
export type OptionKind='correct'|'gray'|'risky'|'criminal';
export type QuestionOption={index:number;text:string;kind?:OptionKind};
export type GameQuestion={id:string;round:number;caseTitle?:string;text:string;options:QuestionOption[];correctIndex?:number;explanation?:string;};
export type PublicRoom={
 room_id:string;code:string;case_key:string;case_title:string;status:RoomStatus;
 room_revision:number;round_key?:string;current_round:number;question:GameQuestion|null;
 question_time_sec?:number;round_started_at?:string;remaining_ms?:number;deadline_at?:string;
 locked:boolean;revealed:boolean;responded:number;players_total:number;players_connected:number;
 entry_open?:boolean;answer_distribution?:Record<string,number>;correction_policy?:string;
 average_exposure?:number;ocultou_bens_count?:number;ocultacao_descoberta_count?:number
};
export type PublicPlayer={
 player_id:string;room_id?:string;nickname:string;score:number;rank?:number|null;
 connected?:boolean;answered_current?:boolean;current_round?:number;player_status?:string;
 exposure?:number;ocultou_bens?:boolean;ocultacao_descoberta?:boolean;
 counters?:Record<string,number>;
};
export type PlayerAnswer={id?:string;question_id?:string;round_key?:string;option_index?:number;classification?:OptionKind;response_time_ms?:number};
export type PrivatePlayer={
 id:string;nickname:string;score:number;exposure:number;ocultou_bens?:boolean;
 ocultacao_descoberta?:boolean;patrimonio_bloqueado?:number;
 answers:PlayerAnswer[];counters?:Record<string,number>;final_result?:{resultLabel?:string};
};
export type PrivateRoom={
 code:string;caseKey:string;caseTitle?:string;status:RoomStatus;currentRound?:number;
 current_round?:number;roundKey?:string;room_revision?:number;roundRevision?:number;
 locked?:boolean;revealed?:boolean;correctionPolicy?:string;correction_policy?:string;
 question:GameQuestion|null;roundStartedAt?:string;round_started_at?:string;deadlineAt?:string;deadline_at?:string;
 remainingMs?:number;remaining_ms?:number;questionTimeSec?:number;question_time_sec?:number;
};
export type PrivateSnapshot={room:PrivateRoom;player:PrivatePlayer};
export type AdminPlayer=PublicPlayer&{id:string;current_round?:number;currentRound?:number;player_status?:string;exposure:number};
export type AdminSnapshot={code:string;adminToken:string;room:PrivateRoom;players:AdminPlayer[];events?:unknown[]};
export type Session={playerId:string;sessionToken:string;nickname:string;avatarId:string;genderFilter:string};
export type RoomState={room:PublicRoom|null;players:PublicPlayer[];admin:AdminSnapshot|null;player:PrivateSnapshot|null;online:boolean;loading:boolean;error:string|null;avatars:Record<string,string>;presenceIds:string[]};
export const roundKey=(r:PrivateRoom|null|undefined)=>String(r?.roundKey||r?.room_revision||r?.currentRound||'');
export const revision=(r:PrivateRoom|null|undefined)=>Number(r?.room_revision??r?.roundRevision??-1);
export const currentRound=(r:PrivateRoom|null|undefined)=>Number(r?.currentRound??r?.current_round??1);
export function exposureLabel(x:number|null|undefined){const n=Number(x||0);return n<25?'BAIXA':n<50?'MODERADA':n<75?'ALTA':'CRÍTICA';}
export function timeLeft(room:PublicRoom|PrivateRoom|null|undefined){
 if(!room)return 0;
 if(room.status==='paused'){return Math.max(0,Math.ceil(Number(('remainingMs' in room?room.remainingMs:('remaining_ms' in room?room.remaining_ms:0))||0)/1000));}
 const deadline=('deadlineAt'in room?room.deadlineAt:room.deadline_at);
 if(deadline)return Math.max(0,Math.ceil((new Date(deadline).getTime()-Date.now())/1000));
 const started=('roundStartedAt'in room?room.roundStartedAt:room.round_started_at);
 const seconds=('questionTimeSec'in room?room.questionTimeSec:room.question_time_sec)||60;
 return started?Math.max(0,Number(seconds)-Math.floor((Date.now()-new Date(started).getTime())/1000)):Number(seconds);
}
export function formatClock(s:number){return String(Math.floor(Math.max(0,s)/60)).padStart(2,'0')+':'+String(Math.max(0,s)%60).padStart(2,'0');}
export function requestId(type:string){return type+'-'+crypto.randomUUID();}
