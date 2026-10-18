/* ORG screens 1: sign-in, setup, organization, dashboard, teams, roles, AI employees */
(function(){
const S=window.SCREENS,U=AF.ui,E=AF.esc,D=window.ORG_DATA;
const stTone={Active:'ok',Onboarding:'info',Paused:'warn','Pending approval':'info',Suspended:'bad',Invited:'info'};

S['ORG-001']={title:'Admin sign-in',bare:true,group:'Access',permission:'org.access',noEmpty:true,
  state:{step:0,email:'alex@codifyd.example',mode:'normal'},
  spec:{persona:'Organization administrator',goal:'Authenticate into the correct tenant with MFA.',states:['sign-in','MFA challenge','invited','account locked','session expired','SSO redirect','offline','denied'],security:'Admin sessions require MFA; repeated failures lock the account and notify other admins. No credentials are handled in this prototype.'},
  render(c){const s=c.s;
    let body;
    if(s.mode==='locked')body=`<h1>Account temporarily locked</h1><p class="muted">Too many failed attempts. Try again in 15 minutes, or ask another administrator to unlock you.</p><div style="margin-top:14px">${U.btn('Back to sign in','','data-set="mode=normal"')}</div>`;
    else if(s.step===0)body=`<h1>Sign in to Codifyd</h1><p class="muted">Organization administration for Agents Foundry.</p>${U.input('Work email',{bind:'email',value:s.email,type:'email'})}${U.input('Password',{type:'password',value:'••••••••••',hint:'Simulated. Your organization may require SSO.'})}<div class="actions">${U.btn('Continue','primary','data-set="step=1"')}${U.btn('Use SSO','','data-set="step=1"')}</div><p style="margin-top:12px"><button type="button" class="btn ghost sm" data-set="mode=locked">Preview: locked account</button></p>`;
    else body=`<h1>Two-step verification</h1><p class="muted">Enter the code from your authenticator app.</p>${U.input('6-digit code',{ph:'000000'})}<div class="actions">${U.btn('Verify and open console','primary','data-go="ORG-004"')}${U.btn('Back','ghost','data-set="step=0"')}</div>`;
    return `<div class="auth"><div class="card">${body}</div></div>`}};

S['ORG-002']={title:'Setup guide',group:'Overview',navId:'ORG-002',permission:'org.view',
  lead:'Five steps to a safe, working AI workforce. You can return to any step.',noEmpty:true,
  render(c){const steps=[['Confirm organization details','done','ORG-003','Name, domain and region are set.'],['Connect identity (SSO)','done','ORG-016','Okta connected, MFA required.'],['Structure teams and roles','todo','ORG-005','Add departments and assign managers.'],['Approve connectors and models','todo','ORG-017','Choose which systems agents may use.'],['Hire your first AI employee','todo','ORG-008','Pick an approved blueprint and activate.']];const done=steps.filter(x=>x[1]==='done').length;
    return `${U.card('',`<div class="toolbar"><div class="grow"><b>${done} of ${steps.length} complete</b></div></div>${U.progress(done/steps.length*100)}`)}<div style="height:16px"></div>${U.card('',U.list(steps.map(([t,st,id,d],i)=>({lead:`<span class="badge ${st==='done'?'ok':''}">${st==='done'?'✓':i+1}</span>`,title:`<b>${t}</b>`,sub:d,right:U.btn(st==='done'?'Review':'Start',st==='done'?'sm':'primary sm',`data-go="${id}"`)}))))}`}};

S['ORG-003']={title:'Organization details',group:'Organization',navId:'ORG-003',permission:'org.settings.edit',
  lead:'How your organization appears to employees and agents. The data region is set by the platform and cannot be edited here.',
  state:{name:'Codifyd',domain:'codifyd.example',tz:'Asia/Kolkata',size:'51-200',tried:false},noEmpty:true,
  actions:()=>'',
  render(c){const s=c.s;const bad=s.tried&&s.name.trim().length<2;
    return `<div class="split"><div>${U.card('Profile',`${U.input('Organization name',{bind:'name',value:s.name,write:true,req:true,error:bad?'Organization name is required.':''})}${U.input('Verified domain',{bind:'domain',value:s.domain,write:true,hint:'Domain ownership verified 12 Sep 2026.'})}<div class="grid g2">${U.select('Company size',{bind:'size',value:s.size,write:true,options:['1-50','51-200','201-1000','1000+']})}${U.select('Default timezone',{bind:'tz',value:s.tz,write:true,options:['Asia/Kolkata','Europe/London','America/New_York']})}</div>`)}
    <div class="actions" style="margin-top:14px">${s.name.trim().length>=2?U.btn('Save changes','primary','data-write data-sim="Organization details saved" data-title="Save details"'):U.btn('Save changes','primary','data-write data-set="tried=true"')}</div></div>
    <aside>${U.card('Platform-managed',U.kv([['Tenant ID','<code>org_7f3a…c91</code>'],['Data region',D.org.region],['Plan',D.org.plan],['Seats',D.org.seats]])+'<p class="muted" style="margin-top:10px"><small>Changing region requires a platform-owner request.</small></p>')}</aside></div>`}};

S['ORG-004']={title:'Dashboard',group:'Overview',navId:'ORG-004',permission:'org.view',
  lead:'Your AI workforce at a glance: what is running, what needs a decision and what it costs.',
  emptyTitle:'No AI employees yet',emptyText:'Hire your first AI employee from an approved blueprint.',emptyAction:U.btn('Hire AI employee','primary','data-go="ORG-008"'),
  actions:()=>U.btn('Hire AI employee','primary','data-go="ORG-008"'),
  render(c){
    return `<div class="grid g4" style="margin-bottom:16px">${U.stat('AI employees','6','4 active · 1 paused · 1 pending')}${U.stat('Human employees','84','of 100 seats')}${U.stat('Active runs','12','3 waiting on approval')}${U.stat('Month to date','$340','68% of $500 budget','flat')}</div>
    <div class="split"><div>${U.card('Needs your decision',U.list(D.approvals.slice(0,3).map(a=>({lead:U.badge(a[2],'info'),title:`<b>${a[0]}</b>`,sub:`${a[1]} · ${a[4]}`,right:U.btn('Review','sm','data-go="ORG-020"')}))),{actions:U.btn('All approvals','sm','data-go="ORG-020"')})}
    <div style="height:16px"></div>${U.card('AI employees',U.table(['Employee','Team','Status','Runs (30d)'],D.employees.slice(0,4).map(e=>[`<a href="#/ORG-021">${e.name}</a>`,e.team,U.badge(e.status,stTone[e.status]),e.runs]),{caption:'AI employees'}),{flush:true})}</div>
    <aside>${U.card('Spend, last 14 days',U.bars([8,10,9,14,12,18,22,19,25,21,24,28,26,30],'Daily spend')+'<p class="muted" style="margin-top:8px"><small>Budget alerts at 80% and 100%.</small></p>')}<div style="height:16px"></div>${U.card('Recent activity',U.timeline([{tone:'ok',title:'Nova completed regression run',sub:'12 min ago'},{tone:'wait',title:'Echo waiting for activation approval',sub:'2 h ago'},{tone:'ok',title:'Slack connector requested',sub:'5 h ago'},{title:'Policy “Production read-only” updated',sub:'Yesterday'}]))}</aside></div>`}};

S['ORG-005']={title:'Teams & departments',group:'Workforce',navId:'ORG-005',permission:'org.teams.view',
  lead:'Organize people and AI employees. Teams inherit policy from their parent; a team cannot be moved under itself.',
  state:{sel:'qa',open:{}},emptyText:'Create your first department to organize people and AI employees.',emptyAction:U.btn('Add department','primary',''),
  actions:()=>U.btn('＋ Add team','primary','data-write data-sim="Team created under the selected parent" data-title="Add team"'),
  render(c){const s=c.s;const roots=D.teams.filter(t=>!t.parent);const sel=D.teams.find(t=>t.id===s.sel)||D.teams[0];
    const node=(t,d)=>`<li style="padding:2px 0 2px ${d*18}px"><button type="button" class="btn ghost" style="width:100%;justify-content:space-between;${t.id===sel.id?'background:var(--primary-soft)':''}" data-set="sel=${t.id}"><span>${d?'↳ ':''}${t.name}</span><small class="muted">${t.members} people · ${t.agents} AI</small></button></li>`;
    return `<div class="split"><div>${U.card('Organization',`<ul class="list" style="padding:0">${roots.map(r=>node(r,0)+D.teams.filter(x=>x.parent===r.id).map(ch=>node(ch,1)).join('')).join('')}</ul>`)}</div>
    <aside class="sidepanel">${U.card(sel.name,`${U.kv([['Manager',sel.manager],['People',sel.members],['AI employees',sel.agents],['Parent',sel.parent?D.teams.find(t=>t.id===sel.parent).name:'Top level']])}<h3 style="margin:14px 0 6px">AI employees</h3>${U.list(D.employees.filter(e=>e.team===sel.name).map(e=>({title:e.name,right:U.badge(e.status,stTone[e.status])})))||''}${D.employees.filter(e=>e.team===sel.name).length?'':'<p class="muted">No AI employees in this team.</p>'}<div class="actions" style="margin-top:12px">${U.btn('Rename','sm','data-write data-sim="Team renamed" data-title="Rename team"')}${U.btn('Move…','sm','data-write data-sim="Choose a new parent. Cycles are rejected." data-title="Move team"')}${U.btn('Delete','sm danger','data-write data-sim="Delete team “'+sel.name+'”" data-title="Delete team" data-risk="Members and AI employees are unassigned; this is recorded in the audit log." data-confirm="delete"')}</div>`)}</aside></div>`}};

S['ORG-006']={title:'Roles & positions',group:'Workforce',navId:'ORG-006',permission:'org.roles.view',
  lead:'Roles grant permissions. Positions describe jobs and can map to AI employee blueprints.',
  state:{open:''},emptyText:'No custom roles yet. System roles always exist.',
  actions:()=>U.btn('＋ New role','primary','data-write data-sim="Draft role created (no permissions yet)" data-title="New role"'),
  render(c){const s=c.s;
    return `${U.card('',U.table(['Role','Description','Members','Type',''],D.roles.map(r=>[`<b>${r.n}</b>`,r.d,r.members,U.badge(r.sys?'System':'Custom',r.sys?'':'brand'),U.btn('View','sm',`data-set="open=${r.n}"`)]),{caption:'Roles'}),{flush:true})}
    ${s.open?U.drawer(s.open,`<p class="muted">${D.roles.find(r=>r.n===s.open).d}</p><h3 style="margin:14px 0 6px">Key permissions</h3>${U.chips(['View organization','Manage teams','Hire AI employees','Approve connectors','View audit'].slice(0,s.open==='Employee'?1:s.open==='Auditor'?2:5),'ok')}<h3 style="margin:14px 0 6px">Cannot</h3>${U.chips(['Change billing','Disable audit','Read tenant secrets'],'bad')}<div class="actions" style="margin-top:16px"><a class="btn sm" href="#/ORG-015">Open permission matrix</a>${D.roles.find(r=>r.n===s.open).sys?'':U.btn('Edit','sm','data-write data-sim="Role edit saved to draft" data-title="Edit role"')}</div>`,'open'):''}`}};

S['ORG-007']={title:'AI employees',group:'Workforce',navId:'ORG-007',permission:'agents.view',
  lead:'Every AI employee, its owner and status. Pause or retire from here; deep controls live on the employee page.',
  state:{q:'',status:'all'},emptyTitle:'No AI employees yet',emptyText:'Hire an AI employee from an approved blueprint. You choose capabilities and who is accountable.',emptyAction:U.btn('Hire AI employee','primary','data-go="ORG-008"'),
  actions:()=>U.btn('＋ Hire AI employee','primary','data-go="ORG-008"'),
  render(c){const s=c.s;const q=s.q.toLowerCase();const rows=D.employees.filter(e=>(s.status==='all'||e.status===s.status)&&(e.name+e.team+e.manager).toLowerCase().includes(q));
    return `<div class="toolbar"><div class="grow">${U.input('Search',{bind:'q',value:s.q,ph:'Name, team or manager'})}</div>${U.select('Status',{bind:'status',value:s.status,options:[['all','All'],'Active','Onboarding','Paused','Pending approval']})}</div>
    ${U.card('',rows.length?U.table(['AI employee','Blueprint','Team','Accountable human','Status','Runs','Spend'],rows.map(e=>[`<a href="#/ORG-021"><b>${e.name}</b></a>`,e.bp,e.team,e.manager,U.badge(e.status,stTone[e.status]),e.runs,e.spend]),{caption:'AI employees'}):U.empty('No employees match','Adjust search or status.',U.btn('Clear','','data-set="q="')),{flush:true})}`}};
})();
