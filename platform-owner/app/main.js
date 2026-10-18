/* Platform Owner (PLT) — navigation and mount. Screens live in screens-*.js */
AF.mount({
  surfaceLabel:'Platform Owner',
  roleName:'Platform operator',
  persona:'Agents Foundry platform operator (Sam Okafor)',
  user:'Sam Okafor · Platform operator',
  tenant:{name:'Agents Foundry Operations',sub:'Operator console · MFA verified · no tenant data access'},
  home:'PLT-002',
  nav:[
    {group:'Overview',items:[['PLT-002','Overview','▦'],['PLT-016','Incidents','⚠','2'],['PLT-028','Status & maintenance','◔']]},
    {group:'Organizations',items:[['PLT-003','Organizations','▤'],['PLT-005','Provision tenant','＋'],['PLT-006','Provisioning approvals','☑','2'],['PLT-022','Suspension review','⏸']]},
    {group:'Commercial',items:[['PLT-008','Plans & entitlements','☷'],['PLT-009','Billing operations','$'],['PLT-010','Usage & spend','◔']]},
    {group:'Agent catalog',items:[['PLT-011','Blueprint catalog','◈'],['PLT-012','Rollouts','⇪'],['PLT-025','Connector vetting','⚙'],['PLT-026','Model providers','🔑']]},
    {group:'Governance',items:[['PLT-013','Security posture','⛨'],['PLT-014','Audit explorer','☰'],['PLT-019','Policy templates','⚖'],['PLT-020','Staff & roles','☺'],['PLT-027','Compliance requests','▥']]},
    {group:'Operations',items:[['PLT-015','Integration health','◎'],['PLT-017','Support cases','?'],['PLT-018','Support access','⏱'],['PLT-023','Regions & residency','⌖'],['PLT-024','Feature flags','⚑']]},
    {group:'Settings',items:[['PLT-021','Operator settings','⚙']]}
  ],
  screens:window.SCREENS
});
