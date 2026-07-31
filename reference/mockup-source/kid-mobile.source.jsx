/* GENERATED oleh tools/unpack-mockups.mjs dari reference/mockups/kid-mobile.html — JANGAN DIEDIT.
   Sumber kebenaran tetap berkas HTML-nya; berkas ini hanya supaya bisa di-grep. */


class Component extends DCLogic {
  C = {
    bg:'#EEEAF6', bgTeen:'#EFF1F7', surface:'#FFFFFF', surface2:'#F7F4FD', hair:'#EBE6F5',
    ink:'#2A2342', inkSoft:'#736C8C',
    spend:'#FF7A4D', spendT:'#FFEDE5', spendD:'#C24E24',
    save:'#2CA6E0', saveT:'#E2F2FB', saveD:'#1B6E97',
    give:'#F056A0', giveT:'#FCE6F1', giveD:'#B62C74',
    grow:'#2FC078', growT:'#E1F6EC', growD:'#1B7A4B',
    unsorted:'#8A7CF0', unsortedT:'#ECE9FC',
    amber:'#FFB020', track:'#ECE7F7', loss:'#D64550', lossT:'#FCE8EA'
  };
  themes = {
    grape:{name:'Grape',base:'#6C4CE0',deep:'#4A32A8',light:'#8A6BFF',tint:'#EDE7FC',grad:'linear-gradient(135deg,#8A6BFF,#6C4CE0)'},
    ocean:{name:'Ocean',base:'#0E8FB0',deep:'#0A6C86',light:'#3FB6D4',tint:'#DFF3F8',grad:'linear-gradient(135deg,#3FB6D4,#0E8FB0)'},
    mint:{name:'Mint',base:'#12A874',deep:'#0C7C55',light:'#3FCB98',tint:'#DDF5EB',grad:'linear-gradient(135deg,#3FCB98,#12A874)'},
    sunset:{name:'Sunset',base:'#EE6A3B',deep:'#C24E24',light:'#FF9166',tint:'#FDE8DF',grad:'linear-gradient(135deg,#FF9166,#EE6A3B)'},
    berry:{name:'Berry',base:'#D6336C',deep:'#A31E52',light:'#F05C90',tint:'#FBE1EB',grad:'linear-gradient(135deg,#F05C90,#D6336C)'}
  };
  cardShadow='0 2px 4px rgba(42,35,66,.04), 0 8px 24px rgba(42,35,66,.06)';

  state = {
    tier: 'middle',
    theme: (this.props&&this.props.defaultTheme)||'grape',
    tab:'home', push:null, sheet:false,
    masked:false, accordion:'spend', toast:null, lang:'en', mtab:'today',
    data:{
      unsorted:50000,
      spend:{snacks:45000, transport:30000, games:20000},
      save:{bmx:150000, headphones:30000, free:60000},
      give:40000,
      grow:{td:30750, gold:19140, usd:9821}
    },
    pending:[{id:1, icon:'💸', title:'Cash out · Rp 20,000', sub:'From Snacks · waiting for Mom', tag:'Needs OK'}],
    form:{}
  };

  b(){ return this.themes[this.state.theme]; }
  bgCol(){ return this.state.tier==='teen'? this.C.bgTeen : this.C.bg; }

  rp(n){ return 'Rp ' + Math.round(n).toLocaleString('en-US'); }
  money(n,size,o={}){
    const c=o.color||this.C.ink;
    if(o.maskable && this.state.masked){
      return React.createElement('span',{style:{font:`600 ${size}px 'Fredoka',sans-serif`,color:c,letterSpacing:'-.02em'}},'Rp ••••');
    }
    return React.createElement('span',{style:{font:`600 ${size}px 'Fredoka',sans-serif`,color:c,letterSpacing:'-.02em',whiteSpace:'nowrap'}},
      React.createElement('span',{style:{fontSize:Math.round(size*0.56)+'px',fontWeight:500,color:o.rpColor||(c===this.C.ink?this.C.inkSoft:c),marginRight:'2px',opacity:o.rpColor?1:.9}},'Rp'),
      Math.round(n).toLocaleString('en-US'));
  }
  h(t,p,c){ return React.createElement(t,p,...(c==null?[]:Array.isArray(c)?c:[c])); }

  // ---- totals ----
  sum(o){ return Object.values(o).reduce((a,b)=>a+b,0); }
  spendTotal(){ return this.sum(this.state.data.spend); }
  saveTotal(){ return this.sum(this.state.data.save); }
  growTotal(){ return this.sum(this.state.data.grow); }
  giveTotal(){ return this.state.data.give; }
  total(){ const d=this.state.data; return d.unsorted+this.spendTotal()+this.saveTotal()+d.give+this.growTotal(); }

  segs(){
    const C=this.C, d=this.state.data;
    if(this.state.tier==='little'){
      return [
        {amount:d.unsorted,color:C.unsorted},
        {amount:this.spendTotal(),color:C.spend},
        {amount:this.saveTotal()+this.growTotal(),color:C.save},
        {amount:d.give,color:C.give}
      ];
    }
    return [
      {amount:d.unsorted,color:C.unsorted},
      {amount:this.spendTotal(),color:C.spend},
      {amount:this.saveTotal(),color:C.save},
      {amount:d.give,color:C.give},
      {amount:this.growTotal(),color:C.grow}
    ];
  }

  // ---- ring ----
  polar(cx,cy,r,a){ const rad=(a-90)*Math.PI/180; return [cx+r*Math.cos(rad),cy+r*Math.sin(rad)]; }
  arc(cx,cy,r,a0,a1){ const [x0,y0]=this.polar(cx,cy,r,a0),[x1,y1]=this.polar(cx,cy,r,a1); const lg=(a1-a0)>180?1:0; return `M ${x0} ${y0} A ${r} ${r} 0 ${lg} 1 ${x1} ${y1}`; }
  ring(size,stroke,segs,gap=7){
    const total=segs.reduce((s,x)=>s+x.amount,0)||1, cx=size/2, cy=size/2, r=(size-stroke)/2;
    let acc=0; const paths=[];
    segs.forEach((s,i)=>{ const f=s.amount/total; const a0=acc*360+gap/2, a1=(acc+f)*360-gap/2; acc+=f;
      paths.push(React.createElement('path',{key:i,d:this.arc(cx,cy,r,a0,a1),stroke:s.color,strokeWidth:stroke,fill:'none',strokeLinecap:'round'})); });
    return React.createElement('svg',{width:size,height:size,viewBox:`0 0 ${size} ${size}`,style:{display:'block'}},paths);
  }
  progRing(size,stroke,pct,color,track){
    const cx=size/2,cy=size/2,r=(size-stroke)/2, C=2*Math.PI*r, on=C*Math.max(0,Math.min(1,pct/100));
    return React.createElement('svg',{width:size,height:size,viewBox:`0 0 ${size} ${size}`,style:{transform:'rotate(-90deg)'}},[
      React.createElement('circle',{key:'t',cx,cy,r,stroke:track||this.C.track,strokeWidth:stroke,fill:'none'}),
      React.createElement('circle',{key:'p',cx,cy,r,stroke:color,strokeWidth:stroke,fill:'none',strokeLinecap:'round',strokeDasharray:`${on} ${C-on}`})
    ]);
  }

  // ---- state helpers ----
  set(patch){ this.setState(patch); }
  go(tab){ this.setState({tab,push:null,sheet:false}); }
  toast(msg){ this.setState({toast:msg}); clearTimeout(this._t); this._t=setTimeout(()=>this.setState({toast:null}),2600); }
  openPush(push,form={}){ this.setState({push,sheet:false,form}); }
  closePush(){ this.setState({push:null}); }
  addPending(p){ const id=Date.now(); this.setState(s=>({pending:[{id,...p},...s.pending]})); }

  bal(id){ const d=this.state.data;
    if(d.spend[id]!=null) return d.spend[id];
    if(d.save[id]!=null) return d.save[id];
    if(id==='give') return d.give;
    return 0;
  }
  addTo(id,amt){ this.setState(s=>{ const d=JSON.parse(JSON.stringify(s.data));
    if(d.spend[id]!=null) d.spend[id]+=amt; else if(d.save[id]!=null) d.save[id]+=amt; else if(id==='give') d.give+=amt; return {data:d}; }); }

  spendW=[{id:'snacks',emoji:'🍡',name:'Snacks'},{id:'transport',emoji:'🚌',name:'Transport'},{id:'games',emoji:'🎮',name:'Games'}];
  saveW=[{id:'bmx',emoji:'🚲',name:'BMX Bike'},{id:'headphones',emoji:'🎧',name:'Headphones'},{id:'free',emoji:'💭',name:'Free savings'}];

  // =========================================================== SHELL
  renderVals(){
    const app=this.h('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:'22px'}},[
      this.harness(),
      this.frame()
    ]);
    return { app };
  }

  harness(){
    return null;
    const C=this.C, B=this.b();
    const tiers=[['little','Little · KG–Gr 1'],['middle','Middle · Gr 2–6'],['teen','Teen · Gr 7–9']];
    const hint={
      little:'Little mode: big numbers, little text, only 3 wallets (Grow is hidden). For kids still learning to read.',
      middle:'Middle mode: the full app — sub-wallets, dreams, missions, Grow.',
      teen:'Teen mode: same data, calmer voice, tighter numbers, cooler background.'
    }[this.state.tier];
    return this.h('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:'8px',maxWidth:'420px'}},[
      this.h('div',{key:'pill',style:{display:'flex',background:'#fff',borderRadius:'999px',padding:'4px',boxShadow:this.cardShadow,gap:'2px'}},
        tiers.map(([k,l])=>this.h('button',{key:k,onClick:()=>this.setState({tier:k,push:null,accordion:'spend'}),
          style:{border:'none',cursor:'pointer',borderRadius:'999px',padding:'8px 14px',fontSize:'11.5px',fontWeight:700,fontFamily:'inherit',
            background:this.state.tier===k?B.base:'transparent',color:this.state.tier===k?'#fff':C.inkSoft,transition:'all .15s'}},l))),
      this.h('div',{key:'hint',style:{fontSize:'11px',color:'#6b6482',textAlign:'center',lineHeight:1.4,maxWidth:'360px'}},hint),
      this.h('div',{key:'note',style:{fontSize:'9.5px',color:'#9a93ad',textAlign:'center',fontStyle:'italic'}},'Reviewer harness — real children never see this; a parent sets the tier.')
    ]);
  }

  frame(){
    const C=this.C;
    return this.h('div',{style:{width:'390px',height:'812px',background:'#141024',borderRadius:'52px',padding:'11px',boxShadow:'0 40px 90px rgba(42,35,66,.4)',position:'relative',flex:'none'}},
      this.h('div',{style:{width:'100%',height:'100%',background:this.bgCol(),borderRadius:'42px',overflow:'hidden',position:'relative'}},[
        this.h('div',{key:'notch',style:{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:'150px',height:'30px',background:'#141024',borderRadius:'0 0 20px 20px',zIndex:60}},''),
        this.tabContent(),
        this.bottomNav(),
        this.state.sheet? this.sheet():null,
        this.state.push? this.pushScreen():null,
        this.state.toast? this.h('div',{key:'toast',style:{position:'absolute',bottom:'100px',left:'50%',zIndex:90,background:this.C.ink,color:'#fff',padding:'11px 18px',borderRadius:'14px',fontSize:'12.5px',fontWeight:600,boxShadow:'0 8px 24px rgba(0,0,0,.25)',animation:'cel-toast 2.6s both',maxWidth:'300px',textAlign:'center'}},this.state.toast):null
      ]));
  }

  statusBar(dark){
    return this.h('div',{style:{height:'50px',display:'flex',alignItems:'flex-end',justifyContent:'space-between',padding:'0 26px 6px',fontSize:'14px',fontWeight:700,color:dark?'#fff':this.C.ink,flex:'none'}},[
      this.h('span',{key:'t'},'9:41'),
      this.h('span',{key:'r',style:{fontSize:'12px',letterSpacing:'1px'}},'📶 🔋')
    ]);
  }

  bottomNav(){
    const C=this.C, B=this.b(), t=this.state.tab;
    const item=(key,emoji,label)=>this.h('button',{key,onClick:()=>this.go(key),style:{background:'none',border:'none',cursor:'pointer',fontFamily:'inherit',display:'flex',flexDirection:'column',alignItems:'center',gap:'3px',flex:1,padding:0}},[
      this.h('div',{style:{fontSize:'20px',filter:t===key?'none':'grayscale(1) opacity(.7)'}},emoji),
      this.h('div',{style:{fontSize:'10px',fontWeight:t===key?700:600,color:t===key?B.base:C.inkSoft}},label)
    ]);
    return this.h('div',{style:{position:'absolute',bottom:0,left:0,right:0,height:'78px',background:'rgba(255,255,255,.92)',backdropFilter:'blur(14px)',borderTop:'1px solid '+C.hair,display:'flex',alignItems:'center',padding:'0 14px 14px',zIndex:40}},[
      item('home','🏠','Home'), item('wallets','👛','Wallets'),
      this.h('div',{key:'sp',style:{flex:1}},''),
      item('missions','🎯','Missions'), item('me','🙂','Me'),
      this.h('button',{key:'fab',onClick:()=>this.setState({sheet:true}),style:{background:'none',border:'none',cursor:'pointer',fontFamily:'inherit',position:'absolute',left:'50%',top:'-24px',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:'3px',padding:0}},[
        this.h('div',{style:{width:'58px',height:'58px',borderRadius:'20px',background:B.grad,border:'4px solid #fff',boxShadow:'0 8px 30px '+this.hexA(B.base,.4),display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'30px',fontWeight:300,lineHeight:1}},'＋'),
        this.h('div',{style:{fontSize:'10px',fontWeight:700,color:B.base}},'Money')
      ])
    ]);
  }
  hexA(hex,a){ const n=parseInt(hex.slice(1),16); return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`; }

  scrollArea(children,dark){
    return this.h('div',{className:'cel-scroll',style:{position:'absolute',top:0,left:0,right:0,bottom:0,overflowY:'auto',WebkitOverflowScrolling:'touch'}},[
      this.statusBar(dark),
      this.h('div',{key:'body',style:{padding:'2px 18px 100px',display:'flex',flexDirection:'column',gap:this.state.tier==='little'?'20px':'18px'}},children)
    ]);
  }

  tabContent(){
    switch(this.state.tab){
      case 'wallets': return this.walletsTab();
      case 'missions': return this.missionsTab();
      case 'me': return this.meTab();
      default: return this.homeTab();
    }
  }

  sectionLabel(t,link,onLink){
    const B=this.b();
    return this.h('div',{style:{display:'flex',alignItems:'baseline',justifyContent:'space-between',margin:'2px 2px -4px'}},[
      this.h('div',{key:'t',style:{font:`700 14px 'Plus Jakarta Sans'`,color:this.C.ink,minWidth:0}},t),
      link?this.h('button',{key:'l',onClick:onLink,style:{background:'none',border:'none',cursor:'pointer',fontFamily:'inherit',fontSize:'12px',fontWeight:600,color:B.base,padding:0,flex:'none',whiteSpace:'nowrap'}},link):null
    ]);
  }

  // =========================================================== HOME
  homeTab(){
    const C=this.C, B=this.b(), d=this.state.data, tier=this.state.tier;
    const teen=tier==='teen', little=tier==='little';
    const big = little?1.16:teen?0.94:1;
    const heroSize = little?128:118;
    const greet = teen?'Hi, Arthur':'Hi, Arthur!';
    const sub = teen?'Your money summary': little?"Let's check your money":"Let's check your money today";
    const eyebrow = teen?'Total balance':'All your money';
    const nParts = little?4:5;
    const note = teen?'5 active allocations · trending up this month':`Split into ${nParts} parts in the ring ↖︎`;

    const chips=[];
    const chip=(emoji,name,amt,pct,col,tint,extra)=>this.h('button',{key:name,onClick:()=>this.go('wallets'),style:{textAlign:'left',border:'none',cursor:'pointer',fontFamily:'inherit',background:'#fff',borderRadius:'20px',padding:'14px',boxShadow:this.cardShadow}},[
      this.h('div',{style:{display:'flex',alignItems:'center',gap:'9px'}},[
        this.h('div',{style:{width:'38px',height:'38px',borderRadius:'12px',background:tint,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px'}},emoji),
        this.h('div',{style:{minWidth:0}},[
          this.h('div',{style:{fontSize:'13px',fontWeight:700,color:C.ink}},name),
          extra?this.h('div',{style:{fontSize:'10px',fontWeight:600,color:col}},extra):null
        ])
      ]),
      this.h('div',{style:{marginTop:'10px'}},this.money(amt,Math.round(20*big))),
      this.h('div',{style:{height:'6px',borderRadius:'3px',background:C.track,marginTop:'8px',overflow:'hidden'}},
        this.h('div',{style:{width:pct+'%',height:'100%',borderRadius:'3px',background:col}},''))
    ]);
    if(teen){
      chips.push(chip('💳','Spend',this.spendTotal(),55,C.spend,C.spendT));
      chips.push(chip('🎯','Save',this.saveTotal(),80,C.save,C.saveT));
      chips.push(chip('🤝','Give',d.give,35,C.give,C.giveT));
      chips.push(chip('📈','Grow',this.growTotal(),45,C.grow,C.growT,'Grow · −4.6%'));
    } else if(little){
      chips.push(chip('🍡','Spend',this.spendTotal(),55,C.spend,C.spendT));
      chips.push(chip('🏦','Save',this.saveTotal()+this.growTotal(),80,C.save,C.saveT));
      chips.push(chip('💝','Give',d.give,35,C.give,C.giveT));
    } else {
      chips.push(chip('🍡','Spend',this.spendTotal(),55,C.spend,C.spendT));
      chips.push(chip('🏦','Save',this.saveTotal(),80,C.save,C.saveT));
      chips.push(chip('💝','Give',d.give,35,C.give,C.giveT));
      chips.push(chip('🌱','Grow',this.growTotal(),45,C.grow,C.growT));
    }

    const rows=[];
    // topbar
    rows.push(this.h('div',{key:'top',style:{display:'flex',alignItems:'center',gap:'12px',marginTop:'4px'}},[
      this.h('button',{onClick:()=>this.go('me'),style:{border:'none',background:C.surface2,cursor:'pointer',width:'46px',height:'46px',borderRadius:'14px',boxShadow:'0 0 0 2px '+C.amber,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',flex:'none'}},'🦊'),
      this.h('div',{style:{flex:1}},[
        this.h('div',{style:{font:`700 ${little?19:17}px 'Fredoka'`,color:C.ink,letterSpacing:'-.01em'}},greet),
        this.h('div',{style:{fontSize:'11.5px',color:C.inkSoft}},sub)
      ]),
      this.h('div',{style:{background:'#fff',borderRadius:'999px',padding:'7px 12px',boxShadow:this.cardShadow,fontSize:'13px',fontWeight:700,color:C.ink,flex:'none',whiteSpace:'nowrap'}},'⭐ 120')
    ]));
    // hero
    rows.push(this.h('div',{key:'hero',style:{background:'#fff',borderRadius:'26px',padding:'20px',boxShadow:this.cardShadow,display:'flex',alignItems:'center',gap:'18px'}},[
      this.h('div',{style:{position:'relative',width:heroSize+'px',height:heroSize+'px',flex:'none'}},[
        this.ring(heroSize,12,this.segs()),
        this.h('div',{style:{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}},[
          this.h('div',{style:{fontSize:'9px',fontWeight:800,letterSpacing:'1.5px',color:C.inkSoft}},'TOTAL'),
          this.h('div',{style:{fontSize:'22px'}},'💰')
        ])
      ]),
      this.h('div',{style:{flex:1,minWidth:0}},[
        this.h('div',{style:{fontSize:'11px',fontWeight:700,color:C.inkSoft,textTransform:'uppercase',letterSpacing:'.5px'}},eyebrow),
        this.h('div',{style:{margin:'4px 0 6px'}},this.money(this.total(),Math.round(34*big))),
        this.h('div',{style:{fontSize:'11px',color:C.inkSoft,lineHeight:1.35}},note)
      ])
    ]));
    // unsorted (only if >0)
    if(d.unsorted>0){
      rows.push(this.h('button',{key:'uns',onClick:()=>this.openPush('sort'),style:{border:'none',cursor:'pointer',fontFamily:'inherit',textAlign:'left',background:B.grad,borderRadius:'22px',padding:'16px',boxShadow:'0 8px 30px '+this.hexA(B.base,.4),display:'flex',alignItems:'center',gap:'13px'}},[
        this.h('div',{style:{width:'46px',height:'46px',borderRadius:'14px',background:'rgba(255,255,255,.22)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',flex:'none'}},'🪙'),
        this.h('div',{style:{flex:1}},[
          this.h('div',{style:{font:`600 ${little?20:18}px 'Fredoka'`,color:'#fff',letterSpacing:'-.01em'}},this.rp(d.unsorted)+' just arrived!'),
          this.h('div',{style:{fontSize:'11.5px',color:'rgba(255,255,255,.85)',marginTop:'1px'}},'Not sorted yet — where should it go?')
        ]),
        this.h('div',{style:{width:'36px',height:'36px',borderRadius:'999px',background:'#fff',color:B.base,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',fontWeight:700,flex:'none'}},'→')
      ]));
    }
    // pending banner
    if(this.state.pending.length>0){
      rows.push(this.h('button',{key:'pend',onClick:()=>this.openPush('requests'),style:{border:'1px solid '+C.hair,cursor:'pointer',fontFamily:'inherit',textAlign:'left',background:C.surface2,borderRadius:'16px',padding:'11px 14px',display:'flex',alignItems:'center',gap:'11px'}},[
        this.h('div',{style:{fontSize:'18px'}},'⏳'),
        this.h('div',{style:{flex:1}},[
          this.h('div',{style:{fontSize:'12.5px',fontWeight:700,color:C.ink}},this.state.pending.length+' request'+(this.state.pending.length>1?'s':'')+' waiting'),
          this.h('div',{style:{fontSize:'11px',color:C.inkSoft}},'Waiting for a grown-up to say yes')
        ]),
        this.h('div',{style:{color:C.inkSoft,fontSize:'16px'}},'›')
      ]));
    }
    // wallets
    rows.push(this.sectionLabel('My wallets','See all',()=>this.go('wallets')));
    rows.push(this.h('div',{key:'chips',style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}},chips));

    if(!little){
      // dreams
      rows.push(this.sectionLabel('My dreams','All dreams',()=>this.go('wallets')));
      rows.push(this.h('div',{key:'dreams',style:{display:'flex',gap:'12px'}},[
        this.goalCard('🚲','BMX Bike',Math.round(d.save.bmx/300000*100),`${this.rp(d.save.bmx)} of Rp 300,000 · ${this.rp(300000-d.save.bmx)} to go`),
        this.goalCard('🎧','Headphones',Math.round(d.save.headphones/100000*100),`${this.rp(d.save.headphones)} of Rp 100,000 · ${this.rp(100000-d.save.headphones)} to go`)
      ]));
      // mission
      rows.push(this.h('button',{key:'mission',onClick:()=>d.unsorted>0?this.openPush('sort'):this.go('missions'),style:{border:'none',cursor:'pointer',fontFamily:'inherit',textAlign:'left',background:'#fff',borderRadius:'20px',padding:'14px',boxShadow:this.cardShadow,display:'flex',alignItems:'center',gap:'12px'}},[
        this.h('div',{style:{width:'42px',height:'42px',borderRadius:'13px',background:B.tint,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'21px',flex:'none'}},'🎯'),
        this.h('div',{style:{flex:1}},[
          this.h('div',{style:{fontSize:'10px',fontWeight:800,letterSpacing:'.5px',color:B.base,textTransform:'uppercase'}},"Today's mission"),
          this.h('div',{style:{fontSize:'11.5px',color:C.ink,lineHeight:1.35,marginTop:'2px'}},'Saving a little each week gets you there faster. Move Rp 10,000 into your dream →')
        ]),
        this.h('div',{style:{background:B.base,color:'#fff',borderRadius:'12px',padding:'8px 14px',fontSize:'12px',fontWeight:700,flex:'none'}},'Go')
      ]));
    }
    // quick actions
    const qa=[this.qaBtn('💸','Request cash out',()=>this.openPush('cashout'))];
    if(!little) qa.push(this.qaBtn('🔄','Move money',()=>this.openPush('move')));
    else qa.push(this.qaBtn('🪙','Sort money',()=>this.openPush('sort')));
    rows.push(this.h('div',{key:'qa',style:{display:'flex',gap:'12px'}},qa));
    // just now
    rows.push(this.sectionLabel('Just now','History',()=>this.openPush('history')));
    rows.push(this.h('div',{key:'act',style:{background:'#fff',borderRadius:'20px',padding:'4px 14px',boxShadow:this.cardShadow}},[
      this.activityRow('🎁',C.growT,'Gift from Mom','Today 08:20','+50,000',C.grow),
      this.h('div',{style:{height:'1px',background:C.hair}},''),
      this.activityRow('🏦',C.saveT,'Saved to BMX Bike','Yesterday 16:05','−25,000',C.ink),
      this.h('div',{style:{height:'1px',background:C.hair}},''),
      this.activityRow('💝',C.giveT,'Friday giving','Fri 11:30','−10,000',C.ink)
    ]));

    return this.scrollArea(rows,false);
  }
  qaBtn(emoji,label,onClick){ return this.h('button',{key:label,onClick,style:{flex:1,border:'none',cursor:'pointer',fontFamily:'inherit',background:'#fff',borderRadius:'16px',padding:'13px',boxShadow:this.cardShadow,textAlign:'center',fontSize:'12.5px',fontWeight:600,color:this.C.ink}},emoji+' '+label); }
  goalCard(emoji,name,pct,line){ const C=this.C;
    return this.h('div',{key:name,style:{background:'#fff',borderRadius:'20px',padding:'14px',boxShadow:this.cardShadow,flex:1,minWidth:0}},[
      this.h('div',{style:{display:'flex',alignItems:'center',gap:'9px'}},[
        this.h('div',{style:{width:'40px',height:'40px',borderRadius:'12px',background:C.saveT,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'21px',flex:'none'}},emoji),
        this.h('div',{},[
          this.h('div',{style:{fontSize:'13px',fontWeight:700,color:C.ink}},name),
          this.h('div',{style:{fontSize:'11px',fontWeight:700,color:C.save}},pct+'%')
        ])
      ]),
      this.h('div',{style:{height:'6px',borderRadius:'3px',background:C.track,margin:'10px 0 8px',overflow:'hidden'}},
        this.h('div',{style:{width:pct+'%',height:'100%',borderRadius:'3px',background:C.save}},'')),
      this.h('div',{style:{fontSize:'10.5px',color:C.inkSoft,lineHeight:1.35}},line)
    ]);
  }
  activityRow(emoji,tint,label,time,amount,color){ const C=this.C;
    return this.h('div',{key:label,style:{display:'flex',alignItems:'center',gap:'11px',padding:'10px 0'}},[
      this.h('div',{style:{width:'38px',height:'38px',borderRadius:'12px',background:tint,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'19px',flex:'none'}},emoji),
      this.h('div',{style:{flex:1,minWidth:0}},[
        this.h('div',{style:{fontSize:'13px',fontWeight:600,color:C.ink}},label),
        this.h('div',{style:{fontSize:'11px',color:C.inkSoft}},time)
      ]),
      this.h('div',{style:{font:`600 15px 'Fredoka'`,color,letterSpacing:'-.01em'}},amount)
    ]);
  }

  // =========================================================== WALLETS
  walletsTab(){
    const C=this.C, d=this.state.data, little=this.state.tier==='little';
    const rows=[];
    rows.push(this.h('div',{key:'hd',style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'4px'}},[
      this.h('div',{style:{font:`700 24px 'Fredoka'`,color:C.ink,letterSpacing:'-.01em'}},'Wallets'),
      this.h('div',{style:{display:'flex',gap:'8px'}},[
        this.iconBtn('•••'), this.iconBtn('🧾')
      ])
    ]));
    // balance row
    rows.push(this.h('div',{key:'bal',style:{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#fff',borderRadius:'20px',padding:'16px 18px',boxShadow:this.cardShadow}},[
      this.h('div',{},[
        this.h('div',{style:{fontSize:'11px',fontWeight:700,color:C.inkSoft,textTransform:'uppercase',letterSpacing:'.5px'}},'My balance'),
        this.h('div',{style:{marginTop:'3px'}},this.money(this.total(),30,{maskable:true}))
      ]),
      this.h('button',{onClick:()=>this.setState(s=>({masked:!s.masked})),style:{border:'none',cursor:'pointer',background:C.surface2,width:'40px',height:'40px',borderRadius:'12px',fontSize:'18px'}},this.state.masked?'🙈':'👁️')
    ]));
    // main pocket
    rows.push(this.h('div',{key:'main',style:{display:'flex',alignItems:'center',gap:'12px',background:this.b().tint,border:'1px solid '+this.hexA(this.b().base,.2),borderRadius:'20px',padding:'15px'}},[
      this.h('div',{style:{width:'44px',height:'44px',borderRadius:'13px',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',flex:'none'}},'🪙'),
      this.h('div',{style:{flex:1,minWidth:0}},[
        this.h('div',{style:{fontSize:'12.5px',fontWeight:700,color:C.ink}},'Main pocket · unsorted'),
        this.h('div',{style:{margin:'1px 0 2px'}},this.money(d.unsorted,20,{maskable:true})),
        this.h('div',{style:{fontSize:'10.5px',color:C.inkSoft}},'Give it a job before you use it')
      ]),
      this.h('button',{onClick:()=>this.openPush('sort'),disabled:d.unsorted===0,style:{border:'none',cursor:d.unsorted?'pointer':'default',fontFamily:'inherit',background:d.unsorted?this.b().base:'#CFC7EA',color:'#fff',borderRadius:'12px',padding:'10px 16px',fontSize:'12.5px',fontWeight:700,flex:'none'}},'Sort')
    ]));

    if(little){
      // no accordions: simple detail cards per category
      rows.push(this.simpleCat('🛍️','Spend','use now',this.spendTotal(),C.spend,C.spendT));
      rows.push(this.simpleCat('🏦','Save','dreams + savings',this.saveTotal()+this.growTotal(),C.save,C.saveT));
      rows.push(this.simpleCat('💝','Give','share with others',d.give,C.give,C.giveT));
    } else {
      rows.push(this.cluster('spend','🛍️','Spend','3 envelopes · use now',this.spendTotal(),C.spend,C.spendT,C.spendD,this.spendPockets()));
      rows.push(this.cluster('save','🏦','Save','2 dreams + free savings',this.saveTotal(),C.save,C.saveT,C.saveD,this.savePockets()));
      rows.push(this.cluster('give','💝','Give','Share with others',d.give,C.give,C.giveT,C.giveD,this.givePockets()));
      rows.push(this.cluster('grow','🌱','Grow','3 investments · needs OK',this.growTotal(),C.grow,C.growT,C.growD,this.growPockets()));
    }
    return this.scrollArea(rows,false);
  }
  iconBtn(g){ return this.h('button',{key:g,style:{border:'none',cursor:'pointer',background:'#fff',width:'38px',height:'38px',borderRadius:'12px',boxShadow:this.cardShadow,fontSize:'15px'}},g); }
  simpleCat(emoji,name,meta,total,col,tint){ const C=this.C;
    return this.h('div',{key:name,style:{background:'#fff',borderRadius:'20px',padding:'16px',boxShadow:this.cardShadow,display:'flex',alignItems:'center',gap:'13px'}},[
      this.h('div',{style:{width:'52px',height:'52px',borderRadius:'15px',background:tint,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'26px',flex:'none'}},emoji),
      this.h('div',{style:{flex:1}},[
        this.h('div',{style:{fontSize:'15px',fontWeight:700,color:C.ink}},name),
        this.h('div',{style:{fontSize:'11px',color:C.inkSoft}},meta)
      ]),
      this.h('div',{},this.money(total,24,{color:col,maskable:true}))
    ]);
  }
  cluster(key,emoji,name,meta,total,col,tint,deep,pockets){
    const C=this.C, open=this.state.accordion===key;
    return this.h('div',{key,style:{borderRadius:'20px',overflow:'hidden',boxShadow:this.cardShadow}},[
      this.h('button',{onClick:()=>this.setState({accordion:open?null:key}),style:{width:'100%',border:'none',cursor:'pointer',fontFamily:'inherit',textAlign:'left',background:tint,padding:'15px',display:'flex',alignItems:'center',gap:'13px'}},[
        this.h('div',{style:{width:'44px',height:'44px',borderRadius:'13px',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',flex:'none'}},emoji),
        this.h('div',{style:{flex:1,minWidth:0}},[
          this.h('div',{style:{fontSize:'15px',fontWeight:700,color:deep}},name),
          this.h('div',{style:{fontSize:'10.5px',color:this.hexA(deep,.75)}},meta)
        ]),
        this.h('div',{style:{textAlign:'right'}},[
          this.money(total,20,{color:deep,maskable:true}),
        ]),
        this.h('div',{style:{fontSize:'20px',color:deep,transform:open?'rotate(180deg)':'none',transition:'transform .2s',marginLeft:'2px'}},'⌄')
      ]),
      open? this.h('div',{style:{background:'#fff',padding:'14px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',animation:'cel-fade .25s'}},pockets):null
    ]);
  }
  pocket(emoji,name,amt,sub,col,tint,opts={}){ const C=this.C;
    return this.h('div',{key:name,style:{background:opts.dashed?'transparent':C.surface2,border:opts.dashed?('2px dashed '+C.hair):('1px solid '+C.hair),borderRadius:'16px',padding:'13px',display:'flex',flexDirection:'column',gap:'8px',minHeight:'96px',justifyContent:opts.dashed?'center':'flex-start',alignItems:opts.dashed?'center':'stretch'}},
      opts.dashed? [this.h('div',{style:{fontSize:'22px',color:C.inkSoft}},'＋'),this.h('div',{style:{fontSize:'11px',fontWeight:600,color:C.inkSoft,textAlign:'center'}},name)]
      : [
        this.h('div',{style:{display:'flex',alignItems:'center',gap:'8px'}},[
          opts.ring!=null
            ? this.h('div',{style:{position:'relative',width:'40px',height:'40px',flex:'none'}},[this.progRing(40,4,opts.ring,col,tint),this.h('div',{style:{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}},emoji)])
            : this.h('div',{style:{width:'36px',height:'36px',borderRadius:'11px',background:tint,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',flex:'none'}},emoji),
          this.h('div',{style:{minWidth:0}},[
            this.h('div',{style:{fontSize:'12px',fontWeight:700,color:C.ink,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}},name),
            opts.tag?this.h('div',{style:{display:'inline-block',fontSize:'9px',fontWeight:700,color:opts.tagCol||C.grow,background:opts.tagBg||C.growT,padding:'1px 6px',borderRadius:'6px',marginTop:'2px'}},opts.tag):null
          ])
        ]),
        this.h('div',{},this.money(amt,17,{maskable:true})),
        this.h('div',{style:{fontSize:'9.5px',color:opts.subCol||C.inkSoft,lineHeight:1.3}},sub),
        opts.actions?this.h('div',{style:{display:'flex',gap:'6px',marginTop:'2px'}},opts.actions):null
      ]);
  }
  spendPockets(){ const C=this.C,d=this.state.data;
    return [
      this.pocket('🍡','Snacks',d.spend.snacks,'Spend envelope',C.spend,C.spendT),
      this.pocket('🚌','Transport',d.spend.transport,'Spend envelope',C.spend,C.spendT),
      this.pocket('🎮','Games',d.spend.games,'Spend envelope',C.spend,C.spendT),
      this.pocket('','+ New envelope',0,'',C.spend,C.spendT,{dashed:true})
    ];
  }
  savePockets(){ const C=this.C,d=this.state.data;
    return [
      this.pocket('🚲','BMX Bike',d.save.bmx,'Dream · '+Math.round(d.save.bmx/300000*100)+'% of Rp 300k',C.save,C.saveT,{ring:d.save.bmx/300000*100}),
      this.pocket('🎧','Headphones',d.save.headphones,'Dream · '+Math.round(d.save.headphones/100000*100)+'% of Rp 100k',C.save,C.saveT,{ring:d.save.headphones/100000*100}),
      this.pocket('💭','Free savings',d.save.free,'No target yet',C.save,C.saveT),
      this.pocket('','+ New dream',0,'',C.save,C.saveT,{dashed:true})
    ];
  }
  givePockets(){ const C=this.C,d=this.state.data;
    return [
      this.pocket('💝','Ready to give',d.give,'Last: Fri · Rp 10,000',C.give,C.giveT),
      this.pocket('','+ Giving history',0,'',C.give,C.giveT,{dashed:true})
    ];
  }
  growPockets(){ const C=this.C,d=this.state.data;
    const harvest=(id)=>this.h('button',{key:'h',onClick:()=>this.openPush(id==='td'?'harvestTd':'harvestGold'),style:{border:'none',cursor:'pointer',fontFamily:'inherit',background:C.grow,color:'#fff',borderRadius:'9px',padding:'6px 10px',fontSize:'10.5px',fontWeight:700}},'Harvest');
    const addBtn=this.h('button',{key:'a',onClick:()=>this.openPush('buyfx'),style:{border:'1px solid '+C.hair,cursor:'pointer',fontFamily:'inherit',background:'#fff',color:C.ink,borderRadius:'9px',padding:'6px 10px',fontSize:'10.5px',fontWeight:700}},'＋ Add');
    return [
      this.pocket('🏦','Time Deposit',d.grow.td,'Rp 30k + Rp 750 interest',C.grow,C.growT,{tag:'✅ Matured',tagCol:C.growD,tagBg:C.growT,actions:[harvest('td')]}),
      this.pocket('🪙','Gold',d.grow.gold,'▼ 8.9% · 14.5 mg',C.grow,C.growT,{tag:'🔒 OK',tagCol:C.inkSoft,tagBg:C.track,subCol:C.loss,actions:[harvest('gold')]}),
      this.pocket('💵','US Dollar',d.grow.usd,'▼ 1.8% · US$ 0.62',C.grow,C.growT,{tag:'🔒 OK',tagCol:C.inkSoft,tagBg:C.track,subCol:C.loss,actions:[addBtn,harvest('usd')]}),
      this.pocket('','+ Grow money',0,'',C.grow,C.growT,{dashed:true})
    ];
  }

  // =========================================================== MISSIONS
  missionsTab(){
    const C=this.C, B=this.b(), d=this.state.data;
    const mt=this.state.mtab||'today';
    const stars=120, gems=12, choresDue=2, gate=100;
    const hasU=d.unsorted>0;
    const rows=[];
    rows.push(this.h('div',{key:'hd',style:{marginTop:'4px',font:`700 24px 'Fredoka'`,color:C.ink,letterSpacing:'-.01em'}},'Missions'));
    rows.push(this.missionTabBar(mt,hasU,choresDue));

    if(mt==='today'){
      rows.push(this.h('div',{key:'stats',style:{display:'flex',gap:'10px'}},[
        this.statCard('📚','1/6','chapters'),
        this.statCard('⭐',String(stars),'stars'),
        this.statCard('💎',String(gems),'gems')
      ]));
      rows.push(this.h('div',{key:'daily',style:{background:B.grad,borderRadius:'22px',padding:'18px',boxShadow:'0 8px 30px '+this.hexA(B.base,.4),color:'#fff'}},[
        this.h('div',{style:{fontSize:'10px',fontWeight:800,letterSpacing:'.5px',textTransform:'uppercase',opacity:.8}},'Daily mission · Practice'),
        this.h('div',{style:{font:`600 20px 'Fredoka'`,margin:'6px 0 4px'}},hasU?('Sort your '+this.rp(d.unsorted)):'All sorted — nice work!'),
        this.h('div',{style:{fontSize:'12px',opacity:.9,lineHeight:1.4}},hasU?'Money without a job is easy to lose. One tap in the app.':'Come back tomorrow for the next practice.'),
        this.h('button',{onClick:()=>hasU?this.openPush('sort'):this.go('home'),style:{marginTop:'14px',border:'none',cursor:'pointer',fontFamily:'inherit',background:'#fff',color:B.base,borderRadius:'12px',padding:'10px 18px',fontSize:'13px',fontWeight:700}},hasU?'Start':'Back home')
      ]));
      rows.push(this.h('div',{key:'event',style:{background:'linear-gradient(135deg,#FFD27A,#FFB020)',borderRadius:'20px',padding:'16px',display:'flex',alignItems:'center',gap:'13px',boxShadow:'0 8px 24px rgba(255,176,32,.35)'}},[
        this.h('div',{style:{fontSize:'32px'}},'🌙'),
        this.h('div',{style:{flex:1}},[
          this.h('div',{style:{font:`600 16px 'Fredoka'`,color:'#7a4d00'}},'Lebaran THR challenge'),
          this.h('div',{style:{fontSize:'11px',color:'#8a6a1a',lineHeight:1.35}},'Sort your THR before the week ends · +50 ⭐')
        ])
      ]));
      rows.push(this.sectionLabel('Next up'));
      rows.push(this.h('div',{key:'nextup',style:{background:'#fff',borderRadius:'20px',padding:'6px 15px',boxShadow:this.cardShadow}},[
        this.nextUpRow('📖','Chapter 2 · Sorting practice','Your active lesson','Open',()=>this.openPush('lesson',{ch:2,cname:'Sorting practice',step:0,pick:null}),false),
        this.h('div',{key:'hr',style:{height:'1px',background:C.hair}},''),
        this.nextUpRow('🧹','Tidy your room','Due today · +3 💎','Chores',()=>this.setMtab('chores'),true)
      ]));
    }

    if(mt==='lesson'){
      rows.push(this.h('div',{key:'lp',style:{background:'#fff',borderRadius:'20px',padding:'16px',boxShadow:this.cardShadow}},[
        this.h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px'}},[
          this.h('div',{style:{flex:1,minWidth:0}},[
            this.h('div',{style:{font:`700 14px 'Plus Jakarta Sans'`,color:C.ink}},'Chapter 1 of 6'),
            this.h('div',{style:{fontSize:'11px',color:C.inkSoft,marginTop:'2px'}},'Finish a chapter, earn stars.')
          ]),
          this.h('div',{style:{font:`600 20px 'Fredoka'`,color:B.base,flex:'none',whiteSpace:'nowrap'}},'⭐ '+stars)
        ]),
        this.h('div',{style:{height:'8px',borderRadius:'999px',background:C.track,marginTop:'12px',overflow:'hidden'}},
          this.h('div',{style:{width:'17%',height:'100%',borderRadius:'999px',background:B.grad}},''))
      ]));
      rows.push(this.sectionLabel('Chapters'));
      const chapters=[['Money has jobs','done'],['Sorting practice','active'],['Dreams & goals','locked'],['Giving matters','locked'],['Waiting pays off','locked'],['Growing money','locked']];
      rows.push(this.h('div',{key:'ch',style:{background:'#fff',borderRadius:'20px',padding:'6px 14px',boxShadow:this.cardShadow}},
        chapters.map((c,i)=>this.chapterRow(i+1,c[0],c[1],i<chapters.length-1))));
    }

    if(mt==='chores'){
      const unlocked=stars>=gate;
      rows.push(this.h('div',{key:'jobs',style:{background:'#fff',borderRadius:'20px',padding:'16px',boxShadow:this.cardShadow,opacity:unlocked?1:.55}},[
        this.h('div',{style:{display:'flex',alignItems:'baseline',justifyContent:'space-between',gap:'10px'}},[
          this.h('div',{style:{font:`700 14px 'Plus Jakarta Sans'`,color:C.ink,minWidth:0}},'Jobs from home'),
          this.h('div',{style:{fontSize:'10px',fontWeight:700,color:unlocked?C.grow:C.inkSoft,background:unlocked?C.growT:C.track,padding:'2px 8px',borderRadius:'8px',flex:'none',whiteSpace:'nowrap'}},unlocked?('Unlocked · '+stars+' ⭐'):('Locked · '+gate+' ⭐ needed'))
        ]),
        this.h('div',{style:{fontSize:'11px',color:C.inkSoft,margin:'4px 0 12px'}},'Real chores set by a grown-up. These pay 💎 gems — for real-life rewards.'),
        this.jobRow('🧹','Tidy your room','Every day',3),
        this.jobRow('🐟','Feed the fish','Mon / Thu',1),
        this.jobRow('📖','20 min reading','Any day',2)
      ]));
      rows.push(this.h('div',{key:'gems',style:{background:'linear-gradient(135deg,#FFF3D6,#FFE7AE)',borderRadius:'20px',padding:'16px',boxShadow:'0 6px 20px rgba(255,176,32,.22)'}},[
        this.h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between'}},[
          this.h('div',{style:{fontSize:'11.5px',fontWeight:700,color:'#8a6a1a',minWidth:0}},'Your gems'),
          this.h('div',{style:{font:`600 22px 'Fredoka'`,color:'#7a4d00',flex:'none',whiteSpace:'nowrap'}},'💎 '+gems)
        ]),
        this.h('div',{style:{fontSize:'11px',color:'#8a6a1a',lineHeight:1.4,marginTop:'4px'}},'Gems are not money. A grown-up trades them for real-life treats — screen time, a trip, a small gift.')
      ]));
      rows.push(this.h('div',{key:'chnote',style:{fontSize:'11px',color:C.inkSoft,textAlign:'center',lineHeight:1.45,padding:'0 10px'}},'A grown-up ticks a chore off when it is really done.'));
    }
    return this.scrollArea(rows,false);
  }
  setMtab(k){ this.setState({mtab:k}); const el=document.querySelector('.cel-scroll'); if(el) el.scrollTop=0; }
  missionTabBar(mt,hasU,choresDue){ const C=this.C, B=this.b();
    const tabs=[['today','Today',hasU],['lesson','Lesson',true],['chores','Chores',choresDue>0]];
    return this.h('div',{key:'mtabs',style:{display:'flex',background:'#fff',borderRadius:'999px',padding:'4px',gap:'3px',boxShadow:this.cardShadow}},
      tabs.map(([k,lbl,dot])=>{
        const on=mt===k;
        return this.h('button',{key:k,onClick:()=>this.setMtab(k),style:{flex:1,border:'none',cursor:'pointer',fontFamily:'inherit',borderRadius:'999px',padding:'9px 4px',fontSize:'12.5px',fontWeight:700,letterSpacing:'-.01em',background:on?B.base:'transparent',color:on?'#fff':C.inkSoft,transition:'background .15s,color .15s',display:'flex',alignItems:'center',justifyContent:'center',gap:'5px'}},[
          this.h('span',{key:'l'},lbl),
          (dot&&!on)?this.h('span',{key:'d',style:{width:'6px',height:'6px',borderRadius:'50%',background:C.spend,flex:'none'}},''):null
        ]);
      }));
  }
  nextUpRow(emoji,name,sub,cta,onClick,warm){ const C=this.C, B=this.b();
    return this.h('button',{key:name,onClick,style:{width:'100%',border:'none',cursor:'pointer',fontFamily:'inherit',textAlign:'left',background:'transparent',display:'flex',alignItems:'center',gap:'11px',padding:'12px 0'}},[
      this.h('div',{style:{width:'38px',height:'38px',borderRadius:'12px',background:warm?'#FFF1D6':C.surface2,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'19px',flex:'none'}},emoji),
      this.h('div',{style:{flex:1,minWidth:0}},[
        this.h('div',{style:{fontSize:'13px',fontWeight:600,color:C.ink,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}},name),
        this.h('div',{style:{fontSize:'11px',color:C.inkSoft,marginTop:'1px'}},sub)
      ]),
      this.h('div',{style:{fontSize:'11px',fontWeight:700,color:B.base,flex:'none'}},cta+' ›')
    ]);
  }
  statCard(icon,val,label){ const C=this.C;
    return this.h('div',{key:label,style:{flex:1,background:'#fff',borderRadius:'18px',padding:'14px 10px',boxShadow:this.cardShadow,textAlign:'center'}},[
      this.h('div',{style:{fontSize:'22px'}},icon),
      this.h('div',{style:{font:`600 18px 'Fredoka'`,color:C.ink,marginTop:'2px',whiteSpace:'nowrap'}},val),
      this.h('div',{style:{fontSize:'10px',color:C.inkSoft}},label)
    ]);
  }
  jobRow(emoji,name,when,gems){ const C=this.C;
    return this.h('div',{key:name,style:{display:'flex',alignItems:'center',gap:'11px',padding:'9px 0',borderTop:'1px solid '+C.hair}},[
      this.h('div',{style:{width:'36px',height:'36px',borderRadius:'11px',background:C.surface2,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',flex:'none'}},emoji),
      this.h('div',{style:{flex:1}},[
        this.h('div',{style:{fontSize:'13px',fontWeight:600,color:C.ink}},name),
        this.h('div',{style:{fontSize:'10.5px',color:C.inkSoft}},when)
      ]),
      this.h('div',{style:{fontSize:'12px',fontWeight:700,color:'#B07A00',flex:'none',whiteSpace:'nowrap'}},'+'+gems+' 💎')
    ]);
  }
  chapterRow(n,name,st,border){ const C=this.C;
    const map={done:['#fff',C.grow,'✓'],active:['#fff',this.b().base,n],locked:[C.inkSoft,C.track,'🔒']};
    const [fg,bg,glyph]=map[st];
    const open=()=> st==='locked' ? this.toast('Finish the chapter before this one first 🔒') : this.openPush('lesson',{ch:n,cname:name,step:0,pick:null});
    return this.h('button',{key:n,onClick:open,style:{width:'100%',border:'none',background:'transparent',fontFamily:'inherit',textAlign:'left',cursor:'pointer',display:'flex',alignItems:'center',gap:'12px',padding:'11px 0',borderBottom:border?'1px solid '+C.hair:'none',opacity:st==='locked'?.55:1}},[
      this.h('div',{style:{width:'30px',height:'30px',borderRadius:'10px',background:st==='locked'?C.track:bg,color:st==='locked'?C.inkSoft:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:700,flex:'none'}},glyph),
      this.h('div',{style:{flex:1,minWidth:0,fontSize:'13px',fontWeight:600,color:C.ink}},name),
      this.h('div',{style:{fontSize:'10px',fontWeight:700,color:st==='active'?this.b().base:C.inkSoft,textTransform:'uppercase',flex:'none'}},st)
    ]);
  }

  // ---- LESSON MATERIAL ----
  lessonScreen(){
    const C=this.C, B=this.b(), f=this.state.form;
    const n=f.ch||2, name=f.cname||'Sorting practice', step=f.step||0, pick=f.pick;
    const set=(p)=>this.setState({form:{...f,...p}});
    const cats=[['Spend','🧁',C.spend,C.spendT],['Save','🏦',C.save,C.saveT],['Give','💝',C.give,C.giveT],['Grow','🌱',C.grow,C.growT]];
    const rows=[];

    // progress
    rows.push(this.h('div',{key:'prog',style:{display:'flex',gap:'6px',marginTop:'2px'}},
      [0,1,2].map(i=>this.h('div',{key:i,style:{flex:1,height:'5px',borderRadius:'999px',background:i<=step?B.base:C.track,transition:'background .2s'}},''))));
    rows.push(this.h('div',{key:'crumb',style:{fontSize:'10.5px',fontWeight:800,letterSpacing:'.5px',textTransform:'uppercase',color:C.inkSoft}},'Chapter '+n+' · Step '+(step+1)+' of 3'));

    if(step===0){
      rows.push(this.h('div',{key:'t',style:{font:`600 24px 'Fredoka'`,color:C.ink,lineHeight:1.15,letterSpacing:'-.01em'}},'Every rupiah gets a job.'));
      rows.push(this.h('div',{key:'ill',style:{background:B.grad,borderRadius:'22px',padding:'26px 18px',textAlign:'center',boxShadow:'0 8px 30px '+this.hexA(B.base,.32)}},[
        this.h('div',{style:{fontSize:'46px'}},'💰'),
        this.h('div',{style:{font:`600 15px 'Fredoka'`,color:'#fff',marginTop:'6px'}},'Money with no job wanders off'),
        this.h('div',{style:{fontSize:'11.5px',color:'rgba(255,255,255,.85)',marginTop:'3px',lineHeight:1.4}},'It gets spent on things you cannot even remember.')
      ]));
      rows.push(this.h('div',{key:'body',style:{background:'#fff',borderRadius:'20px',padding:'16px',boxShadow:this.cardShadow}},[
        this.h('div',{style:{fontSize:'13px',color:C.ink,lineHeight:1.55}},'When money arrives — allowance, a gift, THR — it lands in your unsorted pile. Sorting means telling every rupiah what it is for. There are only four jobs:'),
        this.h('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginTop:'14px'}},
          cats.map(([lbl,em,col,tint])=>this.h('div',{key:lbl,style:{background:tint,borderRadius:'14px',padding:'12px',display:'flex',alignItems:'center',gap:'9px'}},[
            this.h('div',{style:{fontSize:'20px',flex:'none'}},em),
            this.h('div',{style:{fontSize:'12.5px',fontWeight:700,color:col,whiteSpace:'nowrap'}},lbl)
          ])))
      ]));
      rows.push(this.h('div',{key:'note',style:{fontSize:'11.5px',color:C.inkSoft,textAlign:'center',lineHeight:1.45,padding:'0 8px'}},'A wallet is just a promise about what that money is for.'));
    }

    if(step===1){
      const right='Save';
      rows.push(this.h('div',{key:'t',style:{font:`600 22px 'Fredoka'`,color:C.ink,lineHeight:1.2,letterSpacing:'-.01em'}},'Your turn.'));
      rows.push(this.h('div',{key:'q',style:{background:'#fff',borderRadius:'20px',padding:'16px',boxShadow:this.cardShadow}},[
        this.h('div',{style:{fontSize:'13.5px',color:C.ink,lineHeight:1.5}},'Grandma gives you Rp 100.000. You are saving for a BMX bike that costs Rp 900.000. Which job should most of it get?'),
        this.h('div',{style:{display:'flex',flexDirection:'column',gap:'8px',marginTop:'14px'}},
          cats.map(([lbl,em,col,tint])=>{
            const on=pick===lbl, correct=lbl===right;
            const bd = !pick ? C.hair : on ? (correct?C.grow:C.spend) : (correct?C.grow:C.hair);
            const bgc = !pick ? '#fff' : (on||correct) ? (correct?C.growT:C.spendT) : '#fff';
            return this.h('button',{key:lbl,onClick:()=>!pick&&set({pick:lbl}),style:{width:'100%',border:'2px solid '+bd,background:bgc,borderRadius:'14px',padding:'12px 14px',fontFamily:'inherit',cursor:pick?'default':'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:'10px'}},[
              this.h('div',{style:{fontSize:'18px',flex:'none'}},em),
              this.h('div',{style:{flex:1,fontSize:'13px',fontWeight:700,color:C.ink}},lbl),
              pick&&correct?this.h('div',{style:{fontSize:'13px',color:C.grow,fontWeight:800,flex:'none'}},'✓'):null
            ]);
          }))
      ]));
      if(pick) rows.push(this.h('div',{key:'fb',style:{background:pick===right?C.growT:C.spendT,borderRadius:'18px',padding:'14px 16px'}},[
        this.h('div',{style:{font:`600 15px 'Fredoka'`,color:pick===right?C.grow:C.spend}},pick===right?'That is it.':'Not quite — look again.'),
        this.h('div',{style:{fontSize:'12px',color:C.ink,lineHeight:1.45,marginTop:'3px'}},pick===right?'A dream you are still reaching for lives in Save. It waits there until the bike is yours.':'Money for a dream you are still reaching for belongs in Save — Spend money is gone the same week.')
      ]));
    }

    if(step===2){
      rows.push(this.h('div',{key:'done',style:{background:B.grad,borderRadius:'24px',padding:'28px 20px',textAlign:'center',boxShadow:'0 10px 34px '+this.hexA(B.base,.4)}},[
        this.h('div',{style:{fontSize:'52px'}},'🎉'),
        this.h('div',{style:{font:`700 22px 'Fredoka'`,color:'#fff',marginTop:'6px'}},'Chapter '+n+' done!'),
        this.h('div',{style:{fontSize:'12.5px',color:'rgba(255,255,255,.9)',marginTop:'4px',lineHeight:1.45}},name),
        this.h('div',{style:{display:'inline-block',marginTop:'14px',background:'rgba(255,255,255,.22)',color:'#fff',borderRadius:'999px',padding:'8px 16px',font:`600 15px 'Fredoka'`,whiteSpace:'nowrap'}},'+20 ⭐')
      ]));
      rows.push(this.h('div',{key:'recap',style:{background:'#fff',borderRadius:'20px',padding:'16px',boxShadow:this.cardShadow}},[
        this.h('div',{style:{font:`700 13px 'Plus Jakarta Sans'`,color:C.ink,marginBottom:'8px'}},'What you learned'),
        ...['Money that arrives is unsorted until you give it a job.','There are four jobs: Spend, Save, Give, Grow.','Money for a dream waits in Save.'].map((t,i)=>this.h('div',{key:i,style:{display:'flex',gap:'9px',padding:'5px 0'}},[
          this.h('div',{style:{color:C.grow,fontWeight:800,fontSize:'12px',flex:'none'}},'✓'),
          this.h('div',{style:{fontSize:'12.5px',color:C.inkSoft,lineHeight:1.45}},t)
        ]))
      ]));
      rows.push(this.h('div',{key:'next',style:{fontSize:'11.5px',color:C.inkSoft,textAlign:'center',lineHeight:1.45}},'Next up · Chapter '+(n+1)+' unlocks tomorrow.'));
    }

    const cta = step===0 ? ['Got it — try a question',true,()=>set({step:1})]
      : step===1 ? [pick? (pick==='Save'?'Continue':'Try to remember this') : 'Pick an answer', !!pick, ()=>set({step:2})]
      : ['Practice with my real money',true,()=>this.openPush('sort')];
    return [this.pushHeader('Chapter '+n+' · '+name),this.pushBody(rows),this.pushCta(cta[0],cta[1],cta[2])];
  }

  // =========================================================== ME
  meTab(){
    const C=this.C, B=this.b();
    const rows=[];
    rows.push(this.h('div',{key:'hero',style:{marginTop:'4px',background:B.grad,borderRadius:'24px',padding:'22px',display:'flex',alignItems:'center',gap:'15px',boxShadow:'0 8px 30px '+this.hexA(B.base,.4)}},[
      this.h('div',{style:{width:'64px',height:'64px',borderRadius:'20px',background:'rgba(255,255,255,.22)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'34px',flex:'none'}},'🦊'),
      this.h('div',{},[
        this.h('div',{style:{font:`700 22px 'Fredoka'`,color:'#fff'}},'Arthur'),
        this.h('div',{style:{display:'inline-block',marginTop:'4px',background:'rgba(255,255,255,.22)',color:'#fff',fontSize:'11px',fontWeight:700,padding:'3px 10px',borderRadius:'999px'}},this.tierLabel())
      ])
    ]));
    rows.push(this.h('div',{key:'stats',style:{display:'flex',gap:'10px'}},[
      this.statCard('⭐','120','stars'),this.statCard('💎','12','gems'),this.statCard('🏅','3','badges')
    ]));
    // giving stories
    rows.push(this.sectionLabel('Where my giving went'));
    rows.push(this.h('div',{key:'give',style:{background:'#fff',borderRadius:'20px',padding:'16px',boxShadow:this.cardShadow}},[
      this.h('div',{style:{display:'flex',gap:'11px'}},[
        this.h('div',{style:{width:'40px',height:'40px',borderRadius:'12px',background:C.giveT,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',flex:'none'}},'🕌'),
        this.h('div',{style:{flex:1}},[
          this.h('div',{style:{fontSize:'12.5px',fontWeight:700,color:C.ink}},'Friday at the mosque'),
          this.h('div',{style:{fontSize:'11px',color:C.inkSoft,lineHeight:1.4,marginTop:'2px'}},'“Your Rp 10,000 helped buy iftar meals for 4 people. They said thank you!” — Mom')
        ])
      ]),
      this.h('button',{style:{marginTop:'12px',border:'1px solid '+C.hair,cursor:'pointer',fontFamily:'inherit',background:C.surface2,color:C.ink,borderRadius:'11px',padding:'8px 14px',fontSize:'11.5px',fontWeight:600}},'💬 Write back')
    ]));
    // prizes
    rows.push(this.sectionLabel('Prizes','💎 12'));
    rows.push(this.h('div',{key:'prizes',style:{display:'flex',gap:'12px'}},[
      this.prizeCard('🎬','Movie night','15 💎'),this.prizeCard('🍕','Pizza pick','8 💎'),this.prizeCard('🎡','Theme park','40 💎')
    ]));
    // my look
    rows.push(this.sectionLabel('My look','⭐ 120'));
    rows.push(this.h('div',{key:'look',style:{background:'#fff',borderRadius:'20px',padding:'16px',boxShadow:this.cardShadow}},[
      this.h('div',{style:{fontSize:'11px',color:C.inkSoft,marginBottom:'12px'}},'Buy avatar looks with ⭐ stars only — never real money.'),
      this.h('div',{style:{display:'flex',gap:'12px'}},[
        this.lookCard('🦊','You',true),this.lookCard('🐯','Tiger','30 ⭐'),this.lookCard('🐼','Panda','50 ⭐'),this.lookCard('🦁','Lion','80 ⭐')
      ])
    ]));
    // badges
    rows.push(this.sectionLabel('Badges'));
    rows.push(this.h('div',{key:'badges',style:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px'}},
      [['🥇','First sort',1],['💧','Steady saver',1],['🎁','Kind giver',1],['🌱','Grower',0],['🔥','7-day streak',0],['🏆','Goal hit',0],['⭐','100 stars',1],['📚','Chapter 1',1]]
      .map((b,i)=>this.badge(b[0],b[1],b[2]))));
    // theme picker
    rows.push(this.sectionLabel('Theme'));
    rows.push(this.h('div',{key:'theme',style:{background:'#fff',borderRadius:'20px',padding:'16px',boxShadow:this.cardShadow}},[
      this.h('div',{style:{display:'flex',gap:'12px',justifyContent:'space-between'}},
        Object.keys(this.themes).map(k=>this.themeSwatch(k))),
      this.h('div',{style:{fontSize:'11px',color:C.inkSoft,lineHeight:1.4,marginTop:'14px'}},'Your wallet colours stay the same — orange is always Spend, blue is always Save.')
    ]));
    // language + buddies
    rows.push(this.h('div',{key:'lang',style:{background:'#fff',borderRadius:'18px',padding:'14px 16px',boxShadow:this.cardShadow,display:'flex',alignItems:'center',justifyContent:'space-between'}},[
      this.h('div',{style:{fontSize:'13px',fontWeight:600,color:C.ink}},'🌐 Language'),
      this.h('div',{style:{display:'flex',background:C.surface2,borderRadius:'999px',padding:'3px'}},[
        this.langBtn('en','EN'),this.langBtn('id','ID')
      ])
    ]));
    rows.push(this.sectionLabel('My buddies'));
    rows.push(this.h('div',{key:'buddies',style:{display:'flex',gap:'10px'}},
      ['🐰','🐨','🐧','🦄','＋'].map((e,i)=>this.h('div',{key:i,style:{width:'52px',height:'52px',borderRadius:'16px',background:i===4?C.surface2:'#fff',border:i===4?'2px dashed '+C.hair:'none',boxShadow:i===4?'none':this.cardShadow,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',color:C.inkSoft}},e))));
    return this.scrollArea(rows,false);
  }
  tierLabel(){ return {little:'Little · KG–Grade 1',middle:'Middle · Grade 2–6',teen:'Teen · Grade 7–9'}[this.state.tier]; }
  prizeCard(emoji,name,cost){ const C=this.C;
    return this.h('div',{key:name,style:{flex:1,background:'#fff',borderRadius:'18px',padding:'14px 10px',boxShadow:this.cardShadow,textAlign:'center'}},[
      this.h('div',{style:{fontSize:'28px'}},emoji),
      this.h('div',{style:{fontSize:'11.5px',fontWeight:700,color:C.ink,marginTop:'4px'}},name),
      this.h('div',{style:{fontSize:'11px',fontWeight:700,color:'#B07A00',marginTop:'2px'}},cost)
    ]);
  }
  lookCard(emoji,name,cost){ const C=this.C,B=this.b();
    return this.h('div',{key:name,style:{flex:1,textAlign:'center'}},[
      this.h('div',{style:{width:'100%',aspectRatio:'1',borderRadius:'16px',background:cost===true?B.tint:C.surface2,border:cost===true?'2px solid '+B.base:'1px solid '+C.hair,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px'}},emoji),
      this.h('div',{style:{fontSize:'10px',fontWeight:700,color:cost===true?B.base:C.inkSoft,marginTop:'5px',whiteSpace:'nowrap'}},cost===true?'Wearing':cost)
    ]);
  }
  badge(emoji,name,earned){ const C=this.C;
    return this.h('div',{key:name,style:{textAlign:'center',opacity:earned?1:.4}},[
      this.h('div',{style:{width:'100%',aspectRatio:'1',borderRadius:'16px',background:earned?'#fff':C.surface2,boxShadow:earned?this.cardShadow:'none',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'26px',filter:earned?'none':'grayscale(1)'}},emoji),
      this.h('div',{style:{fontSize:'8.5px',color:C.inkSoft,marginTop:'4px',lineHeight:1.2}},name)
    ]);
  }
  themeSwatch(k){ const t=this.themes[k], sel=this.state.theme===k;
    return this.h('button',{key:k,onClick:()=>this.setState({theme:k}),style:{border:'none',cursor:'pointer',background:'none',fontFamily:'inherit',flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'6px'}},[
      this.h('div',{style:{width:'42px',height:'42px',borderRadius:'14px',background:t.grad,boxShadow:sel?'0 0 0 3px #fff, 0 0 0 5px '+t.base:this.cardShadow}},''),
      this.h('div',{style:{fontSize:'10px',fontWeight:sel?700:600,color:sel?t.base:this.C.inkSoft}},t.name)
    ]);
  }
  langBtn(k,l){ const on=this.state.lang===k;
    return this.h('button',{key:k,onClick:()=>this.setState({lang:k}),style:{border:'none',cursor:'pointer',fontFamily:'inherit',borderRadius:'999px',padding:'6px 14px',fontSize:'11px',fontWeight:700,background:on?this.b().base:'transparent',color:on?'#fff':this.C.inkSoft}},l);
  }

  // =========================================================== ACTION HUB SHEET
  sheet(){
    const C=this.C, B=this.b(), d=this.state.data, little=this.state.tier==='little';
    const row=(emoji,tint,name,desc,onClick,needs,hi)=>this.h('button',{key:name,onClick,style:{width:'100%',border:'none',cursor:'pointer',fontFamily:'inherit',textAlign:'left',background:hi?B.tint:'#fff',borderRadius:'16px',padding:'13px',display:'flex',alignItems:'center',gap:'12px',marginBottom:'8px'}},[
      this.h('div',{style:{width:'44px',height:'44px',borderRadius:'13px',background:tint,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',flex:'none'}},emoji),
      this.h('div',{style:{flex:1,minWidth:0}},[
        this.h('div',{style:{display:'flex',alignItems:'center',gap:'7px'}},[
          this.h('div',{style:{fontSize:'14px',fontWeight:700,color:C.ink}},name),
          needs?this.needsChip():null
        ]),
        this.h('div',{style:{fontSize:'11px',color:C.inkSoft,marginTop:'1px',lineHeight:1.3}},desc)
      ]),
      this.h('div',{style:{color:C.inkSoft,fontSize:'18px'}},'›')
    ]);
    const g1=[];
    if(d.unsorted>0) g1.push(row('🪙',this.hexA(B.base,.14),'Sort new money',this.rp(d.unsorted)+' unsorted — split it into wallets',()=>this.openPush('sort'),false,true));
    g1.push(row('🏦',C.saveT,'Save to a dream','Add money to BMX Bike or another dream',()=>this.openPush('move',{preDest:'bmx'})));
    g1.push(row('💝',C.giveT,'Give','Set money aside to share',()=>this.openPush('giveaway')));
    if(!little) g1.push(row('🔄',this.C.surface2,'Move between wallets','Shift a balance from one wallet to another',()=>this.openPush('move')));
    const g2=[row('💸',C.spendT,'Cash out','Turn app balance into real money or an item',()=>this.openPush('cashout'),true)];
    if(!little) g2.unshift(row('🌱',C.growT,'Grow my money','Put money into a time deposit or gold',()=>this.openPush('grow'),true));

    return this.h('div',{key:'sheetwrap',onClick:()=>this.setState({sheet:false}),style:{position:'absolute',inset:0,zIndex:50,background:'rgba(20,16,36,.4)',animation:'cel-fade .2s',display:'flex',flexDirection:'column',justifyContent:'flex-end'}},
      this.h('div',{onClick:e=>e.stopPropagation(),style:{background:C.bg,borderRadius:'28px 28px 0 0',padding:'12px 18px 26px',animation:'cel-sheet .28s cubic-bezier(.2,.8,.2,1)',maxHeight:'86%',overflowY:'auto'}},[
        this.h('div',{key:'grip',style:{width:'44px',height:'5px',borderRadius:'3px',background:C.hair,margin:'2px auto 14px'}},''),
        this.h('div',{key:'hd',style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px'}},[
          this.h('div',{style:{font:`700 19px 'Fredoka'`,color:C.ink}},'What do you want to do?'),
          this.h('button',{onClick:()=>this.setState({sheet:false}),style:{border:'none',cursor:'pointer',background:'#fff',width:'34px',height:'34px',borderRadius:'11px',fontSize:'15px',color:C.inkSoft,boxShadow:this.cardShadow}},'✕')
        ]),
        this.h('div',{key:'l1',style:{fontSize:'10px',fontWeight:800,letterSpacing:'.5px',color:C.inkSoft,margin:'0 2px 8px'}},'MANAGE MY MONEY · HAPPENS RIGHT AWAY'),
        this.h('div',{key:'g1'},g1),
        this.h('div',{key:'div',style:{height:'1px',background:C.hair,margin:'12px 2px'}},''),
        this.h('div',{key:'l2',style:{fontSize:'10px',fontWeight:800,letterSpacing:'.5px',color:C.inkSoft,margin:'0 2px 8px'}},'ASK A GROWN-UP · NEEDS THEIR OK'),
        this.h('div',{key:'g2'},g2)
      ]));
  }
  needsChip(){ return this.h('div',{style:{fontSize:'8.5px',fontWeight:800,letterSpacing:'.5px',color:this.C.amber,background:'#FFF4DE',padding:'2px 7px',borderRadius:'7px',border:'1px solid #FFE2A8',whiteSpace:'nowrap'}},'NEEDS OK'); }

  // =========================================================== PUSH SCREENS
  pushScreen(){
    const map={sort:this.sortScreen,cashout:this.cashoutScreen,move:this.moveScreen,giveaway:this.giveawayScreen,
      grow:this.growScreen,buyfx:this.buyfxScreen,harvestTd:this.harvestTdScreen,harvestGold:this.harvestGoldScreen,requests:this.requestsScreen,history:this.historyScreen,lesson:this.lessonScreen};
    const fn=map[this.state.push];
    const content=fn?fn.call(this):this.h('div',{},'');
    return this.h('div',{key:'push',style:{position:'absolute',inset:0,zIndex:55,background:this.bgCol(),animation:'cel-push .3s cubic-bezier(.2,.8,.2,1)',display:'flex',flexDirection:'column'}},content);
  }
  pushHeader(title,needs){ const C=this.C;
    return this.h('div',{key:'ph',style:{flex:'none'}},[
      this.statusBar(false),
      this.h('div',{style:{display:'flex',alignItems:'center',gap:'12px',padding:'0 18px 12px'}},[
        this.h('button',{onClick:()=>this.closePush(),style:{border:'none',cursor:'pointer',background:'#fff',width:'40px',height:'40px',borderRadius:'13px',boxShadow:this.cardShadow,fontSize:'20px',color:C.ink,flex:'none'}},'‹'),
        this.h('div',{style:{flex:1,font:`700 20px 'Fredoka'`,color:C.ink,letterSpacing:'-.01em'}},title),
        needs?this.needsChip():null
      ])
    ]);
  }
  pushBody(children){ return this.h('div',{key:'pb',className:'cel-scroll',style:{flex:1,overflowY:'auto',padding:'4px 18px 120px',display:'flex',flexDirection:'column',gap:'14px'}},children); }
  pushCta(label,enabled,onClick){ const B=this.b();
    return this.h('div',{key:'cta',style:{position:'absolute',left:0,right:0,bottom:0,padding:'16px 18px 24px',background:`linear-gradient(to top, ${this.bgCol()} 70%, transparent)`}},
      this.h('button',{onClick:enabled?onClick:null,disabled:!enabled,style:{width:'100%',border:'none',cursor:enabled?'pointer':'default',fontFamily:'inherit',background:enabled?B.base:'#CFC7EA',color:'#fff',borderRadius:'16px',padding:'16px',fontSize:'15px',fontWeight:700,boxShadow:enabled?'0 8px 24px '+this.hexA(B.base,.35):'none'}},label));
  }
  stepper(val,onMinus,onPlus,disMinus,disPlus){ const C=this.C;
    const btn=(g,on,dis)=>this.h('button',{onClick:dis?null:on,disabled:dis,style:{border:'none',cursor:dis?'default':'pointer',fontFamily:'inherit',width:'34px',height:'34px',borderRadius:'11px',background:dis?C.surface2:'#fff',boxShadow:dis?'none':this.cardShadow,fontSize:'18px',fontWeight:700,color:dis?C.hair:C.ink,flex:'none'}},g);
    return this.h('div',{style:{display:'flex',alignItems:'center',gap:'8px'}},[btn('−',onMinus,disMinus),this.h('div',{style:{minWidth:'54px',textAlign:'center'}},this.money(val,16)),btn('+',onPlus,disPlus)]);
  }

  // ---- SORT ----
  sortScreen(){
    const C=this.C, B=this.b(), d=this.state.data, little=this.state.tier==='little';
    const f=this.state.form; if(!f.alloc) f.alloc={};
    const dests = little
      ? [{id:'spend',emoji:'🍡',name:'Spend',col:C.spend,tint:C.spendT},{id:'save',emoji:'🏦',name:'Save',col:C.save,tint:C.saveT},{id:'give',emoji:'💝',name:'Give',col:C.give,tint:C.giveT}]
      : [{id:'snacks',emoji:'🍡',name:'Snacks',col:C.spend,tint:C.spendT},{id:'transport',emoji:'🚌',name:'Transport',col:C.spend,tint:C.spendT},{id:'games',emoji:'🎮',name:'Games',col:C.spend,tint:C.spendT},{id:'bmx',emoji:'🚲',name:'BMX Bike',col:C.save,tint:C.saveT},{id:'headphones',emoji:'🎧',name:'Headphones',col:C.save,tint:C.saveT},{id:'free',emoji:'💭',name:'Free savings',col:C.save,tint:C.saveT},{id:'give',emoji:'💝',name:'Ready to give',col:C.give,tint:C.giveT}];
    const allocated=Object.values(f.alloc).reduce((a,b)=>a+b,0);
    const remainder=d.unsorted-allocated;
    const step=5000;
    const setAlloc=(id,v)=>{ const alloc={...f.alloc,[id]:Math.max(0,v)}; this.setState({form:{...f,alloc}}); };
    const autoSplit=()=>{ const u=d.unsorted; let alloc={};
      if(little){ alloc={spend:Math.round(u*.4/step)*step,save:Math.round(u*.4/step)*step}; alloc.give=u-alloc.spend-alloc.save; }
      else { alloc={snacks:Math.round(u*.4/step)*step,free:Math.round(u*.4/step)*step}; alloc.give=u-alloc.snacks-alloc.free; }
      this.setState({form:{...f,alloc}});
    };
    const hint=little?'Little mode: sort into the 3 big wallets.':'Middle mode: sort right down to a sub-wallet.';
    const rows=[
      this.h('div',{key:'sum',style:{background:B.grad,borderRadius:'22px',padding:'18px',display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:'0 8px 30px '+this.hexA(B.base,.35)}},[
        this.h('div',{},[
          this.h('div',{style:{fontSize:'11px',fontWeight:700,color:'rgba(255,255,255,.8)',textTransform:'uppercase'}},'Left to sort'),
          this.h('div',{style:{marginTop:'2px'}},this.money(remainder,32,{color:'#fff',rpColor:'rgba(255,255,255,.7)'}))
        ]),
        this.h('button',{onClick:autoSplit,style:{border:'none',cursor:'pointer',fontFamily:'inherit',background:'rgba(255,255,255,.22)',color:'#fff',borderRadius:'13px',padding:'11px 15px',fontSize:'12.5px',fontWeight:700}},'Auto-split')
      ]),
      this.h('div',{key:'hint',style:{fontSize:'11.5px',color:C.inkSoft,textAlign:'center'}},hint+' · 40% Spend / 40% Save / 20% Give default'),
      ...dests.map(dst=>{ const v=f.alloc[dst.id]||0;
        return this.h('div',{key:dst.id,style:{background:'#fff',borderRadius:'18px',padding:'14px',boxShadow:this.cardShadow}},[
          this.h('div',{style:{display:'flex',alignItems:'center',gap:'11px'}},[
            this.h('div',{style:{width:'40px',height:'40px',borderRadius:'12px',background:dst.tint,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',flex:'none'}},dst.emoji),
            this.h('div',{style:{flex:1}},[
              this.h('div',{style:{fontSize:'13px',fontWeight:700,color:C.ink}},dst.name),
              this.h('div',{style:{fontSize:'11px',color:dst.col,fontWeight:600}},this.rp(v))
            ]),
            this.stepper(v,()=>setAlloc(dst.id,v-step),()=>remainder>=step&&setAlloc(dst.id,v+step),v<=0,remainder<step)
          ]),
          this.h('div',{style:{height:'6px',borderRadius:'3px',background:C.track,marginTop:'10px',overflow:'hidden'}},
            this.h('div',{style:{width:(d.unsorted?v/d.unsorted*100:0)+'%',height:'100%',borderRadius:'3px',background:dst.col,transition:'width .2s'}},''))
        ]);
      })
    ];
    const confirm=()=>{
      const alloc=f.alloc;
      this.setState(s=>{ const nd=JSON.parse(JSON.stringify(s.data));
        Object.entries(alloc).forEach(([id,amt])=>{ if(!amt) return;
          if(little){ if(id==='spend') nd.spend.snacks+=amt; else if(id==='save') nd.save.free+=amt; else if(id==='give') nd.give+=amt; }
          else { if(nd.spend[id]!=null) nd.spend[id]+=amt; else if(nd.save[id]!=null) nd.save[id]+=amt; else if(id==='give') nd.give+=amt; }
        });
        nd.unsorted=0;
        return {data:nd,push:null,tab:'home'};
      });
      this.toast('Sorted! Same total, new jobs. 💪');
    };
    return [this.pushHeader('Sort your money'),this.pushBody(rows),this.pushCta('Put money in wallets',remainder===0&&allocated>0,confirm)];
  }

  // ---- CASH OUT ----
  cashoutScreen(){
    const C=this.C, d=this.state.data, f=this.state.form;
    const sources=[...this.spendW.map(w=>({...w,cat:'Spend',col:C.spend,tint:C.spendT,bal:d.spend[w.id]})),
                   ...this.saveW.map(w=>({...w,cat:'Save',col:C.save,tint:C.saveT,bal:d.save[w.id]}))];
    const src=sources.find(s=>s.id===f.src);
    const amt=f.amt||0, step=10000;
    const methods=[['gopay','GoPay'],['ovo','OVO'],['cash','Cash'],['buy','Buy it for me']];
    const set=(patch)=>this.setState({form:{...f,...patch}});
    const rows=[
      this.h('div',{key:'why',style:{background:C.spendT,borderRadius:'16px',padding:'13px 15px',fontSize:'11.5px',color:C.spendD,lineHeight:1.4}},'Cash out turns app balance into real money. A grown-up says yes first. You can only cash out from Spend or Save — not Give, Unsorted, or Grow.'),
      this.pickLabel('From which wallet?'),
      this.h('div',{key:'src',style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}},
        sources.map(s=>this.selectCard(s.emoji,s.name,this.rp(s.bal),f.src===s.id,()=>set({src:s.id,amt:0}),s.col))),
      this.pickLabel('How much?'),
      this.h('div',{key:'amt',style:{background:'#fff',borderRadius:'18px',padding:'16px',boxShadow:this.cardShadow,display:'flex',alignItems:'center',justifyContent:'space-between'}},[
        this.money(amt,26,{color:src?C.ink:C.hair}),
        this.stepper(amt,()=>set({amt:Math.max(0,amt-step)}),()=>src&&amt+step<=src.bal&&set({amt:amt+step}),amt<=0,!src||amt+step>src.bal)
      ]),
      src?this.h('div',{key:'cap',style:{fontSize:'10.5px',color:C.inkSoft,textAlign:'right',marginTop:'-6px'}},'Max '+this.rp(src.bal)):null,
      this.pickLabel('How to get it? (optional)'),
      this.h('div',{key:'mth',style:{display:'flex',flexWrap:'wrap',gap:'8px'}},
        methods.map(([k,l])=>this.chipToggle(l,f.method===k,()=>set({method:f.method===k?null:k})))),
      this.pickLabel('Why do you want it?'),
      this.textArea(f.reason||'',v=>set({reason:v}),'e.g. buy a birthday gift for my friend')
    ];
    const ok=src&&amt>0&&(f.reason||'').trim().length>2;
    const submit=()=>{ this.addPending({icon:'💸',title:'Cash out · '+this.rp(amt),sub:'From '+src.name+' · waiting for a grown-up',tag:'Needs OK'});
      this.setState({push:null,tab:'home'}); this.toast('Request sent to a grown-up ⏳'); };
    return [this.pushHeader('Cash out',true),this.pushBody(rows),this.pushCta('Send request',ok,submit)];
  }

  // ---- MOVE ----
  moveScreen(){
    const C=this.C, d=this.state.data, f=this.state.form;
    const wallets=[...this.spendW.map(w=>({...w,col:C.spend,tint:C.spendT,bal:d.spend[w.id]})),
                   ...this.saveW.map(w=>({...w,col:C.save,tint:C.saveT,bal:d.save[w.id]})),
                   {id:'give',emoji:'💝',name:'Ready to give',col:C.give,tint:C.giveT,bal:d.give}];
    if(!f._init && f.preDest){ f.dst=f.preDest; f._init=true; }
    const src=wallets.find(w=>w.id===f.src), dst=wallets.find(w=>w.id===f.dst);
    const amt=f.amt||0, step=5000;
    const set=(patch)=>this.setState({form:{...f,...patch}});
    const rows=[
      this.h('div',{key:'note',style:{background:this.b().tint,borderRadius:'16px',padding:'13px 15px',fontSize:'11.5px',color:this.b().deep,lineHeight:1.4}},'Move happens right away — no grown-up needed. Grow can\'t be moved (only Harvest), and Unsorted only leaves through Sort.'),
      this.pickLabel('From'),
      this.h('div',{key:'src',style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}},
        wallets.map(w=>this.selectCard(w.emoji,w.name,this.rp(w.bal),f.src===w.id,()=>set({src:w.id,amt:0}),w.col))),
      this.pickLabel('To'),
      this.h('div',{key:'dst',style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}},
        wallets.filter(w=>w.id!==f.src).map(w=>this.selectCard(w.emoji,w.name,this.rp(w.bal),f.dst===w.id,()=>set({dst:w.id}),w.col))),
      this.pickLabel('How much?'),
      this.h('div',{key:'amt',style:{background:'#fff',borderRadius:'18px',padding:'16px',boxShadow:this.cardShadow,display:'flex',alignItems:'center',justifyContent:'space-between'}},[
        this.money(amt,26,{color:src?C.ink:C.hair}),
        this.stepper(amt,()=>set({amt:Math.max(0,amt-step)}),()=>src&&amt+step<=src.bal&&set({amt:amt+step}),amt<=0,!src||amt+step>src.bal)
      ])
    ];
    const ok=src&&dst&&amt>0&&amt<=src.bal;
    const submit=()=>{ this.setState(s=>{ const nd=JSON.parse(JSON.stringify(s.data));
        const dec=(id)=>{ if(nd.spend[id]!=null) nd.spend[id]-=amt; else if(nd.save[id]!=null) nd.save[id]-=amt; else if(id==='give') nd.give-=amt; };
        const inc=(id)=>{ if(nd.spend[id]!=null) nd.spend[id]+=amt; else if(nd.save[id]!=null) nd.save[id]+=amt; else if(id==='give') nd.give+=amt; };
        dec(src.id); inc(dst.id); return {data:nd,push:null,tab:'wallets'}; });
      this.toast('Moved '+this.rp(amt)+' · '+src.name+' → '+dst.name); };
    return [this.pushHeader('Move money'),this.pushBody(rows),this.pushCta('Move it',ok,submit)];
  }

  // ---- GIVE AWAY ----
  giveawayScreen(){
    const C=this.C, d=this.state.data, f=this.state.form;
    const causes=[['🕌','Mosque'],['🏠','Orphanage'],['🌊','Disaster relief'],['🧑‍🤝‍🧑','A friend'],['🐾','Animals'],['✏️','Write your own']];
    const amt=f.amt||0, step=5000;
    const set=(patch)=>this.setState({form:{...f,...patch}});
    const rows=[
      this.h('div',{key:'bal',style:{background:C.giveT,borderRadius:'16px',padding:'14px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}},[
        this.h('div',{style:{fontSize:'12px',fontWeight:600,color:C.giveD}},'Ready to give'),this.money(d.give,22,{color:C.give})
      ]),
      this.pickLabel('Who are you helping?'),
      this.h('div',{key:'cause',style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px'}},
        causes.map(([e,n])=>this.selectCard(e,n,'',f.cause===n,()=>set({cause:n}),C.give))),
      this.pickLabel('How much?'),
      this.h('div',{key:'amt',style:{background:'#fff',borderRadius:'18px',padding:'16px',boxShadow:this.cardShadow,display:'flex',alignItems:'center',justifyContent:'space-between'}},[
        this.money(amt,26,{color:C.ink}),
        this.stepper(amt,()=>set({amt:Math.max(0,amt-step)}),()=>amt+step<=d.give&&set({amt:amt+step}),amt<=0,amt+step>d.give)
      ]),
      this.pickLabel('Want to say why? (optional)'),
      this.textArea(f.reason||'',v=>set({reason:v}),'Totally optional — giving doesn\'t need paperwork.')
    ];
    const ok=f.cause&&amt>0;
    const submit=()=>{ this.addPending({icon:'💝',title:'Give '+this.rp(amt),sub:'To '+f.cause+' · waiting for a grown-up',tag:'Needs OK'});
      this.setState({push:null,tab:'home'}); this.toast('Giving request sent 💝'); };
    return [this.pushHeader('Give it away',true),this.pushBody(rows),this.pushCta('Send request',ok,submit)];
  }

  // ---- GROW hub ----
  growScreen(){
    const C=this.C;
    const opt=(emoji,name,desc,go)=>this.h('button',{key:name,onClick:go,style:{width:'100%',border:'none',cursor:'pointer',fontFamily:'inherit',textAlign:'left',background:'#fff',borderRadius:'18px',padding:'15px',boxShadow:this.cardShadow,display:'flex',alignItems:'center',gap:'12px'}},[
      this.h('div',{style:{width:'46px',height:'46px',borderRadius:'14px',background:C.growT,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'23px',flex:'none'}},emoji),
      this.h('div',{style:{flex:1}},[this.h('div',{style:{fontSize:'14px',fontWeight:700,color:C.ink}},name),this.h('div',{style:{fontSize:'11px',color:C.inkSoft,lineHeight:1.3,marginTop:'1px'}},desc)]),
      this.h('div',{style:{color:C.inkSoft,fontSize:'18px'}},'›')
    ]);
    const rows=[
      this.h('div',{key:'note',style:{background:C.growT,borderRadius:'16px',padding:'13px 15px',fontSize:'11.5px',color:C.growD,lineHeight:1.4}},'Growing money always needs a grown-up\'s OK. Money that grows can only come back out through Harvest — and it lands in Save, never Spend.'),
      opt('🏦','Time Deposit','Lock money for 3, 6 or 12 months for interest',()=>this.openPush('buyfx',{kind:'td'})),
      opt('🪙','Gold','Buy grams of gold · price moves up and down',()=>this.openPush('buyfx',{kind:'gold'})),
      opt('💵','Foreign currency','Buy USD, SGD or EUR at today\'s rate',()=>this.openPush('buyfx',{kind:'fx'}))
    ];
    return [this.pushHeader('Grow my money',true),this.pushBody(rows)];
  }

  // ---- BUY FX / grow purchase ----
  buyfxScreen(){
    const C=this.C, d=this.state.data, f=this.state.form;
    const currencies=[['USD','🇺🇸',16000],['SGD','🇸🇬',12000],['EUR','🇪🇺',17000]];
    const cur=f.cur||'USD'; const rate=(currencies.find(c=>c[0]===cur)[2])*1.01;
    const sources=this.saveW.map(w=>({...w,bal:d.save[w.id]})).concat(this.spendW.map(w=>({...w,bal:d.spend[w.id]})));
    const src=sources.find(s=>s.id===f.src);
    const amt=f.amt||0, step=10000;
    const set=(patch)=>this.setState({form:{...f,...patch}});
    const rows=[
      this.h('div',{key:'note',style:{background:C.growT,borderRadius:'16px',padding:'13px 15px',fontSize:'11.5px',color:C.growD,lineHeight:1.4}},'Buying at today\'s rate (includes a small 1% spread). A grown-up approves before anything happens.'),
      this.pickLabel('Which currency?'),
      this.h('div',{key:'cur',style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px'}},
        currencies.map(([code,flag,r])=>this.selectCard(flag,code,this.rp(Math.round(r*1.01))+'/1',cur===code,()=>set({cur:code}),C.grow))),
      this.pickLabel('Pay from'),
      this.h('div',{key:'src',style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}},
        sources.map(s=>this.selectCard(s.emoji,s.name,this.rp(s.bal),f.src===s.id,()=>set({src:s.id,amt:0}),s.id in d.save?C.save:C.spend))),
      this.pickLabel('How much (in rupiah)?'),
      this.h('div',{key:'amt',style:{background:'#fff',borderRadius:'18px',padding:'16px',boxShadow:this.cardShadow,display:'flex',alignItems:'center',justifyContent:'space-between'}},[
        this.money(amt,26,{color:src?C.ink:C.hair}),
        this.stepper(amt,()=>set({amt:Math.max(0,amt-step)}),()=>src&&amt+step<=src.bal&&set({amt:amt+step}),amt<=0,!src||amt+step>src.bal)
      ]),
      amt>0?this.h('div',{key:'got',style:{textAlign:'center',fontSize:'12px',color:C.inkSoft}},'You\'d get about '+cur+' '+(amt/rate).toFixed(2)):null
    ];
    const ok=src&&amt>0;
    const submit=()=>{ this.addPending({icon:'🌱',title:'Buy '+cur+' '+(amt/rate).toFixed(2),sub:'From '+src.name+' · waiting for a grown-up',tag:'Needs OK'});
      this.setState({push:null,tab:'home'}); this.toast('Grow request sent 🌱'); };
    return [this.pushHeader('Buy '+cur,true),this.pushBody(rows),this.pushCta('Send request',ok,submit)];
  }

  // ---- HARVEST TIME DEPOSIT ----
  harvestTdScreen(){
    const C=this.C, d=this.state.data, f=this.state.form;
    const opt=(key,emoji,name,desc)=>this.selectRow(emoji,name,desc,f.choice===key,()=>this.setState({form:{...f,choice:key}}),C.grow,C.growT);
    const rows=[
      this.h('div',{key:'card',style:{background:C.growT,borderRadius:'18px',padding:'16px',textAlign:'center'}},[
        this.h('div',{style:{fontSize:'11px',fontWeight:700,color:C.growD,textTransform:'uppercase'}},'Time Deposit · matured ✅'),
        this.h('div',{style:{margin:'6px 0 2px'}},this.money(d.grow.td,32,{color:C.growD})),
        this.h('div',{style:{fontSize:'11.5px',color:C.growD}},'Rp 30,000 principal + Rp 750 interest')
      ]),
      this.pickLabel('What next?'),
      opt('cash','💰','Cash out everything','Move Rp 30,750 into a Save wallet'),
      opt('roll','🔄','Roll it all over','Start a new 3 / 6 / 12-month deposit'),
      opt('interest','✨','Take just the interest','Rp 750 to Save, principal rolls over')
    ];
    const ok=!!f.choice;
    const submit=()=>{ this.addPending({icon:'🏦',title:'Harvest Time Deposit',sub:'Lands in Save · waiting for a grown-up',tag:'Needs OK'});
      this.setState({push:null,tab:'home'}); this.toast('Harvest request sent — it will land in Save 🏦'); };
    return [this.pushHeader('Harvest · Time Deposit',true),this.pushBody(rows),this.pushCta('Send request',ok,submit)];
  }

  // ---- HARVEST GOLD ----
  harvestGoldScreen(){
    const C=this.C, d=this.state.data;
    const paid=Math.round(14.5*1450000/1000); // per mg demo; simplified
    const buyback=d.grow.gold;
    const rows=[
      this.h('div',{key:'card',style:{background:'#fff',borderRadius:'18px',padding:'18px',boxShadow:this.cardShadow}},[
        this.h('div',{style:{fontSize:'11px',fontWeight:700,color:C.inkSoft,textTransform:'uppercase',textAlign:'center'}},'Sell 14.5 mg gold today'),
        this.h('div',{style:{display:'flex',justifyContent:'space-between',marginTop:'14px',paddingBottom:'12px',borderBottom:'1px solid '+C.hair}},[
          this.h('div',{},[this.h('div',{style:{fontSize:'11px',color:C.inkSoft}},'You paid'),this.money(21000,20,{color:C.inkSoft})]),
          this.h('div',{style:{textAlign:'right'}},[this.h('div',{style:{fontSize:'11px',color:C.inkSoft}},'Today\'s buyback'),this.money(buyback,20,{color:C.loss})])
        ]),
        this.h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'12px'}},[
          this.h('div',{style:{fontSize:'12.5px',fontWeight:700,color:C.ink}},'Difference'),
          this.h('div',{style:{font:`600 18px 'Fredoka'`,color:C.loss}},'▼ '+this.rp(21000-buyback))
        ])
      ]),
      this.h('div',{key:'why',style:{background:C.lossT,borderRadius:'18px',padding:'16px'}},[
        this.h('div',{style:{fontSize:'13px',fontWeight:700,color:C.loss}},'Why is it less than you paid?'),
        this.h('div',{style:{fontSize:'11.5px',color:'#9a2f38',lineHeight:1.45,marginTop:'6px'}},'Shops sell gold at a higher price than they buy it back — that gap is how they earn. Gold is for waiting, not for flipping. Its price also moves up and down day to day.')
      ]),
      this.h('div',{key:'land',style:{fontSize:'11.5px',color:C.inkSoft,textAlign:'center'}},'Whatever you get lands in a Save wallet, never Spend.')
    ];
    const submit=()=>{ this.addPending({icon:'🪙',title:'Harvest Gold · '+this.rp(buyback),sub:'Lands in Save · waiting for a grown-up',tag:'Needs OK'});
      this.setState({push:null,tab:'home'}); this.toast('Harvest request sent — lands in Save 🏦'); };
    return [this.pushHeader('Harvest · Gold',true),this.pushBody(rows),this.pushCta('Sell '+this.rp(buyback)+' to Save',true,submit)];
  }

  // ---- REQUESTS ----
  requestsScreen(){
    const C=this.C;
    const rows=[];
    if(this.state.pending.length===0){
      rows.push(this.h('div',{key:'empty',style:{textAlign:'center',padding:'60px 20px',color:C.inkSoft}},[
        this.h('div',{style:{fontSize:'44px'}},'🎉'),this.h('div',{style:{fontSize:'14px',fontWeight:700,color:C.ink,marginTop:'10px'}},'Nothing waiting'),this.h('div',{style:{fontSize:'12px',marginTop:'4px'}},'All caught up!')
      ]));
    } else {
      rows.push(this.h('div',{key:'note',style:{fontSize:'11.5px',color:C.inkSoft,textAlign:'center'}},'Everything here is waiting for a grown-up. Nothing happens until they say yes.'));
      this.state.pending.forEach(p=>rows.push(this.h('div',{key:p.id,style:{background:'#fff',borderRadius:'18px',padding:'15px',boxShadow:this.cardShadow,display:'flex',alignItems:'center',gap:'12px'}},[
        this.h('div',{style:{width:'44px',height:'44px',borderRadius:'13px',background:C.surface2,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',flex:'none'}},p.icon),
        this.h('div',{style:{flex:1,minWidth:0}},[
          this.h('div',{style:{fontSize:'13.5px',fontWeight:700,color:C.ink}},p.title),
          this.h('div',{style:{fontSize:'11px',color:C.inkSoft,marginTop:'1px'}},p.sub)
        ]),
        this.h('div',{style:{fontSize:'18px'}},'⏳')
      ])));
    }
    return [this.pushHeader('Requests'),this.pushBody(rows)];
  }

  // ---- HISTORY ----
  historyScreen(){
    const C=this.C, B=this.b(), little=this.state.tier==='little', teen=this.state.tier==='teen';
    const f=this.state.form; const filter=f.filter||'all';
    const TODAY='2026-07-23';
    // demo ledger — dir: 'in' (money arrives) / 'out' (money leaves) / 'move' (between wallets)
    const cat={grow:[C.grow,C.growT],save:[C.save,C.saveT],spend:[C.spend,C.spendT],give:[C.give,C.giveT],loss:[C.loss,C.lossT]};
    const txns=[
      {d:'2026-07-23',e:'🎁',c:'grow',t:'Gift from Mom',s:'Into unsorted',time:'08:20',amt:50000,dir:'in'},
      {d:'2026-07-23',e:'🍡',c:'spend',t:'Snack at the canteen',s:'From Snacks',time:'12:05',amt:8000,dir:'out'},
      {d:'2026-07-22',e:'🏦',c:'save',t:'Saved to BMX Bike',s:'Snacks → BMX Bike',time:'16:05',amt:25000,dir:'move'},
      {d:'2026-07-22',e:'🎯',c:'grow',t:'Mission reward',s:'Sorted 3 days in a row',time:'15:40',amt:5000,dir:'in'},
      {d:'2026-07-22',e:'🚌',c:'spend',t:'Bus fare',s:'From Transport',time:'07:30',amt:6000,dir:'out'},
      {d:'2026-07-20',e:'💸',c:'spend',t:'Cash out for a comic',s:'From Games',time:'14:10',amt:12000,dir:'out'},
      {d:'2026-07-18',e:'💝',c:'give',t:'Friday giving',s:'From Ready to give',time:'11:30',amt:10000,dir:'out'},
      {d:'2026-07-18',e:'🌱',c:'grow',t:'Time Deposit interest',s:'3-month deposit matured',time:'09:00',amt:750,dir:'in'},
      {d:'2026-07-16',e:'💵',c:'grow',t:'Sold USD',s:'To Free savings',time:'13:25',amt:9821,dir:'in'},
      {d:'2026-07-14',e:'💰',c:'grow',t:'Weekly allowance',s:'Into unsorted',time:'08:00',amt:40000,dir:'in'},
      {d:'2026-07-14',e:'🎮',c:'spend',t:'Game top-up',s:'From Games',time:'19:15',amt:15000,dir:'out'},
      {d:'2026-07-14',e:'🪙',c:'save',t:'Bought 14.5 mg gold',s:'Free savings → Gold',time:'10:20',amt:21000,dir:'move'},
    ];
    const dayOff=(ds)=>Math.round((new Date(TODAY)-new Date(ds))/864e5);
    const dow=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], mon=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const label=(ds)=>{ const o=dayOff(ds); if(o===0)return'Today'; if(o===1)return'Yesterday'; const dt=new Date(ds); return `${dow[dt.getDay()]}, ${dt.getDate()} ${mon[dt.getMonth()]}`; };

    // ---- period / range filter ----
    let inRange=()=>true, rangeLabel='';
    if(teen){
      const from=f.from||'2026-07-01', to=f.to||TODAY;
      inRange=(it)=> it.d>=from && it.d<=to;
      rangeLabel=`${new Date(from).getDate()} ${mon[new Date(from).getMonth()]} – ${new Date(to).getDate()} ${mon[new Date(to).getMonth()]}`;
    } else if(!little){
      const per=f.period||'2w';
      const days={'1d':1,'3d':3,'5d':5,'7d':7,'2w':14,'1m':31}[per];
      inRange=(it)=> dayOff(it.d)<days;
    }
    const matchDir=(it)=> filter==='all' || (filter==='in'&&it.dir==='in') || (filter==='out'&&it.dir!=='in');
    const visible=txns.filter(it=>inRange(it)&&matchDir(it));
    let totalIn=0,totalOut=0;
    txns.filter(inRange).forEach(it=>{ it.dir==='in'?totalIn+=it.amt:totalOut+=it.amt; });

    const set=(patch)=>this.setState({form:{...f,...patch}});
    const rows=[];
    // summary
    rows.push(this.h('div',{key:'sum',style:{background:B.grad,borderRadius:'22px',padding:'16px 18px',display:'flex',boxShadow:'0 8px 30px '+this.hexA(B.base,.32)}},[
      this.h('div',{style:{flex:1}},[
        this.h('div',{style:{fontSize:'10.5px',fontWeight:700,color:'rgba(255,255,255,.8)',textTransform:'uppercase',letterSpacing:'.4px'}},'Came in'),
        this.h('div',{style:{marginTop:'2px'}},this.money(totalIn,22,{color:'#fff',rpColor:'rgba(255,255,255,.7)'}))
      ]),
      this.h('div',{style:{width:'1px',background:'rgba(255,255,255,.25)',margin:'2px 4px'}},''),
      this.h('div',{style:{flex:1,paddingLeft:'14px'}},[
        this.h('div',{style:{fontSize:'10.5px',fontWeight:700,color:'rgba(255,255,255,.8)',textTransform:'uppercase',letterSpacing:'.4px'}},'Went out'),
        this.h('div',{style:{marginTop:'2px'}},this.money(totalOut,22,{color:'#fff',rpColor:'rgba(255,255,255,.7)'}))
      ])
    ]));
    rows.push(this.h('div',{key:'note',style:{fontSize:'11px',color:C.inkSoft,textAlign:'center'}},teen?('Your activity · '+rangeLabel):'Everything that has happened to your money.'));

    // ---- teen chart ----
    if(teen) rows.push(this.historyChart(visible,label,dayOff));

    // ---- teen date range ----
    if(teen){
      const inp=(key,val)=>this.h('input',{key,type:'date',value:val,min:'2026-07-01',max:TODAY,onChange:e=>set({[key]:e.target.value}),style:{flex:1,minWidth:0,border:'1px solid '+C.hair,borderRadius:'12px',padding:'10px 12px',fontSize:'12.5px',fontFamily:'inherit',color:C.ink,background:'#fff',outline:'none'}});
      rows.push(this.h('div',{key:'range',style:{background:'#fff',borderRadius:'16px',padding:'12px 14px',boxShadow:this.cardShadow}},[
        this.h('div',{style:{fontSize:'11px',fontWeight:700,color:C.inkSoft,textTransform:'uppercase',letterSpacing:'.4px',marginBottom:'8px'}},'Pick a date range'),
        this.h('div',{style:{display:'flex',alignItems:'center',gap:'8px'}},[
          inp('from',f.from||'2026-07-01'),
          this.h('div',{style:{fontSize:'12px',color:C.inkSoft,flex:'none'}},'→'),
          inp('to',f.to||TODAY)
        ])
      ]));
    }

    // ---- middle period chips ----
    if(!little && !teen){
      const per=f.period||'2w';
      const opts=[['1d','1d'],['3d','3d'],['5d','5d'],['7d','7d'],['2w','2w'],['1m','1m']];
      rows.push(this.h('div',{key:'per',style:{display:'flex',gap:'7px',flexWrap:'wrap'}},
        opts.map(([k,lbl])=>this.chipToggle(lbl,per===k,()=>set({period:k})))));
    }

    // ---- dir filter chips ----
    rows.push(this.h('div',{key:'filt',style:{display:'flex',gap:'8px'}},[
      this.chipToggle('All',filter==='all',()=>set({filter:'all'})),
      this.chipToggle('Money in',filter==='in',()=>set({filter:'in'})),
      this.chipToggle('Money out',filter==='out',()=>set({filter:'out'})),
    ]));

    // ---- grouped list ----
    const order=[...new Set(visible.map(it=>it.d))];
    order.forEach(ds=>{
      const items=visible.filter(it=>it.d===ds);
      rows.push(this.h('div',{key:'g'+ds,style:{fontSize:'11px',fontWeight:800,color:C.inkSoft,textTransform:'uppercase',letterSpacing:'.5px',margin:'6px 2px -6px'}},label(ds)));
      const inner=[];
      items.forEach((it,i)=>{
        if(i>0) inner.push(this.h('div',{key:'hr'+i,style:{height:'1px',background:C.hair}},''));
        const [col,tint]=cat[it.c];
        const isIn=it.dir==='in';
        const amtStr=(isIn?'+':'−')+this.rp(it.amt);
        inner.push(this.h('div',{key:'r'+ds+i,style:{display:'flex',alignItems:'center',gap:'11px',padding:'11px 0'}},[
          this.h('div',{style:{width:'38px',height:'38px',borderRadius:'12px',background:tint,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'19px',flex:'none'}},it.e),
          this.h('div',{style:{flex:1,minWidth:0}},[
            this.h('div',{style:{fontSize:'13px',fontWeight:600,color:C.ink,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}},it.t),
            this.h('div',{style:{fontSize:'11px',color:C.inkSoft,marginTop:'1px'}},it.s+' · '+it.time)
          ]),
          this.h('div',{style:{font:`600 15px 'Fredoka'`,color:isIn?C.grow:C.ink,letterSpacing:'-.01em',flex:'none'}},amtStr)
        ]));
      });
      rows.push(this.h('div',{key:'c'+ds,style:{background:'#fff',borderRadius:'20px',padding:'2px 15px',boxShadow:this.cardShadow}},inner));
    });
    if(!visible.length) rows.push(this.h('div',{key:'empty',style:{textAlign:'center',padding:'50px 20px',color:C.inkSoft}},[
      this.h('div',{style:{fontSize:'40px'}},filter==='in'?'💸':'🐷'),
      this.h('div',{style:{fontSize:'13px',fontWeight:700,color:C.ink,marginTop:'10px'}},'Nothing here yet'),
      this.h('div',{style:{fontSize:'12px',marginTop:'4px'}},'Try a wider range or a different filter.')
    ]));

    return [this.pushHeader('History'),this.pushBody(rows)];
  }
  historyChart(visible,label,dayOff){ const C=this.C;
    // aggregate visible txns by date into in / out totals
    const byDay={};
    visible.forEach(it=>{ const k=it.d; byDay[k]=byDay[k]||{in:0,out:0}; it.dir==='in'?byDay[k].in+=it.amt:byDay[k].out+=it.amt; });
    let days=Object.keys(byDay).sort();
    if(days.length>10) days=days.slice(-10);
    const max=Math.max(1,...days.map(k=>Math.max(byDay[k].in,byDay[k].out)));
    const H=90;
    const dt=(k)=>new Date(k);
    const cols=days.map(k=>{
      const bar=(v,col)=>this.h('div',{style:{width:'7px',height:Math.max(3,Math.round(v/max*H))+'px',borderRadius:'4px 4px 2px 2px',background:col,transition:'height .2s'}},'');
      return this.h('div',{key:k,style:{display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',flex:'none'}},[
        this.h('div',{style:{display:'flex',alignItems:'flex-end',gap:'3px',height:H+'px'}},[bar(byDay[k].in,C.grow),bar(byDay[k].out,this.hexA(C.ink,.55))]),
        this.h('div',{style:{fontSize:'9.5px',color:C.inkSoft,fontWeight:600}},dt(k).getDate())
      ]);
    });
    const legend=(col,txt)=>this.h('div',{style:{display:'flex',alignItems:'center',gap:'5px'}},[
      this.h('div',{style:{width:'9px',height:'9px',borderRadius:'3px',background:col}},''),
      this.h('div',{style:{fontSize:'10.5px',color:C.inkSoft,fontWeight:600}},txt)
    ]);
    return this.h('div',{key:'chart',style:{background:'#fff',borderRadius:'20px',padding:'16px 16px 14px',boxShadow:this.cardShadow}},[
      this.h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}},[
        this.h('div',{style:{fontSize:'12.5px',fontWeight:700,color:C.ink}},'In vs out'),
        this.h('div',{style:{display:'flex',gap:'12px'}},[legend(C.grow,'In'),legend(this.hexA(C.ink,.55),'Out')])
      ]),
      days.length?this.h('div',{style:{display:'flex',gap:'12px',alignItems:'flex-end',overflowX:'auto',paddingBottom:'2px'}},cols)
        :this.h('div',{style:{fontSize:'11.5px',color:C.inkSoft,textAlign:'center',padding:'24px 0'}},'No activity in this range yet.')
    ]);
  }

  // ---- shared push controls ----
  pickLabel(t){ return this.h('div',{key:'lbl-'+t,style:{fontSize:'12px',fontWeight:700,color:this.C.ink,margin:'4px 2px -4px'}},t); }
  selectCard(emoji,name,sub,sel,onClick,accent){ const C=this.C;
    return this.h('button',{key:name,onClick,style:{border:sel?'2px solid '+accent:'1px solid '+C.hair,cursor:'pointer',fontFamily:'inherit',textAlign:'center',background:sel?this.hexA(accent,.08):'#fff',borderRadius:'15px',padding:'12px 8px',display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',transition:'all .12s'}},[
      this.h('div',{style:{fontSize:'22px'}},emoji),
      this.h('div',{style:{fontSize:'11.5px',fontWeight:700,color:C.ink,lineHeight:1.2}},name),
      sub?this.h('div',{style:{fontSize:'10px',color:sel?accent:C.inkSoft,fontWeight:600}},sub):null
    ]);
  }
  selectRow(emoji,name,desc,sel,onClick,accent,tint){ const C=this.C;
    return this.h('button',{key:name,onClick,style:{width:'100%',border:sel?'2px solid '+accent:'1px solid '+C.hair,cursor:'pointer',fontFamily:'inherit',textAlign:'left',background:sel?tint:'#fff',borderRadius:'16px',padding:'14px',display:'flex',alignItems:'center',gap:'12px'}},[
      this.h('div',{style:{width:'42px',height:'42px',borderRadius:'13px',background:sel?'#fff':C.surface2,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'21px',flex:'none'}},emoji),
      this.h('div',{style:{flex:1}},[this.h('div',{style:{fontSize:'13.5px',fontWeight:700,color:C.ink}},name),this.h('div',{style:{fontSize:'11px',color:C.inkSoft,marginTop:'1px'}},desc)]),
      this.h('div',{style:{width:'22px',height:'22px',borderRadius:'999px',border:'2px solid '+(sel?accent:C.hair),background:sel?accent:'transparent',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',flex:'none'}},sel?'✓':'')
    ]);
  }
  chipToggle(label,sel,onClick){ const C=this.C,B=this.b();
    return this.h('button',{key:label,onClick,style:{border:sel?'1.5px solid '+B.base:'1px solid '+C.hair,cursor:'pointer',fontFamily:'inherit',background:sel?B.tint:'#fff',color:sel?B.deep:C.ink,borderRadius:'999px',padding:'9px 15px',fontSize:'12px',fontWeight:600}},label);
  }
  textArea(val,onChange,ph){ const C=this.C;
    return this.h('textarea',{key:'ta',value:val,onChange:e=>onChange(e.target.value),placeholder:ph,rows:3,style:{width:'100%',border:'1px solid '+C.hair,borderRadius:'14px',padding:'13px',fontSize:'12.5px',fontFamily:'inherit',color:C.ink,resize:'none',outline:'none',background:'#fff'}});
  }
}
