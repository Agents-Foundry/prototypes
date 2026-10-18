/* Employee Desktop (EMP) — navigation and mount. Screens live in screens-*.js */
AF.mount({
  surfaceLabel:'Employee Desktop',
  roleName:'Employee',
  persona:'Employee working with assigned AI agents (Dana Kim, QA lead)',
  user:'Dana Kim · QA lead',
  tenant:{name:'Codifyd · Quality Assurance',sub:'Signed in · Staging allowed · Production read-only'},
  home:'EMP-002',
  nav:[
    {group:'Work',items:[['EMP-002','Workspace','⌂'],['EMP-019','New task','＋'],['EMP-003','Conversation','✉'],['EMP-004','Run & progress','▶'],['EMP-012','Approvals','☑','2']]},
    {group:'Evidence',items:[['EMP-007','Jira work','▤'],['EMP-008','Browser tests','◎'],['EMP-009','Artifacts','▥'],['EMP-010','Repository','⎇'],['EMP-022','Code review','⇄'],['EMP-020','Defect draft','⚑'],['EMP-021','Run report','✔']]},
    {group:'Agents',items:[['EMP-018','My agents','◈'],['EMP-011','Skills & connectors','⚙'],['EMP-023','Memory','✎']]},
    {group:'Library',items:[['EMP-013','History & search','⌕']]},
    {group:'Account',items:[['EMP-006','Accounts & vault','🔑'],['EMP-014','Environments','☰'],['EMP-015','Settings & privacy','⛨'],['EMP-016','Offline & recovery','↻'],['EMP-024','Support','?']]}
  ],
  screens:window.SCREENS
});
