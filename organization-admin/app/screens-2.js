/* ORG screens 2: create agents (ORG-008 to ORG-013) with a shared draft */
(function(){
const S=window.SCREENS,U=AF.ui,E=AF.esc,D=window.ORG_DATA;
const labels=['Blueprint version','Installation','Preview','Connections','Create agents'];
const hire=c=>c.shared.hire||(c.shared.hire={role:'qa',ver:'1.1.0',inst:'QA default',issueTracker:'Jira',sourceControl:'GitHub',testingTechnologies:'Playwright',start:'installation',agentName:'',assign:{dana:true},projectName:'web-checkout',repositoryUrl:'git.codifyd.example/web-checkout',qaUrl:'qa-staging.codifyd.example',projectScripts:'test, lint',packageRegistryUrl:'registry.codifyd.example',provider:'anthropic',modelId:'',cred:'ORGANIZATION',ack:false,tried:false,ready:true});
const nav=(c,back,next,nextOk=true,label='Continue')=>`<div class="actions" style="margin-top:16px;justify-content:space-between"><div class="actions">${U.btn('← Back','',`data-go="${back}"`)}${U.btn('Save draft','','data-write data-sim="Draft saved. It is visible only to you." data-title="Save draft"')}</div>${U.btn(label,'primary',nextOk?`data-go="${next}"`:'disabled')}</div>`;
const bpOf=h=>D.blueprints.find(b=>b.id===h.role);
const verOf=h=>{const b=bpOf(h);return b.vers.find(v=>v[0]===h.ver)||b.vers[0]};
const actionsOf={qa:[['jira.read','Low','ALLOW'],['qa.plan','Low','ALLOW'],['qa.execute_playwright','Medium','REQUIRE_APPROVAL'],['jira.issue.create','Medium','REQUIRE_APPROVAL']],other:[['repository.read','Low','ALLOW'],['repository.write','Low','ALLOW'],['workspace.command','Medium','ALLOW'],['workspace.dependencies.install','Medium','ALLOW'],['repository.pull_request.create','High','REQUIRE_APPROVAL']]};
const oTone={ALLOW:'ok',REQUIRE_APPROVAL:'warn',DENY:'bad'};

S['ORG-008']={title:'Create agents: blueprint version',group:'Create agents',navId:'ORG-008',permission:'agents.hire',
  lead:'Choose a role and version from the catalog. The version is immutable and identified by its digest. The blueprint cannot grant permission; policy decides.',
  emptyTitle:'No blueprints available',emptyText:'The catalog has no versions for this organization.',
  render(c){const h=hire(c);const b=bpOf(h);
    return `${U.steps(labels,0)}<div class="grid g2">${D.blueprints.map(x=>`<button type="button" class="tplcard" aria-pressed="${h.role===x.id}" data-set="$hire.role=${x.id}"><div class="toolbar" style="margin:0"><b class="grow">${x.n}</b>${U.badge(x.vers.length+' version'+(x.vers.length>1?'s':''),'brand')}</div><p class="muted" style="margin:6px 0">${x.mission}</p></button>`).join('')}</div>
    <div style="height:14px"></div>${U.card(b.n+' · versions',U.table(['Version','Digest',''],b.vers.map((v,i)=>[`<b>${v[0]}</b>${i===0?' (latest)':''}`,'<code>'+v[1]+'</code>',U.btn(h.ver===v[0]?'Selected':'Select','sm',`data-set="$hire.ver=${v[0]}"`)]),{caption:'Versions'}),{flush:true})}
    <div style="height:14px"></div>${U.card('Selected version',U.kv([['Mission',b.mission],['Skills',U.chips(b.skills)],['Workflows',U.chips(b.workflows)],['Digest','<code>'+verOf(h)[1]+'</code> (sample)']]))}${nav(c,'ORG-007','ORG-009')}`}};

S['ORG-009']={title:'Create agents: installation',group:'Create agents',navId:'ORG-008',permission:'agents.hire',
  lead:'Create an installation: the organization-wide answers for this blueprint version. It applies only to agents created afterwards.',
  noEmpty:true,
  render(c){const h=hire(c);const bad=h.tried&&h.inst.trim().length<3;
    return `${U.steps(labels,1)}<div class="split"><div>${U.card('Installation answers',`${U.input('Installation name',{bind:'$hire.inst',value:h.inst,req:true,error:bad?'Enter a name of at least 3 characters.':'',hint:'Active installation names are unique in the organization.'})}${U.select('Issue tracker',{bind:'$hire.issueTracker',value:h.issueTracker,options:[['Jira','Jira'],['Linear','Linear (Planned)']]})}${U.select('Source control',{bind:'$hire.sourceControl',value:h.sourceControl,options:[['GitHub','GitHub'],['GitLab','GitLab (Planned)'],['Azure DevOps','Azure DevOps (Planned)']]})}${h.role==='qa'?U.input('Testing technologies',{bind:'$hire.testingTechnologies',value:h.testingTechnologies}):''}`)}</div>
    <aside>${U.card('Blueprint',`<b>${bpOf(h).n}</b> <span class="badge brand">${E(h.ver)}</span><p class="muted" style="margin-top:6px">${bpOf(h).mission}</p>`)}<div style="height:14px"></div>${U.notice('info','Planned options','Linear, GitLab and Azure DevOps are not connectable yet.')}</aside></div>
    ${nav(c,'ORG-008',h.inst.trim().length>=3?'ORG-010':'',h.inst.trim().length>=3)}${h.inst.trim().length<3?`<p style="margin-top:8px">${U.btn('Check required fields','sm','data-set="$hire.tried=true"')}</p>`:''}`}};

S['ORG-010']={title:'Create agents: preview',group:'Create agents',navId:'ORG-008',permission:'agents.hire',
  lead:'Preview what this role can do and what happens for each action. The catalog cannot grant permission, and your overrides can only make an outcome stricter.',noEmpty:true,
  render(c){const h=hire(c);const rows=(h.role==='qa'?actionsOf.qa:actionsOf.other);
    return `${U.steps(labels,2)}${U.card('',U.table(['Governed action','Risk','Outcome'],rows.map(([a,r,o])=>['<code>'+a+'</code>',U.risk(r),U.badge(o,oTone[o])]),{caption:'Actions and outcomes'}),{flush:true})}
    <div style="height:14px"></div>${U.notice('info','Where outcomes come from','Defaults are platform policy. Change them on Governed actions; an override can only require approval or deny, never loosen. Unknown actions are denied.')}${nav(c,'ORG-009','ORG-011')}`}};

S['ORG-011']={title:'Create agents: connections',group:'Create agents',navId:'ORG-008',permission:'agents.hire',
  lead:'Check what this installation needs before creating agents. Secrets stay in your vault and are never shown.',noEmpty:true,
  render(c){const h=hire(c);const ok=h.ready;
    const rows=[['Jira',h.issueTracker==='Jira','ORG-017','Issue tracker connection'],[h.sourceControl,h.sourceControl==='GitHub','ORG-017','Source control connection'],['Source checkout',ok,'ORG-017','Checkout of the configured repository'],['Model credential',ok,'ORG-018','Anthropic credential for this organization']];
    const all=rows.every(r=>r[1]);
    return `${U.steps(labels,3)}${U.card('Required connections',U.list(rows.map(([n,good,go,d])=>({lead:U.avatar(n[0]),title:`<b>${n}</b>`,sub:d,right:(good?U.badge('Ready','ok'):U.badge('Missing','bad')+' '+U.btn('Set up','sm',`data-go="${go}"`))}))))}
    <p style="margin-top:10px"><button type="button" class="btn ghost sm" data-set="$hire.ready=${!ok}">Preview: ${ok?'a missing connection':'all ready'}</button></p>${all?'':U.notice('warn','Not ready','Agents can be created, but runs will be refused until the connections above are active.')}${nav(c,'ORG-010','ORG-012')}`}};

S['ORG-012']={title:'Create agents: review',group:'Create agents',navId:'ORG-008',permission:'agents.hire',
  lead:'Create agents from the installation. Each person you assign gets a separate, private instance. Creating is idempotent: repeating the same request returns the same result.',noEmpty:true,
  render(c){const h=hire(c);const people=[['dana','Dana Kim'],['marcus','Marcus Lee'],['sana','Sana Iqbal'],['jon','Jon Park']];const chosen=people.filter(p=>h.assign[p[0]]).map(p=>p[1]);
    const okName=h.agentName.trim().length>=3;const ready=okName&&chosen.length>=1&&chosen.length<=25&&h.ack&&h.cred==='ORGANIZATION';
    const role=h.role;
    return `${U.steps(labels,4)}<div class="split"><div>${U.card('Agent',`${U.select('Start from',{bind:'$hire.start',value:h.start,options:[['installation','Installation: '+E(h.inst)],['none','None (answer every setting)']]})}${U.input('Agent name',{bind:'$hire.agentName',value:h.agentName,ph:'e.g. QA Engineer · Nova',req:true,error:h.tried&&!okName?'Enter a name of at least 3 characters.':'',hint:'Active names are unique in the organization.'})}<div class="grid g2">${U.input('Project name',{bind:'$hire.projectName',value:h.projectName})}${U.input('Repository URL',{bind:'$hire.repositoryUrl',value:h.repositoryUrl})}${['qa','ta'].includes(role)?U.input('QA URL',{bind:'$hire.qaUrl',value:h.qaUrl}):''}${role!=='qa'?U.input('Project scripts',{bind:'$hire.projectScripts',value:h.projectScripts}):''}${role!=='qa'?U.input('Package registry URL',{bind:'$hire.packageRegistryUrl',value:h.packageRegistryUrl}):''}</div><p class="muted"><small>Which answers a role asks for is illustrative.</small></p>`)}
    <div style="height:14px"></div>${U.card('Model',`<div class="grid g2">${U.select('Provider',{bind:'$hire.provider',value:h.provider,options:[['anthropic','Anthropic (live)'],['openai','OpenAI (Planned)']]})}${U.input('Model identifier',{bind:'$hire.modelId',value:h.modelId,ph:'free text',hint:'Entered by hand today.'})}</div>${U.select('Credential',{bind:'$hire.cred',value:h.cred,options:[['ORGANIZATION','Organization credential'],['EMPLOYEE_BYOK','Employee key (Planned)']]})}${h.cred==='EMPLOYEE_BYOK'?U.notice('bad','Refused (MODEL_CREDENTIAL_UNAVAILABLE)','Employee-held keys are not available yet. Choose the organization credential.'):''}`)}</div>
    <aside>${U.card('Assign to employees',`<p class="muted" style="margin-bottom:8px">${chosen.length} of 25 selected</p>${people.map(([k,n])=>`<label style="display:flex;gap:8px;margin:6px 0"><input type="checkbox" data-bind="$hire.assign.${k}" ${h.assign[k]?'checked':''}> ${n}</label>`).join('')}`)}<div style="height:14px"></div>${U.card('Create',`<p class="muted">Manifest v2 issuance: ${U.badge('on (set at deployment)','ok')}</p><label style="display:flex;gap:8px;margin:12px 0"><input type="checkbox" data-bind="$hire.ack" ${h.ack?'checked':''}> I reviewed the enforced permissions.</label><div style="display:grid;gap:8px">${U.btn('Review enforced permissions','','data-go="ORG-010"')}${U.btn('Create agents','primary',ready?`data-write data-sim="Create ${chosen.length} agent(s). The same request key returns the same result." data-title="Create agents" data-after="go=1"`:'data-set="$hire.tried=true"')}</div>`)}</aside></div>
    <div class="actions" style="margin-top:16px">${U.btn('← Back','','data-go="ORG-011"')}${c.s.go?U.btn('View result →','primary','data-go="ORG-013"'):''}</div>`}};

S['ORG-013']={title:'Create agents: result',group:'Create agents',navId:'ORG-008',permission:'agents.hire',
  lead:'Each agent gets a signed manifest. An agent is created only once the server confirms it.',noEmpty:true,
  state:{result:'created'},
  render(c){const s=c.s,h=hire(c);const nm=[['dana','Dana Kim'],['marcus','Marcus Lee'],['sana','Sana Iqbal'],['jon','Jon Park']].filter(p=>h.assign[p[0]]).map(p=>p[1]);const names=nm.length?nm:['Dana Kim'];
    const map={created:['ok','Agents created','Each agent has a signed manifest. Nothing runs until an employee starts a task.'],replay:['info','Already completed','This request was completed before. The same result is shown and nothing was created twice.'],failed:['bad','Nothing was created','The request failed before any agent was saved. It is safe to repeat the same request.'],refused:['bad','Refused','The request was not accepted. Review the message and submit a new request.']};
    const m=map[s.result];
    const rows=s.result==='created'||s.result==='replay'?U.card('Manifests',U.table(['Agent for','Manifest','Key id','Digest'],names.map((n,i)=>[n,'v2, signed','<code>af-manifest-2026-10</code>','<code>sha256:'+(['9c41','e07a','b3d2','51f8'][i%4])+'…</code>']),{caption:'Manifests'}),{flush:true}):'';
    return `${U.tabs('result',s.result,[['created','Created'],['replay','Replayed'],['failed','Failed'],['refused','Refused']])}<div class="split"><div>${U.notice(m[0],m[1],m[2])}${rows}<p class="muted" style="margin-top:8px"><small>Key id and digests are samples.</small></p></div><aside>${U.card('Next',U.btn('Open agent directory','primary','data-go="ORG-007"')+' '+(s.result==='failed'||s.result==='refused'?U.btn('Back to the form','','data-go="ORG-012"'):''))}</aside></div>`}};
})();
