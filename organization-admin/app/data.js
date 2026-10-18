/* Shared sample data for the Organization Admin prototype. All values are fictional. */
window.SCREENS=window.SCREENS||{};
window.ORG_DATA={
  org:{name:'Codifyd',slug:'codifyd',region:'India (ap-south-1)',plan:'Growth',seats:'84 / 100',domain:'codifyd.example'},
  teams:[
    {id:'eng',name:'Engineering',parent:null,members:31,agents:6,manager:'Marcus Lee'},
    {id:'qa',name:'Quality Assurance',parent:'eng',members:9,agents:3,manager:'Dana Kim'},
    {id:'fe',name:'Frontend',parent:'eng',members:12,agents:2,manager:'Marcus Lee'},
    {id:'be',name:'Backend',parent:'eng',members:10,agents:1,manager:'Jon Park'},
    {id:'ops',name:'Operations',parent:null,members:14,agents:3,manager:'Sana Iqbal'},
    {id:'prod',name:'Product',parent:null,members:11,agents:1,manager:'Elena Costa'}
  ],
  roles:[
    {n:'Org admin',d:'Configures the organization, policy and connectors',members:3,sys:true},
    {n:'Team lead',d:'Manages team members and assigned agents',members:8,sys:true},
    {n:'Employee',d:'Works with assigned agents within policy',members:67,sys:true},
    {n:'Auditor',d:'Read-only access to audit and access reviews',members:2,sys:false},
    {n:'QA Engineer',d:'Position: tests releases with QA agents',members:9,sys:false}
  ],
  employees:[
    {id:'a1',name:'QA Engineer · Nova',bp:'QA Engineer 2.0.3',team:'Quality Assurance',manager:'Dana Kim',status:'Active',runs:'412',spend:'$128'},
    {id:'a2',name:'QA Engineer · Orion',bp:'QA Engineer 2.0.3',team:'Quality Assurance',manager:'Dana Kim',status:'Active',runs:'287',spend:'$91'},
    {id:'a3',name:'Frontend Engineer · Lyra',bp:'Frontend Engineer 1.4.0',team:'Frontend',manager:'Marcus Lee',status:'Active',runs:'203',spend:'$77'},
    {id:'a4',name:'Release Assistant · Atlas',bp:'Release Assistant 0.9.2',team:'Operations',manager:'Sana Iqbal',status:'Onboarding',runs:'0',spend:'$0'},
    {id:'a5',name:'DevOps Engineer · Vega',bp:'DevOps Engineer 1.1.0',team:'Operations',manager:'Sana Iqbal',status:'Paused',runs:'96',spend:'$44'},
    {id:'a6',name:'Support Triage · Echo',bp:'Support Triage 1.2.1',team:'Product',manager:'Elena Costa',status:'Pending approval',runs:'0',spend:'$0'}
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
    {id:'qa',n:'QA Engineer',v:'2.0.3',d:'Plans tests from Jira stories, runs browser checks, drafts defects.',tools:['Jira','Browser','Bitbucket (read)'],risk:'Medium'},
    {id:'fe',n:'Frontend Engineer',v:'1.4.0',d:'Implements and reviews UI changes in approved repositories.',tools:['Bitbucket','Browser','Shell (sandbox)'],risk:'High'},
    {id:'ops',n:'DevOps Engineer',v:'1.1.0',d:'Checks pipelines and prepares release steps. Cannot deploy.',tools:['Pipelines (read)','Jira'],risk:'Medium'},
    {id:'sup',n:'Support Triage',v:'1.2.1',d:'Classifies tickets and drafts replies for human approval.',tools:['Helpdesk','Slack'],risk:'Low'}
  ],
  approvals:[
    ['Activate “Support Triage · Echo”','Elena Costa','Activation','High-risk tool: Slack post','2 h ago'],
    ['Connector request: Slack','Marcus Lee','Connector','Needs org approval','5 h ago'],
    ['Privileged grant: Jira write (QA team)','Dana Kim','Privilege','Time-boxed 30 days','1 d ago'],
    ['Model key change: Anthropic','Alex Rivera','Key rotation','Second admin required','1 d ago']
  ]
};
