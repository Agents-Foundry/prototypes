/* ORG screens 4: employee detail, usage, access review, audit, data & privacy, plan, emergency controls */
(function(){
const S=window.SCREENS,U=AF.ui,E=AF.esc,D=window.ORG_DATA;

S['ORG-021']={title:'AI employee · QA Engineer · Nova',group:'Workforce',navId:'ORG-007',permission:'agents.view',
  lead:'Blueprint QA Engineer v2.0.3 · Quality Assurance · accountable: Dana Kim.',
  state:{tab:'overview',paused:false},noEmpty:true,
  actions:c=>U.btn(c.s.paused?'Resume':'Pause','', `data-write data-sim="${c.s.paused?'Resume':'Pause'} Nova. Running tasks stop at the next safe checkpoint." data-title="${c.s.paused?'Resume':'Pause'} AI employee" data-after="paused=${!c.s.paused}"`)+U.btn('Retire','danger','data-write data-sim="Retire Nova permanently" data-title="Retire AI employee" data-risk="Credentials are revoked and memory is archived per retention policy. This cannot be undone." data-confirm="retire nova"'),
  render(c){const s=c.s;
    return `${s.paused?U.notice('warn','Paused','Nova accepts no new work. Pending approvals are held.'):''}${U.tabs('tab',s.tab,[['overview','Overview'],['access','Permissions'],['runs','Recent runs'],['audit','Activity']])}
    ${s.tab==='overview'?`<div class="grid g4" style="margin-bottom:16px">${U.stat('Runs (30 d)','412','+9%','up')}${U.stat('Success rate','88%','−2 pts','down')}${U.stat('Approvals asked','136','median wait 2.1 min')}${U.stat('Spend (30 d)','$128','of $200 budget')}</div><div class="split-eq">${U.card('Profile',U.kv([['Status',U.badge(s.paused?'Paused':'Active',s.paused?'warn':'ok')],['Team','Quality Assurance'],['Environment','Development, Staging'],['Hired','12 Sep 2026 by Alex Rivera'],['Model','Organization provider']]))}${U.card('Health',U.list([{lead:'<span class="badge ok">✓</span>',title:'Jira connector'},{lead:'<span class="badge warn">!</span>',title:'Bitbucket needs reauthorization',sub:'Expires in 3 days'},{lead:'<span class="badge ok">✓</span>',title:'Policy in sync (v4)'}]))}</div>`:''}
    ${s.tab==='access'?U.card('Effective permissions',U.table(['Capability','Mode','Environment'],[['Read Jira, repositories','Auto','Dev, Staging'],['Browser tests','Ask once per run','Dev, Staging'],['Write to Jira','Ask each time','Staging only'],['Production writes','Blocked','—']].map(r=>[r[0],U.badge(r[1],r[1]==='Blocked'?'bad':r[1]==='Auto'?'ok':'warn'),r[2]]),{caption:'Permissions'}),{flush:true,actions:U.btn('Edit capabilities','sm','data-write data-sim="Capability edit saved to a draft for approval" data-title="Edit capabilities"')}):''}
    ${s.tab==='runs'?U.card('',U.table(['Task','Started','Outcome','Cost'],[['Validate checkout regression','12 min ago',U.badge('Waiting on approval','info'),'$0.42'],['Review login flow cases','2 h ago',U.badge('Completed','ok'),'$0.28'],['Smoke test release 4.8','Yesterday',U.badge('Failed (env down)','bad'),'$0.11']]),{flush:true}):''}
    ${s.tab==='audit'?U.card('Recent activity',U.timeline([{tone:'ok',title:'Read QA-184',sub:'12 min ago'},{tone:'wait',title:'Requested approval: attach test cases to QA-184',sub:'11 min ago · pending'},{tone:'ok',title:'Capabilities narrowed by Alex Rivera',sub:'3 days ago'}])):''}`}};

S['ORG-022']={title:'Usage & spend',group:'Insight',navId:'ORG-022',permission:'org.billing.view',
  lead:'What your AI workforce costs, by team and model. Budgets alert at 80% and stop new runs at 100%.',
  state:{range:'month',budget:'500'},emptyText:'Usage appears after your first AI employee runs a task.',
  render(c){const s=c.s;
    return `<div class="toolbar">${U.select('Period',{bind:'range',value:s.range,options:[['week','This week'],['month','This month'],['quarter','This quarter']]})}</div>
    <div class="grid g4" style="margin-bottom:16px">${U.stat('Spend','$340','68% of budget')}${U.stat('Runs','2,184','+12%','up')}${U.stat('Avg cost / run','$0.16','flat')}${U.stat('Forecast','$498','Near budget','down')}</div>
    <div class="split"><div>${U.card('Daily spend',U.bars([8,10,9,14,12,18,22,19,25,21,24,28,26,30,29,31],'Daily spend'))}<div style="height:16px"></div>${U.card('By team',U.table(['Team','Spend','Share'],[['Quality Assurance','$173','51%'],['Frontend','$77','23%'],['Operations','$68','20%'],['Product','$22','6%']].map(r=>[r[0],r[1],U.progress(parseInt(r[2]))+' '+r[2]]),{caption:'Spend by team'}),{flush:true})}</div>
    <aside>${U.card('Budget',`${U.progress(68)}<p class="muted" style="margin:8px 0 12px">$340 of $500 used.</p>${U.input('Monthly budget (USD)',{bind:'budget',value:s.budget,type:'number',write:true})}${Number(s.budget)<340?U.notice('bad','Below current spend','New runs would stop immediately. Choose an amount above $340.'):''}${U.btn('Save budget','primary','data-write data-sim="Budget updated to $'+E(s.budget)+'" data-title="Save budget"')}`)}</aside></div>`}};

S['ORG-023']={title:'Access reviews',status:'planned',group:'Governance',navId:'ORG-023',permission:'org.access.review',
  lead:'Periodically confirm that people, AI employees and grants still need what they have. Unreviewed access expires.',
  state:{dec:{}},emptyText:'No access review is open. The next review starts on 1 Jan 2027.',
  render(c){const s=c.s;const items=[['Dana Kim','Privileged: approve Jira writes','Last used 2 d ago'],['Nova (QA Engineer)','Jira write · Staging','Last used 12 min ago'],['Lee Wong','Org admin','Not used in 94 days'],['Jon Park','Bitbucket write','Never used']];
    const done=Object.keys(s.dec).length;
    return `${U.card('',`<div class="toolbar"><div class="grow"><b>Q4 review · due 31 Oct 2026</b><br><small class="muted">${done} of ${items.length} decided</small></div></div>${U.progress(done/items.length*100)}`)}<div style="height:16px"></div>${U.card('',U.table(['Subject','Access','Evidence','Decision'],items.map((r,i)=>[`<b>${r[0]}</b>`,r[1],r[2],s.dec[i]?U.badge(s.dec[i],s.dec[i]==='Keep'?'ok':'bad'):`<span class="actions">${U.btn('Keep','sm',`data-write data-act="dec:${i},Keep"`)}${U.btn('Revoke','sm danger',`data-write data-act="dec:${i},Revoke"`)}</span>`]),{caption:'Access review items'}),{flush:true})}
    ${done===items.length?U.notice('ok','Review complete (simulated)','Revocations would apply immediately and be written to the audit log.'):''}`},
  act(n,[i,v],c){if(n==='dec')c.s.dec[i]=v}};

S['ORG-024']={title:'Audit log',group:'Insight',navId:'ORG-024',permission:'org.audit.view',
  lead:'A record of who did what, to what, and when. Entries cannot be edited or deleted.',
  state:{q:'',kind:'all',open:''},emptyText:'No events match. Widen the date range or clear filters.',
  actions:()=>U.btn('Export (logged)','','data-write data-sim="Export of 90 days queued. The export itself is recorded in the audit log." data-title="Export audit log"'),
  render(c){const s=c.s;const ev=[['12:04:11','Dana Kim','Approved single-use Jira write','QA-184','Approval'],['11:58:40','Nova (AI)','Requested approval: attach test cases','QA-184','Agent'],['10:20:02','Alex Rivera','Narrowed capabilities','Nova','Config'],['09:12:55','Alex Rivera','Changed policy “Production read-only” v3→v4','Policy','Policy'],['Yesterday','Sana Iqbal','Approved Slack connector request','Slack','Connector'],['Yesterday','System','Credential renewal reminder sent','Bitbucket','System']];
    const rows=ev.filter(e=>(s.kind==='all'||e[4]===s.kind)&&(e.join(' ').toLowerCase().includes(s.q.toLowerCase())));
    return `<div class="toolbar"><div class="grow">${U.input('Search events',{bind:'q',value:s.q,ph:'Actor, action or target'})}</div>${U.select('Type',{bind:'kind',value:s.kind,options:[['all','All'],'Approval','Agent','Config','Policy','Connector','System']})}</div>
    ${U.card('',rows.length?U.table(['Time','Actor','Event','Target','Type',''],rows.map(e=>[e[0],e[1],e[2],e[3],U.badge(e[4]),U.btn('Detail','sm',`data-set="open=${e[0]}|${E(e[2])}"`)]),{caption:'Audit events'}):U.empty('No matching events','Try clearing filters.',U.btn('Clear','','data-set="q="')),{flush:true})}
    ${s.open?U.drawer('Event detail',U.kv([['Event',E(s.open.split('|')[1]||'')],['Time (UTC)','2026-10-18T'+(s.open.split('|')[0].includes(':')?s.open.split('|')[0]:'00:00:00')+'Z'],['Request ID','<code>req_8c21f0</code>'],['Source','Console · 203.0.113.x (illustrative)'],['Result','Success'],['Integrity','Hash-chained · verified']])+'<p class="muted" style="margin-top:12px"><small>Sensitive values are redacted. Illustrative record, not evidence a backend recorded anything.</small></p>','open'):''}`}};

S['ORG-025']={title:'Data & privacy',group:'Organization',navId:'ORG-025',permission:'org.data.admin',
  lead:'How long data is kept, who can export it and how it is deleted. Legal holds override deletion.',
  state:{conv:'90',art:'365',hold:false},noEmpty:true,
  render(c){const s=c.s;
    return `<div class="split-eq"><div>${U.card('Retention',`${U.select('Conversations',{bind:'conv',value:s.conv,write:true,options:[['30','30 days'],['90','90 days'],['365','1 year']]})}${U.select('Artifacts and evidence',{bind:'art',value:s.art,write:true,options:[['90','90 days'],['365','1 year'],['1095','3 years']]})}${U.notice('info','Memory','Agent memory follows conversation retention and can be reviewed and deleted by the employee.')}${U.btn('Save retention','primary','data-write data-sim="Retention updated. Deletion runs after a 7-day grace period." data-title="Save retention" data-risk="Shortening retention schedules permanent deletion of older data." data-confirm="save retention"')}`)}</div>
    <div>${U.card('Legal hold',`${U.switch('Place organization data on legal hold','hold',s.hold)}${s.hold?U.notice('warn','Deletion paused','Retention deletion is suspended for all data until the hold is lifted.'):'<p class="muted" style="margin-top:8px">No hold is active.</p>'}`)}<div style="height:16px"></div>${U.card('Export & deletion',`<p class="muted" style="margin-bottom:10px">Export all organization data or request deletion of the tenant.</p><div class="actions">${U.btn('Request data export','','data-write data-sim="Export requested; a link is sent to an admin and expires in 24 h" data-title="Data export"')}${U.btn('Delete organization…','danger','data-write data-sim="Request tenant deletion. The platform owner must confirm." data-title="Delete organization" data-risk="All data is permanently deleted after the grace period." data-confirm="delete codifyd"')}</div>`)}</div></div>`}};

S['ORG-026']={title:'Plan & settings',status:'planned',group:'Organization',navId:'ORG-026',permission:'org.billing.view',
  lead:'Your subscription, seats and notification preferences.',
  state:{tab:'plan',billing:true,digest:true,incident:true},noEmpty:true,
  render(c){const s=c.s;
    return `${U.tabs('tab',s.tab,[['plan','Plan & seats'],['notify','Notifications']])}
    ${s.tab==='plan'?`<div class="split-eq">${U.card('Growth plan',`${U.kv([['Seats','84 of 100 used'],['AI employees','6 of 10 included'],['Renews','1 Nov 2026'],['Region',D.org.region]])}<div style="margin-top:12px">${U.progress(84)}</div><div class="actions" style="margin-top:14px">${U.btn('Request more seats','primary','data-write data-sim="Request sent to your Agents Foundry account team" data-title="Request seats"')}</div>`)}${U.card('Invoices',U.table(['Period','Amount','Status'],[['Oct 2026','$1,240',U.badge('Open','info')],['Sep 2026','$1,196',U.badge('Paid','ok')],['Aug 2026','$1,101',U.badge('Paid','ok')]]),{flush:true})}</div>`:''}
    ${s.tab==='notify'?U.card('Notify me about',`<div style="display:grid;gap:12px">${U.switch('Approvals waiting for me','digest',s.digest)}${U.switch('Incidents and degraded connectors','incident',s.incident)}${U.switch('Billing and budget alerts','billing',s.billing)}</div>`):''}`}};

S['ORG-027']={title:'Emergency controls',group:'Organization',navId:'ORG-027',permission:'org.emergency',
  lead:'Stop things fast. These actions take effect immediately, are logged and need a typed confirmation.',
  state:{frozen:false},noEmpty:true,
  render(c){const s=c.s;
    return `${s.frozen?U.notice('bad','All AI employees are paused','No agent can start or continue work. Resume when it is safe.'):U.notice('info','Normal operation','Use these controls during an incident or suspected compromise.')}
    <div class="grid g3">${U.card('Pause all AI employees',`<p class="muted" style="margin-bottom:12px">Stops all runs at the next safe checkpoint and blocks new work.</p>${s.frozen?U.btn('Resume all','primary','data-write data-sim="Resume all AI employees" data-title="Resume" data-after="frozen=false"'):U.btn('Pause all','danger','data-write data-sim="Pause all AI employees" data-title="Pause all" data-risk="Work in progress halts; humans are notified." data-confirm="pause all" data-after="frozen=true"')}`)}
    ${U.card('Revoke connector access',`<p class="muted" style="margin-bottom:12px">Immediately revoke tokens for one or all connectors.</p>${U.btn('Revoke…','danger','data-write data-sim="Revoke connector tokens" data-title="Revoke connectors" data-risk="Agents lose access to external systems until reauthorized." data-confirm="revoke"')}`)}
    ${U.card('Suspend a person',`<p class="muted" style="margin-bottom:12px">End sessions and reassign pending approvals.</p>${U.btn('Choose person…','','data-go="ORG-014"')}`)}</div>`}};
})();
