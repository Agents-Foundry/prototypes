/* Shared sample data for the Organization Admin prototype. All values are fictional. */
window.SCREENS=window.SCREENS||{};
window.ORG_DATA={
  org:{name:'Codifyd',slug:'codifyd',plan:'Growth',seats:'84 / 100',domain:'codifyd.example'},
  teams:[
    {id:'eng',name:'Engineering',code:'ENG',type:'department',status:'active',parent:null,members:31,agents:6,manager:'Marcus Lee',head:'Head of Engineering',holder:'Marcus Lee'},
    {id:'qa',name:'Quality Assurance',code:'QA',type:'team',status:'active',parent:'eng',members:9,agents:3,manager:'Dana Kim',head:'QA Lead',holder:'Dana Kim'},
    {id:'fe',name:'Frontend',code:'FE',type:'team',status:'active',parent:'eng',members:12,agents:2,manager:'Marcus Lee',head:'Frontend Lead',holder:'(vacant)'},
    {id:'be',name:'Backend',code:'BE',type:'team',status:'active',parent:'eng',members:10,agents:1,manager:'Jon Park',head:'Backend Lead',holder:'Jon Park'},
    {id:'ops',name:'Operations',code:'OPS',type:'department',status:'active',parent:null,members:14,agents:3,manager:'Sana Iqbal',head:'Head of Operations',holder:'Sana Iqbal'},
    {id:'prod',name:'Product',code:'PRD',type:'department',status:'active',parent:null,members:11,agents:1,manager:'Elena Costa',head:'Head of Product',holder:'Elena Costa'},
    {id:'old',name:'Guild: Accessibility',code:'A11Y',type:'guild',status:'archived',parent:null,members:0,agents:0,manager:'—',head:'Guild lead',holder:'(vacant)'}
  ],
  roles:[
    {n:'Org admin',d:'Configures the organization, policy and connectors',members:3,sys:true},
    {n:'Team lead',d:'Manages team members and assigned agents',members:8,sys:true},
    {n:'Employee',d:'Works with assigned agents within policy',members:67,sys:true},
    {n:'Auditor',d:'Read-only access to audit and access reviews',members:2,sys:false},
    {n:'QA Engineer',d:'Position: tests releases with QA agents',members:9,sys:false}
  ],
  employees:[
    {id:'a1',name:'QA Engineer · Nova',bp:'QA Engineer 1.1.0',inst:'QA default',digest:'sha256:41ab…92',mv:'v2',team:'Quality Assurance',manager:'Dana Kim',status:'Active',runs:'412',spend:'1.28M tokens'},
    {id:'a2',name:'QA Engineer · Orion',bp:'QA Engineer 1.1.0',inst:'QA default',digest:'sha256:41ab…92',mv:'v2',team:'Quality Assurance',manager:'Priya Nair',status:'Active',runs:'287',spend:'0.91M tokens'},
    {id:'a3',name:'Frontend Engineer · Lyra',bp:'Frontend Engineer 1.0.0',inst:'Frontend default',digest:'sha256:7e03…c1',mv:'v2',team:'Frontend',manager:'Marcus Lee',status:'Active',runs:'203',spend:'0.77M tokens'},
    {id:'a4',name:'Code Reviewer · Atlas',bp:'Code Reviewer 1.0.0',inst:'Review default',digest:'sha256:c2f8…0d',mv:'v2',team:'Engineering',manager:'Marcus Lee',status:'Active',runs:'96',spend:'0.44M tokens'},
    {id:'a5',name:'Backend Engineer · Vega',bp:'Backend Engineer 1.0.0',inst:'Backend default',digest:'sha256:b3d2…5a',mv:'v2',team:'Backend',manager:'Jon Park',status:'Retired',runs:'31',spend:'0.12M tokens'}
  ],
  people:[
    ['Alex Rivera','alex@codifyd.example','Org admin','Operations','Active','Today'],
    ['Dana Kim','dana@codifyd.example','Team lead','Quality Assurance','Active','Today'],
    ['Marcus Lee','marcus@codifyd.example','Team lead','Engineering','Active','Yesterday'],
    ['Sana Iqbal','sana@codifyd.example','Team lead','Operations','Active','Today'],
    ['Jon Park','jon@codifyd.example','Employee','Backend','Active','3 days ago'],
    ['Priya Nair','priya@codifyd.example','Employee','Quality Assurance','Invited','—'],
    ['Lee Wong','lee@codifyd.example','Employee','Frontend','Suspended','3 weeks ago']
  ],
  blueprints:[
    {id:'qa',n:'QA Engineer',mission:'Plans tests from Jira stories, runs browser checks, drafts defects.',vers:[['1.1.0','sha256:41ab…92'],['1.0.0','sha256:09de…7c']],skills:['QA planning','Defect writing'],workflows:['Validate a story']},
    {id:'fe',n:'Frontend Engineer',mission:'Implements UI changes in the configured repository (implement-ui-change).',vers:[['1.0.0','sha256:7e03…c1']],skills:['UI change'],workflows:['implement-ui-change']},
    {id:'be',n:'Backend Engineer',mission:'Implements API changes in the configured repository (implement-api-change).',vers:[['1.0.0','sha256:b3d2…5a']],skills:['API change'],workflows:['implement-api-change']},
    {id:'cr',n:'Code Reviewer',mission:'Reviews a change set and reports findings (review-change).',vers:[['1.0.0','sha256:c2f8…0d']],skills:['Change review'],workflows:['review-change']},
    {id:'ta',n:'Test Automation Engineer',mission:'Automates regression tests (automate-regression-tests).',vers:[['1.1.0','sha256:55f1…ab'],['1.0.0','sha256:2a6e…f3']],skills:['Test automation'],workflows:['automate-regression-tests']}
  ],
  approvals:[
    ['Open draft pull request in agents-foundry/qa-demo','Nova, for Dana Kim','High risk','repository.pull_request.create','expires in 6 min'],
    ['Open draft pull request in agents-foundry/web-checkout','Lyra, for Marcus Lee','High risk','repository.pull_request.create','expires in 9 min'],
    ['Create Jira Bug in QA: Totals rounding off by one cent','Nova, for Dana Kim','Tightened','jira.issue.create (override: admin approval)','expires in 4 min'],
    ['Create Jira Bug in QA: Promo field accepts spaces','Orion, for Priya Nair','Expired','jira.issue.create','expired 1 h ago']
  ]
};
