import{E as n,b as l,k as d,c as E,d as u,e as p,I as S,P as T,R as N}from"./tomorrow-D_jCYm-M.js";/* empty css              */const i=[{id:1,expectedCode:/NUMBER\s+DC\s+INTEGER\s*\(\s*42\s*\)/i,expectedValues:[{labelName:"NUMBER",value:42}],solution:"NUMBER DC INTEGER(42)",successMessage:"Perfect! You've declared a variable with the DC instruction."},{id:2,expectedCode:[/VALUE\s+DC\s+INTEGER\s*\(\s*100\s*\)/i,/L\s+1\s*,\s*VALUE/i,/RESULT\s+DS\s+INTEGER/i,/ST\s+1\s*,\s*RESULT/i],expectedValues:[{labelName:"RESULT",value:100},{labelName:"VALUE",value:100}],solution:`VALUE DC INTEGER(100)
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

END ST 1, FACTORIAL`,successMessage:"🎉 Amazing! You've successfully calculated 4! = 24. You're now ready for advanced pseudo assembly programming!"}],m=n.theme({"&":{backgroundColor:"#000 !important",color:"#ffffff",fontSize:"14px",minHeight:"120px"},".cm-cursor":{borderLeftColor:"#44aa00ff !important"},"&.cm-focused":{outline:"none",border:"none"},".cm-editor":{border:"1px solid #2E2E2E"}},{dark:!0});class L{currentStep=1;editors={};totalSteps=6;constructor(){this.initializeEditors(),this.setupEventListeners()}initializeEditors(){for(let e=1;e<=this.totalSteps;e++){const t=document.getElementById(`tutorial-editor-${e}`);if(t){const s=l.create({doc:"",extensions:[d.of(p),E,u,m]});this.editors[e]=new n({state:s,parent:t})}}}setupEventListeners(){document.querySelectorAll(".prev-step").forEach(e=>{e.addEventListener("click",()=>this.previousStep())}),document.querySelectorAll(".next-step").forEach(e=>{e.addEventListener("click",()=>this.nextStep())}),document.querySelectorAll(".load-example").forEach(e=>{e.addEventListener("click",t=>{const s=parseInt(t.target.dataset.step||"1");this.loadExample(s)})}),document.querySelectorAll(".check-answer").forEach(e=>{e.addEventListener("click",t=>{const s=parseInt(t.target.dataset.step||"1");this.checkAnswer(s)})})}showStep(e){for(let s=1;s<=this.totalSteps;s++){const r=document.getElementById(`step-${s}`);r&&(r.style.display="none")}const t=document.getElementById(`step-${e}`);t&&(t.style.display="block"),this.currentStep=e}nextStep(){this.currentStep<this.totalSteps&&this.showStep(this.currentStep+1)}previousStep(){this.currentStep>1&&this.showStep(this.currentStep-1)}loadExample(e){const t=i[e-1];if(t&&this.editors[e]){const s=this.editors[e];s.dispatch({changes:{from:0,to:s.state.doc.length,insert:t.solution}})}}checkAnswer(e){const t=i[e-1],s=this.editors[e],r=document.getElementById(`feedback-${e}`);if(!t||!s||!r)return;const o=s.state.doc.toString();try{const a=new S(o);a.interpret(),this.validateCode(a,o,t)?r.innerHTML=`<span class="text-green-400">✓ ${t.successMessage}</span>`:r.innerHTML=`<span class="text-yellow-400">! Code runs but doesn't match the expected solution pattern. Try again!</span>`}catch(a){a instanceof T||a instanceof N?r.innerHTML=`<span class="text-red-400">✗ Error: ${a.message}</span>`:r.innerHTML='<span class="text-red-400">✗ Unexpected error occurred</span>'}}validateCode(e,t,s){let r=!0;const o=s.expectedCode;return Array.isArray(o)?r&&=o.every(a=>a.test(t)):r&&=o.test(t),r=r&&s.expectedValues.every(a=>{try{return e.getValueByLabel(a.labelName)===a.value}catch{return!1}}),r}}document.addEventListener("DOMContentLoaded",()=>{new L});
