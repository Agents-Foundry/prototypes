/* EMP screens 2: Jira work, browser tests, artifacts, repository, skills directory, approvals inbox */
(function(){
const S=window.SCREENS,U=AF.ui,E=AF.esc,D=window.EMP_DATA;
const run=c=>c.shared.run||(c.shared.run={approval:'',mode:'running'});

S['EMP-007']={title:'Jira work · QA-184',group:'Evidence',navId:'EMP-007',permission:'jira.read',
  lead:'The story Nova read and the defect it drafted. Agents can read stories and create issues in allowed projects. They cannot attach files to or edit existing issues.',
  state:{tab:'draft'},emptyText:'No story is linked to this task.',
  render(c){const s=c.s,r=run(c);
    const att={draft:['info','Draft only','Nothing has been written to Jira.'],unknown:['warn','Outcome unknown','Jira did not answer, returned a server error or an unreadable answer, so the issue may or may not exist. Do not retry. Ask an administrator to reconcile.'],created:['ok','Created','Jira returned issue key QA-190 (simulated).'],refused:['bad','Refused by Jira','Jira refused the request. A refusal is final: nothing was created.']}[s.tab];
    return `<div class="split"><div>${U.card(`${D.story.id} · ${D.story.title}`,`<h3 style="margin-bottom:6px">Acceptance criteria</h3><ol style="margin:0;padding-left:20px">${D.story.ac.map(a=>`<li>${a}</li>`).join('')}</ol>`,{actions:U.badge('In QA','brand')})}
    <div style="height:16px"></div>${U.card('Drafted test cases (saved as an artifact, not written to Jira)',U.table(['ID','Case','Status'],D.cases.map(x=>[x[0],x[1],U.badge('Draft')]),{caption:'Test cases'}),{flush:true})}</div>
    <aside class="sidepanel">${U.card('Defect in Jira',`${U.tabs('tab',s.tab,[['draft','Draft'],['unknown','Unknown'],['created','Created'],['refused','Refused']])}${U.notice(att[0],att[1],att[2])}${s.tab==='draft'?(r.approval==='allowed'?U.notice('ok','Approved once','Waiting for Jira to return a receipt.'):U.btn('Request approval to create the issue','primary','data-go="EMP-005"')):''}${s.tab==='unknown'?U.btn('Ask an administrator to reconcile','','data-write data-sim="Ask an administrator to check Jira and record the outcome; the request is not retried" data-title="Ask for reconciliation"'):''}`)}</aside></div>`}};

S['EMP-008']={title:'Browser & test execution',group:'Evidence',navId:'EMP-008',permission:'browser.run',
  lead:'Tests run in an isolated browser against the QA origin configured for this agent. Secrets are masked.',
  state:{view:'results'},noEmpty:true,
  render(c){const s=c.s,v=s.view;
    const rows=D.cases.map(x=>[x[0],x[1],U.badge(x[2],x[2]==='Passed'?'ok':'bad')]);
    const ev=[['Trace (one per failed test)','2'],['Screenshots','5'],['Videos','2'],['Console log','1'],['Network log','1']];
    const res={results:['FAILED','warn'],timeout:['TIMED_OUT','bad'],refused:['DENIED','bad']}[v];
    return `<div class="toolbar">${U.kv([['QA origin','qa-staging.codifyd.example (configured for Nova)'],['Result',U.badge(res[0],res[1])]])}${U.tabs('view',v,[['results','Results'],['timeout','Timed out'],['refused','Refused']])}</div>
    ${v==='timeout'?U.notice('bad','The test run timed out','The browser was closed and temporary data discarded. Ask Nova to start a new run.'):''}
    ${v==='refused'?U.notice('bad','Tests were not run','The runtime could not guarantee isolation or egress control, so nothing ran. Reason codes: ISOLATION_UNAVAILABLE or EGRESS_CONTROL_UNAVAILABLE. Ask an administrator.'):''}
    ${v==='results'?U.notice('warn','2 checks failed','TC-02 and TC-04 failed. A failed check is evidence, not a failed run: the run itself finished.'):''}
    ${v==='results'?U.card('',U.table(['Case','Description','Result'],rows,{caption:'Test results'}),{flush:true})+'<div style="height:16px"></div>'+U.card('Evidence kept',U.table(['Kind','Files'],ev,{caption:'Evidence kinds'}),{flush:true})+'<p class="muted" style="margin:8px 0"><small>3 files not kept: over the per-run limits.</small></p>'+U.btn('Open evidence','primary','data-go="EMP-009"'):''}`}};

S['EMP-009']={title:'Artifacts & evidence',status:'partial',group:'Evidence',navId:'EMP-009',permission:'artifact.view',
  lead:'Everything the agent produced, tied to the run that created it. Each file has a retention class that decides when it is deleted.',
  state:{sel:'checkout-double-discount.png'},emptyText:'Artifacts from runs appear here.',
  render(c){const s=c.s;const all=D.artifacts.concat([{n:'scratch-notes.txt',k:'Notes',s:'UNMANAGED',t:'2 d ago',sz:'1 KB',r:'—'},{n:'run-2288-log.txt',k:'Log',s:'DELETED',t:'31 d ago',sz:'—',r:'30 d'}]);const a=all.find(x=>x.n===s.sel)||all[0];
    const tone=x=>x==='DELETED'?'bad':x==='UNMANAGED'?'warn':x==='Draft'?'info':'ok';
    const gone=a.s==='DELETED';
    return `<div class="split"><div>${U.card('',U.table(['File','Type','Retention','State','Size','Created'],all.map(x=>({attrs:`data-set="sel=${x.n}"`,cls:x.n===a.n?'sel':'',cells:[`<b>${x.n}</b>`,x.k,U.badge(x.r,x.r==='—'?'':'brand'),U.badge(x.s,tone(x.s)),x.sz,x.t]})),{caption:'Artifacts'}),{flush:true})}</div>
    <aside class="sidepanel">${U.card(a.n,`<div class="diff" style="padding:30px 12px;text-align:center;font-family:var(--font)"><span class="muted">${gone?'Deleted by the retention policy':'Preview (sanitized)'}</span></div>${U.kv([['Type',a.k],['Created by','Nova · run 2291'],['Retention',a.r==='—'?'Not managed by a retention class':a.r],['Integrity',gone?'Not available':a.s==='UNMANAGED'?'Not checked':'Verified: stored hash matches <code>sha256:9c41…e07</code>'],['Redaction','Secrets and personal data removed']])}<div class="actions" style="margin-top:12px">${U.btn('Request download','sm',gone?'disabled':'data-write data-sim="A personal download permission valid for 60 seconds is issued to you only" data-title="Request download"')} ${U.badge('In-app download: Partial','info')}</div>`)}</aside></div>`}};

S['EMP-010']={title:'Repository context',group:'Evidence',navId:'EMP-010',permission:'repo.read',
  lead:'The workspace for this thread. It holds one configured repository and nothing else. Credentials for a private checkout are never shown to you or to the agent.',
  state:{tab:'status'},emptyText:'No repository is configured for this agent.',
  render(c){const s=c.s,t=s.tab;
    const body={
      status:U.card('Working tree (git.status)',`<div class="diff"><div class="h">On branch main · configured repository web-checkout</div><div class="a">+ M src/checkout/promo.ts</div><div class="a">+ M tests/e2e/checkout.spec.ts</div></div><p class="muted" style="margin-top:8px"><small>File reads and writes stay inside the workspace and within size limits.</small></p>`),
      scripts:U.card('Allowed scripts',U.list([{title:'<code>npm run test</code>',sub:'Listed in the project scripts',right:U.badge('Allowed','ok')},{title:'<code>npm run lint</code>',sub:'Listed in the project scripts',right:U.badge('Allowed','ok')},{title:'<code>npm run deploy</code>',sub:'Not listed in the project scripts',right:U.badge('Not allowed','bad')}])+`<p class="muted" style="margin-top:8px"><small>Dependencies install only from the configured registry.</small></p>`),
      changes:U.card('Change set',U.table(['File','Change'],[['src/checkout/promo.ts','Modified'],['tests/e2e/checkout.spec.ts','Modified']],{caption:'Change set'})+`<p class="muted" style="margin-top:8px">Opening a draft pull request from this change set is a High-risk action that an administrator approves.</p>`),
      lost:U.notice('bad','Workspace lost (WORKSPACE_LOST)','The workspace for this thread is gone. It is not recreated silently. Ask the agent to start a new run so you can see what is rebuilt.')
    }[t];
    return `${U.tabs('tab',t,[['status','Status'],['scripts','Scripts'],['changes','Change set'],['lost','Workspace lost']])}${body}`}};

S['EMP-011']={title:'What this agent can do',group:'Agents',navId:'EMP-011',permission:'skills.view',
  lead:'What Nova can use, as written in its signed manifest. Skills and workflows are pinned by digest. Governed actions show the default outcome; your organization can only make them stricter.',
  state:{tab:'tools'},emptyText:'Nothing here yet.',
  render(c){const s=c.s,t=s.tab;
    const body={
      tools:U.table(['Tool','Used for'],[['<code>jira.read</code>','Read stories'],['<code>jira.issue.create</code>','Create an issue in an allowed project'],['<code>playwright.run</code>','Run browser tests on the configured QA origin'],['<code>git.status</code>','Show the working tree'],['<code>file.read</code> / <code>file.write</code>','Read and write files in the workspace']],{caption:'Tools'}),
      skills:U.table(['Skill','Digest'],[['QA planning','<code>sha256:41ab…92</code>'],['Defect writing','<code>sha256:7e03…c1</code>']],{caption:'Skills'})+'<p class="muted" style="margin-top:8px"><small>Skills are guidance for the agent, not executable code.</small></p>',
      workflows:U.table(['Workflow','Digest'],[['Validate a story','<code>sha256:c2f8…0d</code>']],{caption:'Workflows'}),
      actions:U.table(['Governed action','Risk','Default outcome'],[['<code>jira.read</code>','Low',U.badge('ALLOW','ok')],['<code>workspace.command</code>','Medium',U.badge('ALLOW','ok')],['<code>qa.execute_playwright</code>','Medium',U.badge('REQUIRE_APPROVAL','warn')],['<code>jira.issue.create</code>','Medium',U.badge('REQUIRE_APPROVAL','warn')],['<code>repository.pull_request.create</code>','High',U.badge('REQUIRE_APPROVAL','warn')],['<code>production.deploy</code>','Critical',U.badge('DENY','bad')]],{caption:'Governed actions'}),
      mcp:U.empty('MCP servers are Planned','Model Context Protocol servers are not part of the platform yet.')
    }[t];
    return `${U.tabs('tab',t,[['tools','Tools'],['skills','Skills'],['workflows','Workflows'],['actions','Governed actions'],['mcp','MCP (Planned)']])}${U.card('',body,{flush:true,bodyPad:true})}`}};

S['EMP-012']={title:'Notifications & approvals',group:'Work',navId:'EMP-012',permission:'approval.view',
  lead:'Decisions that are blocking agents, and updates you may want to see.',
  state:{tab:'approvals'},emptyTitle:'All caught up',emptyText:'Approvals and updates appear here.',
  render(c){const s=c.s,r=run(c);
    const mine=r.approval?[]:[['Create Jira Bug in QA: Discount code applied twice','Nova','Medium risk · expires in 8 min']];
    const admin=[['Open draft pull request in agents-foundry/qa-demo','Nova','High risk · waiting for approval in the admin control plane']];
    const list=s.tab==='approvals'?mine:s.tab==='admin'?admin:s.tab==='updates'?[['Run 2291 found 2 failing checks','Nova','12 min ago'],['Run 2290 completed','Nova','Yesterday']]:[['You were mentioned in QA-184','Marcus Lee','1 h ago']];
    return `${U.tabs('tab',s.tab,[['approvals','You can decide ('+mine.length+')'],['admin','Waiting on admin ('+admin.length+')'],['updates','Updates'],['mentions','Mentions']])}${s.tab==='approvals'?U.notice('info','Proposed rule','Employees deciding Low and Medium risk requests is a proposal that needs an accepted ADR. Today an employee sees their own requests and the message Waiting for approval.'):''}${U.card('',list.length?U.list(list.map(x=>({lead:U.avatar(x[1][0],x[1]!=='Marcus Lee'),title:`<b>${x[0]}</b>`,sub:`${x[1]} · ${x[2]}`,right:s.tab==='approvals'?U.btn('Review','sm primary','data-go="EMP-005"'):s.tab==='admin'?U.badge('Waiting on admin','warn'):U.btn('Open','sm','data-go="EMP-021"')}))):U.empty('Nothing here','You have no items in this tab.'))}`}};
})();
