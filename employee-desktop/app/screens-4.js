/* EMP screens 4: new task, defect publish, run report, code review, memory, support */
(function(){
const S=window.SCREENS,U=AF.ui,E=AF.esc,D=window.EMP_DATA;

S['EMP-019']={title:'New task',status:'partial',group:'Work',navId:'EMP-019',permission:'task.create',
  lead:'Delegate work with clear limits. The agent plans first and asks before anything leaves this workspace.',
  state:{agent:'nova',goal:'',env:'Staging',story:'QA-184',autonomy:'ask',limit:'30',tried:false},noEmpty:true,
  render(c){const s=c.s;const bad=s.tried&&s.goal.trim().length<8;
    return `<div class="split"><div>${U.card('What do you need?',`${U.select('Agent',{bind:'agent',value:s.agent,options:D.agents.map(a=>[a.id,a.name])})}${U.textarea('Goal',{bind:'goal',value:s.goal,ph:'e.g. Validate the checkout regression for QA-184 and draft a defect if it reproduces.'})}${bad?`<div class="errmsg" role="alert" style="color:var(--danger);margin:-8px 0 10px">Describe the goal in at least 8 characters.</div>`:''}<div class="grid g2">${U.input('Linked Jira story',{bind:'story',value:s.story})}${U.select('Environment',{bind:'env',value:s.env,options:['Development','Staging']})}</div>`)}</div>
    <aside class="sidepanel">${U.card('Limits',`${U.select('When the agent wants to change something',{bind:'autonomy',value:s.autonomy,options:[['ask','Ask me each time'],['batch','Ask once per run (low risk only)']],hint:'High-risk actions always ask each time.'})}${U.select('Time limit (minutes)',{bind:'limit',value:s.limit,options:['15','30','60']})}<div style="margin-top:8px">${U.btn('Start task','primary',s.goal.trim().length>=8?'data-write data-sim="Task started. Nova will present a plan before acting." data-title="Start task" data-after="tried=false"':'data-set="tried=true"')}</div>`)}</aside></div>`}};

S['EMP-020']={title:'Defect draft & publish review',group:'Evidence',navId:'EMP-021',permission:'jira.write',
  lead:'Nova drafted a defect from the failed tests. Nothing is created in Jira until you approve and Jira confirms it.',
  state:{title:'Discount code applies twice on checkout',sev:'Major',stage:'draft'},noEmpty:true,
  render(c){const s=c.s;
    const msg={draft:['info','Draft','Not created in Jira.'],pending:['warn','Waiting for Jira','Outcome unknown. Do not submit again; check for a receipt.'],created:['ok','Created','Jira confirmed QA-190 (simulated receipt).'],failed:['bad','Not created','Jira rejected the request. Nothing changed. Safe to retry.']}[s.stage];
    return `${U.tabs('stage',s.stage,[['draft','Draft'],['pending','Pending'],['created','Created'],['failed','Failed']])}${U.notice(msg[0],msg[1],msg[2])}
    <div class="split"><div>${U.card('Defect',`${U.input('Title',{bind:'title',value:s.title})}${U.select('Severity',{bind:'sev',value:s.sev,options:['Minor','Major','Critical']})}${U.textarea('Steps to reproduce',{value:'1. Add two items to cart\n2. Apply code SAVE10\n3. Apply SAVE10 again\nExpected: rejected. Observed: applied twice.'})}<h3 style="margin:8px 0 6px">Evidence</h3>${U.list([{title:'checkout-double-discount.png',sub:'Sanitized screenshot',right:U.badge('Attached','ok')},{title:'trace-TC-02.zip',sub:'Redacted trace',right:U.badge('Attached','ok')}])}`)}</div>
    <aside class="sidepanel">${U.card('Publish',`<p class="muted" style="margin-bottom:10px">Creates an issue in project QA. Single use, expires in 10 minutes.</p>${U.btn(s.stage==='created'?'Published':'Approve and create in Jira','primary',s.stage==='created'||s.stage==='pending'?'disabled':'data-write data-sim="Create defect in Jira (single use). Result is reported only after Jira confirms." data-title="Create Jira defect" data-risk="Creates a visible issue assigned to the QA board." data-confirm="create" data-after="stage=pending"')}${s.stage==='pending'?'<div style="margin-top:10px">'+U.btn('Check for receipt','sm','data-set="stage=created"')+'</div>':''}`)}</aside></div>`}};

S['EMP-021']={title:'Run report',group:'Evidence',navId:'EMP-021',permission:'run.view',
  lead:'Run 2291 · Validate checkout regression · QA-184. A factual summary: what ran, what passed, what is confirmed.',
  noEmpty:true,
  actions:()=>U.btn('Export report','','data-write data-sim="Export a redacted PDF report" data-title="Export report"')+U.btn('Create defect','primary','data-go="EMP-020"'),
  render(c){
    return `<div class="grid g4" style="margin-bottom:16px">${U.stat('Cases','8','2 failed','down')}${U.stat('Passed','6','75%')}${U.stat('Duration','4 min 12 s','Staging')}${U.stat('Cost','$0.42','within limit')}</div>
    <div class="split"><div>${U.card('Outcomes',U.table(['Case','Result'],D.cases.map(x=>[`${x[0]} · ${x[1]}`,U.badge(x[2],x[2]==='Passed'?'ok':'bad')]),{caption:'Outcomes'}),{flush:true})}</div>
    <aside>${U.card('Confirmed vs. unconfirmed',U.list([{lead:'<span class="badge ok">✓</span>',title:'Tests ran in Staging',sub:'Run log verified'},{lead:'<span class="badge ok">✓</span>',title:'Evidence sanitized'},{lead:'<span class="badge warn">!</span>',title:'Jira attachment unconfirmed',sub:'Awaiting receipt'}]))}<div style="height:16px"></div>${U.card('Evidence',U.btn('Open artifacts','','data-go="EMP-009"'))}</aside></div>`}};

S['EMP-022']={title:'Code change review',group:'Evidence',navId:'EMP-010',permission:'repo.review',
  lead:'Lyra proposes a change in an isolated workspace. Nothing is pushed until you approve and the repository confirms.',
  state:{decided:''},noEmpty:true,
  render(c){const s=c.s;
    return `${s.decided?U.notice(s.decided==='approved'?'ok':'info','Decision recorded (simulated)',s.decided==='approved'?'A branch would be pushed; the remote confirms before this shows as done.':'Changes requested. Lyra will revise.'):''}<div class="split"><div>${U.card('src/checkout/promo.ts',U.diff(['@@ applyPromo() @@','  const used = order.appliedCodes;','- if (!used.includes(code)) {','+ if (!used.has(code.toUpperCase())) {','    order.total -= discount(code);','+   used.add(code.toUpperCase());','  }']))}<div style="height:16px"></div>${U.card('Tests run',U.list([{lead:'<span class="badge ok">✓</span>',title:'promo.spec.ts · 14 passed'},{lead:'<span class="badge ok">✓</span>',title:'lint · clean'}]))}</div>
    <aside class="sidepanel">${U.card('Decision',`<p class="muted" style="margin-bottom:10px">Branch <code>fix/promo-double-apply</code> · 1 file · +3 −1</p><div style="display:grid;gap:8px">${U.btn('Approve and push branch','primary',s.decided?'disabled':'data-write data-sim="Push branch fix/promo-double-apply (no merge)" data-title="Push branch" data-after="decided=approved"')}${U.btn('Request changes','',s.decided?'disabled':'data-write data-sim="Send feedback to Lyra" data-title="Request changes" data-after="decided=changes"')}</div><p class="muted" style="margin-top:10px"><small>Merging to main is not available to agents.</small></p>`)}</aside></div>`}};

S['EMP-023']={title:'Memory',status:'planned',group:'Agents',navId:'EMP-023',permission:'memory.view',
  lead:'What agents remember to work better with you. Each memory shows where it came from, and you can remove it.',
  state:{items:null},emptyTitle:'No memories',emptyText:'Agents have not saved anything about you.',
  render(c){const s=c.s;if(!s.items)s.items=[{id:1,t:'Prefers concise defect titles',src:'Conversation with Nova · 3 Oct'},{id:2,t:'Staging is the default test environment',src:'Task setup · 28 Sep'},{id:3,t:'Escalate payment bugs to Marcus Lee',src:'Run 2104 · 20 Sep'}];
    return `${s.items.length?U.card('',U.list(s.items.map(m=>({title:`<b>${m.t}</b>`,sub:`Source: ${m.src}`,right:U.btn('Forget','sm',`data-write data-act="forget:${m.id}"`)}))),{actions:U.btn('Forget all','sm danger','data-write data-sim="Forget all memories for your agents" data-title="Forget all" data-risk="Agents lose learned preferences; this is recorded." data-confirm="forget all"')}):U.empty('No memories','Agents will not remember anything until you work together more.')}<p class="muted" style="margin-top:10px"><small>Secrets and personal data are redacted before anything is stored.</small></p>`},
  act(n,[id],c){if(n==='forget')c.s.items=c.s.items.filter(m=>String(m.id)!==id)}};

S['EMP-024']={title:'Support & diagnostics',group:'Account',navId:'EMP-024',permission:'support.view',
  lead:'Check your connection and send a redacted diagnostic bundle. You see what will be sent before it leaves.',
  state:{sent:false},noEmpty:true,
  render(c){const s=c.s;
    return `<div class="split-eq">${U.card('Connection checks',U.list([['Network','ok','Online · 38 ms'],['Sign-in session','ok','Valid for 6 h'],['Jira connector','ok','Reachable'],['Bitbucket connector','warn','Renew in 3 days'],['Policy service','ok','In sync']].map(([n,t,d])=>({lead:`<span class="badge ${t}">${t==='ok'?'✓':'!'}</span>`,title:n,sub:d}))))}
    ${U.card('Send diagnostics',`<p class="muted" style="margin-bottom:8px">The bundle includes app version, connectivity results and error codes. It never includes secrets, conversations or file contents.</p><div class="diff"><div>app 0.9.0-proposal · OS (simulated)</div><div>checks: 5 · warnings: 1</div><div>support ref: SIM-EMP-0000</div></div><div style="margin-top:12px">${s.sent?U.notice('ok','Sent (simulated)','Reference SIM-EMP-0000. No data actually left this prototype.'):U.btn('Send redacted bundle','primary','data-write data-sim="Send the redacted diagnostics bundle" data-title="Send diagnostics" data-after="sent=true"')}</div>`)}</div>`}};
})();
