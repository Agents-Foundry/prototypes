/* ORG screens 2: hiring wizard (ORG-008 to ORG-013) with a shared draft */
(function(){
const S=window.SCREENS,U=AF.ui,E=AF.esc,D=window.ORG_DATA;
const labels=['Blueprint','Configure','Capabilities','Integrations','Review'];
const hire=c=>c.shared.hire||(c.shared.hire={bp:'qa',name:'',team:'Quality Assurance',manager:'Dana Kim',env:'Development',hours:'Business hours',caps:{read:true,browser:true,jiraw:false,shell:false,slack:false},conn:{jira:'ok',bb:'auth',slack:'none'},identity:'delegated',ack:false,tried:false});
const nav=(c,back,next,nextOk=true,label='Continue')=>`<div class="actions" style="margin-top:16px;justify-content:space-between"><div class="actions">${U.btn('← Back','',`data-go="${back}"`)}${U.btn('Save draft','','data-write data-sim="Draft saved. It is visible only to you until activation is requested." data-title="Save draft"')}</div>${U.btn(label,'primary',nextOk?`data-go="${next}"`:'disabled')}</div>`;
const bpOf=h=>D.blueprints.find(b=>b.id===h.bp);

S['ORG-008']={title:'Hire: choose a blueprint',group:'Hire AI employee',navId:'ORG-008',permission:'agents.hire',
  lead:'Only published blueprints your organization allows are listed. The blueprint sets the ceiling on what the employee can do.',
  emptyTitle:'No blueprints available',emptyText:'Your platform operator has not enabled any blueprints for this organization.',
  render(c){const h=hire(c);
    return `${U.steps(labels,0)}<div class="grid g2">${D.blueprints.map(b=>`<button type="button" class="tplcard" aria-pressed="${h.bp===b.id}" data-set="$hire.bp=${b.id}"><div class="toolbar" style="margin:0"><b class="grow">${b.n}</b>${U.badge('v'+b.v,'brand')}</div><p class="muted" style="margin:6px 0">${b.d}</p>${U.chips(b.tools)} <span style="margin-left:6px">${U.risk(b.risk)} risk</span></button>`).join('')}</div>${nav(c,'ORG-007','ORG-009')}`}};

S['ORG-009']={title:'Hire: configure',group:'Hire AI employee',navId:'ORG-008',permission:'agents.hire',
  lead:'Give the employee an identity and an accountable human. Every AI employee needs a manager who answers for its work.',
  noEmpty:true,
  render(c){const h=hire(c);const bad=h.tried&&h.name.trim().length<3;
    return `${U.steps(labels,1)}<div class="split"><div>${U.card('Identity',`${U.input('Display name',{bind:'$hire.name',value:h.name,ph:'e.g. QA Engineer · Nova',req:true,error:bad?'Enter a name of at least 3 characters.':'',hint:'Shown to employees and in audit records.'})}<div class="grid g2">${U.select('Team',{bind:'$hire.team',value:h.team,options:D.teams.map(t=>t.name)})}${U.select('Accountable manager',{bind:'$hire.manager',value:h.manager,options:['Dana Kim','Marcus Lee','Sana Iqbal','Elena Costa']})}</div><div class="grid g2">${U.select('Default environment',{bind:'$hire.env',value:h.env,options:['Development','Staging'],hint:'Production is read-only by policy.'})}${U.select('Working hours',{bind:'$hire.hours',value:h.hours,options:['Business hours','Extended','Always on (needs approval)']})}</div>`)}</div>
    <aside>${U.card('Blueprint',`<b>${bpOf(h).n}</b> <span class="badge brand">v${bpOf(h).v}</span><p class="muted" style="margin-top:6px">${bpOf(h).d}</p>`)}</aside></div>
    ${nav(c,'ORG-008',h.name.trim().length>=3?'ORG-010':'',h.name.trim().length>=3)}${h.name.trim().length<3?`<p style="margin-top:8px">${U.btn('Check required fields','sm','data-set="$hire.tried=true"')}</p>`:''}`}};

S['ORG-010']={title:'Hire: capabilities',group:'Hire AI employee',navId:'ORG-008',permission:'agents.hire',
  lead:'Narrow what this employee can do. You can only turn capabilities off or require approval; you cannot exceed the blueprint.',noEmpty:true,
  render(c){const h=hire(c);const rows=[['read','Read Jira stories and repositories','Low','Auto',false],['browser','Run browser tests (approved origins)','Medium','Ask once per run',false],['jiraw','Write to Jira (attach, create issue)','Medium','Ask each time',false],['shell','Run shell commands in a sandbox','High','Ask each time',true],['slack','Post to Slack channels','Medium','Ask each time',false]];
    return `${U.steps(labels,2)}${U.card('',U.table(['Capability','Risk','Approval','Allow'],rows.map(([k,l,r,m,lock])=>[`<b>${l}</b>`,U.risk(r),m,lock?`<span class="badge bad" title="Not permitted by your policy">Blocked by policy</span>`:`<label class="switch"><input type="checkbox" data-bind="$hire.caps.${k}" ${h.caps[k]?'checked':''}><span class="tr"></span><span class="sr-only">Allow ${l}</span></label>`]),{caption:'Capabilities'}),{flush:true})}
    ${h.caps.jiraw?U.notice('warn','Writes need approval','Each Jira write will ask the accountable manager for a scoped, single-use approval.'):''}${nav(c,'ORG-009','ORG-011')}`}};

S['ORG-011']={title:'Hire: integrations',group:'Hire AI employee',navId:'ORG-008',permission:'agents.hire',
  lead:'Connect only approved systems. The employee acts with delegated, scoped identity; secrets stay in your vault and are never shown.',noEmpty:true,
  render(c){const h=hire(c);const rows=[['Jira','jira','Approved connector v3 · project QA'],['Bitbucket','bb','Approved connector v2 · 5 repositories'],['Slack','slack','Not approved for this organization']];
    const stat={ok:U.badge('Connected','ok'),auth:U.badge('Needs authorization','warn'),none:U.badge('Not approved','bad')};
    return `${U.steps(labels,3)}${U.card('',U.list(rows.map(([n,k,d])=>({lead:U.avatar(n[0]),title:`<b>${n}</b>`,sub:d,right:stat[h.conn[k]]+' '+(h.conn[k]==='auth'?U.btn('Authorize','sm','data-write data-sim="Open the secure authorization window for Bitbucket" data-title="Authorize connector" data-after="$hire.conn.bb=ok"'):h.conn[k]==='none'?U.btn('Request approval','sm','data-write data-sim="Connector request sent to organization admins" data-title="Request connector"'):'')}))))}
    <div style="height:14px"></div>${U.card('Identity used for actions',U.select('Act as',{bind:'$hire.identity',value:h.identity,options:[['delegated','Delegated: the accountable manager’s permissions, narrowed'],['service','Service identity (needs approval)']],hint:'Effective permissions are the intersection of the blueprint, your policy and this identity.'}))}${nav(c,'ORG-010','ORG-012')}`}};

S['ORG-012']={title:'Hire: review & activate',group:'Hire AI employee',navId:'ORG-008',permission:'agents.hire',
  lead:'Check everything before requesting activation. High-risk capabilities need a second administrator.',noEmpty:true,
  render(c){const h=hire(c);const caps=Object.entries(h.caps).filter(([,v])=>v).map(([k])=>({read:'Read',browser:'Browser',jiraw:'Jira write',shell:'Shell',slack:'Slack'}[k]));const needs2=h.caps.shell||h.caps.slack;const ready=h.name.trim().length>=3&&h.ack;
    return `${U.steps(labels,4)}<div class="split"><div>${U.card('Summary',U.kv([['Name',E(h.name||'— not set —')],['Blueprint',`${bpOf(h).n} v${bpOf(h).v}`],['Team',E(h.team)],['Accountable manager',E(h.manager)],['Environment',E(h.env)],['Capabilities',U.chips(caps)||'None'],['Identity',h.identity==='delegated'?'Delegated, narrowed':'Service identity']]))}</div>
    <aside>${U.card('Readiness',U.list([{lead:`<span class="badge ${h.name.trim().length>=3?'ok':'bad'}">${h.name.trim().length>=3?'✓':'✕'}</span>`,title:'Name and manager set'},{lead:'<span class="badge ok">✓</span>',title:'Connectors authorized'},{lead:`<span class="badge ${needs2?'warn':'ok'}">${needs2?'!':'✓'}</span>`,title:needs2?'Second admin approval required':'No extra approval required'}])+`<label style="display:flex;gap:8px;margin:12px 0"><input type="checkbox" data-bind="$hire.ack" ${h.ack?'checked':''}> I understand this employee may act within the limits above.</label>${U.btn('Request activation','primary',ready?`data-write data-sim="Activation requested for ${E(h.name)}" data-title="Request activation" data-after="go=1"`:'disabled')}`)}</aside></div>
    <div class="actions" style="margin-top:16px">${U.btn('← Back','','data-go="ORG-011"')}${c.s.go?U.btn('View result →','primary','data-go="ORG-013"'):''}</div>`}};

S['ORG-013']={title:'Hire: activation result',group:'Hire AI employee',navId:'ORG-008',permission:'agents.hire',
  lead:'Activation is asynchronous. The employee is only active once the server confirms it; until then nothing runs.',noEmpty:true,
  state:{result:'pending'},
  render(c){const s=c.s,h=hire(c);const nm=E(h.name||'New AI employee');
    const map={pending:['info','Waiting for approval',`A second administrator must approve ${nm}. No access has been granted.`,[{tone:'ok',title:'Request submitted'},{tone:'wait',title:'Awaiting second admin'},{title:'Provisioning'},{title:'Active'}]],
      provisioning:['info','Provisioning',`Creating identity and scoped credentials for ${nm}.`,[{tone:'ok',title:'Request submitted'},{tone:'ok',title:'Approved by Sana Iqbal'},{tone:'run',title:'Provisioning'},{title:'Active'}]],
      active:['ok','Active',`${nm} is ready. Employees on ${E(h.team)} can now assign work.`,[{tone:'ok',title:'Request submitted'},{tone:'ok',title:'Approved'},{tone:'ok',title:'Provisioned'},{tone:'ok',title:'Active'}]],
      failed:['bad','Activation failed','Provisioning did not complete. Nothing was granted. You can retry safely: the request is idempotent.',[{tone:'ok',title:'Request submitted'},{tone:'ok',title:'Approved'},{tone:'bad',title:'Provisioning failed',sub:'Reference ACT-4471'},{title:'Active'}]],
      rejected:['bad','Request rejected','The approver declined. Review the comment and submit a new request.',[{tone:'ok',title:'Request submitted'},{tone:'bad',title:'Rejected by Sana Iqbal',sub:'“Slack scope too broad.”'}]]};
    const m=map[s.result];
    return `${U.tabs('result',s.result,[['pending','Pending'],['provisioning','Provisioning'],['active','Active'],['failed','Failed'],['rejected','Rejected']])}<div class="split"><div>${U.notice(m[0],m[1],m[2])}${U.card('Progress',U.timeline(m[3]))}</div><aside>${U.card('Next',s.result==='active'?U.btn('Open AI employee','primary','data-go="ORG-021"')+' '+U.btn('Back to employees','','data-go="ORG-007"'):s.result==='failed'?U.btn('Retry activation','primary','data-write data-sim="Retry sent with the same request key" data-title="Retry"'):s.result==='rejected'?U.btn('Edit and resubmit','primary','data-go="ORG-012"'):U.btn('Back to employees','','data-go="ORG-007"'))}</aside></div>`}};
})();
