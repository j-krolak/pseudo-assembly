import{E as c,b as l,k as E,c as u,d as p,e as m,I as S,P as N,R as T}from"./tomorrow-BgShzc1h.js";/* empty css              */const r=[{id:1,expectedCode:/NUMBER\s+DC\s+INTEGER\s*\(\s*42\s*\)/i,expectedValues:[{labelName:"NUMBER",value:42}],solution:"NUMBER DC INTEGER(42)",successMessage:"Perfect! You've declared a variable with the DC instruction."},{id:2,expectedCode:[/VALUE\s+DC\s+INTEGER\s*\(\s*100\s*\)/i,/L\s+1\s*,\s*VALUE/i,/RESULT\s+DS\s+INTEGER/i,/ST\s+1\s*,\s*RESULT/i],expectedValues:[{labelName:"RESULT",value:100},{labelName:"VALUE",value:100}],solution:`VALUE DC INTEGER(100)
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

END ST 1, FACTORIAL`,successMessage:"🎉 Amazing! You've successfully calculated 4! = 24. You're now ready for advanced pseudo assembly programming!"}],h=c.theme({"&":{backgroundColor:"#000 !important",color:"#ffffff",fontSize:"14px",minHeight:"120px"},".cm-cursor":{borderLeftColor:"#44aa00ff !important"},"&.cm-focused":{outline:"none",border:"none"},".cm-editor":{border:"1px solid #2E2E2E"}},{dark:!0});class L{currentStep=1;editors={};totalSteps=6;constructor(){this.initializeEditors(),this.setupEventListeners(),this.updateStepIndicator()}initializeEditors(){for(let e=1;e<=this.totalSteps;e++){const s=document.getElementById(`tutorial-editor-${e}`);if(s){const t=l.create({doc:"",extensions:[E.of(m),u,p,h]});this.editors[e]=new c({state:t,parent:s})}}}setupEventListeners(){const e=document.getElementById("prev-btn"),s=document.getElementById("next-btn");e?.addEventListener("click",()=>this.previousStep()),s?.addEventListener("click",()=>this.nextStep()),document.querySelectorAll(".load-example").forEach(t=>{t.addEventListener("click",n=>{const a=parseInt(n.target.dataset.step||"1");this.loadExample(a)})}),document.querySelectorAll(".check-answer").forEach(t=>{t.addEventListener("click",n=>{const a=parseInt(n.target.dataset.step||"1");this.checkAnswer(a)})})}showStep(e){for(let t=1;t<=this.totalSteps;t++){const n=document.getElementById(`step-${t}`);n&&(n.style.display="none")}const s=document.getElementById(`step-${e}`);s&&(s.style.display="block"),this.currentStep=e,this.updateStepIndicator(),this.updateNavigationButtons()}updateStepIndicator(){const e=document.getElementById("step-indicator");e&&(e.textContent=`Step ${this.currentStep} of ${this.totalSteps}`)}updateNavigationButtons(){const e=document.getElementById("prev-btn"),s=document.getElementById("next-btn");e&&(e.disabled=this.currentStep===1),s&&(s.style.display=this.currentStep===this.totalSteps?"none":"block");const t=document.getElementById("completion-message");t&&(t.style.display=this.currentStep===this.totalSteps?"block":"none")}nextStep(){this.currentStep<this.totalSteps&&this.showStep(this.currentStep+1)}previousStep(){this.currentStep>1&&this.showStep(this.currentStep-1)}loadExample(e){const s=r[e-1];if(s&&this.editors[e]){const t=this.editors[e];t.dispatch({changes:{from:0,to:t.state.doc.length,insert:s.solution}})}}checkAnswer(e){const s=r[e-1],t=this.editors[e],n=document.getElementById(`feedback-${e}`);if(!s||!t||!n)return;const a=t.state.doc.toString();try{const o=new S(a);o.interpret(),this.validateCode(o,a,s)?(n.innerHTML=`<span class="text-green-400">✓ ${s.successMessage}</span>`,e<this.totalSteps&&setTimeout(()=>{const i=document.getElementById("next-btn");i&&i.click()},2e3)):n.innerHTML=`<span class="text-yellow-400">⚠ Code runs but doesn't match the expected solution pattern. Try again!</span>`}catch(o){o instanceof N||o instanceof T?n.innerHTML=`<span class="text-red-400">✗ Error: ${o.message}</span>`:n.innerHTML='<span class="text-red-400">✗ Unexpected error occurred</span>'}}validateCode(e,s,t){let n=!0;const a=t.expectedCode;return Array.isArray(a)?n&&=a.every(o=>o.test(s)):n&&=a.test(s),n=n&&t.expectedValues.every(o=>{try{return e.getValueByLabel(o.labelName)===o.value}catch{return!1}}),n}}document.addEventListener("DOMContentLoaded",()=>{new L});
