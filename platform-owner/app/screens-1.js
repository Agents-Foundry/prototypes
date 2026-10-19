/* PLT screens 1: login, overview, organizations, profile, provisioning, approvals */
(function(){
const S=window.SCREENS,U=AF.ui,E=AF.esc,D=window.PLT_DATA;
const st={Active:'ok',Onboarding:'info',Suspended:'bad',Trial:'warn'};
const org=c=>D.orgs.find(o=>o.id===(c.shared.org||'codifyd'));
const prov=c=>c.shared.prov||(c.shared.prov={name:'',slug:'',region:'India',plan:'Starter',admin:'',step:0,submitted:false});

S['PLT-001']={title:'Operator sign-in',bare:true,group:'Access',permission:'platform.access',noEmpty:true,
  state:{step:0,view:'normal'},
  spec:{persona:'Platform operator',goal:'Strong authentication for staff who can affect all tenants.',states:['sign-in','hardware key / MFA','recovery','denied','locked','step-up required'],security:'Phishing-resistant MFA required; sessions are short; no tenant data is reachable from this console by default.'},
  render(c){const s=c.s;let b;
    if(s.view==='locked')b=`<h1>Access locked</h1><p class="muted">Too many failed attempts. The security team was notified. Contact the on-call security engineer to unlock.</p><div style="margin-top:14px">${U.btn('Back','','data-set="view=normal"')}</div>`;
    else if(s.step===0)b=`<h1>Platform console</h1><p class="muted">Staff access only. Activity is logged.</p>${U.input('Staff email',{value:'sam@agentsfoundry.example',type:'email'})}${U.btn('Continue with company SSO','primary','data-set="step=1"')}<p style="margin-top:10px"><button type="button" class="btn ghost sm" data-set="view=locked">Preview: locked</button></p>`;
    else b=`<h1>Use your security key</h1><p class="muted">Insert and touch your hardware key. Codes by SMS are not accepted for operators.</p><div class="notice info"><div>Simulated: any action continues.</div></div><div class="actions">${U.btn('Verify key','primary','data-go="PLT-002"')}${U.btn('Back','ghost','data-set="step=0"')}</div>`;
    return `<div class="auth"><div class="card">${b}</div></div>`}};

S['PLT-002']={title:'Platform overview',group:'Overview',navId:'PLT-002',permission:'platform.view',
  lead:'Cross-tenant health without exposure to tenant conversations, secrets or private content.',
  emptyText:'No data yet. Metrics appear after the first tenant is provisioned.',
  actions:()=>U.btn('Provision tenant','primary','data-go="PLT-005"'),
  render(c){
    return `<div class="grid g4" style="margin-bottom:16px">${U.stat('Organizations','128','+7 in 30 days','up')}${U.stat('Active tenants','121','4 onboarding · 3 suspended')}${U.stat('Usage this month','$42,810','Estimated, not reconciled')}${U.stat('Open incidents','2','1 needs review','down')}</div>
    <div class="split"><div>${U.card('Needs attention',U.list([{lead:U.badge('Approval','info'),title:'<b>Northwind Labs</b> provisioning',sub:'Requested 12 min ago by Priya Rao',right:U.btn('Review','sm primary','data-go="PLT-006"')},{lead:U.badge('Incident','warn'),title:'<b>INC-1027</b> model latency (EU)',sub:'Investigating · 43 min',right:U.btn('Open','sm','data-go="PLT-016"')},{lead:U.badge('Billing','warn'),title:'<b>Vertex Works</b> payment failed twice',sub:'Suspension review due in 2 days',right:U.btn('Review','sm','data-go="PLT-022"')}]))}
    <div style="height:16px"></div>${U.card('Tenants',U.table(['Organization','Region','Plan','Users','Status'],D.orgs.slice(0,5).map(o=>[`<a href="#/PLT-003">${o.name}</a>`,o.region,o.plan,o.users,U.badge(o.status,st[o.status])]),{caption:'Tenants'}),{flush:true,actions:U.btn('All','sm','data-go="PLT-003"')})}</div>
    <aside>${U.card('Organizations over time',U.bars([62,68,75,83,90,96,104,112,121,128],'Organizations over time')+'<p class="muted" style="margin-top:6px"><small>Last 10 weeks</small></p>')}<div style="height:16px"></div>${U.card('Provider health',U.list([['Anthropic','ok','Healthy'],['OpenAI','warn','Elevated latency (EU)'],['Local endpoints','ok','Healthy']].map(([n,t,d])=>({lead:`<span class="badge ${t}">${t==='ok'?'✓':'!'}</span>`,title:n,sub:d}))),{actions:U.btn('Details','sm','data-go="PLT-015"')})}</aside></div>`}};

S['PLT-003']={title:'Organizations',group:'Organizations',navId:'PLT-003',permission:'tenants.view',
  lead:'Find and manage tenants. Tenant private data is not accessible from this screen.',
  state:{q:'',status:'all',region:'all'},emptyText:'No organizations have been provisioned yet.',emptyAction:U.btn('Provision tenant','primary','data-go="PLT-005"'),
  actions:()=>U.btn('＋ Provision tenant','primary','data-go="PLT-005"'),
  render(c){const s=c.s;const rows=D.orgs.filter(o=>(s.status==='all'||o.status===s.status)&&(s.region==='all'||o.region===s.region)&&o.name.toLowerCase().includes(s.q.toLowerCase()));
    return `<div class="toolbar"><div class="grow">${U.input('Search organizations',{bind:'q',value:s.q})}</div>${U.select('Status',{bind:'status',value:s.status,options:[['all','All'],'Active','Onboarding','Suspended','Trial']})}${U.select('Region',{bind:'region',value:s.region,options:[['all','All'],'India','EU','US']})}</div>
    ${U.card('',rows.length?U.table(['Organization','Region','Plan','Users','AI employees','Status','MRR',''],rows.map(o=>[`<b>${o.name}</b>`,o.region,o.plan,o.users,o.agents,U.badge(o.status,st[o.status]),o.mrr,U.btn('Open','sm',`data-act="open:${o.id}"`)]),{caption:'Organizations'}):U.empty('No organizations match','Change or clear the filters.',U.btn('Clear','','data-set="q="')),{flush:true})}`},
  act(n,[id],c){if(n==='open'){c.shared.org=id;c.go('PLT-004')}}};

S['PLT-004']={title:'Organization profile',group:'Organizations',navId:'PLT-003',permission:'tenants.view',
  state:{tab:'overview'},noEmpty:true,
  lead:'Lifecycle, administrators, plan and support context. Conversations, artifacts and secrets are not visible to operators.',
  actions:c=>U.btn('Support access…','','data-go="PLT-018"')+U.btn('Review suspension','danger','data-go="PLT-022"'),
  render(c){const s=c.s,o=org(c);
    return `<div class="toolbar"><h2 class="grow">${o.name} ${U.badge(o.status,st[o.status])}</h2>${U.select('Switch',{value:o.id,aria:'Switch organization',options:D.orgs.map(x=>[x.id,x.name]),bind:'$org'})}</div>${U.tabs('tab',s.tab,[['overview','Overview'],['admins','Administrators'],['plan','Plan & usage'],['lifecycle','Lifecycle']])}
    ${s.tab==='overview'?`<div class="grid g4" style="margin-bottom:16px">${U.stat('Users',o.users)}${U.stat('AI employees',o.agents)}${U.stat('Region',o.region)}${U.stat('Customer since',o.since)}</div>${U.card('Facts shown to operators',U.kv([['Tenant ID','<code>org_'+o.id+'_7f3a</code>'],['Plan',o.plan],['Health','No open incidents'],['Support access','None active'],['Tenant data','<span class="badge">Not accessible</span>']]))}`:''}
    ${s.tab==='admins'?U.card('',U.table(['Administrator','Role','MFA','Last sign-in'],[['Alex Rivera','Org admin',U.badge('On','ok'),'Today'],['Sana Iqbal','Org admin',U.badge('On','ok'),'Yesterday']]),{flush:true,actions:U.btn('Resend admin invite','sm','data-go="PLT-007"')}):''}
    ${s.tab==='plan'?U.card('Plan',U.kv([['Plan',o.plan],['Seats',o.users+' used'],['MRR',o.mrr]])+'<div style="margin-top:12px">'+U.btn('Change plan','','data-go="PLT-008"')+'</div>'):''}
    ${s.tab==='lifecycle'?U.card('Lifecycle',U.timeline([{tone:'ok',title:'Provisioned',sub:o.since},{tone:'ok',title:'First admin accepted invite'},{tone:o.status==='Suspended'?'bad':'ok',title:o.status==='Suspended'?'Suspended for non-payment':'Active'}])):''}`}};

S['PLT-005']={title:'Provision a tenant',group:'Organizations',navId:'PLT-005',permission:'tenants.provision',
  lead:'Guided and policy-aware. Submitting requests approval; nothing becomes active without an independent approver and authoritative provisioning.',
  noEmpty:true,
  render(c){const p=prov(c);const labels=['Organization','Region & plan','First admin','Review'];
    const slugBad=p.slug&&!/^[a-z0-9-]{3,30}$/.test(p.slug);const adminBad=p.admin&&!/^\S+@\S+\.\S+$/.test(p.admin);
    const okStep=[p.name.trim().length>=2&&/^[a-z0-9-]{3,30}$/.test(p.slug),true,/^\S+@\S+\.\S+$/.test(p.admin),true][p.step];
    let body='';
    if(p.step===0)body=U.card('Organization identity',U.input('Organization name',{bind:'$prov.name',value:p.name,ph:'e.g. Northwind Labs'})+U.input('Tenant slug',{bind:'$prov.slug',value:p.slug,ph:'northwind',hint:'Lowercase letters, numbers, hyphens. Cannot be changed later.',error:slugBad?'Use 3–30 lowercase letters, numbers or hyphens.':''}));
    if(p.step===1)body=U.card('Region and plan',`<div class="grid g2">${U.select('Data region',{bind:'$prov.region',value:p.region,options:['India','EU','US'],hint:'Sets data residency. Hard to change once active.'})}${U.select('Plan',{bind:'$prov.plan',value:p.plan,options:['Trial','Starter','Growth','Enterprise']})}</div>${U.notice('info','Residency','Prompts and outputs for this tenant will be processed only in the selected region.')}`);
    if(p.step===2)body=U.card('First administrator',U.input('Administrator email',{bind:'$prov.admin',value:p.admin,type:'email',ph:'admin@company.example',error:adminBad?'Enter a valid email address.':''})+U.notice('info','Invitation only','A one-time invitation is sent. Initial passwords are never set or shared.'));
    if(p.step===3)body=U.card('Review request',U.kv([['Organization',E(p.name)],['Slug',`<code>${E(p.slug)}</code>`],['Region',E(p.region)],['Plan',E(p.plan)],['First admin',E(p.admin)]])+U.notice('warn','Approval required','Another operator must approve. Submitting does not create a tenant.'));
    return `${U.steps(labels,p.step)}${body}<div class="actions" style="margin-top:14px">${U.btn('Back','',p.step===0?'disabled':`data-set="$prov.step=${p.step-1}"`)}${p.step<3?U.btn('Continue','primary',okStep?`data-set="$prov.step=${p.step+1}"`:'disabled'):U.btn('Submit for approval','primary','data-write data-sim="Provisioning request submitted for independent approval" data-title="Submit request" data-after="$prov.submitted=true"')}${p.submitted?U.btn('View approvals →','','data-go="PLT-006"'):''}</div>`}};

S['PLT-006']={title:'Provisioning review & approval',group:'Organizations',navId:'PLT-006',permission:'tenants.approve',
  lead:'Independent review of tenant requests. You cannot approve a request you submitted.',
  state:{sel:'northwind'},emptyTitle:'No requests',emptyText:'Submitted provisioning requests appear here.',
  render(c){const s=c.s;const p=c.shared.prov;
    const reqs=[['northwind','Northwind Labs','EU · Enterprise','Priya Rao','12 min'],['lumen2','Lumen Retail (second tenant)','US · Trial','Sam Okafor','1 h']];
    if(p&&p.submitted&&p.name)reqs.unshift(['new',p.name,p.region+' · '+p.plan,'Sam Okafor','just now']);
    const cur=reqs.find(r=>r[0]===s.sel)||reqs[0];const own=cur[3]==='Sam Okafor';const dec=s['d_'+cur[0]];
    return `<div class="split"><div>${U.card('',U.table(['Request','Region · plan','Requested by','Waiting',''],reqs.map(r=>({cls:r[0]===cur[0]?'sel':'',cells:[`<b>${E(r[1])}</b>`,E(r[2]),r[3],r[4],U.btn('Open','sm',`data-set="sel=${r[0]}"`)]})),{caption:'Requests'}),{flush:true})}</div>
    <aside class="sidepanel">${U.card(E(cur[1]),`${U.kv([['Region',E(cur[2])],['Requested by',cur[3]],['Checks','Domain verified · residency matches plan · no sanctions hit (simulated)']])}${own?U.notice('bad','Your own request','Another operator must decide.'):''}${dec?U.notice('ok','Decision recorded (simulated)',dec):''}<div class="actions" style="margin-top:12px">${U.btn('Approve','primary',own||dec?'disabled':'data-write data-sim="Approve provisioning. The tenant becomes Active only after authoritative provisioning completes." data-title="Approve tenant" data-after="d_'+cur[0]+'=Approved. The tenant stays Onboarding until provisioning completes."')}${U.btn('Reject','',own||dec?'disabled':'data-write data-sim="Reject with a reason" data-title="Reject request" data-after="d_'+cur[0]+'=Rejected. The requester is notified."')}</div>`)}</aside></div>`}};
})();
