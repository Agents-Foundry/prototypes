/* PLT screens 3: security posture, audit explorer, provider health, incidents, support cases, support access */
(function(){
const S=window.SCREENS,U=AF.ui,E=AF.esc,D=window.PLT_DATA;

S['PLT-013']={title:'Security posture',group:'Governance',navId:'PLT-013',permission:'security.view',
  lead:'Platform-wide MFA, SSO and policy drift. Posture findings never expose tenant secrets or content.',
  state:{tab:'findings'},emptyText:'No findings. Posture checks run every hour.',
  render(c){const s=c.s;const f=[['Operator accounts without hardware key','2 of 14','High','Open'],['Tenants without SSO enforced','31 of 121','Medium','Accepted risk'],['Policy drift: “Production read-only” weakened','Helix Systems','High','Investigating'],['Stale connector tokens (> 90 days)','4','Low','Open']];
    const tn={High:'bad',Medium:'warn',Low:''};
    return `<div class="grid g4" style="margin-bottom:16px">${U.stat('Operator MFA','100%','All staff enrolled','up')}${U.stat('Hardware keys','86%','2 pending','down')}${U.stat('Tenants with SSO','74%','+3 pts','up')}${U.stat('Policy drift','1','High severity','down')}</div>
    ${U.tabs('tab',s.tab,[['findings','Findings'],['controls','Controls']])}
    ${s.tab==='findings'?U.card('',U.table(['Finding','Scope','Severity','State',''],f.map(r=>[`<b>${r[0]}</b>`,r[1],U.badge(r[2],tn[r[2]]),r[3],U.btn('Assign','sm','data-write data-sim="Assign to security on-call" data-title="Assign finding"')]),{caption:'Findings'}),{flush:true}):''}
    ${s.tab==='controls'?U.card('Platform controls',U.list([['Operators cannot read tenant conversations','Enforced'],['Support access needs customer authorization','Enforced'],['All privileged actions are audited and hash-chained','Enforced'],['Secrets never leave the vault','Enforced']].map(([t,d])=>({lead:'<span class="badge ok">✓</span>',title:t,right:U.badge(d,'ok')})))):''}`}};

S['PLT-014']={title:'Platform audit explorer',group:'Governance',navId:'PLT-014',permission:'audit.view',
  lead:'Immutable record of operator and system events. Tenant content is redacted; exports are themselves logged.',
  state:{q:'',kind:'all',open:''},emptyText:'No events match. Widen the time range or clear filters.',
  actions:()=>U.btn('Export (logged)','','data-write data-sim="Export of 30 days queued; the export is recorded" data-title="Export audit"'),
  render(c){const s=c.s;const ev=[['12:31','Sam Okafor','Approved provisioning request','Northwind Labs','Operator'],['12:10','System','Grant expired','Support access · Codifyd','System'],['11:48','Priya Rao','Paused rollout stage 2','QA Engineer 2.1.0','Operator'],['10:02','Sam Okafor','Changed policy template v7→v8','Production read-only','Policy'],['Yesterday','System','Credential rotation completed','Anthropic key','System']];
    const rows=ev.filter(e=>(s.kind==='all'||e[4]===s.kind)&&e.join(' ').toLowerCase().includes(s.q.toLowerCase()));
    return `<div class="toolbar"><div class="grow">${U.input('Search events',{bind:'q',value:s.q})}</div>${U.select('Type',{bind:'kind',value:s.kind,options:[['all','All'],'Operator','System','Policy']})}</div>${U.card('',rows.length?U.table(['Time','Actor','Event','Target','Type',''],rows.map(e=>[e[0],e[1],e[2],e[3],U.badge(e[4]),U.btn('Detail','sm',`data-set="open=${E(e[2])}"`)]),{caption:'Audit events'}):U.empty('No matching events','Try clearing filters.',U.btn('Clear','','data-set="q="')),{flush:true})}
    ${s.open?U.drawer('Event detail',U.kv([['Event',E(s.open)],['Integrity','Hash-chained · verified'],['Request ID','<code>req_51ad0e</code>'],['Tenant content','<span class="badge">Redacted</span>'],['Retention','7 years']])+'<p class="muted" style="margin-top:10px"><small>Illustrative record. Not evidence that a backend recorded an event.</small></p>','open'):''}`}};

S['PLT-015']={title:'Provider & integration health',group:'Operations',navId:'PLT-015',permission:'health.view',
  lead:'Model providers and external platforms the service depends on, with regional detail.',
  emptyText:'No providers are configured.',
  render(c){const rows=[['Anthropic','Models','Healthy','210 ms','99.98%','ok'],['OpenAI','Models','Degraded (EU)','1.9 s','99.2%','warn'],['Jira connector','Integration','Healthy','340 ms','99.9%','ok'],['Bitbucket connector','Integration','Healthy','290 ms','99.95%','ok'],['Slack connector','Integration','Token refresh failing','—','97.1%','bad']];
    return `<div class="grid g3" style="margin-bottom:16px">${U.stat('Healthy','3 of 5','Providers')}${U.stat('Degraded','1','OpenAI EU')}${U.stat('Failing','1','Slack token refresh','down')}</div>${U.card('',U.table(['Provider','Type','State','p95 latency','30-day uptime'],rows.map(r=>[`<b>${r[0]}</b>`,r[1],U.badge(r[2],r[5]),r[3],r[4]]),{caption:'Provider health'}),{flush:true,actions:U.btn('Open incident','sm','data-go="PLT-016"')})}`}};

S['PLT-016']={title:'Incident center',group:'Overview',navId:'PLT-016',permission:'incidents.manage',
  lead:'Track and communicate operational incidents. Customer-facing updates require a second person to publish.',
  state:{sel:'INC-1027',stage:'investigating'},emptyTitle:'No open incidents',emptyText:'Incidents appear here when declared.',
  actions:()=>U.btn('Declare incident','primary','data-write data-sim="Declare a new incident and page the on-call" data-title="Declare incident"'),
  render(c){const s=c.s;const cur=D.incidents.find(i=>i[0]===s.sel)||D.incidents[0];
    const order=['investigating','identified','monitoring','resolved'];
    return `<div class="split"><div>${U.card('',U.table(['ID','Title','State','Severity','Age'],D.incidents.map(i=>({cls:i[0]===cur[0]?'sel':'',cells:[`<a href="#/PLT-016" data-set="sel=${i[0]}">${i[0]}</a>`,i[1],U.badge(i[2],i[2]==='Investigating'?'warn':'info'),i[3],i[4]]})),{caption:'Incidents'}),{flush:true})}<div style="height:16px"></div>${U.card('Timeline',U.timeline([{tone:'ok',title:'Declared by Sam Okafor',sub:'43 min ago'},{tone:'ok',title:'Paged on-call',sub:'41 min ago'},{tone:s.stage==='investigating'?'run':'ok',title:'Investigating'},{tone:order.indexOf(s.stage)>=1?(order.indexOf(s.stage)===1?'run':'ok'):'',title:'Cause identified'},{tone:order.indexOf(s.stage)>=2?(order.indexOf(s.stage)===2?'run':'ok'):'',title:'Monitoring'},{tone:s.stage==='resolved'?'ok':'',title:'Resolved'}]))}</div>
    <aside class="sidepanel">${U.card(cur[0]+' · '+cur[1],`${U.kv([['Severity',cur[3]],['Owner',cur[5]],['Affected','EU model traffic'],['Customer impact','Slower agent responses']])}${U.select('Stage',{bind:'stage',value:s.stage,write:true,options:[['investigating','Investigating'],['identified','Identified'],['monitoring','Monitoring'],['resolved','Resolved']]})}<div class="actions">${U.btn('Publish customer update','primary','data-write data-sim="Needs a second approver before publishing to the status page" data-title="Publish update"')}</div>`)}</aside></div>`}};

S['PLT-017']={title:'Support cases',group:'Operations',navId:'PLT-017',permission:'support.view',
  lead:'Help customers without default access to their data. If tenant access is needed, request it from the customer.',
  state:{open:''},emptyTitle:'No open cases',emptyText:'Customer support cases appear here.',
  render(c){const s=c.s;const cases=[['CS-3301','Codifyd','Agent stuck waiting on approval','Open','High'],['CS-3299','Helix Systems','SSO login loop','Escalated','High'],['CS-3290','Aster Digital','Invoice question','Open','Low'],['CS-3281','Vertex Works','Access request','Access requested','Medium']];
    return `${U.card('',U.table(['Case','Organization','Subject','State','Priority',''],cases.map(r=>[r[0],`<b>${r[1]}</b>`,r[2],U.badge(r[3],r[3]==='Escalated'?'bad':r[3]==='Access requested'?'info':''),r[4],U.btn('Open','sm',`data-set="open=${r[0]}"`)]),{caption:'Support cases'}),{flush:true})}
    ${s.open?U.drawer(s.open,`${U.notice('info','No tenant data access','You see case details the customer sent. Request time-boxed access if you need more.')}<div class="actions">${U.btn('Reply','sm','data-write data-sim="Reply sent to customer contact" data-title="Reply"')}<a class="btn sm" href="#/PLT-018">Request access</a>${U.btn('Escalate','sm','data-write data-sim="Escalate to engineering on-call" data-title="Escalate"')}</div>`,'open'):''}`}};

S['PLT-018']={title:'Time-boxed support access',group:'Operations',navId:'PLT-018',permission:'support.access',
  lead:'The customer authorizes scoped, expiring access. Every action in the session is recorded and visible to them.',
  state:{stage:'request',scope:'metadata',dur:'30'},noEmpty:true,
  spec:{goal:'Get minimal, customer-approved, time-limited access with full audit.',states:['request','pending customer approval','active scoped session','expired','denied'],security:'Operators cannot grant themselves access. Scope excludes conversations and secrets by default; sessions end automatically.'},
  render(c){const s=c.s;
    const stage={request:['info','Draft request','Choose scope and duration, then ask the customer.'],pending:['warn','Waiting for the customer','Codifyd’s admins were asked. Nothing is accessible yet.'],active:['ok','Active scoped session',`Access to ${E(s.scope)} for ${E(s.dur)} minutes. Customer can end it any time.`],expired:['bad','Expired','The session ended automatically. Request again if needed.'],denied:['bad','Denied','The customer declined. No access was granted.']}[s.stage];
    return `${U.tabs('stage',s.stage,[['request','Request'],['pending','Pending'],['active','Active'],['expired','Expired'],['denied','Denied']])}${U.notice(stage[0],stage[1],stage[2])}
    <div class="split-eq">${U.card('Request',`${U.select('Organization',{options:['Codifyd','Helix Systems'],write:true})}${U.select('Scope',{bind:'scope',value:s.scope,write:true,options:[['metadata','Configuration metadata only'],['logs','Redacted service logs'],['session','Screen-share with customer present']]})}${U.select('Duration',{bind:'dur',value:s.dur,write:true,options:['15','30','60']})}${U.textarea('Reason (shown to customer)',{write:true,value:'Investigating stuck approvals reported in CS-3301.'})}${s.stage==='request'?U.btn('Send request to customer','primary','data-write data-sim="Request sent to Codifyd administrators. They choose to allow or deny." data-title="Request access" data-after="stage=pending"'):''}`)}${U.card('Safeguards',U.list([{lead:'<span class="badge ok">✓</span>',title:'Customer approves'},{lead:'<span class="badge ok">✓</span>',title:'Never includes conversations or secrets'},{lead:'<span class="badge ok">✓</span>',title:'Auto-expires, recorded in both audit logs'}]))}</div>`}};
})();
