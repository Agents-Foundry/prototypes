/* EMP screens 3: history, environments, settings, offline recovery, onboarding, my agents */
(function(){
const S=window.SCREENS,U=AF.ui,E=AF.esc,D=window.EMP_DATA;

S['EMP-013']={title:'History & search',group:'Library',navId:'EMP-013',permission:'history.view',
  lead:'Find past conversations, runs and artifacts. Items past retention or under redaction are labeled; nothing is silently missing.',
  state:{q:'',kind:'all'},emptyText:'Your history will appear here once you have worked with an agent.',
  render(c){const s=c.s;const all=[['Validate checkout regression','Run','Nova','Today','Available'],['Sanity plan for release 4.7','Run','Atlas','3 days ago','Available'],['Login flow test cases','Conversation','Nova','2 weeks ago','Redacted'],['Header component review','Run','Lyra','5 weeks ago','Available'],['Payments smoke test','Run','Nova','4 months ago','Expired (retention)']];
    const rows=all.filter(x=>(s.kind==='all'||x[1]===s.kind)&&(x[0]+x[2]).toLowerCase().includes(s.q.toLowerCase()));
    const tone={Available:'ok',Redacted:'warn','Expired (retention)':''};
    return `<div class="toolbar"><div class="grow">${U.input('Search history',{bind:'q',value:s.q,ph:'Task, agent or keyword'})}</div>${U.select('Type',{bind:'kind',value:s.kind,options:[['all','All'],'Run','Conversation']})}</div>
    ${U.card('',rows.length?U.table(['Item','Type','Agent','When','State',''],rows.map(x=>[`<b>${x[0]}</b>`,x[1],x[2],x[3],U.badge(x[4],tone[x[4]]),x[4]==='Available'?`<a class="btn sm" href="#/EMP-021">Open</a>`:U.btn('Why?','sm','data-sim="'+(x[4]==='Redacted'?'Sensitive content was removed by policy.':'Retention ended after 90 days; deleted unless a legal hold applies.')+'" data-title="About this item"')]),{caption:'History'}):U.empty('No results','Try a different search.',U.btn('Clear','','data-set="q="')),{flush:true})}<p class="muted" style="margin-top:10px"><small>Retention: conversations 90 days, artifacts 1 year (set by your organization).</small></p>`}};

S['EMP-014']={title:'Environment manager',group:'Account',navId:'EMP-014',permission:'env.view',
  lead:'Where agents may act on your behalf. Production is read-only unless an administrator grants time-boxed elevation with a fresh sign-in.',
  state:{elev:false},noEmpty:true,
  render(c){const s=c.s;
    const envs=[['Development','Ready','ok','Read and write with approvals'],['Staging','Ready','ok','Read and write with approvals'],['Production',s.elev?'Elevated (14 min left)':'Read-only',s.elev?'warn':'info','Reads only; writes blocked']];
    return `<div class="grid g3">${envs.map(([n,st,t,d])=>U.card(n,`<p class="muted" style="margin-bottom:10px">${d}</p>${U.badge(st,t)}`)).join('')}</div>
    <div style="height:16px"></div>${U.card('Production access',`${s.elev?U.notice('warn','Elevated access is active','Expires automatically. Every action is audited and still asks first.')+U.btn('End elevation now','','data-set="elev=false"'):`<p class="muted" style="margin-bottom:12px">Request time-boxed elevated access to run a specific production task. Your administrator approves, and you re-authenticate.</p>${U.btn('Request elevated access','primary','data-write data-sim="Step-up sign-in required, then admin approval. Not granted automatically." data-title="Request elevation" data-risk="Elevated sessions can touch production systems." data-confirm="elevate" data-after="elev=true"')}`}`)}
    <div style="height:16px"></div>${U.card('Approved targets',U.table(['Origin','Environment','Status'],[['staging.codifyd.example','Staging',U.badge('Approved','ok')],['dev.codifyd.example','Development',U.badge('Approved','ok')],['shop.codifyd.example','Production',U.badge('Read-only')]]),{flush:true})}`}};

S['EMP-015']={title:'Settings & privacy',group:'Account',navId:'EMP-015',permission:'settings.edit',
  lead:'Appearance, notifications and what is stored on this device. Some options are locked by your organization.',
  state:{tab:'general',notify:true,sound:false,motion:false,telemetry:false,cache:true,size:'100'},noEmpty:true,
  render(c){const s=c.s;
    return `${U.tabs('tab',s.tab,[['general','General'],['privacy','Privacy'],['access','Accessibility']])}
    ${s.tab==='general'?U.card('Notifications',`<div style="display:grid;gap:12px">${U.switch('Notify me about approvals','notify',s.notify,{write:false})}${U.switch('Play a sound','sound',s.sound,{write:false})}</div>`):''}
    ${s.tab==='privacy'?U.card('Your data',`<div style="display:grid;gap:12px">${U.switch('Send anonymous usage diagnostics','telemetry',s.telemetry,{write:false})}${U.switch('Keep an encrypted offline cache (read-only, max 24 h)','cache',s.cache,{write:false})}</div>${U.notice('info','Locked by Codifyd','Your conversations are visible to you and, for audits, to compliance reviewers. This cannot be changed here.')}<div class="actions">${U.btn('Clear local cache','','data-sim="Delete the encrypted cache on this device" data-title="Clear cache"')}</div>`):''}
    ${s.tab==='access'?U.card('Display',`<div style="display:grid;gap:12px">${U.switch('Reduce motion','motion',s.motion,{write:false})}</div>${U.select('Text size',{bind:'size',value:s.size,options:[['100','100%'],['125','125%'],['150','150%']],hint:'Layouts reflow up to 200% zoom.'})}`):''}`}};

S['EMP-016']={title:'Recovery & offline workspace',group:'Account',navId:'EMP-016',permission:'run.recover',
  lead:'What happens when you lose connection or a device conflicts. Reads may continue briefly; anything that changes outside systems waits.',
  state:{view:'offline'},noEmpty:true,
  spec:{goal:'Safe resume after interruption without duplicate or unauthorized effects.',states:['offline','recoverable','stale','conflict','unrecoverable'],security:'Offline authorization lasts at most 24 hours, read-only. Uncertain outcomes are reconciled before any retry; policy is re-checked on resume.'},
  render(c){const v=c.s.view;
    const msg={offline:['warn','You are offline','Showing your encrypted cache (read-only). Pending write to QA-184 is <b>not confirmed</b>. Nothing will be retried until you reconnect.'],recoverable:['ok','Reconnected','Run 2291 can resume from the 12:04 checkpoint after you re-authorize. The earlier approval is no longer valid.'],stale:['warn','Cached data is stale','Last synced 22 hours ago. Offline access ends in 2 hours; then the cache is denied until you sign in online.'],conflict:['bad','Two devices changed this run','Your laptop and desktop saved different checkpoints. Pick which to keep; the other is archived, not overwritten.'],unrecoverable:['bad','This run cannot be resumed','Its environment was removed. Artifacts are preserved; start a new run.']}[v];
    return `${U.tabs('view',v,[['offline','Offline'],['recoverable','Recoverable'],['stale','Stale cache'],['conflict','Conflict'],['unrecoverable','Unrecoverable']])}${U.notice(msg[0],msg[1],msg[2])}
    <div class="split-eq">${U.card('Run 2291',U.timeline([{tone:'ok',title:'Checkpoint 12:04',sub:'Saved on this device and in your account'},{tone:v==='conflict'?'bad':'wait',title:'Attach to QA-184',sub:'Outcome unknown · no retry'},{title:'Browser tests',sub:'Not started'}]))}
    ${U.card('Actions',`<div style="display:grid;gap:8px">${v==='recoverable'?U.btn('Re-authorize and resume','primary','data-write data-sim="Fresh authorization required; policy re-checked before anything runs" data-title="Resume run"'):''}${v==='offline'||v==='stale'?U.btn('Reconnect','primary','data-set="view=recoverable"'):''}${v==='conflict'?U.btn('Keep laptop version','primary','data-write data-sim="Keep laptop checkpoint; archive the other" data-title="Resolve conflict"')+U.btn('Keep desktop version','','data-write data-sim="Keep desktop checkpoint; archive the other" data-title="Resolve conflict"'):''}${v==='unrecoverable'?U.btn('Start a new run','primary','data-go="EMP-019"'):''}${U.btn('Check what is confirmed','','data-sim="Query Jira for a receipt (requires connection)" data-title="Reconcile"')}</div>`)}</div>`}};

S['EMP-017']={title:'Welcome',group:'Access',navId:'EMP-017',permission:'app.access',
  lead:'A two-minute tour of how work with AI colleagues is kept safe.',
  state:{step:0},noEmpty:true,
  render(c){const s=c.s;const pages=[['Meet your agents','AI colleagues assigned by your administrator. They plan and do work, you stay in charge.'],['Approvals keep you in control','Reading is easy. Anything that changes another system asks you first, once, for exactly that action.'],['Your privacy','Secrets never appear in chats or files. You can review and delete what agents remember about you.'],['You’re ready','Start with a small task and watch the plan before approving anything.']];const p=pages[s.step];
    return `${U.steps(['Agents','Approvals','Privacy','Start'],s.step)}${U.card(p[0],`<p style="font-size:16px;max-width:60ch;margin-bottom:16px">${p[1]}</p><div class="actions">${s.step>0?U.btn('Back','','data-set="step='+(s.step-1)+'"'):''}${s.step<3?U.btn('Next','primary','data-set="step='+(s.step+1)+'"'):U.btn('Open my workspace','primary','data-go="EMP-002"')}${U.btn('Skip','ghost','data-go="EMP-002"')}</div>`)}`}};

S['EMP-018']={title:'My agents',group:'Agents',navId:'EMP-018',permission:'agents.view',
  lead:'AI colleagues assigned to you. Their abilities are set by your administrator and cannot be widened here.',
  state:{sel:'nova'},emptyTitle:'No agents assigned',emptyText:'Ask your administrator to assign an AI employee to you.',
  render(c){const s=c.s;const a=D.agents.find(x=>x.id===s.sel)||D.agents[0];
    return `<div class="split"><div class="grid g2">${D.agents.map(x=>`<button type="button" class="tplcard" aria-pressed="${s.sel===x.id}" data-set="sel=${x.id}"><div class="toolbar" style="margin:0">${U.avatar(x.name[0],true)}<b class="grow">${x.name}</b>${U.badge(x.status,x.status==='Working'?'info':x.status==='Idle'?'':'warn')}</div><p class="muted" style="margin-top:8px">${x.role}</p></button>`).join('')}</div>
    <aside class="sidepanel">${U.card(a.name,`${U.kv([['Doing',a.task],['Tools',U.chips(a.tools)],['Can write?','Only after you approve each action'],['Accountable','Dana Kim']])}<div class="actions" style="margin-top:12px">${U.btn('Start a task','primary','data-go="EMP-019"')}${U.btn('Open conversation','','data-go="EMP-003"')}</div>`)}</aside></div>`}};
})();
