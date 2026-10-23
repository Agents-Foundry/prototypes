/* Shared sample data for the Employee Desktop prototype. All values are fictional. */
window.SCREENS=window.SCREENS||{};
window.EMP_DATA={
  story:{id:'QA-184',title:'Checkout applies a discount code twice',ac:['A valid code is applied once per order','Expired codes are rejected with a clear message','Codes cannot be stacked with other promotions','Totals are rounded to two decimals']},
  agents:[
    {id:'nova',name:'QA Engineer · Nova',role:'Plans tests, runs browser checks, drafts defects',status:'Working',task:'Validate checkout regression',tools:['Jira','Browser','Bitbucket (read)']},
    {id:'lyra',name:'Frontend Engineer · Lyra',role:'Reviews and proposes UI changes',status:'Idle',task:'—',tools:['Bitbucket','Browser']},
    {id:'atlas',name:'Release Assistant · Atlas',role:'Builds release checklists',status:'Waiting on you',task:'Sanity plan for release 4.8',tools:['Jira','Checklists']}
  ],
  steps:[
    ['Read Jira story QA-184','jira.read','TOOL'],
    ['Draft test cases','8 cases covering single use, expiry, stacking, rounding','MODEL'],
    ['Run browser tests','playwright.run on the configured QA origin · you approved qa.execute_playwright earlier (single use)','TOOL'],
    ['Review evidence','Screenshots and traces, kept per retention class','MODEL'],
    ['Create Jira Bug in QA','Needs an approval: jira.issue.create','ACTION'],
    ['Report','Say what is confirmed and what is not','MESSAGE']
  ],
  cases:[['TC-01','Apply a valid code once','Passed'],['TC-02','Apply the same code twice','Failed'],['TC-03','Expired code is rejected','Passed'],['TC-04','Code plus loyalty discount','Failed'],['TC-05','Rounding on 3-item cart','Passed'],['TC-06','Remove code and re-add','Passed'],['TC-07','Code on empty cart','Passed'],['TC-08','Case-insensitive code','Passed']],
  artifacts:[
    {n:'checkout-double-discount.png',k:'Screenshot',s:'Sanitized',t:'12 min ago',sz:'184 KB',r:'30 d'},
    {n:'trace-TC-02.zip',k:'Playwright trace',s:'Redacted',t:'12 min ago',sz:'2.1 MB',r:'30 d'},
    {n:'test-cases-QA-184.md',k:'Test cases',s:'Draft',t:'20 min ago',sz:'6 KB',r:'365 d'},
    {n:'run-log-2291.txt',k:'Log',s:'Redacted',t:'12 min ago',sz:'41 KB',r:'30 d'},
    {n:'defect-draft-QA-184.md',k:'Defect draft',s:'Draft',t:'8 min ago',sz:'3 KB',r:'1 d'}
  ]
};
