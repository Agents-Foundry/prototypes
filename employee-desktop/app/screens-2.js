/* EMP screens 2: Jira work, browser tests, artifacts, repository, skills directory, approvals inbox */
(function(){
const S=window.SCREENS,U=AF.ui,E=AF.esc,D=window.EMP_DATA;
const run=c=>c.shared.run||(c.shared.run={approval:'',mode:'running'});

S['EMP-007']={title:'Jira work · QA-184',group:'Evidence',navId:'EMP-007',permission:'jira.read',
  lead:'The story, the test cases Nova drafted and the state of anything written back to Jira.',
  state:{tab:'draft'},emptyText:'No story is linked to this task.',
  render(c){const s=c.s,r=run(c);
    const att={draft:['info','Draft only','Nothing has been written to Jira.'],conflict:['warn','Conflict','Someone edited QA-184 after Nova read it. Nothing was overwritten; review the differences first.'],submitted:['ok','Attached','Jira returned receipt J-88213 (simulated).'],failed:['bad','Attachment failed','Jira rejected the attachment (permission). Nothing changed. You can retry safely.']}[s.tab];
    return `<div class="split"><div>${U.card(`${D.story.id} · ${D.story.title}`,`<h3 style="margin-bottom:6px">Acceptance criteria</h3><ol style="margin:0;padding-left:20px">${D.story.ac.map(a=>`<li>${a}</li>`).join('')}</ol>`,{actions:U.badge('In QA','brand')})}
    <div style="height:16px"></div>${U.card('Drafted test cases',U.table(['ID','Case','Status'],D.cases.map(x=>[x[0],x[1],U.badge('Draft')]),{caption:'Test cases'}),{flush:true})}</div>
    <aside class="sidepanel">${U.card('Write-back to Jira',`${U.tabs('tab',s.tab,[['draft','Draft'],['conflict','Conflict'],['submitted','Attached'],['failed','Failed']])}${U.notice(att[0],att[1],att[2])}${s.tab==='draft'?(r.approval==='allowed'?U.notice('ok','Approved once','Ready to attach.'):U.btn('Request approval to attach','primary','data-go="EMP-005"')):''}${s.tab==='conflict'?U.btn('Review differences','','data-sim="Show a side-by-side of your story edits vs. Nova’s read" data-title="Review conflict"'):''}${s.tab==='failed'?U.btn('Retry safely','','data-write data-sim="Retry with the same request key; no duplicate is created" data-title="Retry attachment"'):''}`)}</aside></div>`}};

S['EMP-008']={title:'Browser & test execution',group:'Evidence',navId:'EMP-008',permission:'browser.run',
  lead:'Tests run in an isolated browser against approved origins only. You see what it sees; secrets are masked.',
  state:{env:'Staging',view:'results'},noEmpty:true,
  render(c){const s=c.s,r=run(c);const started=r.approval!=='';
    const rows=D.cases.map(x=>[x[0],x[1],started?U.badge(x[2],x[2]==='Passed'?'ok':'bad'):U.badge('Not run')]);
    return `<div class="toolbar">${U.select('Environment',{bind:'env',value:s.env,options:['Development','Staging'],hint:'Production is not available for tests.'})}${U.tabs('view',s.view,[['results','Results'],['timeout','Timeout'],['live','Live view']])}</div>
    ${!started?U.notice('info','Waiting','Nova will run tests after the Jira attachment decision.'):''}
    ${s.view==='timeout'?U.notice('bad','Test TC-04 timed out','No response from checkout in 60 s. The browser was closed and temporary data discarded. Retry on a fresh session?')+U.btn('Retry case','sm','data-write data-sim="Retry TC-04 on a fresh isolated session" data-title="Retry test"'):''}
    ${s.view==='live'?U.card('Isolated session · '+s.env,`<div class="diff" style="padding:40px 16px;text-align:center;font-family:var(--font)" aria-label="Browser view placeholder"><div class="muted">Browser view (simulated)</div><div style="margin:10px auto;max-width:420px;border:1px dashed var(--border-strong);padding:20px;border-radius:12px">Checkout · promo field shows ••••••• (secret masked)</div><div class="muted">Origin: staging.codifyd.example · approved</div></div>`):''}
    ${s.view!=='live'?U.card('',U.table(['Case','Description','Result'],rows,{caption:'Test results'}),{flush:true}):''}
    ${started?U.notice('warn','2 failures found','TC-02 and TC-04 failed. Evidence is available.')+U.btn('Open evidence','primary','data-go="EMP-009"'):''}`}};

S['EMP-009']={title:'Artifacts & evidence',status:'partial',group:'Evidence',navId:'EMP-009',permission:'artifact.view',
  lead:'Everything the agent produced. Evidence is sanitized and tied to the run that created it.',
  state:{sel:'checkout-double-discount.png'},emptyText:'Artifacts from runs appear here.',
  render(c){const s=c.s;const a=D.artifacts.find(x=>x.n===s.sel)||D.artifacts[0];
    return `<div class="split"><div>${U.card('',U.table(['File','Type','State','Size','Created'],D.artifacts.map(x=>({attrs:`data-set="sel=${x.n}"`,cls:x.n===a.n?'sel':'',cells:[`<b>${x.n}</b>`,x.k,U.badge(x.s,x.s==='Draft'?'info':'ok'),x.sz,x.t]})),{caption:'Artifacts'}),{flush:true})}</div>
    <aside class="sidepanel">${U.card(a.n,`<div class="diff" style="padding:30px 12px;text-align:center;font-family:var(--font)"><span class="muted">Preview (sanitized)</span></div>${U.kv([['Type',a.k],['Created by','Nova · run 2291'],['Integrity','<code>sha256:9c41…e07</code>'],['Redaction','Secrets and personal data removed']])}<div class="actions" style="margin-top:12px">${U.btn('Download','sm','data-write data-sim="Download sanitized copy" data-title="Download"')}${U.btn('Share…','sm','data-write data-sim="Share with team members who can already view QA-184" data-title="Share artifact"')}${U.btn('Delete','sm danger','data-write data-sim="Delete this artifact" data-title="Delete artifact" data-risk="Deletion is recorded; legal hold blocks deletion if active." data-confirm="delete"')}</div>`)}</aside></div>`}};

S['EMP-010']={title:'Repository context',group:'Evidence',navId:'EMP-010',permission:'repo.read',
  lead:'The code your agent can read. Scope is limited to approved repositories and branches; indexing runs in an isolated workspace.',
  state:{repo:'web-checkout',branch:'main'},emptyText:'No repository scope is approved for this task.',
  render(c){const s=c.s;
    const repos=[['web-checkout','Indexed',100,'ok'],['payments-api','Indexing',64,'info'],['design-tokens','Stale (41 d)',100,'warn'],['infra-secrets','Not permitted',0,'bad']];
    const cur=repos.find(r=>r[0]===s.repo);
    return `<div class="split"><div>${U.card('Repositories',U.list(repos.map(r=>({lead:U.avatar(r[0][0].toUpperCase()),title:`<b>${r[0]}</b>`,sub:r[1]==='Not permitted'?'Outside your approved scope':'',right:`${U.badge(r[1],r[3])} ${U.btn(s.repo===r[0]?'Selected':'Select','sm',r[3]==='bad'?'disabled':`data-set="repo=${r[0]}"`)}`}))))}</div>
    <aside>${U.card(cur[0],`${U.select('Branch',{bind:'branch',value:s.branch,options:['main','release/4.8','feature/promo-fix']})}${cur[2]<100?U.progress(cur[2])+'<p class="muted" style="margin-top:6px">Indexing '+cur[2]+'%</p>':''}${cur[3]==='warn'?U.notice('warn','Stale','Index is 41 days old. Refresh before relying on it.')+U.btn('Refresh index','sm','data-write data-sim="Refresh index in isolated workspace" data-title="Refresh index"'):''}<h3 style="margin:12px 0 6px">Files (read-only)</h3><div class="diff"><div>src/</div><div>  checkout/promo.ts</div><div>  checkout/totals.ts</div><div>tests/</div><div>  e2e/checkout.spec.ts</div></div>`)}</aside></div>`}};

S['EMP-011']={title:'Skills, tools & connectors',group:'Agents',navId:'EMP-011',permission:'skills.view',
  lead:'What your agents can use. Only items your administrator approved can run; you can request more.',
  state:{q:'',tab:'installed'},emptyText:'Nothing here yet.',
  render(c){const s=c.s,q=s.q.toLowerCase();
    const all=[['Jira','Read stories, attach files','installed','Approved'],['Browser testing','Run tests in an isolated browser','installed','Approved'],['Bitbucket (read)','Read repositories and diffs','installed','Approved'],['Slack','Post to #qa-reports','request','Needs approval'],['Accessibility scan','Check pages against WCAG 2.2 AA','request','In review'],['GitHub','Read repositories','unavailable','Not approved']];
    const rows=all.filter(x=>x[2]===s.tab&&(x[0]+x[1]).toLowerCase().includes(q));
    return `${U.tabs('tab',s.tab,[['installed','Installed'],['request','Requestable'],['unavailable','Unavailable']])}<div class="toolbar"><div class="grow">${U.input('Search',{bind:'q',value:s.q})}</div></div>
    <div class="grid g3">${rows.map(x=>U.card(x[0],`<p class="muted" style="margin-bottom:10px">${x[1]}</p>${U.badge(x[3],x[2]==='installed'?'ok':x[2]==='request'?'info':'')} ${x[2]==='request'?U.btn('Request','sm','data-write data-sim="Request sent to your administrator" data-title="Request"'):''}`)).join('')||U.empty('Nothing matches','Try another tab or search.')}</div>`}};

S['EMP-012']={title:'Notifications & approvals',group:'Work',navId:'EMP-012',permission:'approval.view',
  lead:'Decisions that are blocking agents, and updates you may want to see.',
  state:{tab:'approvals'},emptyTitle:'All caught up',emptyText:'Approvals and updates appear here.',
  render(c){const s=c.s,r=run(c);
    const apps=r.approval?[]:[['Attach test cases to QA-184','Nova','Expires in 8 min']];
    const more=[['Publish Atlas release plan to Confluence','Atlas','Expires in 2 h'],['Create Jira defect QA-190','Nova','Draft ready']];
    const list=s.tab==='approvals'?apps.concat(more):s.tab==='updates'?[['Run 2291 found 2 failures','Nova','12 min ago'],['Bitbucket connection expires in 3 days','System','Today']]:[['You were mentioned in QA-184','Marcus Lee','1 h ago']];
    return `${U.tabs('tab',s.tab,[['approvals','Approvals ('+(apps.length+more.length)+')'],['updates','Updates'],['mentions','Mentions']])}${U.card('',list.length?U.list(list.map(x=>({lead:U.avatar(x[1][0],x[1]!=='System'&&x[1]!=='Marcus Lee'),title:`<b>${x[0]}</b>`,sub:`${x[1]} · ${x[2]}`,right:s.tab==='approvals'?U.btn('Review','sm primary','data-go="EMP-005"'):U.btn('Open','sm','data-go="EMP-021"')}))):U.empty('Nothing here','You have no items in this tab.'))}`}};
})();
