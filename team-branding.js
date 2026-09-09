(()=>{
'use strict';
const TEAMS=[
 {name:'Северсталь',color:'#000000',logo:'https://drive.google.com/thumbnail?id=10xBTOFy_ps1G3LNaHV3WpbQkuZ74pjRn&sz=w512'},
 {name:'Армия СКА',color:'#074A8A',logo:'https://drive.google.com/thumbnail?id=14XZX2FRyR5x_aVkU2SMLhW-Emk0RUkTo&sz=w512'},
 {name:'Спартак',color:'#D10000',logo:'https://drive.google.com/thumbnail?id=19kJ3uz-yyb1Z2y8qvRbFwuw_2kjUUD2f&sz=w512'},
 {name:'Динамо Москва',color:'#FFFFFF',logo:'https://drive.google.com/thumbnail?id=1I3KuJZEajmksDKtoBsdj4h_75fU0e_KY&sz=w512'},
 {name:'Динамо СПБ',color:'#30466A',logo:'https://drive.google.com/thumbnail?id=1x4KaAFMJ_qfmi26oVjnsc-huKpWtqBbh&sz=w512'},
 {name:'Динамо-Джуниверс',color:'#00DD00',logo:'https://drive.google.com/thumbnail?id=1HTqvh6fg5ZzOLFwOtY62zucjnRZyOXmu&sz=w512',aliases:['Динамо Джуневерс','Динамо Джуниверс']},
 {name:'Локомотив',color:'#00256D',logo:'https://drive.google.com/thumbnail?id=1D6wJnaawN4kMt-1ZWTSvf-trYkslzyKi&sz=w512'},
 {name:'Локомотив 2004',color:'#00256D',logo:'https://drive.google.com/thumbnail?id=1sq7UHtBq_xiexekxmzWawF3yVTaEl-J-&sz=w512',aliases:['Локомотив-2004']},
 {name:'АКМ',color:'#09274F',logo:'https://drive.google.com/thumbnail?id=1NmPj1OwI3C1yuNmgt2XX57HbEiiDauB7&sz=w512'},
 {name:'Ак Барс',color:'#CE1F2E',logo:'https://drive.google.com/thumbnail?id=1I09r6XwD-9L4r5ojPGKCHsJ5WGUyOFy1&sz=w512'},
 {name:'Авангард',color:'#7E7764',logo:'https://drive.google.com/thumbnail?id=1y6CZfZSXYDVqCAjOvv6xB_7Fwu1AQwvn&sz=w512'},
 {name:'Крылья Советов',color:'#0B167F',logo:'https://drive.google.com/thumbnail?id=1n6ViHZhkRvq_R_Ul1PEHnFnX7HVNk6-p&sz=w512'},
 {name:'Красная Машина Юниор',color:'#9E1C10',logo:'https://drive.google.com/thumbnail?id=1qATM0WxWDCgYfemDQvhdy30Ub0sWSWWV&sz=w512'},
 {name:'Трактор',color:'#1C1919',logo:'https://drive.google.com/thumbnail?id=1qWTRWy-p36RDSMlAy4AqA60PrrUTaczd&sz=w512'},
 {name:'ЦСКА',color:'#1F4285',logo:'https://drive.google.com/thumbnail?id=1bT6o4afTqonyA05keLbe_nfQ78sAmNda&sz=w512'},
 {name:'МАХ',color:'#F3F3F3',logo:'https://drive.google.com/thumbnail?id=1Veii4NYgKc06nRtxKmCRQv1YCE164YZP&sz=w512'},
 {name:'Нефтехимик',color:'#002E54',logo:'https://drive.google.com/thumbnail?id=1csEdtjesEvgAFSsfnfhmWUnUE23Tnqeg&sz=w512'},
 {name:'Сибирь',color:'#02153F',logo:'https://drive.google.com/thumbnail?id=1Xul8VXC7juk2NHQfb28Cl9Jt_Kj0Obw-&sz=w512'},
 {name:'Торпедо',color:'#10069F',logo:'https://drive.google.com/thumbnail?id=17NYLCFaSrX6q4g0T7jhBnmidrI1JzKl9&sz=w512'},
 {name:'Лада',color:'#133A65',logo:'https://drive.google.com/thumbnail?id=15mcwMoXT7OaH46jj8w90PCeTtJY54UAF&sz=w512'}
];
const norm=s=>String(s||'').toLocaleLowerCase('ru-RU').replace(/ё/g,'е').replace(/[«»"']/g,'').replace(/[-–—]+/g,' ').replace(/\s+/g,' ').trim();
const index=new Map();
for(const team of TEAMS){index.set(norm(team.name),team);for(const a of team.aliases||[])index.set(norm(a),team)}
function get(name){return index.get(norm(name))||null}
function inkFor(hex){const h=String(hex||'').replace('#','');if(h.length!==6)return'#FFFFFF';const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return(.299*r+.587*g+.114*b)>172?'#07111F':'#FFFFFF'}
window.RussianCupTeamBranding=Object.freeze({teams:Object.freeze(TEAMS.map(t=>Object.freeze({...t}))),get,norm,inkFor});
})();
