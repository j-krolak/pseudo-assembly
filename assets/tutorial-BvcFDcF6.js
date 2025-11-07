import{E as c,b as d,k as E,c as l,d as p,e as u,I as S,P as m,R as T}from"./tomorrow-Cx33cH7u.js";/* empty css              */const a=[{id:1,expectedCode:/NUMBER\s+DC\s+INTEGER\s*\(\s*42\s*\)/i,solution:"NUMBER DC INTEGER(42)",successMessage:"Perfect! You've declared a variable with the DC instruction."},{id:2,expectedCode:[/VALUE\s+DC\s+INTEGER\s*\(\s*100\s*\)/i,/L\s+1\s*,\s*VALUE/i,/RESULT\s+DS\s+INTEGER/i,/ST\s+1\s*,\s*RESULT/i],solution:`VALUE DC INTEGER(100)
RESULT DS INTEGER

L 1, VALUE
ST 1, RESULT`,successMessage:"Excellent! You've mastered loading and storing data."},{id:3,expectedCode:[/DC\s+INTEGER\s*\(\s*10\s*\)/i,/DC\s+INTEGER\s*\(\s*5\s*\)/i,/DC\s+INTEGER\s*\(\s*3\s*\)/i,/A\s+\d+\s*,/i,/M\s+\d+\s*,/i],solution:`NUM1 DC INTEGER(10)
NUM2 DC INTEGER(5)
NUM3 DC INTEGER(3)
RESULT DS INTEGER

L 1, NUM1
A 1, NUM2
M 1, NUM3
ST 1, RESULT`,successMessage:"Great! You calculated (10 + 5) * 3 = 45 successfully."},{id:4,expectedCode:[/(COUNTER|CTR|I)\s+DC\s+INTEGER\s*\(\s*[01]\s*\)/i,/(LIMIT|MAX|END_VAL)\s+DC\s+INTEGER\s*\(\s*5\s*\)/i,/(ONE|INC)\s+DC\s+INTEGER\s*\(\s*1\s*\)/i,/\w+\s*:/i,/C\s+\d+\s*,/i,/J[ZN]\s+\w+/i,/J\s+\w+/i],solution:`COUNTER DC INTEGER(1)
LIMIT DC INTEGER(5)
ONE DC INTEGER(1)
RESULT DS INTEGER

L 1, COUNTER

LOOP A 1, ONE
C 1, LIMIT
JZ END
J LOOP

END ST 1, RESULT`,successMessage:"Fantastic! You've created a loop that counts from 1 to 5."},{id:5,expectedCode:[/(N|NUM)\s+DC\s+INTEGER\s*\(\s*4\s*\)/i,/(ONE|INC)\s+DC\s+INTEGER\s*\(\s*1\s*\)/i,/(FACTORIAL|RESULT|RES).*DS/i,/\w+\s*:/i,/M\s+\d+\s*,/i,/S\s+\d+\s*,/i,/(JZ|JN)\s+\w+/i],solution:`N DC INTEGER(4)
ONE DC INTEGER(1)
RESULT DC INTEGER(1)
FACTORIAL DS INTEGER

L 1, RESULT
L 2, N

LOOP M 1, 2
S 2, ONE
C 2, ONE
JN END
J LOOP

END ST 1, FACTORIAL`,successMessage:"🎉 Amazing! You've successfully calculated 4! = 24. You're now ready for advanced pseudo assembly programming!"}],N=c.theme({"&":{backgroundColor:"#000 !important",color:"#ffffff",fontSize:"14px",minHeight:"120px"},".cm-cursor":{borderLeftColor:"#44aa00ff !important"},"&.cm-focused":{outline:"none",border:"none"},".cm-editor":{border:"1px solid #2E2E2E"}},{dark:!0});class I{currentStep=1;editors={};totalSteps=5;constructor(){this.initializeEditors(),this.setupEventListeners(),this.updateStepIndicator()}initializeEditors(){for(let e=1;e<=this.totalSteps;e++){const t=document.getElementById(`tutorial-editor-${e}`);if(t){const s=d.create({doc:"",extensions:[E.of(u),l,p,N]});this.editors[e]=new c({state:s,parent:t})}}}setupEventListeners(){const e=document.getElementById("prev-btn"),t=document.getElementById("next-btn");e?.addEventListener("click",()=>this.previousStep()),t?.addEventListener("click",()=>this.nextStep()),document.querySelectorAll(".load-example").forEach(s=>{s.addEventListener("click",n=>{const o=parseInt(n.target.dataset.step||"1");this.loadExample(o)})}),document.querySelectorAll(".check-answer").forEach(s=>{s.addEventListener("click",n=>{const o=parseInt(n.target.dataset.step||"1");this.checkAnswer(o)})})}showStep(e){for(let s=1;s<=this.totalSteps;s++){const n=document.getElementById(`step-${s}`);n&&(n.style.display="none")}const t=document.getElementById(`step-${e}`);t&&(t.style.display="block"),this.currentStep=e,this.updateStepIndicator(),this.updateNavigationButtons()}updateStepIndicator(){const e=document.getElementById("step-indicator");e&&(e.textContent=`Step ${this.currentStep} of ${this.totalSteps}`)}updateNavigationButtons(){const e=document.getElementById("prev-btn"),t=document.getElementById("next-btn");e&&(e.disabled=this.currentStep===1),t&&(t.style.display=this.currentStep===this.totalSteps?"none":"block");const s=document.getElementById("completion-message");s&&(s.style.display=this.currentStep===this.totalSteps?"block":"none")}nextStep(){this.currentStep<this.totalSteps&&this.showStep(this.currentStep+1)}previousStep(){this.currentStep>1&&this.showStep(this.currentStep-1)}loadExample(e){const t=a[e-1];if(t&&this.editors[e]){const s=this.editors[e];s.dispatch({changes:{from:0,to:s.state.doc.length,insert:t.solution}});const n=document.querySelector(`[data-step="${e}"].load-example`),o=document.querySelector(`[data-step="${e}"].check-answer`);n&&o&&(n.style.display="none",o.style.display="inline-block")}}checkAnswer(e){const t=a[e-1],s=this.editors[e],n=document.getElementById(`feedback-${e}`);if(!t||!s||!n)return;const o=s.state.doc.toString();try{new S(o).interpret(),this.validateCode(o,t.expectedCode)?(n.innerHTML=`<span class="text-green-400">✓ ${t.successMessage}</span>`,e<this.totalSteps&&setTimeout(()=>{const r=document.getElementById("next-btn");r&&r.click()},2e3)):n.innerHTML=`<span class="text-yellow-400">⚠ Code runs but doesn't match the expected solution pattern. Try again!</span>`}catch(i){i instanceof m||i instanceof T?n.innerHTML=`<span class="text-red-400">✗ Error: ${i.message}</span>`:n.innerHTML='<span class="text-red-400">✗ Unexpected error occurred</span>'}}validateCode(e,t){return Array.isArray(t)?t.every(s=>s.test(e)):t.test(e)}}document.addEventListener("DOMContentLoaded",()=>{new I});
