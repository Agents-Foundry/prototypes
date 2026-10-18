/* Agent Studio (STD) — navigation and mount. Screens live in screens-*.js */
AF.mount({
  surfaceLabel:'Agent Studio',
  roleName:'Blueprint author',
  persona:'Blueprint author (Priya Nair) and publishing reviewers',
  user:'Priya Nair · Blueprint author',
  tenant:{name:'Codifyd · Engineering',sub:'Studio workspace · author role'},
  home:'STD-002',
  nav:[
    {group:'Blueprints',items:[['STD-002','Catalog','▦'],['STD-003','New blueprint','＋'],['STD-004','QA Engineer','◈']]},
    {group:'Build',items:[['STD-005','Instructions','✎'],['STD-006','Tools & skills','⚙'],['STD-007','Knowledge & memory','▤'],['STD-008','Model & policies','⛨'],['STD-009','Autonomy & approvals','✋']]},
    {group:'Validate',items:[['STD-010','Test playground','▶'],['STD-011','Evaluations','✔'],['STD-013','Versions & diff','⇄']]},
    {group:'Release',items:[['STD-014','Review queue','☑','3'],['STD-016','Publish & rollout','⇪'],['STD-017','Rollback & deprecation','↺']]},
    {group:'Insight & admin',items:[['STD-018','Usage & feedback','◔'],['STD-019','Custom skills','✚'],['STD-020','Studio settings','☰']]}
  ],
  screens:window.SCREENS
});
