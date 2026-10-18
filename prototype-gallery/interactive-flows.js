/* Self-contained, simulated gallery journeys. No network, credentials or persistent writes. */
(function () {
  'use strict';
  const catalog = {
    platform: [
      ['Filter tenants','Search organization','Codifyd','directory'],
      ['Inspect tenant','Tenant identifier','codifyd-demo','inspect'],
      ['Review provisioning','Tenant slug','new-tenant-demo','provision'],
      ['Check quota','Monthly token allowance','100000','quota'],
      ['Inspect health','Service name','Agent runtime','health'],
      ['Review governance','Exception identifier','POL-104','governance'],
      ['Trace incident','Incident identifier','INC-202','audit']
    ],
    admin: [
      ['Edit team','Team name','QA Engineering','team'],
      ['Invite member','Email address','reviewer@example.invalid','invite'],
      ['Compare role','Role name','Team Lead','role'],
      ['Assign agent','Agent version','QA Engineer v2','assignment'],
      ['Validate provider','Provider name','Anthropic','provider'],
      ['Review access','Access review ID','AR-202','access'],
      ['Inspect audit','Audit event ID','AUD-101','audit']
    ],
    employee: [
      ['Select agent','Agent name','QA Engineer','agent'],
      ['Draft task','Jira issue','DEMO-123','task'],
      ['Inspect run','Run identifier','RUN-104','run'],
      ['Review artifact','Artifact name','Playwright trace','artifact'],
      ['Review approval','Approval request','APR-101','approval'],
      ['Reconcile run','Run identifier','RUN-104','recovery'],
      ['Find history','Search query','Regression','history']
    ],
    studio: [
      ['Create blueprint','Blueprint name','QA Engineer','blueprint'],
      ['Edit contract','Output schema','TestCase[]','contract'],
      ['Review tool grant','Tool name','Jira write','tool'],
      ['Validate policy','Model identifier','claude-demo','policy'],
      ['Run evaluation','Evaluation suite','Policy denial','evaluation'],
      ['Compare versions','Base version','v1','diff'],
      ['Review publish','Candidate version','v2','publish']
    ]
  };
  const overview = {
    platform: ['Open tenant directory','Tenant filter','Active','directory'],
    admin: ['Review organization','Department','Engineering','team'],
    employee: ['Start from workspace','Assigned agent','QA Engineer','agent'],
    studio: ['Browse blueprints','Blueprint','QA Engineer','blueprint']
  };
  function spec(surface, index) {
    return index === 0 ? overview[surface] : (catalog[surface] || [])[index - 1];
  }
  function safe(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function render(surface, index, state) {
    const data = spec(surface,index);
    if (!data) return '';
    const [action,label,example,kind] = data;
    const key = surface + ':' + index;
    const record = state.flows?.[key];
    const value = record?.value ?? example;
    const result = record?.result;
    const sensitive = ['provision','invite','assignment','approval','publish','tool','access','governance','quota'].includes(kind);
    return '<section class="detail-panel" aria-label="Interactive ' + safe(action) + ' scenario">' +
      '<h4>' + safe(action) + ' · interactive simulation</h4>' +
      '<label class="field" for="flow-input">' + safe(label) +
      '<input id="flow-input" maxlength="100" value="' + safe(value) + '" autocomplete="off" required></label>' +
      '<p class="review-hint">Demo-only input; it is not sent to a server or saved outside this page.</p>' +
      (sensitive ? '<p class="notice">Privileged operation: preview only. No real approval or permission change is possible.</p>' : '') +
      '<div class="actions"><button class="btn" data-action="flow-validate">Validate sample</button>' +
      '<button class="btn secondary" data-action="flow-clear">Clear result</button></div>' +
      (result ? '<div class="notice" role="status"><strong>' + safe(result.title) + '</strong><p>' + safe(result.detail) + '</p></div>' : '') +
      '</section>';
  }
  function validate(surface,index,raw,state) {
    const data=spec(surface,index); if(!data) return;
    const [action,label,,kind]=data;
    const key=surface+':'+index;
    const value=String(raw || '').trim();
    let result;
    if (!value) result={title:'Validation failed',detail:label+' is required.'};
    else if (kind==='invite' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      result={title:'Validation failed',detail:'Enter an email address in a valid format.'};
    else if (kind==='provision' && !/^[a-z][a-z0-9-]{2,39}$/.test(value))
      result={title:'Validation failed',detail:'Use a lowercase slug of 3–40 letters, digits or hyphens, starting with a letter.'};
    else if (kind==='quota' && (!/^\d+$/.test(value) || Number(value)<1))
      result={title:'Validation failed',detail:'Allowance must be a positive whole number.'};
    else result={title:'Sample validated',detail:action+' for “'+value+'” is a read-only demonstration. No data was changed.'};
    state.flows=state.flows || {};
    state.flows[key]={value,result};
  }
  function clear(surface,index,state) {
    if (state.flows) delete state.flows[surface+':'+index];
  }
  window.GalleryFlows={render,validate,clear,spec};
}());
