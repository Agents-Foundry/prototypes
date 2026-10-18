/* Agents Foundry prototype shell. Design-only: no network, no storage of real data, no real actions. */
(function(){
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};

/* ---------- UI helpers (return HTML strings; callers escape dynamic text with esc) ---------- */
const ui={
  esc,
  badge:(t,tone='')=>`<span class="badge ${tone}">${t}</span>`,
  btn:(label,variant='',attrs='')=>`<button type="button" class="btn ${variant}" ${attrs}>${label}</button>`,
  stat:(label,value,delta,tone='flat')=>`<div class="card stat"><div class="l">${label}</div><div class="v">${value}</div>${delta?`<div class="d ${tone}">${delta}</div>`:''}</div>`,
  card:(title,body,o={})=>`<section class="card ${o.flush?'flush':''} ${o.cls||''}">${title||o.actions?`<header>${title?`<h2>${title}</h2>`:'<span></span>'}<div class="actions">${o.actions||''}</div></header>`:''}${o.flush&&o.bodyPad?`<div style="padding:18px">${body}</div>`:body}</section>`,
  table:(cols,rows,o={})=>`<div class="table-wrap"><table class="${o.cls||''}"><caption class="sr-only">${esc(o.caption||'Data table')}</caption><thead><tr>${cols.map(c=>`<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>{const a=Array.isArray(r)?{cells:r}:r;return `<tr ${a.attrs||''} class="${a.cls||''}">${a.cells.map(c=>`<td>${c}</td>`).join('')}</tr>`}).join('')}</tbody></table></div>`,
  input:(label,o={})=>`<label class="field ${o.error?'err':''}"><span>${label}</span><input ${o.bind?`data-bind="${o.bind}"`:''} type="${o.type||'text'}" value="${esc(o.value??'')}" placeholder="${esc(o.ph||'')}" ${o.req?'required':''} ${o.dis?'disabled':''} ${o.write?'data-write':''}>${o.hint?`<small>${o.hint}</small>`:''}${o.error?`<div class="errmsg" role="alert">${o.error}</div>`:''}</label>`,
  select:(label,o={})=>`<label class="field"><span>${label}</span><select aria-label="${esc(o.aria||label)}" ${o.bind?`data-bind="${o.bind}"`:''} ${o.write?'data-write':''}>${(o.options||[]).map(x=>{const v=Array.isArray(x)?x[0]:x,l=Array.isArray(x)?x[1]:x;return `<option value="${esc(v)}" ${String(o.value)===String(v)?'selected':''}>${esc(l)}</option>`}).join('')}</select>${o.hint?`<small>${o.hint}</small>`:''}</label>`,
  textarea:(label,o={})=>`<label class="field"><span>${label}</span><textarea ${o.bind?`data-bind="${o.bind}"`:''} ${o.write?'data-write':''} placeholder="${esc(o.ph||'')}">${esc(o.value??'')}</textarea>${o.hint?`<small>${o.hint}</small>`:''}</label>`,
  tabs:(key,cur,items)=>`<div class="tabs" role="tablist">${items.map(([v,l])=>`<button type="button" role="tab" class="tab" aria-selected="${cur===v}" data-set="${key}=${v}">${l}</button>`).join('')}</div>`,
  steps:(labels,idx)=>`<ol class="steps" style="list-style:none;padding:0;margin:0 0 16px">${labels.map((l,i)=>`<li class="step ${i===idx?'on':''} ${i<idx?'done':''}" ${i===idx?'aria-current="step"':''}><i>${i<idx?'✓':i+1}</i>${l}</li>`).join('')}</ol>`,
  kv:(pairs)=>`<dl class="kv">${pairs.map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`,
  list:(items)=>`<ul class="list">${items.map(i=>`<li>${i.lead||''}<div class="grow"><div>${i.title||''}</div>${i.sub?`<small class="muted">${i.sub}</small>`:''}</div>${i.right||''}</li>`).join('')}</ul>`,
  notice:(tone,title,text)=>`<div class="notice ${tone}" ${tone==='bad'?'role="alert"':'role="status"'}><div>${title?`<b>${title}</b>`:''}${text||''}</div></div>`,
  progress:(pct,tone='')=>`<div class="progress ${tone}" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>`,
  bars:(vals,label='Trend')=>{const m=Math.max(...vals,1);return `<div class="bars" role="img" aria-label="${esc(label)}: ${vals.join(', ')}">${vals.map(v=>`<i style="height:${Math.max(4,v/m*100)}%"></i>`).join('')}</div>`},
  switch:(label,key,on,o={})=>`<label class="switch"><input type="checkbox" data-toggle="${key}" ${on?'checked':''} ${o.write===false?'':'data-write'}><span class="tr"></span><span>${label}</span></label>`,
  timeline:(items)=>`<ol class="timeline">${items.map(i=>`<li class="${i.tone||''}"><div><b>${i.title}</b></div>${i.sub?`<small class="muted">${i.sub}</small>`:''}</li>`).join('')}</ol>`,
  avatar:(t,agent)=>`<span class="avatar ${agent?'agent':''}" aria-hidden="true">${esc(t)}</span>`,
  drawer:(title,body,closeKey)=>`<aside class="drawer" role="dialog" aria-modal="false" aria-label="${esc(title)}"><div class="toolbar"><h2 class="grow">${title}</h2><button class="btn sm" type="button" data-set="${closeKey}=">Close</button></div>${body}</aside>`,
  empty:(title,text,action='')=>`<div class="empty"><h3>${title}</h3><p>${text}</p>${action?`<div style="margin-top:14px">${action}</div>`:''}</div>`,
  diff:(lines)=>`<div class="diff" role="group" aria-label="Code diff">${lines.map(l=>`<div class="${l[0]==='+'?'a':l[0]==='-'?'r':l[0]==='@'?'h':''}">${esc(l)}</div>`).join('')}</div>`,
  chips:(arr,tone='')=>`<span class="chips">${arr.map(x=>`<span class="badge ${tone}">${x}</span>`).join('')}</span>`,
  risk:(r)=>`<span class="risk-${r==='High'?'high':r==='Medium'?'med':'low'}">● ${r}</span>`
};

/* ---------- shell ---------- */
const SCENARIOS=[['normal','Normal'],['loading','Loading'],['empty','Empty'],['error','Request error'],['denied','Permission denied'],['offline','Offline'],['unknown','Outcome unknown'],['stale','Stale data']];
let cfg,cur,scenario='normal',store={},shared={},simLog=[],lastFocus=null;
const $=s=>document.querySelector(s);

function applyTheme(t){document.documentElement.setAttribute('data-theme',t);safe.set('af-theme',t)}
function initTheme(){const s=safe.get('af-theme');applyTheme(s||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'))}

function mount(config){
  cfg=config;initTheme();
  const root=document.getElementById('root');
  root.innerHTML=`<a class="skip" href="#main">Skip to main content</a>
  <div class="app" id="app">
    <nav class="rail" id="rail" aria-label="${esc(cfg.surfaceLabel)} navigation"></nav>
    <div class="main">
      <div class="banner-proto" role="note"><b>Design prototype</b> · simulated data · no network or real actions · screens are proposals, not approved designs</div>
      <header class="topbar">
        <button class="btn sm menu-btn" type="button" id="menu" aria-label="Open navigation">☰ Menu</button>
        <div class="crumb" id="crumb"></div>
        <div class="proto-bar">
          <label for="scn">Scenario</label>
          <select id="scn" aria-label="Simulated scenario">${SCENARIOS.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select>
          <button class="btn sm" type="button" id="spec">Screen spec</button>
          <button class="btn sm" type="button" id="pal" aria-label="Jump to screen (Ctrl+K)">Jump <kbd>Ctrl K</kbd></button>
          <button class="btn sm" type="button" id="theme">Theme</button>
          <button class="btn sm" type="button" id="reset">Reset demo</button>
        </div>
      </header>
      <div id="statusline" class="sr-only" role="status" aria-live="polite"></div>
      <main class="content" id="main" tabindex="-1"></main>
    </div>
  </div>
  <div class="toasts" id="toasts" aria-live="polite"></div><div id="overlay"></div>`;
  renderRail();
  $('#scn').addEventListener('change',e=>{scenario=e.target.value;render()});
  $('#theme').onclick=()=>applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');
  $('#reset').onclick=()=>{store={};shared={};simLog=[];scenario='normal';$('#scn').value='normal';render();toast('Demo state reset')};
  $('#spec').onclick=()=>openSpec();
  $('#pal').onclick=()=>openPalette();
  $('#menu').onclick=()=>$('#rail').classList.toggle('open');
  document.addEventListener('click',onClick);
  document.addEventListener('input',onInput);
  document.addEventListener('change',onChange);
  document.addEventListener('keydown',onKey);
  addEventListener('hashchange',route);
  route();
}

function renderRail(){
  const items=cfg.nav.map(g=>`<div class="navgroup">${esc(g.group)}</div>`+g.items.map(([id,label,ic,cnt])=>`<button class="navbtn" type="button" data-go="${id}" data-nav="${id}">${ic?`<span class="ic" aria-hidden="true">${ic}</span>`:''}<span>${esc(label)}</span>${cnt?`<span class="cnt">${cnt}</span>`:''}</button>`).join('')).join('');
  $('#rail').innerHTML=`<div class="brand"><span class="mark" aria-hidden="true">◆</span>Agents Foundry</div><div class="surface-chip">${esc(cfg.surfaceLabel)}</div>${cfg.tenant?`<div class="tenant"><b>${esc(cfg.tenant.name)}</b>${esc(cfg.tenant.sub||'')}</div>`:''}${items}<div class="railfoot">${esc(cfg.user||'Simulated user')}<br>Prototype · no real data</div>`;
}

function route(){
  const id=decodeURIComponent((location.hash||'').replace(/^#\/?/,''));
  cur=cfg.screens[id]?id:cfg.home;
  render(true);
}
function go(id){if(location.hash==='#/'+id)render(true);else location.hash='#/'+id}

function makeCtx(){
  const sc=cfg.screens[cur];
  if(!store[cur])store[cur]=JSON.parse(JSON.stringify(sc.state||{}));
  return{id:cur,s:store[cur],shared,scenario,go,rerender:()=>render(),toast,sim,ui,esc,screens:cfg.screens,set:(k,v)=>{store[cur][k]=v}};
}

function scenarioBody(sc,ctx){
  const w=sc.title;
  switch(scenario){
    case'loading':return `<div class="card" aria-busy="true" role="status"><div class="skel" style="width:40%"></div><div class="skel"></div><div class="skel" style="width:85%"></div><div class="skel" style="width:70%"></div><p class="muted">Loading simulated data… no request is sent.</p></div>`;
    case'empty':if(sc.noEmpty)break;return ui.card('',ui.empty(sc.emptyTitle||`No ${esc(w.toLowerCase())} yet`,sc.emptyText||'Nothing to show for this screen in the simulated empty state. Explain what appears here and the first action to take.',sc.emptyAction||''));
    case'error':return ui.notice('bad','Request failed',`The simulated request for “${esc(w)}” did not complete. No data was changed. ${ui.btn('Retry','sm','data-retry')}`)+ui.card('',`<p class="muted">Support reference <code>SIM-${esc(cur)}-0000</code> is illustrative. Error details never include secrets or tenant content.</p>`);
    case'denied':return ui.card('',`<div class="empty"><h3>You don’t have access to this screen</h3><p>Required permission: <code>${esc(sc.permission||'resource.view')}</code>. A visible navigation item is not proof of authorization; the server decides. Your role: <b>${esc(cfg.roleName||'Standard user')}</b>.</p><div style="margin-top:14px">${ui.btn('Request access (simulated)','primary','data-sim="Access request sent to your administrator" data-title="Request access"')} ${ui.btn('Back','', 'data-back')}</div></div>`);
    default:break;
  }
  let pre='';
  if(scenario==='offline')pre=ui.notice('warn','Offline — read-only','You are viewing cached, bounded data. Changes are disabled until you reconnect and re-authorize. Nothing was sent.');
  if(scenario==='unknown')pre=ui.notice('bad','Outcome unknown','A previous change may or may not have applied. Do not retry. Reconcile the result first; actions that change data are disabled.');
  if(scenario==='stale')pre=ui.notice('warn','Showing stale data','Last updated 14 minutes ago. Refresh before making decisions; privileged actions will re-check policy.');
  return pre+sc.render(ctx);
}

function render(nav){
  const sc=cfg.screens[cur];const ctx=makeCtx();
  const active=document.activeElement;
  const bindKey=active&&active.dataset&&active.dataset.bind;
  const selStart=bindKey&&active.selectionStart,selEnd=bindKey&&active.selectionEnd;
  $('#app').classList.toggle('bare',!!sc.bare);
  document.querySelectorAll('[data-nav]').forEach(b=>{if(b.dataset.nav===(sc.navId||cur))b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  document.title=`${sc.title} · ${cfg.surfaceLabel} · Agents Foundry prototype`;
  $('#crumb').textContent=`${cfg.surfaceLabel} / ${sc.group||''}${sc.group?' / ':''}${sc.title}`;
  $('#rail').style.display=sc.bare?'none':'';
  let body;
  try{body=scenarioBody(sc,ctx)}catch(e){body=ui.notice('bad','This prototype screen failed to render',esc(e.message))}
  const head=sc.bare&&scenario==='normal'?'':`<div class="pagehead"><div><div class="sid">${esc(cur)}${sc.group?' · '+esc(sc.group):''}</div><h1 id="h1" tabindex="-1">${esc(sc.title)}</h1>${sc.lead?`<p class="lead">${sc.lead}</p>`:''}</div><div class="actions">${scenario==='normal'||scenario==='stale'||scenario==='offline'||scenario==='unknown'?(sc.actions?sc.actions(ctx):''):''}</div></div>`;
  const main=$('#main');main.innerHTML=head+body;
  if(['offline','unknown'].includes(scenario))main.querySelectorAll('[data-write]').forEach(el=>{el.disabled=true;el.title='Unavailable in this scenario: changes are blocked (fail-closed)'});
  if(sc.init&&['normal','stale','offline','unknown'].includes(scenario)){try{sc.init(main,ctx)}catch(e){}}
  $('#rail').classList.remove('open');
  if(nav){const h=$('#h1')||main;h.focus({preventScroll:true});scrollTo(0,0);$('#statusline').textContent=`${sc.title} screen loaded`}
  else if(bindKey){const el=main.querySelector(`[data-bind="${bindKey}"]`);if(el){el.focus();try{el.setSelectionRange(selStart,selEnd)}catch(e){}}}
  $('#scn').value=scenario;
  renderRailBadges();
}
function renderRailBadges(){}

/* ---------- events ---------- */
function parseVal(v){return v==='true'?true:v==='false'?false:v}
function put(key,val){if(key[0]==='$'){const parts=key.slice(1).split('.');let o=shared;for(let i=0;i<parts.length-1;i++){o=o[parts[i]]=o[parts[i]]||{}}o[parts[parts.length-1]]=val}else store[cur][key]=val}
function onClick(e){
  const t=e.target.closest('[data-go],[data-set],[data-sim],[data-retry],[data-back],[data-act]');
  if(!t||t.disabled)return;
  if(t.hasAttribute('data-act')){const [n,...r]=t.dataset.act.split(':');const sc=cfg.screens[cur];if(sc.act)sc.act(n,r.join(':').split(','),makeCtx());render();return}
  if(t.hasAttribute('data-go')){e.preventDefault();go(t.dataset.go);return}
  if(t.hasAttribute('data-set')){const [k,...r]=t.dataset.set.split('=');put(k,parseVal(r.join('=')));render();return}
  if(t.hasAttribute('data-sim')){sim({title:t.dataset.title||'Simulated action',message:t.dataset.sim,risk:t.dataset.risk,confirmText:t.dataset.confirm,after:t.dataset.after});return}
  if(t.hasAttribute('data-retry')){scenario='normal';render();return}
  if(t.hasAttribute('data-back')){history.back();return}
}
function onInput(e){const t=e.target;if(t.dataset&&t.dataset.bind&&t.type!=='checkbox'&&t.tagName!=='SELECT'){put(t.dataset.bind,t.value);render()}}
function onChange(e){const t=e.target;
  if(t.dataset&&t.dataset.bind&&t.tagName==='SELECT'){put(t.dataset.bind,t.value);render()}
  else if(t.dataset&&t.dataset.bind&&t.type==='checkbox'){put(t.dataset.bind,t.checked);render()}
  else if(t.dataset&&t.dataset.toggle){put(t.dataset.toggle,t.checked);render()}}
function onKey(e){
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openPalette();return}
  if(e.key==='Escape'){if($('#overlay').innerHTML){closeOverlay();return}if(store[cur]&&(store[cur].open||store[cur].drawer)){store[cur].open='';store[cur].drawer='';render()}}
}

/* ---------- overlays ---------- */
function closeOverlay(){$('#overlay').innerHTML='';if(lastFocus&&lastFocus.focus)lastFocus.focus()}
function trap(box){box.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const f=[...box.querySelectorAll('button,input,select,textarea,a[href]')].filter(x=>!x.disabled);if(!f.length)return;const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}})}
function sim(o){
  lastFocus=document.activeElement;
  const need=o.confirmText;
  $('#overlay').innerHTML=`<div class="overlay" role="presentation"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="mt"><h2 id="mt">${esc(o.title||'Simulated action')}</h2><p>${esc(o.message||'')}</p>
  ${o.risk?`<div class="notice bad" style="margin-top:12px"><div><b>High-risk action</b>${esc(o.risk)}</div></div>`:''}
  ${need?`<label class="field" style="margin-top:12px"><span>Type <code>${esc(need)}</code> to confirm</span><input id="cf" autocomplete="off"></label>`:''}
  <p class="muted" style="margin-top:10px"><small>Simulation only: no policy is evaluated, nothing is saved, no external request is made.</small></p>
  <div class="btnrow"><button class="btn" type="button" id="mc">Cancel</button><button class="btn ${o.risk?'danger':'primary'}" type="button" id="mo" ${need?'disabled':''}>Confirm (simulated)</button></div></div></div>`;
  const box=$('#overlay .modal');trap(box);
  const ok=$('#mo');$('#mc').onclick=closeOverlay;
  if(need)$('#cf').addEventListener('input',e=>{ok.disabled=e.target.value!==need});
  ok.onclick=()=>{simLog.push({t:new Date().toLocaleTimeString(),title:o.title,msg:o.message});closeOverlay();toast(`Simulated: ${o.message||o.title}. No real action occurred.`);if(o.after){put(o.after.split('=')[0],parseVal(o.after.split('=').slice(1).join('=')||''));render()}};
  (need?$('#cf'):ok).focus();
}
function toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;$('#toasts').append(t);setTimeout(()=>t.remove(),4500)}
function openSpec(){
  lastFocus=document.activeElement;const sc=cfg.screens[cur];const sp=sc.spec||{};
  $('#overlay').innerHTML=`<aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="st"><div class="toolbar"><h2 class="grow" id="st">Screen spec · ${esc(cur)}</h2><button class="btn sm" type="button" id="sx">Close</button></div>
  ${ui.notice('info','Status: proposed','This screen is a design proposal. It has not been reviewed or approved, and the prototype does not enforce any policy.')}
  ${ui.kv([['Screen',esc(sc.title)],['Persona',esc(sp.persona||cfg.persona||'')],['Goal',esc(sp.goal||sc.lead||'')],['Permission',`<code>${esc(sc.permission||'resource.view')}</code>`],['States',esc((sp.states||['normal','loading','empty','error','denied','offline','unknown','stale']).join(', '))],['Security',esc(sp.security||'Authorization is enforced server-side in production; UI visibility is not authorization. Privileged actions require fresh authorization and are audited.')],['Accessibility',esc(sp.a11y||'Keyboard operable; visible focus; labels for every control; status announced via live region; no information by color alone.')],['Acceptance',esc(sp.accept||'To be defined by the product owner; this prototype is not acceptance evidence.')]])}
  <h3 style="margin:16px 0 6px">Simulated actions this session</h3>${simLog.length?ui.list(simLog.slice(-8).reverse().map(l=>({title:esc(l.title),sub:esc(l.t+' · '+l.msg)}))):'<p class="muted">None yet.</p>'}
  </aside>`;
  trap($('#overlay .drawer'));$('#sx').onclick=closeOverlay;$('#sx').focus();
}
function openPalette(){
  lastFocus=document.activeElement;
  const all=Object.entries(cfg.screens).map(([id,s])=>({id,title:s.title,group:s.group||''}));
  $('#overlay').innerHTML=`<div class="overlay" style="align-items:start"><div class="modal palette" role="dialog" aria-modal="true" aria-label="Jump to screen"><input id="pq" placeholder="Jump to a screen by ID or name…" aria-label="Search screens" autocomplete="off"><ul id="pl" role="listbox"></ul></div></div>`;
  const box=$('#overlay .modal');trap(box);let idx=0,cur2=[];
  const draw=()=>{const q=$('#pq').value.toLowerCase();cur2=all.filter(x=>(x.id+' '+x.title+' '+x.group).toLowerCase().includes(q)).slice(0,60);idx=Math.min(idx,Math.max(0,cur2.length-1));$('#pl').innerHTML=cur2.map((x,i)=>`<li><button type="button" role="option" class="${i===idx?'act':''}" data-pid="${x.id}"><span class="sid">${x.id}</span><span>${esc(x.title)}</span><span class="muted" style="margin-left:auto">${esc(x.group)}</span></button></li>`).join('')||'<li class="muted" style="padding:8px">No matching screens</li>'};
  const pick=id=>{closeOverlay();go(id)};
  $('#pq').addEventListener('input',()=>{idx=0;draw()});
  $('#pq').addEventListener('keydown',e=>{if(e.key==='ArrowDown'){idx=Math.min(idx+1,cur2.length-1);draw();e.preventDefault()}else if(e.key==='ArrowUp'){idx=Math.max(0,idx-1);draw();e.preventDefault()}else if(e.key==='Enter'&&cur2[idx]){pick(cur2[idx].id)}});
  $('#pl').addEventListener('click',e=>{const b=e.target.closest('[data-pid]');if(b)pick(b.dataset.pid)});
  draw();$('#pq').focus();
}

window.AF={mount,ui,esc,go,toast,sim};
})();
