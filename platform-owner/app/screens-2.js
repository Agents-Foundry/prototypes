/* PLT screens 2: invitations, plans, billing, usage, blueprint catalog, rollouts */
(function(){
const S=window.SCREENS,U=AF.ui,E=AF.esc,D=window.PLT_DATA;

S['PLT-007']={title:'Tenant invitation & handoff',group:'Organizations',navId:'PLT-005',permission:'tenants.invite',
  lead:'Invite the first administrator and confirm they have taken over. Invitations are one-time links; passwords are never shared.',
  state:{open:''},emptyText:'No invitations are outstanding.',
  render(c){const s=c.s;const rows=[['Northwind Labs','priya@northwind.example','Pending','Expires in 6 d','info'],['Lumen Retail','owner@lumen.example','Expired','Expired 2 d ago','warn'],['Aster Digital','cto@aster.example','Accepted','Accepted 12 Aug','ok'],['Vertex Works','ops@vertex.example','Revoked','Revoked by Sam Okafor','bad']];
    return `${U.card('',U.table(['Organization','Invitee','Status','Detail',''],rows.map(r=>[`<b>${r[0]}</b>`,r[1],U.badge(r[2],r[4]),r[3],r[2]==='Pending'||r[2]==='Expired'?`<span class="actions">${U.btn(r[2]==='Expired'?'Reissue':'Resend','sm','data-write data-sim="Send a new one-time invitation to '+r[1]+'. Earlier links stop working." data-title="Send invitation"')}${r[2]==='Pending'?U.btn('Revoke','sm','data-write data-sim="Revoke the invitation" data-title="Revoke invitation" data-risk="The link stops working immediately." data-confirm="revoke"'):''}</span>`:U.btn('Details','sm',`data-set="open=${r[0]}"`)]),{caption:'Invitations'}),{flush:true})}
    ${s.open?U.drawer(s.open+' · handoff',U.timeline([{tone:'ok',title:'Invitation sent'},{tone:'ok',title:'Admin accepted and set up MFA'},{tone:'ok',title:'Domain verified'},{tone:'wait',title:'First AI employee hired',sub:'Optional'}])+U.notice('info','Handoff complete when','the admin has MFA and a verified domain. You do not get ongoing access.'),'open'):''}`}};

S['PLT-008']={title:'Plans & entitlements',group:'Commercial',navId:'PLT-008',permission:'plans.view',
  lead:'Offer plans and set what each includes. Changes to a tenant take effect after review and never reduce limits below current use without notice.',
  state:{org:'Aster Digital',plan:'Growth'},noEmpty:true,
  render(c){const s=c.s;const plans=[['Trial','$0','10 seats · 1 AI employee · 14 days'],['Starter','$180','25 seats · 3 AI employees'],['Growth','$1,240','100 seats · 10 AI employees'],['Enterprise','Custom','Unlimited seats · SSO/SCIM · dedicated region']];
    return `<div class="grid g4" style="margin-bottom:16px">${plans.map(p=>U.card(p[0],`<div class="stat"><div class="v">${p[1]}</div></div><p class="muted" style="margin-top:6px">${p[2]}</p>`)).join('')}</div>
    <div class="split-eq">${U.card('Change a tenant’s plan',`${U.select('Organization',{bind:'org',value:s.org,options:D.orgs.map(o=>o.name)})}${U.select('New plan',{bind:'plan',value:s.plan,options:plans.map(p=>p[0])})}${s.plan==='Starter'?U.notice('warn','Over limit','Aster Digital has 12 users and 2 AI employees; Starter allows 3. OK. Check Vertex Works (31 users) before downgrading.'):''}${U.btn('Request change','primary','data-write data-sim="Plan change requested; the tenant is notified before it applies" data-title="Change plan"')}`)}
    ${U.card('Entitlement checks',U.list([{lead:'<span class="badge ok">✓</span>',title:'Seats within limit',sub:'On all active tenants'},{lead:'<span class="badge warn">!</span>',title:'2 tenants near AI employee limit',sub:'Notify account owners'},{lead:'<span class="badge ok">✓</span>',title:'No tenant above plan ceilings'}]))}</div>`}};

S['PLT-009']={title:'Billing operations',group:'Commercial',navId:'PLT-009',permission:'billing.view',
  lead:'Invoices and payment health. Billing staff see commercial data only, never tenant content.',
  state:{tab:'attention',open:''},emptyText:'No invoices to show.',
  render(c){const s=c.s;const all=[['INV-4418','Vertex Works','$1,240','Failed (2nd attempt)','bad','attention'],['INV-4412','Aster Digital','$180','Disputed','warn','attention'],['INV-4409','Helix Systems','$9,800','Paid','ok','all'],['INV-4405','Codifyd','$1,240','Paid','ok','all']];
    const rows=all.filter(r=>s.tab==='all'||r[5]==='attention');
    return `<div class="grid g3" style="margin-bottom:16px">${U.stat('Invoiced this month','$42,810','Estimate')}${U.stat('Collected','$39,260','Reconciled')}${U.stat('Past due','3 accounts','$3,100','down')}</div>${U.tabs('tab',s.tab,[['attention','Needs attention'],['all','All invoices']])}${U.card('',U.table(['Invoice','Organization','Amount','Status',''],rows.map(r=>[r[0],`<b>${r[1]}</b>`,r[2],U.badge(r[3],r[4]),U.btn('Open','sm',`data-set="open=${r[0]}"`)]),{caption:'Invoices'}),{flush:true})}
    ${s.open?U.drawer(s.open,`${U.kv([['Organization',all.find(r=>r[0]===s.open)[1]],['Amount',all.find(r=>r[0]===s.open)[2]],['Method','Card ending 4242 (masked)']])}<div class="actions" style="margin-top:14px">${U.btn('Retry payment','primary','data-write data-sim="Retry charge once. Duplicate charges are prevented by an idempotency key." data-title="Retry payment"')}${U.btn('Send reminder','','data-write data-sim="Reminder email sent to the billing contact" data-title="Send reminder"')}${U.btn('Open dispute notes','','data-sim="Dispute notes opened (simulated)" data-title="Dispute"')}</div>`,'open'):''}`}};

S['PLT-010']={title:'Usage & spending',group:'Commercial',navId:'PLT-010',permission:'usage.view',
  lead:'Platform-wide metering. Values are labeled estimated or reconciled so nobody mistakes a forecast for an invoice.',
  state:{tab:'estimated'},emptyText:'Metering data appears after tenants start running agents.',
  render(c){const s=c.s;
    return `${U.tabs('tab',s.tab,[['estimated','Estimated (live)'],['reconciled','Reconciled (last month)']])}${s.tab==='estimated'?U.notice('warn','Estimated','Live usage may lag by up to 15 minutes and is not invoiced.'):U.notice('ok','Reconciled','Matches provider statements as of 3 Oct 2026.')}
    <div class="grid g4" style="margin-bottom:16px">${U.stat('Model spend',s.tab==='estimated'?'$38,200':'$35,640')}${U.stat('Runs',s.tab==='estimated'?'412,980':'398,114')}${U.stat('Cost / run','$0.09')}${U.stat('Anomalies','1','Aster Digital +340%','down')}</div>
    <div class="split-eq">${U.card('By region',U.table(['Region','Spend','Share'],[['India','$14,900','39%'],['EU','$13,100','34%'],['US','$10,200','27%']].map(r=>[r[0],r[1],U.progress(parseInt(r[2]))]),{caption:'Spend by region'}),{flush:true})}${U.card('By provider',U.list([['Anthropic','$21,300','56%'],['OpenAI','$12,700','33%'],['Local endpoints','$4,200','11%']].map(([n,v,p])=>({title:n,sub:p+' of spend',right:`<b>${v}</b>`}))))}</div>`}};

S['PLT-011']={title:'Global blueprint catalog',group:'Agent catalog',navId:'PLT-011',permission:'blueprints.view',
  lead:'Versioned blueprints available across the platform. Operators control publishing; they cannot see how tenants use them beyond aggregates.',
  state:{open:''},emptyText:'No blueprints are published.',
  render(c){const s=c.s;const bp=[['QA Engineer','2.0.3','Published',14,'Priya Nair'],['Frontend Engineer','1.4.0','Published',9,'Marcus Lee'],['DevOps Engineer','1.1.0','Published',6,'Sana Iqbal'],['Release Assistant','1.0.0-rc1','In review',0,'Priya Nair'],['Support Triage','1.2.1','Restricted',11,'Sana Iqbal'],['Release Notes Writer','0.3.4','Deprecated',2,'Marcus Lee']];
    const tn={Published:'ok','In review':'info',Restricted:'warn',Deprecated:'bad'};
    return `${U.card('',U.table(['Blueprint','Version','Status','Adopted by','Author',''],bp.map(b=>[`<b>${b[0]}</b>`,`<code>${b[1]}</code>`,U.badge(b[2],tn[b[2]]),b[3]+' orgs',b[4],U.btn('Open','sm',`data-set="open=${b[0]}"`)]),{caption:'Blueprints'}),{flush:true})}
    ${s.open?U.drawer(s.open,`${U.kv([['Latest version',bp.find(b=>b[0]===s.open)[1]],['Status',bp.find(b=>b[0]===s.open)[2]],['Safety suites','3 of 3 passing'],['Independent review','Completed (simulated)']])}<div class="actions" style="margin-top:14px"><a class="btn sm" href="#/PLT-012">Rollouts</a>${U.btn('Restrict availability','sm','data-write data-sim="Restrict this blueprint to selected organizations" data-title="Restrict blueprint" data-risk="Organizations that cannot see it can no longer hire new employees from it." data-confirm="restrict"')}</div>`,'open'):''}`}};

S['PLT-012']={title:'Blueprint rollout management',group:'Agent catalog',navId:'PLT-012',permission:'rollouts.manage',
  lead:'Controlled availability: staged, pausable and reversible. Watch error rate before widening.',
  state:{paused:false},emptyText:'No rollouts are active.',
  render(c){const s=c.s;
    return `${s.paused?U.notice('warn','Rollout paused','No new organizations receive QA Engineer 2.1.0 until resumed.'):''}<div class="split"><div>${U.card('QA Engineer 2.1.0',`${U.timeline([{tone:'ok',title:'Stage 1 · 5% (1 org)',sub:'Completed · error rate 0.4%'},{tone:s.paused?'wait':'run',title:'Stage 2 · 25% (4 orgs)',sub:s.paused?'Paused by operator':'In progress · 18 h left'},{title:'Stage 3 · all organizations',sub:'Needs manual go-ahead'}])}<div style="margin-top:6px">${U.progress(62)}<small class="muted">62% of stage 2</small></div>`)}</div>
    <aside>${U.card('Controls',`<div style="display:grid;gap:8px">${s.paused?U.btn('Resume rollout','primary','data-write data-sim="Resume stage 2" data-title="Resume" data-after="paused=false"'):U.btn('Pause rollout','','data-write data-sim="Pause. Existing tenants keep their version." data-title="Pause" data-after="paused=true"')}${U.btn('Roll back','danger','data-write data-sim="Roll back to 2.0.3 for new hires" data-title="Roll back" data-risk="New hires get the previous version; admins are notified." data-confirm="rollback"')}</div>`)}<div style="height:16px"></div>${U.card('Health',U.list([['Error rate','0.9%','ok'],['Safety evaluations','Passing','ok'],['Approval wait (median)','2.4 min','ok']].map(([n,v,t])=>({title:n,right:U.badge(v,t)}))))}</aside></div>`}};
})();
