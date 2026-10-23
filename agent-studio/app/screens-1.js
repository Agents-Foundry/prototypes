/* Agent Studio screens 1: sign-in, catalog, create, overview, instructions, tools */
window.SCREENS=window.SCREENS||{};
window.STD_DATA={
  blueprints:[
    {id:'qa',name:'QA Engineer',dept:'Engineering / QA',ver:'2.0.3',next:'2.1.0-draft',status:'Draft',owner:'Priya Nair',upd:'2 days ago',orgs:14},
    {id:'fe',name:'Frontend Engineer',dept:'Engineering',ver:'1.4.0',next:'',status:'Published',owner:'Marcus Lee',upd:'1 week ago',orgs:9},
    {id:'rel',name:'Release Assistant',dept:'Operations',ver:'0.9.2',next:'1.0.0-rc1',status:'In review',owner:'Priya Nair',upd:'3 hours ago',orgs:0},
    {id:'ops',name:'DevOps Engineer',dept:'Operations',ver:'1.1.0',next:'',status:'Published',owner:'Sana Iqbal',upd:'3 weeks ago',orgs:6},
    {id:'pa',name:'Product Analyst',dept:'Product',ver:'0.7.0',next:'',status:'Draft',owner:'Marcus Lee',upd:'5 days ago',orgs:0},
    {id:'sup',name:'Support Triage',dept:'Customer Success',ver:'1.2.1',next:'',status:'Published',owner:'Sana Iqbal',upd:'2 months ago',orgs:11},
    {id:'hr',name:'HR Assistant',dept:'People',ver:'0.5.0',next:'',status:'In review',owner:'Dana Kim',upd:'1 day ago',orgs:0},
    {id:'legacy',name:'Release Notes Writer',dept:'Product',ver:'0.3.4',next:'',status:'Deprecated',owner:'Marcus Lee',upd:'4 months ago',orgs:2}
  ],
  tools:[
    {n:'Jira',d:'Read stories, comments and attachments',scope:'project:QA',risk:'Low',mode:'Auto',on:true},
    {n:'Jira (write)',d:'Attach files, create issues, add comments',scope:'project:QA · single use',risk:'Medium',mode:'Ask each time',on:true},
    {n:'Bitbucket',d:'Read repository contents and diffs',scope:'approved repos only',risk:'Low',mode:'Auto',on:true},
    {n:'Browser (Playwright)',d:'Run tests in an isolated browser session',scope:'approved origins',risk:'Medium',mode:'Ask once per run',on:true},
    {n:'Shell commands',d:'Run commands in an isolated workspace',scope:'sandbox only',risk:'High',mode:'Ask each time',on:false},
    {n:'Email',d:'Send email on behalf of the user',scope:'—',risk:'High',mode:'Deny',on:false},
    {n:'Slack',d:'Post to approved channels',scope:'#qa-reports',risk:'Medium',mode:'Ask each time',on:false}
  ]
};
const S=window.SCREENS,{ui,esc}=AF,D=window.STD_DATA;
const tone={Published:'ok','In review':'info',Draft:'',Deprecated:'bad'};

S['STD-001']={title:'Sign in & workspace selection',bare:true,group:'Access',permission:'studio.access',noEmpty:true,
  state:{step:0,email:'priya@codifyd.example',ws:'codifyd-eng'},
  spec:{persona:'Blueprint author or reviewer',goal:'Authenticate and choose the correct organization workspace before any blueprint is shown.',states:['sign-in','MFA challenge','workspace choice','invited','expired session','denied','offline'],security:'SSO/MFA enforced by the identity provider; session scoped to one tenant; no passwords or tokens are displayed or stored by this prototype.'},
  render(c){const s=c.s;
    const body=s.step===0?`<h1>Sign in to Agent Studio</h1><p class="muted">Design, test and publish agent blueprints for your organization.</p>
      <div class="sso"><button class="btn" type="button" data-set="step=1">Continue with Okta (simulated)</button><button class="btn" type="button" data-set="step=1">Continue with Google (simulated)</button></div>
      <p class="muted" style="text-align:center;margin:8px 0">or</p>${ui.input('Work email',{bind:'email',value:s.email,type:'email'})}${ui.btn('Continue','primary','data-set="step=1"')}`
    :s.step===1?`<h1>Verify it’s you</h1><p class="muted">Enter the 6-digit code from your authenticator for <b>${esc(s.email)}</b>.</p><div style="margin-top:14px">${ui.input('Authentication code',{ph:'000000',hint:'Simulated: any value continues.'})}</div>${ui.btn('Verify','primary','data-set="step=2"')} ${ui.btn('Back','ghost','data-set="step=0"')}`
    :`<h1>Choose a workspace</h1><p class="muted">You belong to two organizations. Studio content never crosses organizations.</p><div style="margin:14px 0;display:grid;gap:8px">${[['codifyd-eng','Codifyd · Engineering','Author · 8 blueprints'],['northwind','Northwind Labs','Reviewer · 3 pending reviews']].map(([v,n,r])=>`<button type="button" class="tplcard" aria-pressed="${s.ws===v}" data-set="ws=${v}"><b>${n}</b><br><small class="muted">${r}</small></button>`).join('')}</div>${ui.btn('Open workspace','primary','data-go="STD-002"')}`;
    return `<div class="auth"><div class="card">${body}</div><p class="muted" style="text-align:center;margin-top:12px"><small>Prototype · no authentication occurs</small></p></div>`}};

S['STD-002']={title:'Blueprint catalog',status:'partial',group:'Blueprints',navId:'STD-002',permission:'blueprint.view',
  lead:'Reusable agent blueprints for your organization. Only published versions can be hired by organization admins.',
  state:{q:'',status:'all'},emptyText:'Create your first blueprint from a template to start designing an AI employee.',emptyAction:ui.btn('New blueprint','primary','data-go="STD-003"'),
  spec:{goal:'Find, filter and open blueprints; see status and adoption at a glance.'},
  actions:()=>ui.btn('＋ New blueprint','primary','data-go="STD-003"'),
  render(c){const s=c.s,q=s.q.toLowerCase();
    const rows=D.blueprints.filter(b=>(s.status==='all'||b.status===s.status)&&(b.name+b.dept+b.owner).toLowerCase().includes(q));
    const cnt=t=>D.blueprints.filter(b=>b.status===t).length;
    return `<div class="grid g4" style="margin-bottom:16px">${ui.stat('Published',cnt('Published'),'Available to hire','flat')}${ui.stat('In review',cnt('In review'),'Awaiting independent review','flat')}${ui.stat('Drafts',cnt('Draft'),'Not yet submitted','flat')}${ui.stat('Deprecated',cnt('Deprecated'),'Migration notices sent','flat')}</div>
    <div class="toolbar"><div class="grow">${ui.input('Search blueprints',{bind:'q',value:s.q,ph:'Name, department or owner'})}</div><div>${ui.select('Status',{bind:'status',value:s.status,options:[['all','All statuses'],'Published','In review','Draft','Deprecated']})}</div></div>
    ${ui.card('',rows.length?ui.table(['Blueprint','Department','Version','Status','Owner','Hired by','Updated'],rows.map(b=>({attrs:`data-go="STD-004"`,cells:[`<a href="#/STD-004"><b>${b.name}</b></a>`,b.dept,`<code>${b.ver}</code>${b.next?` <small class="muted">→ ${b.next}</small>`:''}`,ui.badge(b.status,tone[b.status]),b.owner,b.orgs?`${b.orgs} orgs`:'—',b.upd]})),{caption:'Blueprints'}):ui.empty('No blueprints match','Try a different search or clear the status filter.',ui.btn('Clear filters','','data-set="q="')),{flush:true})}`}};

S['STD-003']={title:'Create blueprint',status:'planned',group:'Blueprints',navId:'STD-003',permission:'blueprint.create',
  lead:'Start from an approved template. New blueprints begin with no privileged tools and fail-closed policy.',
  state:{tpl:'qa',name:'',dept:'Engineering',purpose:'',tried:false},noEmpty:true,
  spec:{goal:'Create a draft blueprint with a safe baseline.',states:['pristine','validation error','created','name conflict','denied'],security:'New drafts start with least privilege: read-only tools, no external writes, fail-closed on denied actions.'},
  render(c){const s=c.s,bad=s.tried&&s.name.trim().length<3;
    const tpls=[['qa','QA Engineer','Test planning, Jira + browser evidence'],['fe','Frontend Engineer','Code review and component tasks'],['rel','Release Assistant','Checklists and sanity plans'],['blank','Blank','Start with no instructions or tools']];
    return `<div class="split"><div>${ui.card('1 · Choose a starting point',`<div class="grid g2">${tpls.map(([v,n,d])=>`<button type="button" class="tplcard" aria-pressed="${s.tpl===v}" data-set="tpl=${v}"><b>${n}</b><br><small class="muted">${d}</small></button>`).join('')}</div>`)}
    <div style="height:16px"></div>${ui.card('2 · Describe it',`${ui.input('Blueprint name',{bind:'name',value:s.name,ph:'e.g. Accessibility Auditor',error:bad?'Enter a name of at least 3 characters.':'',req:true})}${ui.select('Department',{bind:'dept',value:s.dept,options:['Engineering','Operations','Product','Customer Success','People']})}${ui.textarea('Purpose',{bind:'purpose',value:s.purpose,ph:'What job does this AI employee do, and for whom?',hint:'Shown to organization admins when they hire it.'})}`)}</div>
    <aside class="sidepanel">${ui.card('Baseline safeguards',ui.list([{title:'Read-only tools',sub:'Writes need explicit approval'},{title:'Fail closed',sub:'Denied or unknown actions never proceed'},{title:'Draft only',sub:'Not visible to organization admins'},{title:'Independent review',sub:'Required before publishing'}].map(x=>({...x,lead:'<span class="badge ok">✓</span>'})))+`<div style="margin-top:14px">${s.name.trim().length>=3?ui.btn('Create draft','primary','data-write data-sim="Draft blueprint “'+esc(s.name)+'” created from template" data-title="Create blueprint" data-after="tried=false"'):ui.btn('Create draft','primary','data-set="tried=true"')}</div>`)}</aside></div>`}};

S['STD-004']={title:'QA Engineer · overview',status:'partial',group:'Blueprints',navId:'STD-004',permission:'blueprint.view',
  lead:'Draft 2.1.0 of the QA Engineer blueprint. Published version 2.0.3 is in use by 14 organizations.',
  state:{tab:'readiness'},
  spec:{goal:'See version, readiness checks and adoption in one place; jump to the next unfinished task.'},
  actions:()=>ui.btn('Open playground','','data-go="STD-010"')+ui.btn('Submit for review','primary','data-go="STD-014"'),
  render(c){const t=c.s.tab;
    const checks=[['Instructions complete','ok','STD-005'],['Tools scoped and approved','ok','STD-006'],['Knowledge sources reviewed','warn','STD-007'],['Model and data policy set','ok','STD-008'],['Autonomy matrix defined','ok','STD-009'],['Evaluation pass rate ≥ 95%','warn','STD-011']];
    return `<div class="grid g4" style="margin-bottom:16px">${ui.stat('Draft version','2.1.0','from 2.0.3')}${ui.stat('Evaluation pass rate','92%','Needs ≥ 95% to publish','down')}${ui.stat('Open review comments','2','1 blocking','flat')}${ui.stat('Hired by','14 orgs','on 2.0.3','flat')}</div>
    ${ui.tabs('tab',t,[['readiness','Readiness'],['activity','Activity'],['adoption','Adoption']])}
    ${t==='readiness'?ui.card('Publish readiness',ui.list(checks.map(([l,tn,id])=>({lead:`<span class="badge ${tn}">${tn==='ok'?'✓':'!'}</span>`,title:l,right:`<a class="btn sm" href="#/${id}">${tn==='ok'?'Review':'Fix'}</a>`})))+ui.notice('info','Independent review required','Authors cannot approve their own blueprint. Readiness checks are advisory; reviewers decide.')):''}
    ${t==='activity'?ui.card('Recent activity',ui.timeline([{tone:'ok',title:'Priya Nair changed instructions',sub:'Today 10:12 · +14 −3 lines'},{tone:'run',title:'Evaluation suite “Regression” ran',sub:'Today 09:40 · 92% pass'},{tone:'wait',title:'Reviewer comment on Jira write scope',sub:'Yesterday · Sana Iqbal'},{title:'Draft 2.1.0 created from 2.0.3',sub:'2 days ago'}])):''}
    ${t==='adoption'?ui.card('Adoption by organization',ui.table(['Organization','Version','AI employees','Last run'],[['Codifyd','2.0.3','3','2 min ago'],['Northwind Labs','2.0.2','1','1 hour ago'],['Helix Systems','2.0.3','2','Yesterday']].map(r=>r),{caption:'Adoption',}),{flush:true}):''}`}};

S['STD-005']={title:'Instructions & persona',group:'Build',navId:'STD-005',permission:'blueprint.edit',
  lead:'Define what the agent is for, how it works and what it must never do. Changes save to the draft only.',
  state:{role:'QA Engineer',style:'concise',instr:'You are a QA engineer working inside the customer’s approved environments.\n1. Read the Jira story and acceptance criteria.\n2. Draft test cases and wait for review before publishing anything.\n3. Run tests only in approved, non-production environments.\n4. Report outcomes honestly; never claim an external action succeeded until confirmed.',dont:'Never run against production. Never include credentials or customer data in artifacts.',dirty:false},noEmpty:true,
  spec:{goal:'Author versioned instructions with clear boundaries and an input/output contract.',states:['pristine','unsaved changes','too long','policy conflict','saved','read-only (in review)']},
  actions:c=>ui.btn('Save draft','primary','data-write data-sim="Instructions saved to draft 2.1.0" data-title="Save draft"'),
  render(c){const s=c.s;return `<div class="split"><div>${ui.card('Persona',`<div class="grid g2">${ui.input('Role title',{bind:'role',value:s.role,write:true})}${ui.select('Communication style',{bind:'style',value:s.style,write:true,options:[['concise','Concise and factual'],['detailed','Detailed and explanatory'],['formal','Formal']]})}</div>${ui.textarea('Instructions',{bind:'instr',value:s.instr,write:true,hint:`${s.instr.length} / 8000 characters · versioned on save`})}${ui.textarea('Hard boundaries (must never)',{bind:'dont',value:s.dont,write:true,hint:'Boundaries are also enforced by policy; instructions alone are not a control.'})}`)}</div>
    <aside class="sidepanel">${ui.card('Input & output contract',ui.kv([['Input','Jira story ID, environment'],['Output','Test plan, evidence bundle, defect draft'],['Handoff','Human review before any external write']]))}<div style="height:16px"></div>${ui.card('Outline preview',`<ol style="margin:0;padding-left:18px">${s.instr.split('\n').filter(Boolean).map(l=>`<li>${esc(l.replace(/^\d+\.\s*/,''))}</li>`).join('')}</ol>`)}</aside></div>`}};

S['STD-006']={title:'Tools & skills',group:'Build',navId:'STD-006',permission:'blueprint.edit',
  lead:'Grant the smallest set of capabilities. Risky tools require approval; organization admins can narrow further, never widen.',
  state:{sel:'Jira (write)',tools:null},
  spec:{goal:'Declare tool scopes, risk and approval mode per capability.',states:['default','tool disabled by platform policy','scope too broad','needs reviewer sign-off','denied'],security:'Scopes here are a ceiling. At runtime effective permissions are the intersection of blueprint, organization policy, user role and environment.'},
  render(c){const s=c.s;if(!s.tools)s.tools=D.tools.map(t=>({...t}));const cur=s.tools.find(t=>t.n===s.sel)||s.tools[0];
    return `<div class="split"><div>${ui.card('',ui.table(['Capability','Scope','Risk','Mode','Enabled'],s.tools.map(t=>({attrs:`data-set="sel=${esc(t.n)}"`,cls:t.n===cur.n?'sel':'',cells:[`<b>${t.n}</b><br><small class="muted">${t.d}</small>`,t.scope,ui.risk(t.risk),t.mode,t.on?ui.badge('On','ok'):ui.badge('Off')]})),{caption:'Tools'}),{flush:true})}</div>
    <aside class="sidepanel">${ui.card(cur.n,`${ui.kv([['Scope',esc(cur.scope)],['Risk',ui.risk(cur.risk)],['Approval',esc(cur.mode)]])}<div style="margin-top:14px">${ui.select('Approval mode',{value:cur.mode,write:true,options:['Auto','Ask once per run','Ask each time','Deny']})}</div>${cur.risk==='High'?ui.notice('warn','Reviewer sign-off needed','High-risk capabilities need security review before publish.'):''}${ui.btn(cur.on?'Disable capability':'Enable capability','', `data-write data-sim="${cur.on?'Disable':'Enable'} ${esc(cur.n)} in draft" data-title="Change capability"`)}`)}</aside></div>`}};
