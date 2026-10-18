/* PLT screens 5: regions, feature flags, connector vetting, model providers, compliance requests, status */
(function(){
const S=window.SCREENS,U=AF.ui,E=AF.esc,D=window.PLT_DATA;

S['PLT-023']={title:'Regions & data residency',group:'Operations',navId:'PLT-023',permission:'regions.view',
  lead:'Where tenants’ data and processing live. Moving a tenant between regions is a controlled migration, never a toggle.',
  state:{open:''},emptyText:'No regions are enabled.',
  render(c){const s=c.s;const r=[['India (ap-south-1)','Open','41 tenants','72%','ok'],['EU (eu-west-1)','Open','52 tenants','81%','warn'],['US (us-east-1)','Open','28 tenants','55%','ok'],['EU sovereign (planned)','Planned','0 tenants','—','']];
    return `${U.card('',U.table(['Region','State','Tenants','Capacity used',''],r.map(x=>[`<b>${x[0]}</b>`,U.badge(x[1],x[1]==='Open'?'ok':''),x[2],x[3]==='—'?'—':U.progress(parseInt(x[3]),x[4])+' '+x[3],U.btn('Details','sm',`data-set="open=${x[0]}"`)]),{caption:'Regions'}),{flush:true})}
    ${s.open?U.drawer(s.open,`${U.kv([['Providers','Anthropic, local endpoints'],['Data stays in region','Yes (enforced)'],['Cross-region traffic','Blocked by default']])}${s.open.startsWith('EU (eu')?U.notice('warn','Capacity near limit','81% used. Pause new Enterprise tenants here or add capacity.'):''}<div class="actions" style="margin-top:12px">${U.btn('Pause new tenants','sm','data-write data-sim="Pause new tenant placement in this region" data-title="Pause placement" data-risk="New provisioning requests for this region are blocked." data-confirm="pause region"')}${U.btn('Plan migration','sm','data-sim="A migration is a project with customer consent; open the runbook" data-title="Region migration"')}</div>`,'open'):''}`}};

S['PLT-024']={title:'Feature flags & release trains',group:'Operations',navId:'PLT-024',permission:'flags.manage',
  lead:'Turn capabilities on gradually and safely. Flags never bypass tenant policy or security controls.',
  state:{flags:null},emptyText:'No flags defined.',
  render(c){const s=c.s;if(!s.flags)s.flags=[{n:'offline-cache-v2',d:'Encrypted read-only cache, 24 h',pct:25,on:true},{n:'multi-agent-handoff',d:'Agents hand work to each other with approvals',pct:5,on:true},{n:'artifact-sharing-v2',d:'Governed sharing of artifacts',pct:0,on:false},{n:'blueprint-evals-gate',d:'Block publish when safety suites fail',pct:100,on:true}];
    return `${U.notice('info','Flags are not policy','A flag can hide a feature; it cannot grant a permission. Tenant policy is evaluated independently.')}${U.card('',U.table(['Flag','Description','Rollout','Enabled'],s.flags.map((f,i)=>[`<code>${f.n}</code>`,f.d,`<div style="min-width:120px">${U.progress(f.pct)}<small class="muted">${f.pct}% of tenants</small></div>`,`<label class="switch"><input type="checkbox" data-act="flag:${i}" ${f.on?'checked':''}><span class="tr"></span><span class="sr-only">Enable ${f.n}</span></label>`]),{caption:'Feature flags'}),{flush:true})}`},
  act(n,[i],c){if(n==='flag'){const f=c.s.flags[Number(i)];f.on=!f.on}}};

S['PLT-025']={title:'Connector vetting',group:'Agent catalog',navId:'PLT-025',permission:'connectors.manage',
  lead:'Which connectors tenants may be offered. Each version is reviewed for scopes, data access and vendor risk before release.',
  state:{open:''},emptyText:'No connectors in the catalog.',
  render(c){const s=c.s;const r=[['Jira','3.1','Approved','Reviewed 14 Aug'],['Bitbucket','2.4','Approved','Reviewed 2 Sep'],['Slack','1.0','In review','Scopes under review'],['GitHub','0.8','Rejected','Requires broader scopes than allowed']];
    return `${U.card('',U.table(['Connector','Version','Status','Note',''],r.map(x=>[`<b>${x[0]}</b>`,`<code>${x[1]}</code>`,U.badge(x[2],x[2]==='Approved'?'ok':x[2]==='In review'?'info':'bad'),x[3],U.btn('Review','sm',`data-set="open=${x[0]}"`)]),{caption:'Connectors'}),{flush:true})}
    ${s.open?U.drawer(s.open+' review',`${U.list([{lead:'<span class="badge ok">✓</span>',title:'Scopes are least-privilege'},{lead:`<span class="badge ${s.open==='Slack'?'warn':'ok'}">${s.open==='Slack'?'!':'✓'}</span>`,title:'Data access documented'},{lead:'<span class="badge ok">✓</span>',title:'Tokens stored only in tenant vault'}])}<div class="actions" style="margin-top:12px">${U.btn('Approve version','primary sm','data-write data-sim="Approve connector version for the catalog" data-title="Approve connector"')}${U.btn('Request changes','sm','data-write data-sim="Request changes from the connector owner" data-title="Request changes"')}</div>`,'open'):''}`}};

S['PLT-026']={title:'Model providers',group:'Agent catalog',navId:'PLT-026',permission:'models.manage',
  lead:'Providers and models available to tenants, with regional availability and cost controls. Keys are held in vaults and never shown.',
  state:{tab:'providers'},emptyText:'No providers configured.',
  render(c){const s=c.s;
    return `${U.tabs('tab',s.tab,[['providers','Providers'],['models','Models']])}
    ${s.tab==='providers'?U.card('',U.table(['Provider','Regions','Credentials','Status',''],[['Anthropic','India, EU, US','Platform-managed',U.badge('Enabled','ok'),U.btn('Rotate key','sm','data-write data-sim="Key rotation needs a second operator" data-title="Rotate key" data-risk="In-flight requests continue on the old key until verified." data-confirm="rotate"')],['OpenAI','EU, US','Platform-managed',U.badge('Degraded (EU)','warn'),U.btn('Rotate key','sm','data-write data-sim="Key rotation needs a second operator" data-title="Rotate key" data-risk="In-flight requests continue on the old key until verified." data-confirm="rotate"')],['Local endpoints','Tenant-hosted','Tenant-managed',U.badge('Approved','ok'),'']],{caption:'Providers'}),{flush:true}):''}
    ${s.tab==='models'?U.card('',U.table(['Model','Context','Cost tier','Tool calling','Availability'],[['Large reasoning','200k','High',U.badge('Yes','ok'),'All regions'],['Balanced','200k','Medium',U.badge('Yes','ok'),'All regions'],['Fast','128k','Low',U.badge('Yes','ok'),'India, EU'],['Local 8B','32k','—',U.badge('Limited','warn'),'Tenant-hosted']]),{flush:true}):''}`}};

S['PLT-027']={title:'Compliance & data requests',group:'Governance',navId:'PLT-027',permission:'compliance.manage',
  lead:'Legal holds and data-subject requests across tenants. Operators coordinate; tenants’ own admins execute actions on their data.',
  state:{tab:'requests'},emptyTitle:'No open requests',emptyText:'Requests appear here when a customer or authority files one.',
  render(c){const s=c.s;
    return `${U.tabs('tab',s.tab,[['requests','Requests'],['holds','Legal holds']])}
    ${s.tab==='requests'?U.card('',U.table(['Request','Organization','Type','Due','State',''],[['DSR-882','Helix Systems','Data export','in 12 d',U.badge('In progress','info'),U.btn('Open','sm','data-sim="Open request; the tenant admin performs the export" data-title="Request"')],['DSR-880','Codifyd','Deletion','in 3 d',U.badge('Due soon','warn'),U.btn('Open','sm','data-sim="Open request" data-title="Request"')],['DSR-871','Aster Digital','Access','Done',U.badge('Completed','ok'),'']],{caption:'Data requests'}),{flush:true}):''}
    ${s.tab==='holds'?U.card('Active legal holds',U.table(['Organization','Reason','Since','Effect'],[['Vertex Works','Litigation (ref hidden)','2026-09-01','Deletion blocked']]),{flush:true})+U.notice('info','Why this matters','A hold overrides retention and termination deletion until lifted by Legal.'):''}`}};

S['PLT-028']={title:'Status & maintenance',group:'Overview',navId:'PLT-028',permission:'status.manage',
  lead:'What customers see on the status page, and planned maintenance windows. Public updates need a second approver.',
  state:{tab:'status',draft:''},emptyText:'No maintenance is scheduled.',
  render(c){const s=c.s;
    return `${U.tabs('tab',s.tab,[['status','Status page'],['maint','Maintenance']])}
    ${s.tab==='status'?`<div class="split"><div>${U.card('Components',U.list([['Control plane','ok','Operational'],['Agent runtime (EU)','warn','Degraded performance'],['Connectors','ok','Operational'],['Sign-in','ok','Operational']].map(([n,t,d])=>({title:n,right:U.badge(d,t)}))))}</div><aside>${U.card('Draft update',`${U.textarea('Message to customers',{bind:'draft',value:s.draft,ph:'We are investigating slower agent responses in the EU region.'})}${U.btn('Request publish approval','primary',s.draft.trim().length>=10?'data-write data-sim="Sent to a second approver before going public" data-title="Publish update"':'disabled')}`)}</aside></div>`:''}
    ${s.tab==='maint'?U.card('',U.table(['Window','Scope','Customer notice','State'],[['25 Oct 02:00–03:00 UTC','EU control plane','Sent 7 d ahead',U.badge('Scheduled','info')],['8 Nov 02:00–02:30 UTC','Connectors','Draft',U.badge('Draft')]]),{flush:true,actions:U.btn('＋ Schedule','sm','data-write data-sim="Schedule a maintenance window with notices" data-title="Schedule maintenance"')}):''}`}};
})();
