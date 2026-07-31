/* GENERATED oleh tools/unpack-mockups.mjs dari reference/mockups/parent-web.html — JANGAN DIEDIT.
   Sumber kebenaran tetap berkas HTML-nya; berkas ini hanya supaya bisa di-grep. */


class Component extends DCLogic {
  constructor(props){
    super(props);
    this.C = 2*Math.PI*36;
    this.TODAY = new Date(2026,6,16);
    this.state = { authed:null, login:'pick', lgEmail:'', lgPass:'', kEmail:'', pin:'',
      tab:(props&&props.defaultTab)||'dash', kid:'arthur', seg:'ok', reqSel:null, insRange:'30d', insAll:false, insTipTab:'celebrate', insFrom:'2026-06-16', insTo:'2026-07-16', push:null, toast:null };
    this.initData();
  }
  initData(){
    const D = this.D = {};
    D.gold = { sell:1450000, buyback:1320000 };
    D.fx = { USD:16000, SGD:12000, EUR:17000 };
    D.rates = { 3:1.5, 6:2.5, 12:4 };
    D.priceDate = '16 Jul 2026';
    D.parents = [ {id:'p1',label:'Parent 1',email:'you@nummi.app',status:'joined'}, {id:'p2',label:'Parent 2',email:'',status:'none'} ];
    D.kids = {
      arthur:{ id:'arthur', name:'Arthur', emo:'🦊', tier:'MIDDLE · GR 2–6', tierLong:'Middle · Grade 2–6', little:false, born:'March 2016', gems:12,
        learn:{ starsEarned:120, chaptersDone:1, chaptersTotal:6, weekLessonDone:false, current:'Give money a job', last:'Money buys things' },
        allowance:{ on:true, amount:20000, freq:'weekly', dow:6, dom:1 },
        rules:{ mode:'flexible', split:{ on:true, spend:40, save:40, give:10, dest:{spend:'snacks',save:'freesavings',give:'give'} } },
        unsorted:50000,
        wallets:[
          {id:'snacks',name:'Snacks',ico:'🍡',cat:'spend',amt:45000},
          {id:'transport',name:'Transport',ico:'🚌',cat:'spend',amt:30000},
          {id:'games',name:'Games',ico:'🎮',cat:'spend',amt:20000},
          {id:'bmx',name:'BMX Bike',ico:'🚲',cat:'save',kind:'dream',amt:150000,target:400000,deadline:'Dec 2026'},
          {id:'headphones',name:'Headphones',ico:'🎧',cat:'save',kind:'dream',amt:30000,target:60000,deadline:'Sep 2026'},
          {id:'freesavings',name:'Free savings',ico:'💭',cat:'save',kind:'catchall',amt:60000},
          {id:'give',name:'Give',ico:'🎁',cat:'give',amt:40000},
          {id:'td',name:'Time Deposit',ico:'🏦',cat:'grow',amt:30750,meta:{kind:'td',principal:30000,ratePct:2.5,termMonths:6,start:'15 Jan 2026',maturity:'15 Jul 2026',matured:true}},
          {id:'gold',name:'Gold',ico:'🪙',cat:'grow',amt:19140,meta:{kind:'gold',grams:0.0145,cost:21000}},
          {id:'fxusd',name:'US Dollar',ico:'💵',cat:'grow',amt:9821,meta:{kind:'fx',ccy:'USD',units:0.62,cost:10000}}
        ],
        act:[
          {ic:'moon',label:'Lebaran THR from Om Rizal',when:'2 days ago',amt:'+50,000',c:'in'},
          {ic:'tag',label:'Sorted into Snacks',when:'2 days ago',amt:'20,000',c:'mid'},
          {ic:'tag',label:'Sorted into BMX Bike dream',when:'2 days ago',amt:'30,000',c:'mid'},
          {ic:'bank',label:'Time Deposit matured',when:'Yesterday',amt:'+750',c:'in'}
        ] },
      nadia:{ id:'nadia', name:'Nadia', emo:'🐰', tier:'LITTLE · KG–GR 1', tierLong:'Little · KG–Grade 1', little:true, born:'August 2020', gems:4,
        learn:{ starsEarned:30, chaptersDone:0, chaptersTotal:5, weekLessonDone:true, current:'What money is', last:null },
        allowance:{ on:false, amount:10000, freq:'weekly', dow:6, dom:1 },
        rules:{ mode:'strict', split:{ on:true, spend:50, save:30, give:20, dest:{spend:'spend',save:'save',give:'give'} } },
        unsorted:20000,
        wallets:[
          {id:'spend',name:'Spend',ico:'🍭',cat:'spend',amt:35000},
          {id:'save',name:'Save',ico:'🏦',cat:'save',kind:'catchall',amt:90000},
          {id:'give',name:'Give',ico:'🎁',cat:'give',amt:15000}
        ],
        act:[
          {ic:'gift',label:'Birthday gift from Grandma',when:'1 week ago',amt:'+100,000',c:'in'},
          {ic:'tag',label:'Sorted into Spend',when:'1 week ago',amt:'35,000',c:'mid'},
          {ic:'tag',label:'Sorted into Give',when:'1 week ago',amt:'15,000',c:'mid'}
        ] }
    };
    D.kids.arthur.tx = [
      {ic:'hand',label:'Cash out · comic book',sub:'From Snacks',date:'2026-07-16',amt:20000,dir:'out'},
      {ic:'bank',label:'Time Deposit matured',sub:'Interest paid by you · Grow',date:'2026-07-15',amt:750,dir:'in'},
      {ic:'tag',label:'Sorted into BMX Bike dream',sub:'Unsorted → Save',date:'2026-07-14',amt:30000,dir:'mid'},
      {ic:'tag',label:'Sorted into Snacks',sub:'Unsorted → Spend',date:'2026-07-14',amt:20000,dir:'mid'},
      {ic:'moon',label:'Lebaran THR from Om Rizal',sub:'Into Unsorted',date:'2026-07-14',amt:50000,dir:'in'},
      {ic:'cal',label:'Allowance · auto',sub:'Weekly · into Unsorted',date:'2026-07-11',amt:20000,dir:'in'},
      {ic:'gift',label:'Give to Panti Asuhan Kasih',sub:'From Give · story sent',date:'2026-07-10',amt:10000,dir:'out'},
      {ic:'seed',label:'Bought gold',sub:'Free savings → Grow',date:'2026-07-08',amt:21000,dir:'mid'},
      {ic:'cal',label:'Allowance · auto',sub:'Weekly · into Unsorted',date:'2026-07-04',amt:20000,dir:'in'},
      {ic:'hand',label:'Cash out · school trip snack',sub:'From Transport',date:'2026-06-29',amt:15000,dir:'out'},
      {ic:'gift',label:'Mission reward · Help with the dishes',sub:'💎 3 · no money moved',date:'2026-06-28',amt:0,dir:'mid'},
      {ic:'cal',label:'Allowance · auto',sub:'Weekly · into Unsorted',date:'2026-06-27',amt:20000,dir:'in'},
      {ic:'cal',label:'Allowance · auto',sub:'Weekly · into Unsorted',date:'2026-06-20',amt:20000,dir:'in'},
      {ic:'hand',label:'Cash out · football socks',sub:'From Snacks',date:'2026-06-18',amt:25000,dir:'out'},
      {ic:'cal',label:'Allowance · auto',sub:'Weekly · into Unsorted',date:'2026-06-13',amt:20000,dir:'in'},
      {ic:'tag',label:'Sorted into Free savings',sub:'Unsorted → Save',date:'2026-06-12',amt:25000,dir:'mid'},
      {ic:'gift',label:'Mission reward · Cleared the store room',sub:'Extra work · into Unsorted',date:'2026-06-08',amt:20000,dir:'in'},
      {ic:'cal',label:'Allowance · auto',sub:'Weekly · into Unsorted',date:'2026-06-06',amt:20000,dir:'in'},
      {ic:'hand',label:'Cash out · school book',sub:'From Transport',date:'2026-06-02',amt:18000,dir:'out'},
      {ic:'cal',label:'Allowance · auto',sub:'Weekly · into Unsorted',date:'2026-05-30',amt:20000,dir:'in'},
      {ic:'gift',label:'Gift from Bu Wati',sub:'Into Unsorted',date:'2026-05-24',amt:30000,dir:'in'},
      {ic:'cal',label:'Allowance · auto',sub:'Weekly · into Unsorted',date:'2026-05-23',amt:20000,dir:'in'},
      {ic:'cal',label:'Allowance · auto',sub:'Weekly · into Unsorted',date:'2026-05-16',amt:20000,dir:'in'}
    ];
    D.kids.nadia.tx = [
      {ic:'tag',label:'Sorted into Give',sub:'Unsorted → Give',date:'2026-07-09',amt:15000,dir:'mid'},
      {ic:'tag',label:'Sorted into Spend',sub:'Unsorted → Spend',date:'2026-07-09',amt:35000,dir:'mid'},
      {ic:'gift',label:'Birthday gift from Grandma',sub:'Into Unsorted',date:'2026-07-09',amt:100000,dir:'in'},
      {ic:'hand',label:'Cash out · sticker book',sub:'From Spend',date:'2026-06-21',amt:8000,dir:'out'},
      {ic:'gift',label:'Gift from Om Rizal',sub:'Into Unsorted',date:'2026-06-14',amt:25000,dir:'in'},
      {ic:'tag',label:'Sorted into Save',sub:'Unsorted → Save',date:'2026-06-14',amt:15000,dir:'mid'},
      {ic:'gift',label:'Mission reward · Tidied her toys',sub:'💎 2 · no money moved',date:'2026-06-07',amt:0,dir:'mid'},
      {ic:'gift',label:'Gift from Grandpa',sub:'Into Unsorted',date:'2026-05-29',amt:20000,dir:'in'},
      {ic:'hand',label:'Cash out · balloon at the fair',sub:'From Spend',date:'2026-05-18',amt:5000,dir:'out'}
    ];
    D.kids.nadia.tx.unshift({ic:'hand',label:'Cash out · ice cream',sub:'From Spend',date:'2026-07-16',amt:10000,dir:'out'});
    D.missions = [
      {id:'pm1',kid:'arthur',ico:'🛏️',title:'Make your bed',sub:'Family contribution · weekly',pill:'💎 2',kind:'gem'},
      {id:'pm2',kid:'arthur',ico:'🍽️',title:'Help with the dishes',sub:'Family contribution · weekly',pill:'💎 3',kind:'gem'},
      {id:'pm3',kid:'arthur',ico:'🏍️',title:'Wash the motorbike',sub:'Extra work · once',pill:'Rp 15,000',kind:'money'},
      {id:'pm4',kid:'arthur',ico:'📖',title:'Hafal Juz 30',sub:'Achievement · once',pill:'💎 50',kind:'gem'},
      {id:'pm5',kid:'nadia',ico:'🧸',title:'Tidy up your toys',sub:'Family contribution · weekly',pill:'💎 2',kind:'gem'}
    ];
    D.prizes = [
      {id:'pz1',kid:'arthur',ico:'📺',title:'1 hour of screen time',cost:8},
      {id:'pz2',kid:'arthur',ico:'🎮',title:'1 hour of game time',cost:10},
      {id:'pz3',kid:'arthur',ico:'🍦',title:'Pick the weekend treat',cost:15},
      {id:'pz4',kid:'arthur',ico:'🎡',title:'Family day out — you choose',cost:60},
      {id:'pz5',kid:'nadia',ico:'📚',title:'Extra bedtime story',cost:3}
    ];
    D.reqs = [
      {id:'q1',kid:'arthur',type:'cashout',ic:'cash',state:'ok',when:'10 minutes ago',title:'Cash out',amt:'Rp 25,000',sub:'From Snacks · wants it as cash',why:'Mau beli buku komik di toko dekat sekolah, sisa uang jajanku cukup.',todo:'Hand Arthur Rp 25,000 in cash.',effect:()=>{ this.wal('arthur','snacks').amt-=25000; }},
      {id:'q2',kid:'arthur',type:'harvest',ic:'seed',state:'ok',when:'1 hour ago',title:'Harvest gold',amt:'Rp 19,140',sub:'14.5 mg at today’s buy-back price',why:null,effect:()=>{ const K=D.kids.arthur,g=this.wal('arthur','gold'); this.wal('arthur','freesavings').amt+=g.amt; K.wallets=K.wallets.filter(w=>w.id!=='gold'); }},
      {id:'q3',kid:'arthur',type:'grow',ic:'dollar',state:'ok',when:'Yesterday',title:'Buy US dollars',amt:'Rp 16,000',sub:'Funded from Free savings',why:null,effect:()=>{ const K=D.kids.arthur; this.wal('arthur','freesavings').amt-=16000; const w=this.wal('arthur','fxusd'); const units=16000/Math.round(D.fx.USD*1.01); if(w){w.meta.units+=units;w.meta.cost+=16000;} else K.wallets.push({id:'fxusd',name:'US Dollar',ico:'💵',cat:'grow',amt:0,meta:{kind:'fx',ccy:'USD',units:units,cost:16000}}); this.recalc(); }},
      {id:'q5',kid:'arthur',type:'grow',ic:'bank',state:'ok',when:'2 days ago',title:'Open a Time Deposit',amt:'Rp 30,000',sub:'6 months · funded from Free savings',why:null,effect:()=>{ const K=D.kids.arthur,rate=D.rates[6],interest=Math.round(30000*rate/100); this.wal('arthur','freesavings').amt-=30000; K.wallets.push({id:'td2',name:'Time Deposit 2',ico:'🏦',cat:'grow',amt:30000+interest,meta:{kind:'td',principal:30000,ratePct:rate,termMonths:6,start:'16 Jul 2026',maturity:'16 Jan 2027',matured:false}}); }},
      {id:'q6',kid:'arthur',type:'mission',ic:'check',state:'ok',when:'30 minutes ago',title:'Washed the motorbike',amt:'Rp 15,000',sub:'Extra work · claimed by Arthur',why:null,effect:()=>{ D.kids.arthur.unsorted+=15000; D.kids.arthur.act.unshift({ic:'gift',label:'Mission reward · Wash the motorbike',when:'Just now',amt:'+15,000',c:'in'}); this.logTx(D.kids.arthur,{ic:'gift',label:'Mission reward · Wash the motorbike',sub:'Extra work · into Unsorted',amt:15000,dir:'in'}); }},
      {id:'q7',kid:'arthur',type:'prize',ic:'gift',state:'ok',when:'1 hour ago',title:'Swap for 1 hour of game time',amt:'💎 10',sub:'Arthur has 💎 12',why:null,todo:'Let Arthur have his hour of game time — then mark it done.',effect:()=>{ D.kids.arthur.gems-=10; }},
      {id:'q8',kid:'arthur',type:'give',ic:'gift',state:'ok',when:'3 hours ago',title:'Give to Masjid Al-Hikmah',amt:'Rp 15,000',sub:'From Give',why:'Pak ustadz bilang mau benerin karpet mushola yang bolong.',todo:'Hand the Rp 15,000 over — then tell Arthur what happened to it.',story:'',effect:()=>{ this.wal('arthur','give').amt-=15000; }},
      {id:'q4',kid:'nadia',type:'cashout',ic:'cash',state:'done',when:'2 days ago',title:'Cash out',amt:'Rp 10,000',sub:'From Spend · asked you to buy it',why:'Mau beli es krim sama teman pas pulang sekolah.',todo:'Buy the ice cream for Nadia.',decidedBy:'Parent 1',decidedWhen:'2 days ago',effect:()=>{}}
    ];
  }
  destWallets(K,cat){ const ws=K.wallets.filter(w=>w.cat===cat); return cat==='save'?ws.slice().sort((a,b)=>(b.kind==='catchall')-(a.kind==='catchall')):ws; }
  destWallet(K,cat){ const sp=K.rules.split, ws=this.destWallets(K,cat); return ws.find(w=>w.id===(sp.dest||{})[cat])||ws[0]||null; }
  income(K,amt,o){
    const sp=K.rules.split, parts=[];
    if(sp.on){
      ['spend','save','give'].forEach(cat=>{
        const pct=sp[cat]||0, w=this.destWallet(K,cat);
        if(!pct||!w) return;
        const v=Math.round(amt*pct/100/100)*100;
        if(v>0) parts.push({w,v});
      });
    }
    let used=parts.reduce((s,p)=>s+p.v,0);
    if(used>amt&&parts.length){ parts[parts.length-1].v-=used-amt; used=amt; }
    parts.forEach(p=>p.w.amt+=p.v);
    const rest=Math.max(0,amt-used);
    K.unsorted+=rest;
    const F=n=>this.fmt(n);
    const bits=parts.map(p=>p.w.name+' '+F(p.v)).concat(rest>0?['Unsorted '+F(rest)]:[]);
    const summary=parts.length?bits.join(' · '):'Into Unsorted';
    K.act.unshift({ic:o.ic,label:o.label,when:'Just now',amt:'+'+F(amt),c:'in'});
    this.logTx(K,{ic:o.ic,label:o.label,sub:parts.length?('Auto-split · '+summary):'Into Unsorted',amt,dir:'in'});
    parts.forEach(p=>this.logTx(K,{ic:'tag',label:'Auto-split into '+p.w.name,sub:'Rule · '+K.rules.mode,amt:p.v,dir:'mid'}));
    return summary;
  }
  fmt(n){ return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,','); }
  parseAmt(s){ return parseInt(String(s||'').replace(/[^\d]/g,''),10)||0; }
  wal(k,id){ return this.D.kids[k].wallets.find(w=>w.id===id); }
  catTotal(K,cat){ return K.wallets.filter(w=>w.cat===cat).reduce((s,w)=>s+w.amt,0); }
  kidTotal(K){ return K.unsorted + K.wallets.reduce((s,w)=>s+w.amt,0); }
  seed32(s){ let h=0; for(let i=0;i<s.length;i++) h=(h*131+s.charCodeAt(i))>>>0; return h||1; }
  demoWalk(seedStr,n,end,spread){
    let seed=this.seed32(seedStr);
    const rnd=()=>{ seed=(seed*1664525+1013904223)>>>0; return seed/4294967296; };
    const arr=[]; let v=Math.max(0,end-spread*0.6+(rnd()-0.5)*spread);
    for(let i=0;i<n;i++){ v=v+(end-v)*0.35+(rnd()-0.5)*spread*0.5; arr.push(Math.max(0,v)); }
    arr[n-1]=end; return arr;
  }
  demoWeeks(seedStr,n){
    let seed=this.seed32(seedStr);
    const rnd=()=>{ seed=(seed*1103515245+12345)>>>0; return (seed>>>8)/16777216; };
    return Array.from({length:n},()=>{ const r=rnd(); return r<0.1?'with':r<0.38?'none':'add'; });
  }
  demoBool(seedStr,n,endTrue){
    let seed=this.seed32(seedStr);
    const rnd=()=>{ seed=(seed*1664525+1013904223)>>>0; return seed/4294967296; };
    const arr=Array.from({length:n},()=>rnd()<0.68);
    arr[n-1]=endTrue; return arr;
  }
  demoInts(seedStr,n,loA,hiA,rateMin,rateMax){
    let seed=this.seed32(seedStr);
    const rnd=()=>{ seed=(seed*1664525+1013904223)>>>0; return seed/4294967296; };
    return Array.from({length:n},()=>{ const assigned=loA+Math.floor(rnd()*(hiA-loA+1)); const rate=rateMin+rnd()*(rateMax-rateMin); return { assigned, completed:Math.min(assigned,Math.round(assigned*rate)) }; });
  }
  recalc(){ const D=this.D; Object.values(D.kids).forEach(K=>K.wallets.forEach(w=>{ if(!w.meta)return; if(w.meta.kind==='gold')w.amt=Math.round(w.meta.grams*D.gold.buyback); else if(w.meta.kind==='fx')w.amt=Math.round(w.meta.units*Math.round(D.fx[w.meta.ccy]*0.99)); })); }
  svg(p){ return React.createElement('svg',{width:15,height:15,viewBox:'0 0 24 24',style:{stroke:'currentColor',fill:'none',strokeWidth:1.7,strokeLinecap:'round',strokeLinejoin:'round'},dangerouslySetInnerHTML:{__html:p}}); }
  navSvg(p){ return React.createElement('svg',{width:19,height:19,viewBox:'0 0 24 24',style:{stroke:'currentColor',fill:'none',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'},dangerouslySetInnerHTML:{__html:p}}); }
  icon(name){
    const I={ up:'<path d="M12 19V5M5 12l7-7 7 7"/>', down:'<path d="M12 5v14M5 12l7 7 7-7"/>',
      gift:'<rect x="3" y="8" width="18" height="13" rx="1.5"/><path d="M12 8v13M3 12h18"/>',
      moon:'<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.6 6.6 0 0 0 10.5 10.5"/>',
      tag:'<path d="M20.6 13.4 12 22l-9-9V3h10z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
      bank:'<path d="M3 21h18M5 21V10M19 21V10M12 3l9 5H3z"/>',
      cash:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/>',
      seed:'<path d="M12 21V9M12 9C12 5 9 3 5 3c0 4 3 6 7 6M12 9c0-3 2.5-5 6-5 0 3.5-2.5 5-6 5"/>',
      dollar:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M14.5 9.5a2.5 2.5 0 0 0-5 .8c0 2.7 5 1.4 5 4a2.5 2.5 0 0 1-5 .3"/>',
      check:'<path d="M4 12.5 9 17.5 20 6.5"/>',
      hand:'<path d="M11 13V5a1.5 1.5 0 0 1 3 0v7M14 12V4a1.5 1.5 0 0 1 3 0v9M17 13V7a1.5 1.5 0 0 1 3 0v9a5 5 0 0 1-5 5h-2a6 6 0 0 1-6-6v-4a1.5 1.5 0 0 1 3 0"/>',
      cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>' };
    return this.svg(I[name]||I.check);
  }
  iso(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  logTx(K,o){ if(!K.tx)K.tx=[]; K.tx.unshift(Object.assign({date:this.iso(this.TODAY)},o)); }
  dayLabel(isoStr){
    const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const p=isoStr.split('-'), d=new Date(+p[0],+p[1]-1,+p[2]);
    const diff=Math.round((this.TODAY-d)/86400000);
    if(diff===0) return 'Today';
    if(diff===1) return 'Yesterday';
    return d.getDate()+' '+MON[d.getMonth()]+' '+d.getFullYear();
  }
  toast(m){ clearTimeout(this._tt); this.setState({toast:m}); this._tt=setTimeout(()=>this.setState({toast:null}),2400); }
  nextAllowance(al){
    const T=this.TODAY, DOW=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let d;
    if(al.freq==='monthly'){ d=new Date(T.getFullYear(),T.getMonth(),al.dom); if(d<=T)d=new Date(T.getFullYear(),T.getMonth()+1,al.dom); }
    else { let delta=(al.dow-T.getDay()+7)%7; if(delta===0)delta=7; d=new Date(T); d.setDate(T.getDate()+delta); }
    return DOW[d.getDay()].slice(0,3)+', '+d.getDate()+' '+MON[d.getMonth()];
  }
  applyDecision(r,act,actor){
    const D=this.D, K=D.kids[r.kid];
    r.decidedBy=actor; r.decidedWhen='Just now';
    if(act==='approve'){
      if(r.type==='cashout'){ r.state='todo'; this.toast(actor+' approved — now hand over the money in real life'); }
      else if(r.type==='give'){ if(r.effect)r.effect(); r.state='todo'; this.toast(actor+' approved — now hand it over, then tell them the story'); }
      else if(r.type==='prize'){ if(r.effect)r.effect(); r.state='todo'; this.toast(actor+' approved — now actually make it happen'); }
      else { if(r.effect)r.effect(); r.state='done'; this.toast(actor+(r.type==='mission'?' approved — reward paid.':' approved — done. Nothing to do in real life.')); }
    } else if(act==='talk'){ r.state='talk'; this.toast(actor+' parked it to talk about with '+K.name); }
    else if(act==='decline'){ r.state='declined'; this.toast(actor+' declined — '+K.name+' will see it'); }
  }
  doAct(r,act){
    const D=this.D, K=D.kids[r.kid];
    if(act==='done'){
      if(r.type==='give'){ if(!(r.story||'').trim()){ this.toast('Write '+K.name+' the story first — that is the whole point'); return; } r.state='done'; this.toast('Story sent to '+K.name+' 💛'); }
      else { r.state='done'; if(r.type==='cashout'&&r.effect)r.effect(); this.toast('Settled — '+K.name+'’s ledger updated'); }
      this.forceUpdate();
      return;
    }
    if(act==='talkdone'){
      r.state='talked'; this.toast('Marked as talked — now approve or decline'); this.forceUpdate(); return;
    }
    const pool = r.state==='talked' ? ['approve','decline'] : ['approve','talk','decline'];
    if((r.state==='ok'||r.state==='talked') && Math.random()<0.25){
      const others=pool.filter(a=>a!==act);
      const otherAct=others[Math.floor(Math.random()*others.length)];
      this.applyDecision(r,otherAct,'Parent 2');
      this.toast('Parent 2 sudah memutuskan ini barusan — '+(otherAct==='approve'?'disetujui':otherAct==='decline'?'ditolak':'ditunda untuk dibicarakan'));
      this.forceUpdate();
      return;
    }
    this.applyDecision(r,act,'Parent 1');
    this.forceUpdate();
  }
  chip(K,sel,pick){
    const on = K.id===sel;
    return { pick, emo:K.emo, name:K.name, tier:K.tier,
      sideBg:on?'#F1EEFC':'transparent', sideFg:on?'#4A32A8':'#1E1A38', subFg2:on?'#8274C4':'#7A7596', eBg:on?'#E3D9FB':'#F7F5FD' };
  }
  suggestTier(y,m){ if(!y)return null; let age=2026-y; if(m&&(m-1)>6)age-=1; return age<=7?'kecil':age<=12?'menengah':'remaja'; }
  renderVals(){
    const D=this.D, S=this.state, F=this.fmt.bind(this);
    const authed = S.authed!==null ? S.authed : !(this.props.startAtLogin ?? false);
    const K = D.kids[S.kid] || Object.values(D.kids)[0];
    const V = {};
    V.appShow=authed;
    // login
    V.loginShow=!authed; V.lgIsPick=S.login==='pick'; V.lgIsGrown=S.login==='grown'; V.lgIsKid=S.login==='kid';
    V.goGrown=()=>this.setState({login:'grown'}); V.goKid=()=>this.setState({login:'kid'});
    V.backPick=()=>this.setState({login:'pick',pin:''});
    V.lgEmail=S.lgEmail; V.onLgEmail=e=>this.setState({lgEmail:e.target.value});
    V.lgPass=S.lgPass; V.onLgPass=e=>this.setState({lgPass:e.target.value});
    V.doSignIn=()=>{ this.setState({authed:true}); this.toast('Welcome back, Bu Sinta'); };
    V.kEmail=S.kEmail; V.onKEmail=e=>this.setState({kEmail:e.target.value});
    V.pinVal=S.pin;
    V.onPin=e=>{ const p=e.target.value.replace(/[^\d]/g,'').slice(0,6); this.setState({pin:p}); if(p.length===6){ setTimeout(()=>{ this.setState({authed:true,pin:''}); this.toast('This demo shows the grown-up side'); },250); } };
    V.pinDots=[0,1,2,3,4,5].map(i=>({ bg:i<S.pin.length?'#6C4CE0':'#E0D9F0', tf:i<S.pin.length?'scale(1.15)':'scale(1)' }));
    // nav
    V.isDash=S.tab==='dash'; V.isReq=S.tab==='req'; V.isMis=S.tab==='mis'; V.isIns=S.tab==='ins'; V.isSet=S.tab==='set';
    V.goDash=()=>this.setState({tab:'dash'}); V.goReq=()=>this.setState({tab:'req'});
    V.goMis=()=>this.setState({tab:'mis'}); V.goIns=()=>this.setState({tab:'ins'}); V.goSet=()=>this.setState({tab:'set'});
    const pendAllCount=D.reqs.filter(r=>r.state==='ok'||r.state==='talk'||r.state==='talked').length;
    const navDef=[
      {key:'dash',label:'Dashboard',active:S.tab==='dash',onClick:V.goDash,path:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/>',badge:0},
      {key:'req',label:'Requests',active:S.tab==='req',onClick:V.goReq,path:'<path d="M3 13h5l1.5 3h5L16 13h5"/><path d="M4.8 6.5 3 13v6h18v-6l-1.8-6.5A2 2 0 0 0 17.3 5H6.7a2 2 0 0 0-1.9 1.5z"/>',badge:pendAllCount},
      {key:'mis',label:'Missions',active:S.tab==='mis',onClick:V.goMis,path:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/>',badge:0},
      {key:'ins',label:'Insight',active:S.tab==='ins',onClick:V.goIns,path:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',badge:0},
      {key:'set',label:'Settings',active:S.tab==='set',onClick:V.goSet,path:'<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',badge:0}
    ];
    V.navItems=navDef.map(n=>({ onClick:n.onClick, label:n.label, icon:this.navSvg(n.path), bg:n.active?'#EDE7FC':'transparent', fg:n.active?'#4A32A8':'#4C4869', badgeShow:n.badge>0, badge:n.badge }));
    const TITLES={dash:[K.name,'You are the bank'],req:['Requests','From all your children'],mis:['Missions','Jobs and prizes you set'],ins:['Insight','What the numbers are telling you'],set:['Settings','Rules, per child']};
    const tt=TITLES[S.tab]||TITLES.dash; V.pageTitle=tt[0]; V.pageSubtitle=tt[1];
    // kid chips (sidebar)
    V.kidChips=Object.values(D.kids).map(x=>this.chip(x,S.kid,()=>this.setState({kid:x.id})));
    // dashboard
    const total=this.kidTotal(K);
    const segsRaw=[ {name:'Unsorted',color:'#A99BD6',amt:K.unsorted}, {name:'Spend',color:'#F59E4C',amt:this.catTotal(K,'spend')}, {name:'Save',color:'#4C9EE8',amt:this.catTotal(K,'save')}, {name:'Give',color:'#ED6FA5',amt:this.catTotal(K,'give')} ];
    if(!K.little) segsRaw.push({name:'Grow',color:'#3FBF7F',amt:this.catTotal(K,'grow')});
    let off=0; V.donutSegs=[];
    segsRaw.forEach(s=>{ if(s.amt<=0)return; const len=s.amt/total*this.C, seg=Math.max(len-5,2); V.donutSegs.push({color:s.color,dash:seg+' '+(this.C-seg),off:String(-off)}); off+=len; });
    V.ringEmo=K.emo; V.balLab=K.name+' · total'; V.heroTotal=F(total);
    V.mirrorTxt='Exactly what '+K.name+' sees.';
    V.openWallet=()=>this.setState({push:{type:'wallet',kid:S.kid}});
    V.openHistory=()=>this.setState({push:{type:'hist',kid:S.kid,range:'7d',from:'2026-06-16',to:'2026-07-16'}});
    V.legend=segsRaw.map(s=>({color:s.color,name:s.name,pct:Math.round(s.amt/total*100),val:F(s.amt),open:V.openWallet}));
    const pendAll=D.reqs.filter(r=>r.state==='ok'||r.state==='talk'||r.state==='talked');
    const pendKid=pendAll.filter(r=>r.kid===S.kid);
    V.bellShow=pendAll.length>0; V.stripShow=pendKid.length>0;
    V.stripTitle=pendKid.length+' of '+K.name+'’s request'+(pendKid.length===1?'':'s')+' need'+(pendKid.length===1?'s':'')+' your decision';
    V.actLab=K.name+' · recent';
    V.acts=K.act.map(a=>({icon:this.icon(a.ic),label:a.label,when:a.when,amt:a.amt,color:a.c==='in'?'#1B7A4B':a.c==='out'?'#D64550':'#7A7596'}));
    V.openAddKid=()=>this.setState({push:{type:'addkid',name:'',m:'',y:'',tier:null,touched:false,pin:''}});
    V.openSend=()=>this.setState({push:{type:'send',kid:S.kid,amt:'',src:'Gift',note:''}});
    V.openTake=()=>this.setState({push:{type:'take',kid:S.kid,wal:null,amt:'',why:''}});
    // requests
    const segDefs=[ {id:'ok',label:'To decide'}, {id:'todo',label:'To do'}, {id:'done',label:'Settled'} ];
    const cntOk=D.reqs.filter(r=>r.state==='ok').length, cntTodo=D.reqs.filter(r=>r.state==='todo'||r.state==='talk'||r.state==='talked').length;
    V.segBtns=segDefs.map(s=>{ const on=S.seg===s.id, cnt=s.id==='ok'?cntOk:s.id==='todo'?cntTodo:0;
      return { pick:()=>this.setState({seg:s.id,reqSel:null}), label:s.label, bg:on?'#fff':'transparent', fg:on?'#1E1A38':'#7A7596', sh:on?'0 1px 3px rgba(30,26,56,.1)':'none', cntShow:cnt>0, cnt, cntBg:s.id==='ok'?'#B26A00':'#6C4CE0' }; });
    V.segHint = S.seg==='ok'?'Your children asked. Approve, decline, or park it for a conversation.' : S.seg==='todo'?'Approved — but nothing has moved yet. Do it in real life, then mark it done.' : 'Settled and written into your child’s ledger.';
    const items = S.seg==='ok'?D.reqs.filter(r=>r.state==='ok') : S.seg==='todo'?D.reqs.filter(r=>r.state==='todo'||r.state==='talk'||r.state==='talked') : D.reqs.filter(r=>r.state==='done'||r.state==='declined');
    V.reqEmptyShow=items.length===0;
    V.reqEmptyTitle=S.seg==='ok'?'Nothing to decide':S.seg==='todo'?'Nothing outstanding':'Nothing yet';
    V.reqEmptySub=S.seg==='ok'?'No requests are waiting on you.':S.seg==='todo'?'Everything you approved is finished.':'Settled requests will be listed here.';
    V.reqItems=items.map(r=>{ const RK=D.kids[r.kid];
      const pill = r.state==='talk'?{t:'Talk',bg:'#E4F1FD',fg:'#1B6E97',bd:'#C8E4F8'} : r.state==='talked'?{t:'Decide',bg:'#FFF1D6',fg:'#B26A00',bd:'#F5DFAE'} : r.state==='ok'?{t:'Waiting',bg:'#FFF1D6',fg:'#B26A00',bd:'#F5DFAE'} : r.state==='todo'?{t:'To do',bg:'#EDE7FC',fg:'#6C4CE0',bd:'#D3CBF5'} : r.state==='done'?{t:'Done',bg:'#E1F6EC',fg:'#1B7A4B',bd:'#BCE8D2'} : {t:'Declined',bg:'#FCE8EA',fg:'#D64550',bd:'#F5C9CE'};
      const pending=r.state==='ok';
      return { id:r.id, icon:this.icon(r.ic), title:r.title, amt:r.amt, sub:r.sub, kemo:RK.emo, kname:RK.name, when:r.when,
        pillBg:pill.bg, pillFg:pill.fg, pillBd:pill.bd, pillTxt:pill.t,
        showQuote:!!r.why&&(pending||r.state==='talk'||r.state==='talked'), why:r.why,
        showRisk:(r.type==='grow'||r.type==='harvest')&&pending,
        showDecider:(r.state==='done'||r.state==='declined')&&!!r.decidedBy, deciderTxt:r.decidedBy?('Diputuskan oleh '+r.decidedBy+' · '+(r.decidedWhen||r.when)):'',
        showFoot:pending,
        doApprove:()=>this.doAct(r,'approve'), doTalk:()=>this.doAct(r,'talk'), doDecline:()=>this.doAct(r,'decline'),
        showTalkTodo:r.state==='talk', doTalkDone:()=>this.doAct(r,'talkdone'),
        showDecideFoot:r.state==='talked',
        showTodo:r.state==='todo', todoTxt:r.todo||'',
        showStory:r.state==='todo'&&r.type==='give', storyVal:r.story||'',
        onStory:e=>{ r.story=e.target.value; this.forceUpdate(); },
        doDone:()=>this.doAct(r,'done'),
        doneTxt:r.type==='give'?'Send the story & finish':'Mark as done' };
    });
    { const selId=(S.reqSel&&items.some(x=>x.id===S.reqSel))?S.reqSel:(items[0]?items[0].id:null);
      V.reqItems=V.reqItems.map(it=>Object.assign({},it,{selected:it.id===selId,select:()=>this.setState({reqSel:it.id}),rowBg:it.id===selId?'#F1EEFC':'#fff',rowBd:it.id===selId?'#6C4CE0':'#E7E2F3'}));
      V.reqSelId=selId; V.reqDetail=V.reqItems.find(it=>it.id===selId)||null; V.reqDetailEmpty=!V.reqDetail; }
    // missions
    const L=K.learn, chOpen=L.starsEarned>=100, t2=L.chaptersDone>=2;
    V.lnCurrent=L.current; V.lnChap=L.chaptersDone+' / '+L.chaptersTotal; V.lnChapPct=Math.round(L.chaptersDone/L.chaptersTotal*100)+'%';
    V.starsVal=L.starsEarned; V.starsSub=chOpen?'Past ⭐ 100 — jobs & prizes are unlocked':'⭐ '+(100-L.starsEarned)+' more to unlock jobs & prizes';
    V.weekChipTxt=L.weekLessonDone?'Done':'Not yet'; V.weekChipBg=L.weekLessonDone?'#E1F6EC':'#FFF1D6'; V.weekChipFg=L.weekLessonDone?'#1B7A4B':'#B26A00';
    V.jobsChipTxt=chOpen?'Unlocked':'Locked'; V.jobsChipBg=chOpen?'#E1F6EC':'#F0ECF9'; V.jobsChipFg=chOpen?'#1B7A4B':'#7A7596';
    V.achChipTxt=t2?'Unlocked':'Locked'; V.achChipBg=t2?'#E1F6EC':'#F0ECF9'; V.achChipFg=t2?'#1B7A4B':'#7A7596';
    V.lastShow=!!L.last; V.lastName=K.name; V.lastTxt=L.last||'';
    V.jobsLockShow=!chOpen; V.jobsLockTxt=K.name+' hasn’t reached ⭐ 100 yet — jobs stay locked so learning comes first.';
    const misK=D.missions.filter(m=>m.kid===S.kid);
    V.jobs=misK.map(m=>({ op:chOpen?'1':'0.55', iBg:m.kind==='money'?'#E1F6EC':'#EDE7FC', ico:m.ico, title:m.title, sub:m.sub, pillTxt:m.pill, pillBg:m.kind==='money'?'#E1F6EC':'#EDE7FC', pillFg:m.kind==='money'?'#1B7A4B':'#6C4CE0' }));
    const gemsWk=misK.filter(m=>m.sub.indexOf('weekly')>-1&&m.kind==='gem').reduce((s,m)=>s+parseInt(m.pill.replace(/[^\d]/g,''),10),0);
    V.przs=D.prizes.filter(p=>p.kid===S.kid).map(p=>({ op:chOpen?'1':'0.55', ico:p.ico, title:p.title, cost:p.cost, sub: p.cost>25&&!t2?'Big prize — needs 2 chapters finished':gemsWk>0?('≈ '+Math.max(1,Math.ceil(p.cost/gemsWk))+' week'+(Math.ceil(p.cost/gemsWk)>1?'s':'')+' of weekly jobs'):'Set jobs to make this earnable' }));
    V.addJob=()=>this.setState({push:{type:'job',kid:S.kid,title:'',ico:'🧹',kind:'family',rew:2}});
    V.addPrz=()=>this.setState({push:{type:'prize',kid:S.kid,title:'',ico:'🍦',cost:8}});
    // insight
    {
      const all=S.insAll, kids=all?Object.values(D.kids):[K], sName=all?'the family':K.name;
      V.insChips=[{ id:'__all', emo:'👨‍👩‍👧', name:'All children', tier:Object.keys(D.kids).length+' KIDS', pick:()=>this.setState({insAll:true}) }]
        .concat(Object.values(D.kids).map(x=>({ id:x.id, emo:x.emo, name:x.name, tier:x.tier, pick:()=>this.setState({insAll:false,kid:x.id}) })))
        .map(c=>{ const on=all?c.id==='__all':c.id===K.id; return Object.assign({},c,{ bg:on?'#6C4CE0':'#fff', bd:on?'#6C4CE0':'#E7E2F3', fg:on?'#fff':'#1E1A38', subFg:on?'rgba(255,255,255,.72)':'#7A7596', eBg:on?'rgba(255,255,255,.2)':'#F7F5FD' }); });
      const RG=[{id:'7d',label:'7 days',days:6},{id:'30d',label:'30 days',days:29},{id:'90d',label:'90 days',days:89},{id:'custom',label:'Custom',days:29}];
      const cur=RG.find(r=>r.id===S.insRange)||RG[1];
      V.insRanges=RG.map(r=>{ const on=r.id===cur.id; return { pick:()=>this.setState({insRange:r.id}), label:r.label, bg:on?'#fff':'transparent', fg:on?'#1E1A38':'#7A7596', sh:on?'0 1px 3px rgba(30,26,56,.1)':'none' }; });
      V.insCustomShow=cur.id==='custom';
      V.insFrom=S.insFrom; V.onInsFrom=e=>this.setState({insFrom:e.target.value});
      V.insTo=S.insTo; V.onInsTo=e=>this.setState({insTo:e.target.value});
      let fromIso,toIso;
      if(cur.id==='custom'){ fromIso=S.insFrom; toIso=S.insTo; }
      else { const st=new Date(this.TODAY); st.setDate(st.getDate()-cur.days); fromIso=this.iso(st); toIso=this.iso(this.TODAY); }
      const dOf=s=>{ const p=String(s||'').split('-'); return new Date(+p[0],+(p[1]||1)-1,+(p[2]||1)); };
      const span=Math.max(1,Math.round((dOf(toIso)-dOf(fromIso))/86400000)+1);
      const pTo=new Date(dOf(fromIso)); pTo.setDate(pTo.getDate()-1);
      const pFrom=new Date(pTo); pFrom.setDate(pFrom.getDate()-(span-1));
      V.insRangeLab=cur.id==='custom'?(this.dayLabel(fromIso)+' → '+this.dayLabel(toIso)):('Last '+span+' days');
      V.insScopeNote=(all?('Combined across '+kids.length+' children'):(K.name+' · '+K.tierLong))+' · compared with the '+span+' days before.';
      const scopeTx=kids.reduce((a,k)=>a.concat((k.tx||[]).map(t=>Object.assign({kid:k.name},t))),[]);
      const win=(f,t)=>scopeTx.filter(x=>x.date>=f&&x.date<=t);
      const sum=(arr,dir)=>arr.filter(x=>x.dir===dir).reduce((s,x)=>s+x.amt,0);
      const A=win(fromIso,toIso), Bp=win(this.iso(pFrom),this.iso(pTo));
      const sIn=sum(A,'in'), sOut=sum(A,'out'), sMid=sum(A,'mid');
      const pIn=sum(Bp,'in'), pOut=sum(Bp,'out'), pMid=sum(Bp,'mid');
      const kept=x=>x.i>0?Math.max(0,Math.round((x.i-x.o)/x.i*100)):0;
      const keptPct=kept({i:sIn,o:sOut}), pKept=kept({i:pIn,o:pOut});
      const sortRate=sIn>0?Math.min(100,Math.round(sMid/sIn*100)):0, pSort=pIn>0?Math.min(100,Math.round(pMid/pIn*100)):0;
      const totalNow=kids.reduce((s,k)=>s+this.kidTotal(k),0);
      const N=7, step=(span-1)/(N-1), pts=[];
      for(let i=0;i<N;i++){ const d=new Date(dOf(fromIso)); d.setDate(d.getDate()+Math.round(i*step)); pts.push(this.iso(d)); }
      const bucket=[];
      for(let i=0;i<N;i++){ const f=i===0?fromIso:pts[i-1], t=pts[i]; const seg=scopeTx.filter(x=>x.date>(i===0?'0000':f)&&x.date<=t&&x.date>=fromIso);
        bucket.push({ i:sum(seg,'in'), o:sum(seg,'out'), m:sum(seg,'mid'), at:t }); }
      const spark=(vals,fit)=>{ const mx=Math.max.apply(null,vals.concat([fit?100:1])), lo=0;
        return vals.map((v,i)=>{ const x=(2+i*(48/(vals.length-1))).toFixed(1); const y=(18-((v-lo)/(mx-lo||1))*16).toFixed(1); return x+','+y; }).join(' '); };
      const netAfter=iso=>scopeTx.filter(x=>x.date>iso).reduce((s,x)=>s+(x.dir==='in'?x.amt:x.dir==='out'?-x.amt:0),0);
      const series=pts.map(p=>Math.max(0,totalNow-netAfter(p)));
      const mxS=Math.max.apply(null,series.concat([1])), mnS=Math.min.apply(null,series);
      const rngS=(mxS-mnS)||1;
      const xy=series.map((v,i)=>{ const x=(i*(300/(N-1))).toFixed(1); const y=(78-((v-mnS)/rngS)*66).toFixed(1); return x+','+y; });
      V.insTrendLine=xy.join(' ');
      V.insTrendArea=('0,86 '+xy.join(' ')+' 300,86');
      V.insTrendNow=F(totalNow);
      V.insTrendTicks=[0,2,4,6].map(i=>({label:this.dayLabel(pts[i]).replace(' 2026','')}));
      const grew=series[N-1]-series[0];
      V.insTrendNote=grew===0?'The balance ended where it started.':(grew>0?('Balance grew Rp '+F(grew)+' over this window.'):('Balance fell Rp '+F(-grew)+' over this window.'));
      V.insSeeTx=()=>this.setState({push:{type:'hist',kid:all?'__all':K.id,range:'custom',from:fromIso,to:toIso}});
      const mixOf=k=>{ const t=this.kidTotal(k); return { uns:k.unsorted, spend:this.catTotal(k,'spend'), save:this.catTotal(k,'save'), give:this.catTotal(k,'give'), grow:this.catTotal(k,'grow'), total:t }; };
      const agg=kids.map(mixOf).reduce((a,m)=>({uns:a.uns+m.uns,spend:a.spend+m.spend,save:a.save+m.save,give:a.give+m.give,grow:a.grow+m.grow,total:a.total+m.total}),{uns:0,spend:0,save:0,give:0,grow:0,total:0});
      const unsPct=Math.round(agg.uns/(agg.total||1)*100), spendPct=Math.round(agg.spend/(agg.total||1)*100), savePct=Math.round(agg.save/(agg.total||1)*100), givePct=Math.round(agg.give/(agg.total||1)*100), growPct=Math.round(agg.grow/(agg.total||1)*100);
      const myReqs=all?D.reqs:D.reqs.filter(r=>r.kid===K.id);
      const approved=myReqs.filter(r=>r.state==='done'||r.state==='todo').length, declined=myReqs.filter(r=>r.state==='declined').length,
            talked=myReqs.filter(r=>r.state==='talk'||r.state==='talked').length, waiting=myReqs.filter(r=>r.state==='ok').length, answered=approved+declined+talked;
      const hasDream=kids.some(k=>k.wallets.some(w=>w.kind==='dream'));
      const starsAll=kids.reduce((s,k)=>s+k.learn.starsEarned,0), chapAll=kids.reduce((s,k)=>s+k.learn.chaptersDone,0), chapTot=kids.reduce((s,k)=>s+k.learn.chaptersTotal,0);
      const kidsKey=all?'all':K.id;
      const allocCats=[{name:'Unsorted',color:'#A99BD6',end:unsPct},{name:'Spend',color:'#F59E4C',end:spendPct},{name:'Save',color:'#4C9EE8',end:savePct},{name:'Give',color:'#ED6FA5',end:givePct}];
      if(agg.grow>0) allocCats.push({name:'Grow',color:'#3FBF7F',end:growPct});
      const allocSeries=allocCats.map((c,ci)=>this.demoWalk('alloc'+ci+kidsKey,N,c.end,14));
      V.allocBars=pts.map((p,i)=>{ const raw=allocSeries.map(s=>Math.max(0.5,s[i])), tot=raw.reduce((a,b)=>a+b,0);
        return { segs: allocCats.map((c,ci)=>({ color:c.color, h:Math.round(raw[ci]/tot*100)+'%' })) }; });
      V.allocTicks=[0,2,4,6].map(i=>({label:this.dayLabel(pts[i]).replace(' 2026','')}));
      V.allocLegend=allocCats.map(c=>({color:c.color,name:c.name,pct:c.end}));
      const unsStart=Math.round(allocSeries[0][0]);
      V.allocNote=Math.abs(unsPct-unsStart)<=3?('Unsorted has held steady around '+unsPct+'% across this window.'):(unsPct<unsStart?('Unsorted has shrunk from about '+unsStart+'% to '+unsPct+'% — more money is being given a job sooner.'):('Unsorted has grown from about '+unsStart+'% to '+unsPct+'% — money is sitting undecided longer.'));
      const growWallets=kids.reduce((a,k)=>a.concat(k.wallets.filter(w=>w.cat==='grow').map(w=>Object.assign({kidName:k.name},w))),[]);
      V.growShow=growWallets.length>0;
      if(V.growShow){
        const growVal=growWallets.reduce((s,w)=>s+w.amt,0), growCost=growWallets.reduce((s,w)=>s+(w.meta.cost||w.meta.principal||w.amt),0);
        const valSeries=this.demoWalk('gv'+kidsKey,N,growVal,Math.max(500,growVal*0.12));
        const costSeries=pts.map((p,i)=>growCost*(0.55+0.45*i/(N-1)));
        const mxG=Math.max.apply(null,valSeries.concat(costSeries).concat([1]));
        const xyG=arr=>arr.map((v,i)=>((i*(300/(N-1))).toFixed(1))+','+((78-(v/mxG)*66).toFixed(1))).join(' ');
        V.growValLine=xyG(valSeries); V.growCostLine=xyG(costSeries);
        V.growNow=F(growVal); const gain=growVal-growCost;
        V.growGainTxt=(gain>=0?'+':'−')+'Rp '+F(Math.abs(gain));
        V.growGainColor=gain>=0?'#1B7A4B':'#D64550'; V.growGainBg=gain>=0?'#E1F6EC':'#FCE8EA';
        V.growTicks=V.allocTicks;
        V.growRows=growWallets.map(w=>{ const g=w.amt-(w.meta.cost||w.meta.principal||w.amt); return { ico:w.ico, name:w.name+(all?(' · '+w.kidName):''), val:F(w.amt), gain:(g>=0?'+':'−')+'Rp '+F(Math.abs(g)), gainColor:g>=0?'#1B7A4B':'#D64550' }; });
      }
      const dreamWallets=kids.reduce((a,k)=>a.concat(k.wallets.filter(w=>w.kind==='dream').map(w=>Object.assign({kidName:k.name},w))),[]);
      V.dreamShow=dreamWallets.length>0;
      V.dreamCards=dreamWallets.map(w=>{
        const weeks=this.demoWeeks('dream'+w.id,8);
        let streak=0; for(let i=weeks.length-1;i>=0;i--){ if(weeks[i]==='with') break; streak++; }
        const pct=w.target?Math.min(100,Math.round(w.amt/w.target*100)):0;
        return { ico:w.ico, name:w.name, kidTag:all?(w.kidName+' · '):'', amt:F(w.amt), target:w.target?('Rp '+F(w.target)):'No target set', pctW:pct+'%', deadline:w.deadline?('by '+w.deadline):'',
          streakTxt: streak>=8?'Never raided across this window':(streak+' week'+(streak===1?'':'s')+' untouched since the last withdrawal'),
          weekCells: weeks.map(st=>({bg: st==='add'?'#3FBF7F':st==='with'?'#D64550':'#E9E5F5'})) };
      });
      V.learnCards=kids.map(k=>{
        const days=this.demoBool('learn'+k.id,8,k.learn.weekLessonDone);
        let streak=0; for(let i=days.length-1;i>=0;i--){ if(!days[i]) break; streak++; }
        const stars=this.demoWalk('stars'+k.id,N,k.learn.starsEarned,Math.max(5,k.learn.starsEarned*0.1));
        const mxL=Math.max.apply(null,stars.concat([1]));
        const starLine=stars.map((v,i)=>((i*(300/(N-1))).toFixed(1))+','+((36-(v/mxL)*30).toFixed(1))).join(' ');
        return { name:k.name, emo:k.emo, chapTxt:k.learn.chaptersDone+' of '+k.learn.chaptersTotal+' chapters', starLine, starsNow:k.learn.starsEarned,
          streakTxt: streak>0?(streak+' week'+(streak===1?'':'s')+' of lessons in a row'):'No streak running right now',
          weekCells: days.map(d=>({bg:d?'#6C4CE0':'#E9E5F5'})), current:k.learn.current };
      });
      V.choresCards=kids.map(k=>{
        const wk=this.demoInts('chores'+k.id,8,2,6,0.55,0.95);
        const totA=wk.reduce((s,w)=>s+w.assigned,0), totC=wk.reduce((s,w)=>s+w.completed,0), rate=totA>0?Math.round(totC/totA*100):0;
        const mxC=Math.max.apply(null,wk.map(w=>w.assigned).concat([1]));
        return { name:k.name, emo:k.emo, rate, gems:k.gems, bars: wk.map(w=>({ aH:Math.round(w.assigned/mxC*100)+'%', cH:Math.round(w.completed/mxC*100)+'%' })) };
      });
      const goReqTab=()=>this.setState({tab:'req',seg:'ok'});
      let hd;
      if(waiting>=3) hd={ico:'⏳',bg:'#FFF1D6',title:waiting+' requests are waiting on you',body:'Nothing moves until you answer — and an unanswered ask teaches more than a "no" does. Even declining, with a reason, keeps the arrangement honest.',cta:'Review requests',do:goReqTab};
      else if(unsPct>=25){ const worst=kids.slice().sort((a,b)=>(b.unsorted/(this.kidTotal(b)||1))-(a.unsorted/(this.kidTotal(a)||1)))[0];
        hd={ico:'🪙',bg:'#FFF1D6',title:unsPct+'% of the balance has no job yet',body:'Rp '+F(agg.uns)+' is sitting in Unsorted'+(all?(', most of it '+worst.name+'’s'):'')+'. Sorting is where the thinking happens — worth asking what it’s for before it quietly becomes spending money.',cta:all?('Open '+worst.name+'’s wallets'):'Open wallets',do:()=>this.setState({insAll:false,kid:worst.id,push:{type:'wallet',kid:worst.id}})}; }
      else if(!all&&!K.allowance.on) hd={ico:'📅',bg:'#EDE7FC',title:K.name+' has no allowance yet',body:'A regular amount that never depends on behaviour is what lets a child plan. No real money moves — the ledger just records the commitment.',cta:'Set an allowance',do:()=>this.setState({push:{type:'allow',kid:K.id,amt:K.allowance.amount,freq:K.allowance.freq,dow:K.allowance.dow,dom:K.allowance.dom}})};
      else if(savePct>=45) hd={ico:'🎯',bg:'#E1F6EC',title:'Saving is the strongest habit here',body:hasDream?(savePct+'% of the balance is in Save and the dreams are still intact. Name the dream out loud sometimes — it’s what makes waiting feel worth it.'):(savePct+'% of the balance is in Save, but nothing is named yet. Giving the pile a name is what makes waiting feel worth it.'),cta:'See the transactions',do:V.insSeeTx};
      else if(sOut>sIn&&sIn>0) hd={ico:'📉',bg:'#FCE8EA',title:'More went out than came in',body:'Rp '+F(sOut)+' out against Rp '+F(sIn)+' in over this window. Not a problem on its own — but a good moment to look at the list together.',cta:'See the transactions',do:V.insSeeTx};
      else hd={ico:'🌱',bg:'#EDE7FC',title:'Steady window, nothing alarming',body:(all?'The family':K.name)+' kept '+keptPct+'% of what came in and the wallets are balanced. Keep the allowance predictable and let the habits compound.',cta:'See the transactions',do:V.insSeeTx};
      V.insHeadIco=hd.ico; V.insHeadBg=hd.bg; V.insHeadTitle=hd.title; V.insHeadBody=hd.body; V.insHeadCta=hd.cta; V.insHeadDo=hd.do;
      const celebrate=[], coach=[], ask=[];
      kids.forEach(k=>{
        const m=mixOf(k), kl=k.learn, ktx=(k.tx||[]).filter(t=>t.date>=fromIso&&t.date<=toIso);
        const ki=sum(ktx,'in'), ko=sum(ktx,'out'), kk=kept({i:ki,o:ko});
        const dream=k.wallets.find(w=>w.kind==='dream');
        if(kk>=60&&ki>0) celebrate.push({ico:'🎯',who:k.name,title:'Kept '+kk+'% of what came in',body:'Of Rp '+F(ki)+' that arrived, Rp '+F(Math.max(0,ki-ko))+' is still there. Say it out loud — restraint is invisible unless someone notices it.'});
        if(dream&&dream.amt>0) celebrate.push({ico:'🚲',who:k.name,title:'The '+dream.name+' dream is still intact',body:'Rp '+F(dream.amt)+' set aside and never raided. That is the whole point of a dream wallet.'});
        if(this.catTotal(k,'give')>0) celebrate.push({ico:'🎁',who:k.name,title:'Still sets money aside to give',body:'Rp '+F(this.catTotal(k,'give'))+' is promised to someone else. Ask who it is for — the answer matters more than the amount.'});
        if(kl.starsEarned<100) coach.push({ico:'⭐',who:k.name,title:'Jobs & prizes still locked',body:'⭐ '+(100-kl.starsEarned)+' more to go. Learning is the key that opens chores — not an extra chore.',cta:'Open Missions',do:()=>this.setState({tab:'mis',kid:k.id})});
        if(Math.round(m.uns/(m.total||1)*100)>=25) coach.push({ico:'🪙',who:k.name,title:'Rp '+F(m.uns)+' left unsorted',body:'Money without a job drifts into spending. A two-minute sort together beats a rule.',cta:'Open wallets',do:()=>this.setState({push:{type:'wallet',kid:k.id}})});
        if(!k.allowance.on) coach.push({ico:'📅',who:k.name,title:'No allowance set',body:'Without a predictable amount there is nothing to plan with, and every rupiah becomes a negotiation.',cta:'Set allowance',do:()=>this.setState({insAll:false,kid:k.id,tab:'set',push:{type:'allow',kid:k.id,amt:k.allowance.amount,freq:k.allowance.freq,dow:k.allowance.dow,dom:k.allowance.dom}})});
        if(ko>ki&&ki>0) coach.push({ico:'📉',who:k.name,title:'Spent more than arrived',body:'Rp '+F(ko)+' out against Rp '+F(ki)+' in. Look at the list together before setting any new rule.',cta:'See transactions',do:()=>this.setState({push:{type:'hist',kid:k.id,range:'custom',from:fromIso,to:toIso}})});
        const gw=k.wallets.find(w=>w.meta&&(w.meta.kind==='gold'||w.meta.kind==='fx'));
        if(k.unsorted>0) ask.push({ico:'🪙',who:k.name,title:'Sorting',body:'“You’ve got Rp '+F(k.unsorted)+' unsorted — what job do you want to give it?”'});
        if(dream) ask.push({ico:'🚲',who:k.name,title:'Dreams',body:'“You’re at Rp '+F(dream.amt)+' for the '+dream.name+'. How close does that feel now?”'});
        if(this.catTotal(k,'give')>0) ask.push({ico:'🎁',who:k.name,title:'Giving',body:'“Who should your Give money help next, and how will you decide?”'});
        if(gw&&gw.meta.cost>gw.amt) ask.push({ico:'📉',who:k.name,title:'Grow',body:'“Your '+gw.name.toLowerCase()+' is worth less than you paid. Does that feel unfair, or is that just how prices work?”'});
        if(kl.last) ask.push({ico:'📖',who:k.name,title:'Learning',body:'“You learned “'+kl.last+'”. Can you teach it to me?”'});
      });
      const TT=[{id:'celebrate',label:'Celebrate',list:celebrate,bg:'#E1F6EC',bd:'#BCE8D2'},{id:'coach',label:'Coach',list:coach,bg:'#FFF1D6',bd:'#F5DFAE'},{id:'ask',label:'Ask at dinner',list:ask,bg:'#EDE7FC',bd:'#D3CBF5'}];
      const curTT=TT.find(t=>t.id===S.insTipTab)||TT[0];
      V.insTipTabs=TT.map(t=>{ const on=t.id===curTT.id; return { pick:()=>this.setState({insTipTab:t.id}), label:t.label, bg:on?'#fff':'transparent', fg:on?'#1E1A38':'#7A7596', sh:on?'0 1px 3px rgba(30,26,56,.1)':'none', cntShow:t.list.length>0, cnt:t.list.length, cntBg:t.id==='coach'?'#B26A00':'#6C4CE0' }; });
      V.insTipCount=(celebrate.length+coach.length+ask.length)+' notes';
      const shown=curTT.list.slice(0,4);
      V.insTipEmptyShow=shown.length===0;
      V.insTipEmptyTxt=curTT.id==='coach'?'Nothing to coach right now — the habits are holding.':curTT.id==='celebrate'?'Nothing to celebrate in this window yet. Give it a few weeks of data.':'No openings to suggest yet.';
      V.insTips=shown.map(t=>({ ico:t.ico, title:t.title, who:t.who, body:t.body, bg:curTT.bg, bd:curTT.bd, ctaShow:!!t.cta, cta:t.cta||'', do:t.do||(()=>{}) }));
    }
    // settings
    const al=K.allowance;
    V.alMain=al.on?('Rp '+F(al.amount)+' every '+['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][al.dow]):'Allowance is off';
    V.alSub=al.on?(K.rules.split.on?('Auto-split on arrival · '+K.rules.split.spend+'/'+K.rules.split.save+'/'+K.rules.split.give):'Lands in Unsorted automatically'):'Turn it on to give '+K.name+' a regular, plannable amount';
    V.tglAllow=()=>{ al.on=!al.on; this.toast(al.on?'Allowance on':'Allowance off'); this.forceUpdate(); };
    V.alTglBg=al.on?'#6C4CE0':'#D9D3EA'; V.alTglLeft=al.on?'21px':'3px';
    V.alNextShow=al.on; V.alNextSub=al.on?this.nextAllowance(al):''; V.alAmt=F(al.amount);
    V.runAllow=()=>{ const sum=this.income(K,al.amount,{ic:'cal',label:'Allowance · auto'}); this.toast('Rp '+F(al.amount)+' paid — '+sum); this.forceUpdate(); };
    V.editAllow=()=>this.setState({push:{type:'allow',kid:S.kid,amt:al.amount,freq:al.freq,dow:al.dow,dom:al.dom}});
    const RU=K.rules, SPL=RU.split;
    V.ruleModes=[{id:'strict',label:'Strict'},{id:'flexible',label:'Flexible'}].map(m=>{ const on=RU.mode===m.id; return { pick:()=>{ RU.mode=m.id; this.toast(m.label+' rules on for '+K.name); this.forceUpdate(); }, label:m.label, bg:on?'#fff':'transparent', fg:on?'#1E1A38':'#7A7596', sh:on?'0 1px 3px rgba(30,26,56,.1)':'none' }; });
    V.ruleModeSub=RU.mode==='strict'?('The split is locked. '+K.name+' cannot move money out of a job, and every cash-out needs your yes.'):(K.name+' can re-sort their own money and spend from Spend without asking. You still see everything.');
    V.splitMain=SPL.on?'Auto-split is on':'Auto-split is off';
    V.splitSub=SPL.on?'New money is given a job the moment it lands':'Everything lands in Unsorted for '+K.name+' to sort';
    V.tglSplit=()=>{ SPL.on=!SPL.on; this.toast(SPL.on?'Auto-split on':'Auto-split off — money lands in Unsorted'); this.forceUpdate(); };
    V.spTglBg=SPL.on?'#6C4CE0':'#D9D3EA'; V.spTglLeft=SPL.on?'21px':'3px';
    V.splitOnShow=SPL.on;
    const SPCATS=[{id:'spend',color:'#F59E4C'},{id:'save',color:'#4C9EE8'},{id:'give',color:'#ED6FA5'}];
    const spLeftNow=Math.max(0,100-SPCATS.reduce((s,c)=>s+(SPL[c.id]||0),0));
    V.splitBars=SPCATS.map(c=>({color:c.color,w:(SPL[c.id]||0)+'%'})).concat(spLeftNow>0?[{color:'#A99BD6',w:spLeftNow+'%'}]:[]).filter(b=>parseInt(b.w,10)>0);
    V.splitLegend=SPCATS.map(c=>({ color:c.color, name:(this.destWallet(K,c.id)||{name:c.id}).name, pct:SPL[c.id]||0 })).filter(l=>l.pct>0).concat(spLeftNow>0?[{color:'#A99BD6',name:'Unsorted — '+K.name+' decides',pct:spLeftNow}]:[]);
    V.editSplit=()=>this.setState({push:{type:'split',kid:S.kid,on:SPL.on,mode:RU.mode,spend:SPL.spend,save:SPL.save,give:SPL.give,dest:Object.assign({},SPL.dest)}});
    const growW=K.wallets.filter(w=>w.cat==='grow');
    V.invSumShow=growW.length>0; V.invNoteShow=growW.length===0;
    V.invNoteTxt=K.little?K.name+'’s tier doesn’t include Grow yet — it unlocks with the Middle tier.':K.name+' hasn’t started any investments yet.';
    V.invMain=growW.length+' active — '+growW.map(w=>w.name).join(', ');
    V.invTot=F(growW.reduce((s,w)=>s+w.amt,0));
    const matTd=growW.find(w=>w.meta&&w.meta.kind==='td'&&w.meta.matured);
    V.invMatShow=!!matTd; V.invMatSub=matTd?('Matured '+matTd.meta.maturity+' — principal + interest are in the balance'):'';
    V.manageInv=()=>this.setState({push:{type:'inv',kid:S.kid}});
    V.editRates=()=>this.setState({push:{type:'rates',r3:String(D.rates[3]),r6:String(D.rates[6]),r12:String(D.rates[12])}});
    V.rateRows=[{label:'3-month deposit',val:D.rates[3]},{label:'6-month deposit',val:D.rates[6]},{label:'12-month deposit',val:D.rates[12]}];
    V.priceCells=[ {label:'Gold · sell/g',val:F(D.gold.sell)}, {label:'Gold · buy-back/g',val:F(D.gold.buyback)}, {label:'USD · buy',val:F(Math.round(D.fx.USD*1.01))}, {label:'USD · sell',val:F(Math.round(D.fx.USD*0.99))}, {label:'SGD · mid',val:F(D.fx.SGD)}, {label:'EUR · mid',val:F(D.fx.EUR)} ];
    V.priceDate=D.priceDate;
    V.simDay=()=>{ const j=x=>Math.round(x*(1+(Math.random()*0.04-0.02))); D.gold.sell=j(D.gold.sell); D.gold.buyback=Math.min(j(D.gold.buyback),D.gold.sell-10000); Object.keys(D.fx).forEach(c=>D.fx[c]=j(D.fx[c])); D.priceDate='17 Jul 2026'; this.recalc(); this.toast('A new day — prices moved, Grow balances re-marked'); this.forceUpdate(); };
    V.acctName=K.name; V.acctBorn=K.born; V.acctTier=K.tierLong;
    V.parentRows=D.parents.map(p=>{ const joined=p.status==='joined', invited=p.status==='invited';
      return { initial:p.label.slice(-1), label:p.label, sub: joined?(p.email||'Akun aktif'):invited?('Diundang ke '+p.email):'Belum diundang',
        pillTxt: joined?'Aktif':invited?'Diundang':'—', pillBg: joined?'#E1F6EC':invited?'#FFF1D6':'#F0ECF9', pillFg: joined?'#1B7A4B':invited?'#B26A00':'#7A7596', pillBd: joined?'#BCE8D2':invited?'#F5DFAE':'#E7E2F3' }; });
    V.inviteShow=D.parents[1].status==='none';
    V.openInvite=()=>this.setState({push:{type:'invite',email:''}});
    V.openRenamePro=()=>this.toast('Ubah sebutan orang tua tersedia di Nummi Pro');
    V.signOut=()=>{ this.setState({authed:false,login:'pick',tab:'dash'}); };
    // push / modal
    const P=S.push;
    V.pushOpen=!!P;
    V.closePush=()=>this.setState({push:null});
    V.pSend=!!P&&P.type==='send'; V.pTake=!!P&&P.type==='take'; V.pAddkid=!!P&&P.type==='addkid';
    V.pAllow=!!P&&P.type==='allow'; V.pInv=!!P&&P.type==='inv'; V.pRates=!!P&&P.type==='rates';
    V.pHist=!!P&&P.type==='hist'; V.pWallet=!!P&&P.type==='wallet'; V.pSplit=!!P&&P.type==='split';
    V.pJob=!!P&&P.type==='job'; V.pPrize=!!P&&P.type==='prize';
    V.pInvite=!!P&&P.type==='invite';
    V.modalWidth=(P&&['wallet','hist','inv'].indexOf(P.type)>=0)?'720px':'600px';
    V.pushTitle=!P?'':P.type==='send'?'Send money':P.type==='take'?'Take money':P.type==='addkid'?'Add a child':P.type==='allow'?'Allowance':P.type==='inv'?'Investments':P.type==='split'?'Money rules':P.type==='job'?'New job':P.type==='prize'?'New prize':P.type==='invite'?'Undang pasangan':P.type==='hist'?(P.kid==='__all'?'All transactions':'Transactions'):P.type==='wallet'?(D.kids[P.kid]||K).name+'’s wallets':'Your bank rates';
    V.pushFootShow=!!P&&['inv','hist','wallet'].indexOf(P.type)<0;
    if(P&&P.type==='invite'){
      const emailOk=/^\S+@\S+\.\S+$/.test(P.email||'');
      V.invEmail=P.email; V.onInvEmail=e=>{P.email=e.target.value;this.forceUpdate();};
      V.pushCtaTxt='Kirim undangan'; V.pushCtaOp=emailOk?'1':'0.45';
      V.pushCtaDo=()=>{ if(!emailOk)return; D.parents[1].status='invited'; D.parents[1].email=P.email.trim();
        this.setState({push:null}); this.toast('Undangan dikirim ke '+P.email.trim());
        setTimeout(()=>{ D.parents[1].status='joined'; this.forceUpdate(); this.toast('Parent 2 sudah membuat akun & login'); },5000); };
    }
    if(P&&P.type==='hist'){
      const famH=P.kid==='__all';
      const HK=D.kids[P.kid]||K;
      const txs=famH?Object.values(D.kids).reduce((a,k)=>a.concat((k.tx||[]).map(t=>Object.assign({},t,{sub:k.name+' · '+t.sub}))),[]):(HK.tx||[]);
      V.hKidName=famH?'your children':HK.name;
      const RG=[{id:'1d',label:'1 day'},{id:'7d',label:'7 days'},{id:'custom',label:'Custom'}];
      V.hRanges=RG.map(r=>{ const on=P.range===r.id; return { pick:()=>{P.range=r.id;this.forceUpdate();}, label:r.label, bg:on?'#fff':'transparent', fg:on?'#1E1A38':'#7A7596', sh:on?'0 1px 3px rgba(30,26,56,.1)':'none' }; });
      V.hCustomShow=P.range==='custom';
      V.hFrom=P.from; V.onHFrom=e=>{P.from=e.target.value;this.forceUpdate();};
      V.hTo=P.to; V.onHTo=e=>{P.to=e.target.value;this.forceUpdate();};
      let from,to;
      if(P.range==='custom'){ from=P.from; to=P.to; }
      else { const days=P.range==='1d'?0:6; const d=new Date(this.TODAY); d.setDate(d.getDate()-days); from=this.iso(d); to=this.iso(this.TODAY); }
      const inRange=txs.filter(t=>t.date>=from&&t.date<=to).slice().sort((a,b)=>a.date<b.date?1:a.date>b.date?-1:0);
      const sumIn=inRange.filter(t=>t.dir==='in').reduce((s,t)=>s+t.amt,0);
      const sumOut=inRange.filter(t=>t.dir==='out').reduce((s,t)=>s+t.amt,0);
      V.hIn=F(sumIn); V.hOut=F(sumOut);
      const net=sumIn-sumOut;
      V.hNet=(net>0?'+ Rp ':net<0?'− Rp ':'Rp ')+F(Math.abs(net));
      V.hNetColor=net>0?'#1B7A4B':net<0?'#D64550':'#4C4869';
      V.hCount=inRange.length;
      V.hRangeLab=P.range==='1d'?'Today':P.range==='7d'?'Last 7 days':this.dayLabel(from)+' → '+this.dayLabel(to);
      V.hEmptyShow=inRange.length===0;
      const order=[], byDay={};
      inRange.forEach(t=>{ if(!byDay[t.date]){byDay[t.date]=[];order.push(t.date);} byDay[t.date].push(t); });
      order.sort().reverse();
      V.hGroups=order.map(day=>{
        const rows=byDay[day];
        const dn=rows.filter(t=>t.dir==='in').reduce((s,t)=>s+t.amt,0)-rows.filter(t=>t.dir==='out').reduce((s,t)=>s+t.amt,0);
        return { label:this.dayLabel(day), net:(dn>0?'+':dn<0?'−':'')+(dn?' Rp '+F(Math.abs(dn)):'no change'),
          rows: rows.map(t=>({ icon:this.icon(t.ic), label:t.label, sub:t.sub, amt:(t.dir==='in'?'+ ':t.dir==='out'?'− ':'')+(t.amt?'Rp '+F(t.amt):'—'), color:t.dir==='in'?'#1B7A4B':t.dir==='out'?'#D64550':'#7A7596' })) };
      });
    }
    if(P&&P.type==='wallet'){
      const WK=D.kids[P.kid]||K, wt=this.kidTotal(WK);
      V.wKidEmo=WK.emo; V.wKidName=WK.name; V.wTotal=F(wt); V.wUnsorted=F(WK.unsorted);
      const cats=[ {id:'unsorted',name:'Unsorted',color:'#A99BD6',amt:WK.unsorted}, {id:'spend',name:'Spend',color:'#F59E4C'}, {id:'save',name:'Save',color:'#4C9EE8'}, {id:'give',name:'Give',color:'#ED6FA5'}, {id:'grow',name:'Grow',color:'#3FBF7F'} ];
      V.wBars=cats.map(c=>({ color:c.color, w:Math.round(((c.id==='unsorted'?WK.unsorted:this.catTotal(WK,c.id))/wt)*100)+'%' })).filter(b=>parseInt(b.w,10)>0);
      V.wGroups=cats.filter(c=>c.id!=='unsorted').map(c=>{
        const rows=WK.wallets.filter(w=>w.cat===c.id);
        if(!rows.length) return null;
        return { name:c.name, color:c.color, total:F(this.catTotal(WK,c.id)),
          rows: rows.map(w=>{ const locked=!(w.cat==='spend'||w.kind==='catchall');
            let sub = w.kind==='dream'?'A dream — a promise to themselves' : w.kind==='catchall'?'Free savings, no job yet' : w.cat==='spend'?'Everyday spending' : w.cat==='give'?'Promised to someone else' : w.meta&&w.meta.kind==='td'?('Time Deposit · matures '+w.meta.maturity) : w.meta&&w.meta.kind==='gold'?((w.meta.grams*1000)+' mg at today’s buy-back') : w.meta&&w.meta.kind==='fx'?(w.meta.units+' '+w.meta.ccy+' at today’s sell rate') : 'Wallet';
            return { ico:w.ico, name:w.name, sub, amt:F(w.amt), lockShow:locked }; }) };
      }).filter(Boolean);
      V.wSend=()=>this.setState({push:{type:'send',kid:WK.id,amt:'',src:'Gift',note:''}});
      V.wTake=()=>this.setState({push:{type:'take',kid:WK.id,wal:null,amt:'',why:''}});
      V.wHistory=()=>this.setState({push:{type:'hist',kid:WK.id,range:'7d',from:'2026-06-16',to:'2026-07-16'}});
    }
    if(P&&P.type==='send'){
      const SK=D.kids[P.kid];
      V.sKids=Object.values(D.kids).map(x=>{ const on=x.id===P.kid; return { pick:()=>{P.kid=x.id;this.forceUpdate();}, emo:x.emo, name:x.name, bg:on?'#6C4CE0':'#fff', bd:on?'#6C4CE0':'#E7E2F3', fg:on?'#fff':'#1E1A38', eBg:on?'rgba(255,255,255,.2)':'#F7F5FD' }; });
      const amt=this.parseAmt(P.amt);
      V.sAmt=amt?('Rp '+F(amt)):''; V.onSAmt=e=>{P.amt=e.target.value;this.forceUpdate();};
      V.sMinus=()=>{P.amt=String(Math.max(0,amt-5000));this.forceUpdate();};
      V.sPlus=()=>{P.amt=String(amt+5000);this.forceUpdate();};
      V.sSrcs=['Gift','THR','Allowance top-up','Reward','Other'].map(t=>{ const on=P.src===t; return { pick:()=>{P.src=t;this.forceUpdate();}, txt:t, bg:on?'#EDE7FC':'#fff', bd:on?'#6C4CE0':'#E7E2F3', fg:on?'#4A32A8':'#4C4869' }; });
      V.sNote=P.note; V.onSNote=e=>{P.note=e.target.value;this.forceUpdate();};
      V.sInfoName=SK.name;
      const ok=amt>0;
      V.pushCtaTxt=ok?('Send Rp '+F(amt)+' to '+SK.name):'Send money'; V.pushCtaOp=ok?'1':'0.45';
      V.pushCtaDo=()=>{ if(!ok)return; const sum=this.income(SK,amt,{ic:'up',label:P.src+(P.note?' · '+P.note:'')}); this.setState({push:null,kid:SK.id,tab:'dash'}); this.toast('Rp '+F(amt)+' → '+SK.name+' · '+sum); };
    }
    if(P&&P.type==='take'){
      const TK=D.kids[P.kid];
      V.tKids=Object.values(D.kids).map(x=>{ const on=x.id===P.kid; return { pick:()=>{P.kid=x.id;P.wal=null;this.forceUpdate();}, emo:x.emo, name:x.name, bg:on?'#6C4CE0':'#fff', bd:on?'#6C4CE0':'#E7E2F3', fg:on?'#fff':'#1E1A38', eBg:on?'rgba(255,255,255,.2)':'#F7F5FD' }; });
      const takeable=w=>w.cat==='spend'||w.kind==='catchall';
      const open=[{id:'__unsorted',name:'Unsorted',ico:'🪙',sub:'Not yet given a job',amt:TK.unsorted}].concat(TK.wallets.filter(takeable).map(w=>({id:w.id,name:w.name,ico:w.ico,sub:w.cat==='spend'?'Spend':'Free savings',amt:w.amt})));
      V.tWals=open.map(w=>{ const on=P.wal===w.id; return { pick:()=>{P.wal=w.id;this.forceUpdate();}, ico:w.ico, name:w.name, sub:w.sub, amt:F(w.amt), bg:on?'#EDE7FC':'#fff', bd:on?'#6C4CE0':'#E7E2F3' }; });
      const locks=TK.wallets.filter(w=>!takeable(w));
      V.tLockShow=locks.length>0;
      V.tLocks=locks.map(w=>({ ico:w.ico, name:w.name, amt:F(w.amt), sub:w.kind==='dream'?'A promise to themselves':w.cat==='give'?'A promise to someone else':'A real asset — cannot be clawed back', pick:()=>this.toast(w.name+' is protected') }));
      const maxAmt=P.wal==='__unsorted'?TK.unsorted:(this.wal(P.kid,P.wal)||{amt:0}).amt;
      const amt=this.parseAmt(P.amt), why=(P.why||'').trim();
      V.tFormShow=!!P.wal;
      V.tAmt=amt?('Rp '+F(amt)):''; V.onTAmt=e=>{P.amt=e.target.value;this.forceUpdate();};
      V.tMinus=()=>{P.amt=String(Math.max(0,amt-5000));this.forceUpdate();};
      V.tPlus=()=>{P.amt=String(Math.min(maxAmt,amt+5000));this.forceUpdate();};
      V.tHint='Max available: Rp '+F(maxAmt);
      V.tWhy=P.why; V.onTWhy=e=>{P.why=e.target.value;this.forceUpdate();};
      V.tWhyName=TK.name;
      const wn=P.wal==='__unsorted'?'Unsorted':(this.wal(P.kid,P.wal)||{}).name;
      V.tPrev='A grown-up took Rp '+F(amt)+' from your '+(wn||'…')+'.'+(why?' Reason: “'+why+'”':'');
      const ok=!!P.wal&&amt>0&&amt<=maxAmt&&why.length>0;
      V.pushCtaTxt=amt>0?('Take Rp '+F(amt)):'Take money'; V.pushCtaOp=ok?'1':'0.45';
      V.pushCtaDo=()=>{ if(!ok)return; if(P.wal==='__unsorted')TK.unsorted-=amt; else this.wal(P.kid,P.wal).amt-=amt; TK.act.unshift({ic:'hand',label:'Taken from '+wn+' · '+why,when:'Just now',amt:'−'+F(amt),c:'out'}); this.logTx(TK,{ic:'hand',label:'Taken by a grown-up · '+why,sub:'From '+wn,amt,dir:'out'}); this.setState({push:null,kid:TK.id,tab:'dash'}); this.toast('Rp '+F(amt)+' taken · '+TK.name+' has been notified'); };
    }
    if(P&&P.type==='addkid'){
      V.akName=P.name; V.onAkName=e=>{P.name=e.target.value;this.forceUpdate();};
      V.akM=P.m; V.onAkM=e=>{P.m=e.target.value; if(!P.touched)P.tier=this.suggestTier(parseInt(P.y,10),parseInt(P.m,10))||P.tier; this.forceUpdate();};
      V.akY=P.y; V.onAkY=e=>{P.y=e.target.value; if(!P.touched)P.tier=this.suggestTier(parseInt(P.y,10),parseInt(P.m,10))||P.tier; this.forceUpdate();};
      const sug=this.suggestTier(parseInt(P.y,10),parseInt(P.m,10));
      const TIERS=[ {id:'kecil',label:'Little',sub:'KG–Grade 1 · simplest screens, no Grow'}, {id:'menengah',label:'Middle',sub:'Grade 2–6 · sub-wallets, dreams, Grow'}, {id:'remaja',label:'Teen',sub:'Grade 7–9 · full detail and investing'} ];
      V.akTiers=TIERS.map(t=>{ const on=P.tier===t.id; return { pick:()=>{P.tier=t.id;P.touched=true;this.forceUpdate();}, label:t.label, sub:t.sub, sugShow:sug===t.id, bg:on?'#EDE7FC':'#fff', bd:on?'#6C4CE0':'#E7E2F3' }; });
      V.akTierHint=!sug?'Pick a birth year and we’ll suggest one — you can always override it.':(P.touched&&P.tier!==sug?'You picked a different tier than we suggested — that’s fine, the boundary isn’t sharp.':'Suggested from their age. You can override it.');
      V.akPin=P.pin; V.onAkPin=e=>{P.pin=e.target.value.replace(/[^\d]/g,'').slice(0,6);this.forceUpdate();};
      const ok=(P.name||'').trim().length>0&&P.m&&P.y&&P.tier&&P.pin.length===6;
      V.pushCtaTxt='Create '+((P.name||'').trim()||'the')+' account'; V.pushCtaOp=ok?'1':'0.45';
      V.pushCtaDo=()=>{ if(!ok)return; const id='kid'+(Object.keys(D.kids).length+1); const emo=['🐨','🐯','🐧','🦁','🐸','🐹'][Object.keys(D.kids).length%6];
        const little=P.tier==='kecil'; const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
        D.kids[id]={ id, name:P.name.trim(), emo, little, born:MONTHS[parseInt(P.m,10)-1]+' '+P.y, gems:0,
          tier:little?'LITTLE · KG–GR 1':P.tier==='remaja'?'TEEN · GR 7–9':'MIDDLE · GR 2–6',
          tierLong:little?'Little · KG–Grade 1':P.tier==='remaja'?'Teen · Grade 7–9':'Middle · Grade 2–6',
          learn:{starsEarned:0,chaptersDone:0,chaptersTotal:5,weekLessonDone:false,current:'What money is',last:null},
          allowance:{on:false,amount:10000,freq:'weekly',dow:6,dom:1}, unsorted:0,
          rules:{ mode:little?'strict':'flexible', split:{ on:true, spend:40, save:40, give:20, dest:{} } },
          wallets: little?[{id:'spend',name:'Spend',ico:'🍭',cat:'spend',amt:0},{id:'save',name:'Save',ico:'🏦',cat:'save',kind:'catchall',amt:0},{id:'give',name:'Give',ico:'🎁',cat:'give',amt:0}]:[{id:'spend',name:'Everyday',ico:'🍡',cat:'spend',amt:0},{id:'freesavings',name:'Free savings',ico:'💭',cat:'save',kind:'catchall',amt:0},{id:'give',name:'Give',ico:'🎁',cat:'give',amt:0}],
          act:[] };
        this.setState({push:null,kid:id,tab:'dash'}); this.toast(P.name.trim()+'’s account is ready — send them their first money'); };
    }
    if(P&&P.type==='allow'){
      const AK=D.kids[P.kid], amt=P.amt;
      V.alwAmt='Rp '+F(amt); V.onAlwAmt=e=>{P.amt=this.parseAmt(e.target.value);this.forceUpdate();};
      V.alwMinus=()=>{P.amt=Math.max(5000,amt-5000);this.forceUpdate();};
      V.alwPlus=()=>{P.amt=amt+5000;this.forceUpdate();};
      V.alwFreqs=[{id:'weekly',label:'Weekly'},{id:'biweekly',label:'Every 2 wks'},{id:'monthly',label:'Monthly'}].map(f=>{ const on=P.freq===f.id; return { pick:()=>{P.freq=f.id;this.forceUpdate();}, label:f.label, bg:on?'#fff':'transparent', fg:on?'#1E1A38':'#7A7596', sh:on?'0 1px 3px rgba(30,26,56,.1)':'none' }; });
      if(P.freq==='monthly'){ V.alwDayLab='Which date?'; V.alwDays=[1,5,10,15,20,25].map(d=>{ const on=P.dom===d; return { pick:()=>{P.dom=d;this.forceUpdate();}, label:String(d), bg:on?'#EDE7FC':'#fff', bd:on?'#6C4CE0':'#E7E2F3', fg:on?'#4A32A8':'#4C4869' }; }); }
      else { V.alwDayLab='Which day?'; V.alwDays=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d,i)=>{ const on=P.dow===i; return { pick:()=>{P.dow=i;this.forceUpdate();}, label:d, bg:on?'#EDE7FC':'#fff', bd:on?'#6C4CE0':'#E7E2F3', fg:on?'#4A32A8':'#4C4869' }; }); }
      V.alwNext=this.nextAllowance({on:true,freq:P.freq,dow:P.dow,dom:P.dom})+' · Rp '+F(amt);
      V.pushCtaTxt='Save allowance'; V.pushCtaOp='1';
      V.pushCtaDo=()=>{ Object.assign(AK.allowance,{on:true,amount:P.amt,freq:P.freq,dow:P.dow,dom:P.dom}); this.setState({push:null}); this.toast('Allowance updated for '+AK.name); };
    }
    if(P&&P.type==='inv'){
      const IK=D.kids[P.kid];
      V.invRows=IK.wallets.filter(w=>w.cat==='grow').map(w=>{ const m=w.meta||{}; let kvs=[],pill=null;
        if(m.kind==='td'){ kvs=[{k:'Principal',val:'Rp '+F(m.principal)},{k:'Rate (whole term)',val:m.ratePct+'%'},{k:'Matures',val:m.maturity}]; if(m.matured)pill={t:'Matured — ready',bg:'#E1F6EC',fg:'#1B7A4B'}; }
        else if(m.kind==='gold'){ kvs=[{k:'Holding',val:(m.grams*1000)+' mg'},{k:'Paid',val:'Rp '+F(m.cost)},{k:'Worth at buy-back',val:'Rp '+F(w.amt)}]; pill=w.amt<m.cost?{t:'Down Rp '+F(m.cost-w.amt),bg:'#FCE8EA',fg:'#D64550'}:{t:'Up Rp '+F(w.amt-m.cost),bg:'#E1F6EC',fg:'#1B7A4B'}; }
        else if(m.kind==='fx'){ kvs=[{k:'Holding',val:m.units+' '+m.ccy},{k:'Paid',val:'Rp '+F(m.cost)},{k:'Worth at sell rate',val:'Rp '+F(w.amt)}]; pill=w.amt<m.cost?{t:'Down Rp '+F(m.cost-w.amt),bg:'#FCE8EA',fg:'#D64550'}:{t:'Up Rp '+F(w.amt-m.cost),bg:'#E1F6EC',fg:'#1B7A4B'}; }
        return { ico:w.ico, name:w.name, amt:F(w.amt), kvs, pillShow:!!pill, pillTxt:pill?pill.t:'', pillBg:pill?pill.bg:'', pillFg:pill?pill.fg:'' }; });
    }
    if(P&&P.type==='rates'){
      V.rtInputs=[ {key:'r3',label:'3-month deposit'}, {key:'r6',label:'6-month deposit'}, {key:'r12',label:'12-month deposit'} ].map(x=>({ label:x.label, val:P[x.key], onVal:e=>{P[x.key]=e.target.value;this.forceUpdate();} }));
      V.pushCtaTxt='Save rates'; V.pushCtaOp='1';
      V.pushCtaDo=()=>{ D.rates[3]=parseFloat(P.r3)||D.rates[3]; D.rates[6]=parseFloat(P.r6)||D.rates[6]; D.rates[12]=parseFloat(P.r12)||D.rates[12]; this.setState({push:null}); this.toast('Rates saved — new deposits will use them'); };
    }
    if(P&&P.type==='split'){
      const XK=D.kids[P.kid], base=XK.allowance.amount||20000;
      V.spKid=XK.name;
      V.spOnCards=[{on:true,label:'Split it automatically',sub:'Every rupiah gets a job the moment it lands — no sorting to do'},{on:false,label:'Leave it all in Unsorted',sub:XK.name+' gives each rupiah a job themselves'}].map(o=>{ const sel=P.on===o.on; return { pick:()=>{P.on=o.on;this.forceUpdate();}, label:o.label, sub:o.sub, bg:sel?'#EDE7FC':'#fff', bd:sel?'#6C4CE0':'#E7E2F3', dot:sel?'#6C4CE0':'#D9D3EA', dotIn:sel?'#6C4CE0':'transparent' }; });
      V.spOnShow=P.on;
      const CATS=[{id:'spend',color:'#F59E4C',fallback:'Spend'},{id:'save',color:'#4C9EE8',fallback:'Save'},{id:'give',color:'#ED6FA5',fallback:'Give'}];
      const sum=CATS.reduce((s,c)=>s+(P[c.id]||0),0), left=100-sum;
      const destOf=c=>{ const ws=this.destWallets(XK,c); return ws.find(w=>w.id===P.dest[c])||ws[0]||null; };
      V.spRows=CATS.map(c=>{ const ws=this.destWallets(XK,c.id), d=destOf(c.id), pct=P[c.id]||0;
        return { color:c.color, name:d?d.name:c.fallback, pct, val:pct, amt:F(Math.round(base*pct/100/100)*100),
          onVal:e=>{ P[c.id]=parseInt(e.target.value,10)||0; this.forceUpdate(); },
          destShow:ws.length>1,
          dests:ws.map(w=>{ const on=d&&d.id===w.id; return { pick:()=>{P.dest[c.id]=w.id;this.forceUpdate();}, name:w.ico+' '+w.name, bg:on?'#EDE7FC':'#F7F5FD', bd:on?'#6C4CE0':'#F0ECF9', fg:on?'#4A32A8':'#7A7596' }; }) }; });
      V.spBars=CATS.map(c=>({color:c.color,w:Math.max(0,P[c.id]||0)+'%'})).concat(left>0?[{color:'#A99BD6',w:left+'%'}]:[]).filter(b=>parseInt(b.w,10)>0);
      V.spLeft=Math.abs(left);
      V.spLeftLabel=left<0?'Over by':'Unsorted — '+XK.name+' decides';
      V.spLeftFg=left<0?'#D64550':(left>0&&P.mode==='strict')?'#B26A00':'#7A7596';
      V.spLeftNote=left<0?'The jobs add up to more than the money that arrives. Take '+(-left)+'% off somewhere.':left===0?'Nothing is left over — every rupiah arrives with a job.':P.mode==='strict'?('Strict rules need the whole 100% assigned — leaving money unsorted is a decision, and in Strict '+XK.name+' cannot make it.'):('Rp '+F(Math.round(base*left/100/100)*100)+' of a typical arrival stays unsorted for '+XK.name+' to place.');
      V.spPrevLab='A Rp '+F(base)+' arrival would land as';
      V.spPrev=CATS.filter(c=>(P[c.id]||0)>0).map(c=>({ name:(destOf(c.id)||{name:c.fallback}).name, amt:F(Math.round(base*P[c.id]/100/100)*100) })).concat(left>0?[{name:'Unsorted',amt:F(Math.round(base*left/100/100)*100)}]:[]);
      const MODES=[{id:'strict',label:'Strict',bullets:['The split is locked — money cannot leave the job you gave it','Every cash-out needs your approval, however small','Dreams and Give cannot be cancelled without you']},{id:'flexible',label:'Flexible',bullets:[XK.name+' can re-sort Unsorted and Spend money freely','Spending from Spend goes through without asking','They can retire their own dreams — you still see it happen']}];
      V.spModes=MODES.map(m=>{ const sel=P.mode===m.id; return { pick:()=>{P.mode=m.id;this.forceUpdate();}, label:m.label, bullets:m.bullets.map(t=>({t})), bg:sel?'#EDE7FC':'#fff', bd:sel?'#6C4CE0':'#E7E2F3', dot:sel?'#6C4CE0':'#D9D3EA', dotIn:sel?'#6C4CE0':'transparent' }; });
      const ok=!P.on?true:(left===0||(left>0&&P.mode==='flexible'));
      V.pushCtaTxt=left<0?'Ratio is over 100%':(P.on&&left>0&&P.mode==='strict')?'Assign the last '+left+'%':'Save money rules';
      V.pushCtaOp=ok?'1':'0.45';
      V.pushCtaDo=()=>{ if(!ok)return; XK.rules.mode=P.mode; Object.assign(XK.rules.split,{on:P.on,spend:P.spend,save:P.save,give:P.give,dest:Object.assign({},P.dest)}); this.setState({push:null}); this.toast(P.on?('Rules saved · '+P.spend+'/'+P.save+'/'+P.give+' · '+(P.mode==='strict'?'Strict':'Flexible')):('Auto-split off · '+(P.mode==='strict'?'Strict':'Flexible')+' rules')); };
    }
    if(P&&P.type==='job'){
      const JK=D.kids[P.kid];
      V.jbKid=JK.name;
      V.jbTitle=P.title; V.onJbTitle=e=>{P.title=e.target.value;this.forceUpdate();};
      V.jbIcos=['🧹','🛏️','🍽️','🌱','🐕','🗑️','📚','🏍️','👕','🧺'].map(e=>{ const on=P.ico===e; return { pick:()=>{P.ico=e;this.forceUpdate();}, emo:e, bg:on?'#EDE7FC':'#fff', bd:on?'#6C4CE0':'#E7E2F3' }; });
      const KINDS=[{id:'family',label:'Family contribution',sub:'Helping at home, every week · paid in 💎 gems'},{id:'extra',label:'Extra work',sub:'A one-off you’d otherwise pay for · paid in rupiah'},{id:'ach',label:'Achievement',sub:'A once-only milestone · paid in 💎 gems'}];
      V.jbKinds=KINDS.map(k=>{ const sel=P.kind===k.id; return { pick:()=>{ P.kind=k.id; P.rew=k.id==='extra'?15000:k.id==='ach'?50:2; this.forceUpdate(); }, label:k.label, sub:k.sub, bg:sel?'#EDE7FC':'#fff', bd:sel?'#6C4CE0':'#E7E2F3', dot:sel?'#6C4CE0':'#D9D3EA', dotIn:sel?'#6C4CE0':'transparent' }; });
      const money=P.kind==='extra', step=money?5000:1;
      V.jbRewLab=money?'How much?':'How many gems?';
      V.jbRew=money?('Rp '+F(P.rew)):('💎 '+P.rew);
      V.jbMinus=()=>{P.rew=Math.max(step,P.rew-step);this.forceUpdate();};
      V.jbPlus=()=>{P.rew=P.rew+step;this.forceUpdate();};
      V.jbRewHint=money?'Paid into '+JK.name+'’s money when you approve the claim — it follows the money rules you set.':P.kind==='ach'?'Milestones are worth more than a weekly job — make it feel like one.':'Gems buy prizes, never money. Two or three is plenty for a weekly job.';
      V.jbIco=P.ico;
      V.jbPrevTitle=(P.title||'').trim()||'Your new job';
      V.jbPrevSub=P.kind==='family'?'Family contribution · weekly':P.kind==='extra'?'Extra work · once':'Achievement · once';
      V.jbPill=money?('Rp '+F(P.rew)):('💎 '+P.rew);
      V.jbPillBg=money?'#E1F6EC':'#EDE7FC'; V.jbPillFg=money?'#1B7A4B':'#4A32A8';
      const ok=(P.title||'').trim().length>0&&P.rew>0;
      V.pushCtaTxt='Add this job'; V.pushCtaOp=ok?'1':'0.45';
      V.pushCtaDo=()=>{ if(!ok)return; D.missions.push({ id:'pm'+(D.missions.length+1)+'_'+Date.now(), kid:JK.id, ico:P.ico, title:P.title.trim(), sub:V.jbPrevSub, pill:V.jbPill, kind:money?'money':'gem' }); this.setState({push:null,tab:'mis',kid:JK.id}); this.toast('“'+P.title.trim()+'” added to '+JK.name+'’s jobs'); };
    }
    if(P&&P.type==='prize'){
      const ZK=D.kids[P.kid];
      V.pzKid=ZK.name; V.pzHas=ZK.gems;
      V.pzTitle=P.title; V.onPzTitle=e=>{P.title=e.target.value;this.forceUpdate();};
      V.pzIcos=['🍦','📺','🎮','⚽','🎡','🎬','🛌','🧁','📚','🧸'].map(e=>{ const on=P.ico===e; return { pick:()=>{P.ico=e;this.forceUpdate();}, emo:e, bg:on?'#E4F1FD':'#fff', bd:on?'#6C4CE0':'#E7E2F3' }; });
      V.pzCost=P.cost;
      V.pzMinus=()=>{P.cost=Math.max(1,P.cost-1);this.forceUpdate();};
      V.pzPlus=()=>{P.cost=P.cost+1;this.forceUpdate();};
      V.pzHint=P.cost>25?'Over 💎 25 counts as a big prize — it stays locked until '+ZK.name+' finishes 2 chapters.':'Small, frequent prizes keep the habit alive better than one huge one.';
      const ok=(P.title||'').trim().length>0;
      V.pushCtaTxt='Add this prize'; V.pushCtaOp=ok?'1':'0.45';
      V.pushCtaDo=()=>{ if(!ok)return; D.prizes.push({ id:'pz'+(D.prizes.length+1)+'_'+Date.now(), kid:ZK.id, ico:P.ico, title:P.title.trim(), cost:P.cost }); this.setState({push:null,tab:'mis',kid:ZK.id}); this.toast('“'+P.title.trim()+'” added to '+ZK.name+'’s prizes'); };
    }
    V.toastShow=!!S.toast; V.toastTxt=S.toast||'';
    return V;
  }
}

