import{E as i,P as E,v as u,C as p,a as m,b as f,c as h,d as S,e as T,i as N,I as L,g as C,f as R}from"./index-B7dxPleB.js";/* empty css              */const c=[{id:1,expectedCode:/NUMBER\s+DC\s+INTEGER\s*\(\s*42\s*\)/i,expectedValues:[{labelName:"NUMBER",value:42}],solution:"NUMBER DC INTEGER(42)",successMessage:"Perfect! You've declared a variable with the DC instruction."},{id:2,expectedCode:[/VALUE\s+DC\s+INTEGER\s*\(\s*100\s*\)/i,/L\s+1\s*,\s*VALUE/i,/RESULT\s+DS\s+INTEGER/i,/ST\s+1\s*,\s*RESULT/i],expectedValues:[{labelName:"RESULT",value:100},{labelName:"VALUE",value:100}],solution:`VALUE DC INTEGER(100)
RESULT DS INTEGER

L 1, VALUE
ST 1, RESULT`,successMessage:"Excellent! You've mastered loading and storing data."},{id:3,expectedCode:[/DC\s+INTEGER\s*\(\s*10\s*\)/i,/DC\s+INTEGER\s*\(\s*5\s*\)/i,/DC\s+INTEGER\s*\(\s*3\s*\)/i,/A\s+\d+\s*,/i,/M\s+\d+\s*,/i],expectedValues:[{labelName:"RESULT",value:45}],solution:`NUM1 DC INTEGER(10)
NUM2 DC INTEGER(5)
NUM3 DC INTEGER(3)
RESULT DS INTEGER

L 1, NUM1
A 1, NUM2
M 1, NUM3
ST 1, RESULT`,successMessage:"Great! You calculated (10 + 5) * 3 = 45 successfully."},{id:4,expectedCode:[/\w+\s*/i,/C\s+\d+\s*,/i,/J[ZN]\s+\w+/i,/J\s+\w+/i],expectedValues:[{labelName:"RESULT",value:5}],solution:`COUNTER DC INTEGER(1)
LIMIT DC INTEGER(5)
ONE DC INTEGER(1)
RESULT DS INTEGER

L 1, COUNTER

LOOP A 1, ONE
C 1, LIMIT
JZ END
J LOOP

END ST 1, RESULT`,successMessage:"Fantastic! You've created a loop that counts from 1 to 5."},{id:5,expectedCode:[/\w+\s*/i,/(M|MR)\s+\d+\s*,/i,/(S|SR)\s+\d+\s*,/i,/(JZ|JN)\s+\w+/i],expectedValues:[{labelName:"FACTORIAL",value:24}],solution:`N DC INTEGER(4)
ONE DC INTEGER(1)
RESULT DC INTEGER(1)
FACTORIAL DS INTEGER

L 1, RESULT
L 2, N

LOOP MR 1, 2
S 2, ONE
C 2, ONE
JN END
J LOOP

END ST 1, FACTORIAL`,successMessage:"🎉 Amazing! You've successfully calculated 4! = 24. You're now ready for advanced pseudo assembly programming!"}],n="vimMode",v=i.theme({"&":{backgroundColor:"#000 !important",color:"#ffffff",fontSize:"14px",minHeight:"120px"},".cm-cursor":{borderLeftColor:"#44aa00ff !important"},"&.cm-focused":{outline:"none",border:"none"},".cm-editor":{border:"1px solid #2E2E2E"},".cm-fat-cursor":{background:"#44aa00ff !important"},"&:not(.cm-focused) .cm-fat-cursor":{background:"none",outline:"solid 1px #44aa00ff !important"}},{dark:!0}),g=E.highest(i.theme({".cm-cursor":{borderLeftColor:"#fff !important"}})),d=[u(),g];class I{currentStep=1;editors={};vimCompartments={};totalSteps=6;constructor(){this.initializeEditors(),this.setupEventListeners()}initializeEditors(){const o=localStorage.getItem(n)==="true";for(let s=1;s<=this.totalSteps;s++){const e=document.getElementById(`tutorial-editor-${s}`);if(e){const t=new p;this.vimCompartments[s]=t;const r=m.create({doc:"",extensions:[t.of(o?d:[]),f.of([...T,N]),h,S,v]});this.editors[s]=new i({state:r,parent:e})}}}setupEventListeners(){document.querySelectorAll(".prev-step").forEach(e=>{e.addEventListener("click",()=>this.previousStep())}),document.querySelectorAll(".next-step").forEach(e=>{e.addEventListener("click",()=>this.nextStep())}),document.querySelectorAll(".load-example").forEach(e=>{e.addEventListener("click",t=>{const r=parseInt(t.target.dataset.step||"1");this.loadExample(r)})}),document.querySelectorAll(".check-answer").forEach(e=>{e.addEventListener("click",t=>{const r=parseInt(t.target.dataset.step||"1");this.checkAnswer(r)})});const o=document.querySelectorAll(".vim-toggle"),s=localStorage.getItem(n)==="true";o.forEach(e=>{e.checked=s,e.addEventListener("change",()=>{const t=e.checked;localStorage.setItem(n,String(t)),o.forEach(r=>r.checked=t),Object.entries(this.vimCompartments).forEach(([r,a])=>{this.editors[Number(r)]?.dispatch({effects:a.reconfigure(t?d:[])})})})})}showStep(o){for(let e=1;e<=this.totalSteps;e++){const t=document.getElementById(`step-${e}`);t&&(t.style.display="none")}const s=document.getElementById(`step-${o}`);s&&(s.style.display="block"),this.currentStep=o}nextStep(){this.currentStep<this.totalSteps&&this.showStep(this.currentStep+1)}previousStep(){this.currentStep>1&&this.showStep(this.currentStep-1)}loadExample(o){const s=c[o-1];if(s&&this.editors[o]){const e=this.editors[o];e.dispatch({changes:{from:0,to:e.state.doc.length,insert:s.solution}})}}checkAnswer(o){const s=c[o-1],e=this.editors[o],t=document.getElementById(`feedback-${o}`);if(!s||!e||!t)return;const r=e.state.doc.toString();try{const a=new L(r);a.interpret(),this.validateCode(a,r,s)?t.innerHTML=`<span class="text-green-400">✓ ${s.successMessage}</span>`:t.innerHTML=`<span class="text-yellow-400">! Code runs but doesn't match the expected solution pattern. Try again!</span>`}catch(a){a instanceof C||a instanceof R?t.innerHTML=`<span class="text-red-400">✗ Error: ${a.message}</span>`:t.innerHTML='<span class="text-red-400">✗ Unexpected error occurred</span>'}}validateCode(o,s,e){let t=!0;const r=e.expectedCode;return Array.isArray(r)?t&&=r.every(a=>a.test(s)):t&&=r.test(s),t=t&&e.expectedValues.every(a=>{try{return o.getValueByLabel(a.labelName)===a.value}catch{return!1}}),t}}document.addEventListener("DOMContentLoaded",()=>{new I});
