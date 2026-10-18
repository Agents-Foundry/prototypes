/* Organization Admin (ORG) — navigation and mount. Screens live in screens-*.js */
AF.mount({
  surfaceLabel:'Organization Admin',
  roleName:'Organization admin',
  persona:'Organization administrator (Alex Rivera)',
  user:'Alex Rivera · Org admin',
  tenant:{name:'Codifyd',sub:'Tenant · India region · Growth plan'},
  home:'ORG-004',
  nav:[
    {group:'Overview',items:[['ORG-004','Dashboard','▦'],['ORG-002','Setup guide','✔'],['ORG-020','Approvals','☑','4']]},
    {group:'Workforce',items:[['ORG-007','AI employees','◈'],['ORG-008','Hire AI employee','＋'],['ORG-014','People','☺'],['ORG-005','Teams','▤'],['ORG-006','Roles & positions','☷']]},
    {group:'Governance',items:[['ORG-015','Permissions','⛨'],['ORG-019','Policies','⚖'],['ORG-017','Connectors','⚙'],['ORG-018','Models & keys','🔑'],['ORG-023','Access reviews','↻']]},
    {group:'Insight',items:[['ORG-022','Usage & spend','◔'],['ORG-024','Audit log','☰']]},
    {group:'Organization',items:[['ORG-003','Organization details','⌂'],['ORG-016','Identity & SSO','☗'],['ORG-025','Data & privacy','▥'],['ORG-026','Plan & settings','⚙'],['ORG-027','Emergency controls','⚠']]}
  ],
  screens:window.SCREENS
});
