/* EMP screens 3: history, environments, settings, offline recovery, onboarding, my agents */
(function(){
const S=window.SCREENS,U=AF.ui,E=AF.esc,D=window.EMP_DATA;

S['EMP-013']={title:'History & search',group:'Library',navId:'EMP-013',permission:'history.view',
  lead:'Find past threads and runs. Items past their retention class are labeled as deleted; nothing is silently missing.',
  state:{q:'',kind:'all'},emptyText:'Your history will appear here once you have worked with an agent.',
  render(c){const s=c.s;const all=[['Validate checkout regression','Run','Nova','Today','Available'],['Sanity plan for release 4.7','Run','Atlas','3 days ago','Available'],['Login flow test cases','Thread','Nova','2 weeks ago','Available'],['Header component review','Run','Lyra','5 weeks ago','Legal hold'],['Payments smoke test','Run','Nova','14 months ago','Deleted (retention)']];
    const rows=all.filter(x=>(s.kind==='all'||x[1]===s.kind)&&(x[0]+x[2]).toLowerCase().includes(s.q.toLowerCase()));
    const tone={Available:'ok','Legal hold':'warn','Deleted (retention)':''};
    return `<div class="toolbar"><div class="grow">${U.input('Search history',{bind:'q',value:s.q,ph:'Task, agent or keyword'})}</div>${U.select('Type',{bind:'kind',value:s.kind,options:[['all','All'],'Run','Thread']})}</div>
    ${U.card('',rows.length?U.table(['Item','Type','Agent','When','State',''],rows.map(x=>[`<b>${x[0]}</b>`,x[1],x[2],x[3],U.badge(x[4],tone[x[4]]),x[4]==='Deleted (retention)'?U.btn('Why?','sm','data-sim="Its retention class ended, so the content was deleted." data-title="About this item"'):`<a class="btn sm" href="#/EMP-021">Open</a>`]),{caption:'History'}):U.empty('No results','Try a different search.',U.btn('Clear','','data-set="q="')),{flush:true})}<p class="muted" style="margin-top:10px"><small>Retention classes: Ephemeral (1 day), 30 days, 365 days, Legal hold. A run's checkpoints are deleted when the run ends.</small></p>`}};

S['EMP-014']={title:'Environment manager',group:'Account',navId:'EMP-014',permission:'env.view',
  lead:'Where each agent may test. Every agent has its own QA target. Deploying to production is denied for all agents.',
  state:{},noEmpty:true,
  render(c){
    return `${U.card('QA targets per agent',U.table(['Agent','QA target','Status'],[['Nova · QA Engineer','qa-staging.codifyd.example',U.badge('Configured','ok')],['Lyra · Frontend Engineer','Not configured',U.badge('No tests allowed')],['Atlas · Release Assistant','Not configured',U.badge('No tests allowed')]],{caption:'QA targets'}),{flush:true})}
    <div style="height:16px"></div>${U.card('Production',`${U.notice('info','Deploying to production is denied','The action <code>production.deploy</code> is DENY for every agent. An administrator cannot loosen it from the organization policy.')}`)}
    <div style="height:16px"></div>${U.card('Time-boxed elevated access '+U.badge('Planned','warn'),`<p class="muted">Requesting temporary elevated access with a fresh sign-in is not part of the platform yet.</p>${U.btn('Request elevated access','primary','disabled')}`)}`}};

S['EMP-015']={title:'Settings & privacy',group:'Account',navId:'EMP-015',permission:'settings.edit',
  lead:'Appearance and notifications on this device, and what is collected.',
  state:{tab:'general',notify:true,sound:false,motion:false,size:'100'},noEmpty:true,
  render(c){const s=c.s;
    return `${U.tabs('tab',s.tab,[['general','Notifications'],['privacy','Privacy'],['access','Appearance']])}
    ${s.tab==='general'?U.card('Notifications',`<div style="display:grid;gap:12px">${U.switch('Notify me about approvals','notify',s.notify,{write:false})}${U.switch('Play a sound','sound',s.sound,{write:false})}</div>`):''}
    ${s.tab==='privacy'?U.card('What is collected',`${U.notice('info','Telemetry carries identifiers only','Usage and health telemetry contains identifiers such as run and organization ids. It does not contain the content of your conversations or files.')}<p class="muted" style="margin-top:10px">Your conversations and artifacts are kept by retention class (see History).</p>`):''}
    ${s.tab==='access'?U.card('Display',`<div style="display:grid;gap:12px">${U.switch('Reduce motion','motion',s.motion,{write:false})}</div>${U.select('Text size',{bind:'size',value:s.size,options:[['100','100%'],['125','125%'],['150','150%']],hint:'Layouts reflow up to 200% zoom.'})}`):''}`}};

S['EMP-016']={title:'Run recovery',group:'Account',navId:'EMP-016',permission:'run.recover',
  lead:'What happens to a run when its runtime is lost. The server recovers it when it can. An external write with an unknown outcome is never retried.',
  state:{view:'live'},noEmpty:true,
  spec:{goal:'Show every recovery state of a run, and make clear when a person has to act.',states:['live lease','recovering from checkpoint','repeated model turn','runtime lost','recovery exhausted','abandoned','tool outcome unknown','grant expired'],security:'Recovery re-checks policy. An unknown external write goes to an administrator for reconciliation and is not retried. States follow ADR 0032; wording is proposed.'},
  render(c){const v=c.s.view;
    const msg={live:['info','The runtime is working','Its lease is live. Nothing to do.'],recover:['ok','Recovering from the last checkpoint','The lease expired and a checkpoint exists, so the server recovers the run within 10 minutes. You do not need to do anything.'],repeat:['warn','A model turn is repeated','The turn that was running when the runtime was lost runs again, so its tokens are spent twice.'],lost:['bad','Runtime lost (RUNTIME_LOST)','The lease expired and there is no checkpoint, so the run cannot continue. Artifacts are kept. Start a new run.'],exhausted:['bad','Recovery exhausted (RUNTIME_RECOVERY_EXHAUSTED)','The run was recovered three times and failed each time. Start a new run.'],abandoned:['warn','Run abandoned','The run made no progress for 24 hours and was ended as abandoned.'],unknown:['bad','Tool outcome unknown (TOOL_OUTCOME_UNKNOWN)','An external write was in flight when the runtime was lost, so it may or may not have happened. It is not retried. Ask an administrator to reconcile.'],grant:['warn','Grant expired (GRANT_EXPIRED)','The short-lived access the run held has expired, so the run cannot act. Start a new run.']}[v];
    const newRun=['lost','exhausted','abandoned','grant'].includes(v);
    return `${U.tabs('view',v,[['live','Live'],['recover','Recovering'],['repeat','Repeated turn'],['lost','Lost'],['exhausted','Exhausted'],['abandoned','Abandoned'],['unknown','Unknown outcome'],['grant','Grant expired']])}${U.notice(msg[0],msg[1],msg[2])}
    <div class="split-eq">${U.card('Run 2291',U.timeline([{tone:'ok',title:'Checkpoint 12:04',sub:'Saved by the server'},{tone:v==='unknown'?'bad':v==='live'?'run':'wait',title:'Create Jira Bug in QA',sub:v==='unknown'?'Outcome unknown · not retried':'Not confirmed'},{title:'Report',sub:'Not started'}]))}
    ${U.card('Actions',`<div style="display:grid;gap:8px">${newRun?U.btn('Start a new run','primary','data-go="EMP-019"'):''}${v==='unknown'?U.btn('Ask an administrator to reconcile','primary','data-write data-sim="An administrator checks Jira and records the outcome; the request is not retried" data-title="Ask for reconciliation"'):''}${!newRun&&v!=='unknown'?'<p class="muted">No action needed.</p>':''}</div>`)}</div>`}};

S['EMP-017']={title:'Welcome',group:'Access',navId:'EMP-017',permission:'app.access',
  lead:'A two-minute tour of how work with AI colleagues is kept safe.',
  state:{step:0},noEmpty:true,
  render(c){const s=c.s;const pages=[['Meet your agents','AI colleagues assigned by your administrator. They plan and do work, you stay in charge.'],['Approvals keep you in control','Reading is easy. Anything that changes another system asks first, once, for exactly that request. Some requests are yours to decide; High risk requests go to an administrator.'],['Evidence and limits','Test evidence is kept by retention class and then deleted. Runs have limits, such as the number of model turns. When a limit is reached the run stops and says so.'],['You’re ready','Start with a small task and watch the plan before approving anything.']];const p=pages[s.step];
    return `${U.steps(['Agents','Approvals','Evidence','Start'],s.step)}${U.card(p[0],`<p style="font-size:16px;max-width:60ch;margin-bottom:16px">${p[1]}</p><div class="actions">${s.step>0?U.btn('Back','','data-set="step='+(s.step-1)+'"'):''}${s.step<3?U.btn('Next','primary','data-set="step='+(s.step+1)+'"'):U.btn('Open my workspace','primary','data-go="EMP-002"')}${U.btn('Skip','ghost','data-go="EMP-002"')}</div>`)}`}};

S['EMP-018']={title:'My agents',group:'Agents',navId:'EMP-018',permission:'agents.view',
  lead:'AI colleagues assigned to you. Their abilities come from a signed manifest set by your administrator and cannot be widened here.',
  state:{sel:'nova'},emptyTitle:'No agents assigned',emptyText:'Ask your administrator to assign an AI employee to you.',
  render(c){const s=c.s;const a=D.agents.find(x=>x.id===s.sel)||D.agents[0];
    return `<div class="split"><div class="grid g2">${D.agents.map(x=>`<button type="button" class="tplcard" aria-pressed="${s.sel===x.id}" data-set="sel=${x.id}"><div class="toolbar" style="margin:0">${U.avatar(x.name[0],true)}<b class="grow">${x.name}</b>${U.badge(x.status,x.status==='Working'?'info':x.status==='Idle'?'':'warn')}</div><p class="muted" style="margin-top:8px">${x.role}</p></button>`).join('')}</div>
    <aside class="sidepanel">${U.card(a.name,`${U.kv([['Doing',a.task],['Manifest',U.badge('Signature verified','ok')],['Tools',U.chips(a.tools)],['Writes','Follow the policy outcome: some ask you, some ask an administrator'],['Accountable','Dana Kim']])}<div class="actions" style="margin-top:12px">${U.btn('Start a task','primary','data-go="EMP-019"')}${U.btn('Open conversation','','data-go="EMP-003"')}${U.btn('Request another agent','','data-write data-sim="Request sent to your administrator" data-title="Request an agent"')}</div>`)}</aside></div>`}};
})();
