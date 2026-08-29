import{k as _e,S as Ue,H as We,t as j,s as Ze,V as Ke,E as T,D as y,R as Ve,W as Ye,I as B,P as $e,v as je,a as ze,C as Y,b as Xe,c as qe,d as Qe,e as et,i as tt,f as X,g as q,h as de,j as nt,F as me}from"./index-H4dfowVK.js";/* empty css              */const F=[{name:"sum vector",code:`# sum all elements of VECTOR
VECTOR DC 20*INTEGER(2)
VECTOR_LEN DC INTEGER(20)

ONE DC INTEGER(1)
ZERO DC INTEGER(0)
WORD_SIZE DC INTEGER(4)

SUM DC INTEGER(0)

# R0=ptr, R1=index, R2=sum
LA 0, VECTOR
SR 1, 1
SR 2, 2

START A 2, 0(0)
A 0, WORD_SIZE
A 1, ONE
C 1, VECTOR_LEN
JZ END
J START

END ST 2,SUM
    `},{name:"gcd",code:`# gcd(A, B) via subtraction
# RES holds the result
A DC INTEGER(7)
B DC INTEGER(3)
RES DS INTEGER

L 0, A
L 1, B

START CR 0, 1
JZ END
JN LESS

SR 0, 1
J START

LESS SR 1, 0
J START

END ST 0, RES
`},{name:"palindrom",code:`# is PA a palindrome? RES=1 if so
ONE DC INTEGER(1)
FOUR DC INTEGER(4)

N DC INTEGER(3)

PA DC INTEGER(3)
DC INTEGER(4)
DC INTEGER(3)

RES DC INTEGER(1)

# R1=left ptr, R3=right ptr
LA 1, PA
L 3, N
S 3, ONE
M 3, FOUR
AR 3, 1

START CR 3, 1
JN END
JZ END

L 4, 0(1)
L 5, 0(3)
A 1, FOUR
S 3, FOUR
CR 4, 5
JZ START

SR 8,8
ST 8, RES

END SR 1,1
    `},{name:"bubble sort",code:`# bubble sort P (N elements) ascending
JEDEN DC INTEGER(1)
CZTERY DC INTEGER(4)

N DC INTEGER(3)

P DC INTEGER(12)
DC INTEGER(-4)
DC INTEGER(8)

# R7=P ptr, R1=inner idx, R2=pass limit
LA 7, P

L 1, JEDEN
L 2, N

START LR 3, 1
S 3, JEDEN
M 3, CZTERY
AR 3, 7

LR 4, 3
A 4,  CZTERY
L 5, 0(3)

L 6, 0(4)
CR 5, 6
JN KROK
ST 6, 0(3)
ST 5, 0(4)

KROK A 1, JEDEN
CR 1, 2
JN START
S 2, JEDEN
L 1, JEDEN
C 2, JEDEN
JP START 
    `},{name:"merge sort join",code:`# merge sorted arrays A, B into C
M DC INTEGER(2)
A DC INTEGER(1)
DC INTEGER(2)

N DC INTEGER(2)
B DC INTEGER(1)
DC INTEGER(2)

C DS 4*INTEGER
JEDEN DC INTEGER(1)

L 1, JEDEN
LR 2, 1

# R3=C ptr, R4=A ptr, R5=B ptr
LA 3, C
LA 4, A
LA 5, B
LR 8, 1
AR 8, 8
AR 8, 8

WARUNEK C 1, M
JP UZUPELNIJ_B 
C 2, N
JP UZUPELNIJ_A
L 6, 0(4)
L 7, 0(5)

CR 6, 7
JP WPP
ST 6, 0(3)
A 1, JEDEN
AR 4, 8
AR 3, 8
J WARUNEK

WPP ST 7, 0(3)
A 2, JEDEN
AR 5, 8
AR 3, 8


J WARUNEK

UZUPELNIJ_B C 2, N
JP KONIEC
L 7, 0(5)
ST 7, 0(3)
AR 3, 8
AR 5, 8
A 2, JEDEN
J UZUPELNIJ_B

UZUPELNIJ_A  C 1, M
JP KONIEC
L 6, 0(4)
ST 6, 0(3)
AR 4, 8
AR 3, 8
A 1, JEDEN
J UZUPELNIJ_A


KONIEC SR 1, 1

  `},{name:"fibonacci",code:`# first N fibonacci numbers, into FIB
N DC INTEGER(10)
FOUR DC INTEGER(4)
ONE DC INTEGER(1)

FIB DS 10*INTEGER

# R7=ptr, R1=prev, R2=curr, R3=count
LA 7, FIB
SR 1, 1
L 2, ONE
ST 1, 0(7)
A 7, FOUR
ST 2, 0(7)
A 7, FOUR
L 3, ONE
A 3, ONE

START C 3, N
JZ END
LR 4, 1
AR 4, 2
ST 4, 0(7)
A 7, FOUR
LR 1, 2
LR 2, 4
A 3, ONE
J START

END SR 0, 0
`},{name:"find max",code:`# max element of ARR, into MAX
ARR DC INTEGER(3)
DC INTEGER(7)
DC INTEGER(2)
DC INTEGER(9)
DC INTEGER(4)

N DC INTEGER(5)
FOUR DC INTEGER(4)
ONE DC INTEGER(1)

MAX DS INTEGER

# R7=ptr, R1=count, R2=current max
LA 7, ARR
L 2, 0(7)
L 1, ONE

START C 1, N
JZ END
A 7, FOUR
L 3, 0(7)
CR 3, 2
JN SKIP
LR 2, 3

SKIP A 1, ONE
J START

END ST 2, MAX
`},{name:"is prime",code:`# is NUM prime? RES=1 if so, else 0
NUM DC INTEGER(29)
ONE DC INTEGER(1)
TWO DC INTEGER(2)

RES DC INTEGER(0)

# R0=zero, R1=divisor, R2=NUM, R3/R4=scratch
SR 0, 0
L 2, NUM
L 1, TWO

START CR 1, 2
JZ ISPRIME

LR 3, 2
DR 3, 1
MR 3, 1
LR 4, 2
SR 4, 3
CR 4, 0
JZ NOTPRIME

A 1, ONE
J START

ISPRIME L 4, ONE
ST 4, RES
J END

NOTPRIME ST 0, RES

END SR 0, 0
`},{name:"digit sum",code:`# sum of decimal digits of NUM, into SUM
NUM DC INTEGER(4938)
TEN DC INTEGER(10)

SUM DC INTEGER(0)

# R0=zero, R1=num, R2=sum, R3=quotient, R4/R5=scratch
SR 0, 0
SR 2, 2
L 1, NUM

START CR 1, 0
JZ END

LR 3, 1
D 3, TEN
LR 4, 3
M 4, TEN
LR 5, 1
SR 5, 4
AR 2, 5
LR 1, 3

J START

END ST 2, SUM
`},{name:"matrix transpose",code:`# transpose MAT (ROWS x COLS) into MAT_T
MAT DC INTEGER(1)
DC INTEGER(2)
DC INTEGER(3)
DC INTEGER(4)
DC INTEGER(5)
DC INTEGER(6)

MAT_T DS 6*INTEGER

ROWS DC INTEGER(2)
COLS DC INTEGER(3)
FOUR DC INTEGER(4)
ONE DC INTEGER(1)

# R6=&MAT, R7=&MAT_T, R1=row, R2=col
LA 6, MAT
LA 7, MAT_T
SR 1, 1

ROW SR 2, 2

COL C 2, COLS
JZ ENDCOL

# src addr = MAT + (row*COLS + col)*4
LR 3, 1
M 3, COLS
AR 3, 2
M 3, FOUR
LR 8, 6
AR 8, 3
L 5, 0(8)

# dst addr = MAT_T + (col*ROWS + row)*4
LR 4, 2
M 4, ROWS
AR 4, 1
M 4, FOUR
LR 9, 7
AR 9, 4
ST 5, 0(9)

A 2, ONE
J COL

ENDCOL A 1, ONE
C 1, ROWS
JZ END
J ROW

END SR 0, 0
`},{name:"copy-and-modify self-mod (non-strict-safe)",code:`# copy ORIGA/ORIGB's bytes, patch the copy
# (AR -> SR), run it. Originals stay untouched
ONE DC INTEGER(1)
FIVE DC INTEGER(5)
PATCH DC INTEGER(33554432)
BASELINE DS INTEGER
MODIFIED DS INTEGER
COPY DS INTEGER

# re-entry: r9=0 first time, r9=1 after copy
START SR 8, 8
CR 9, 8
JZ FIRSTTIME
J FINALIZE

FIRSTTIME L 1, FIVE
L 2, ONE
J ORIGA

# save baseline, then build the patched COPY
BACK1 LR 6, 1
LA 3, ORIGA
L 4, 0(3)
ST 4, COPY
L 5, COPY
A 5, PATCH
ST 5, COPY

L 1, FIVE
LR 9, 2
J COPY

# copy ran - report both results
FINALIZE LR 7, 1
ST 6, BASELINE
ST 7, MODIFIED
J DONE

ORIGA AR 1, 2
ORIGB SR 1, 2
J BACK1

DONE SR 0, 0
`}],$=(e,t,n,r,s)=>{const o=document.createElement("button");o.type="button",o.className="dropdown-toggle";const i=document.createElement("div");i.className="dropdown-menu";let c=n;const u=t.map(l=>{const E=document.createElement("div");E.className="dropdown-item";const R=document.createElement("span");if(R.textContent=l.label,E.appendChild(R),E.addEventListener("click",()=>{c=l.value,o.textContent=l.label,m(),e.classList.remove("open"),r(c)}),l.deletable&&s?.onDelete){const g=document.createElement("span");g.className="dropdown-item-delete",g.textContent="×",g.addEventListener("click",f=>{f.stopPropagation(),s.onDelete(l.value)}),E.appendChild(g)}return{value:l.value,element:E}});let a=null;if(s?.addItem){const l=document.createElement("div");l.className="dropdown-item dropdown-item-add",l.textContent=s.addItem.label,l.addEventListener("click",E=>{E.stopPropagation(),e.classList.remove("open"),s.addItem.onClick()}),a=l}const m=()=>{i.replaceChildren(...u.filter(l=>l.value!==c).map(l=>l.element),...a?[a]:[])};o.textContent=t.find(l=>l.value===c)?.label??c,o.addEventListener("click",l=>{l.stopPropagation(),document.querySelectorAll(".dropdown.open").forEach(E=>{E!==e&&E.classList.remove("open")}),e.classList.toggle("open")}),e.replaceChildren(o,i),i.replaceChildren(...u.map(l=>l.element),...a?[a]:[]);const h=Math.max(...u.map(l=>l.element.offsetWidth));o.style.width=i.style.width=`${h}px`,m()};document.addEventListener("click",()=>{document.querySelectorAll(".dropdown.open").forEach(e=>e.classList.remove("open"))});const Q=new Set(_e);function re(e){const t=e.match(/^\s*/)?.[0].length??0,n=e.slice(t);if(n.startsWith("#")||n.length===0)return null;const r=n.match(/^[^\s,]+/);if(!r)return null;const s=r[0],o=n.slice(s.length).match(/^[ \t]+([^\s,]+)/)?.[1],i=(!Q.has(s)||o!==void 0&&Q.has(o))&&n[s.length]!==","&&!/^-?\d+$/.test(s);return{leading:t,word:s,looksLikeLabel:i}}const ot=Ue.define({startState(){return{wordIndex:0,instructionWordIndex:null}},token(e,t){if(e.sol()){t.wordIndex=0;const n=re(e.string);t.instructionWordIndex=n===null?null:n.looksLikeLabel?1:0}if(e.eatSpace())return null;if(e.match("#"))return e.skipToEnd(),"comment";if(e.match(/^-?\d+/))return"number";if(e.match(","))return"punctuation";if(e.match("*"))return"operator";if(e.match(/^[()]/))return"bracket";if(e.match(/^[A-Za-z_][A-Za-z0-9_]*/)){const n=e.current(),r=t.wordIndex;return t.wordIndex+=1,n==="INTEGER"?"typeName":r===t.instructionWordIndex&&Q.has(n)?"keyword":"labelName"}return e.next(),null}}),st=We.define([{tag:j.keyword,color:"#44aa00ff",fontWeight:"bold"},{tag:j.typeName,color:"#00d8ff"},{tag:j.comment,color:"#666"}]),rt=Ze(st);class Ee extends Ye{width;constructor(t){super(),this.width=t}eq(t){return t.width===this.width}toDOM(){const t=document.createElement("span");return t.style.display="inline-block",t.style.width=`${this.width}ch`,t.style.borderRight="1px solid #2E2E2E",t}get estimatedHeight(){return-1}}function ue(e){const t=e.state.doc,n=new Ve,r=[];let s=0;for(let o=1;o<=t.lines;o++){const i=t.line(o),c=i.text,u=re(c);if(u===null){if(c.trimStart().startsWith("#"))continue;const l=c.match(/^\s*/)?.[0].length??0;r.push({hasLabel:!1,gapFrom:i.from,gapTo:i.from+l});continue}const{leading:a,word:m,looksLikeLabel:h}=u;if(!h)r.push({hasLabel:!1,gapFrom:i.from,gapTo:i.from+a});else{const l=i.from+a+m.length,E=c.slice(a+m.length).match(/^[ \t]*/)?.[0].length??0;s=Math.max(s,m.length),r.push({hasLabel:!0,gapFrom:l,gapTo:l+E,labelLen:m.length})}}if(s===0)return y.none;for(const o of r){const i=o.hasLabel?s-o.labelLen+1:s+1;i!==0&&(o.gapFrom===o.gapTo?n.add(o.gapFrom,o.gapFrom,y.widget({widget:new Ee(i),side:1})):n.add(o.gapFrom,o.gapTo,y.replace({widget:new Ee(i)})))}return n.finish()}const at=Ke.fromClass(class{decorations;constructor(e){this.decorations=ue(e)}update(e){e.docChanged&&(this.decorations=ue(e.view))}},{decorations:e=>e.decorations}),ct=T.inputHandler.of((e,t,n,r)=>{if(t!==n||!r||/\s/.test(r))return!1;const s=e.state.doc.lineAt(t),o=re(s.text);return!o||o.looksLikeLabel||s.from+o.leading!==t?!1:(e.dispatch({changes:{from:t,to:n,insert:r+" "},selection:{anchor:t+r.length},userEvent:"input.type"}),!0)}),lt=[at,ct],ae="code",Se="vimMode",Ie="syntaxHighlight",Ce="labelAlign",Ae="customFiles",be="currentFile",De="memoryView",ye="strictMode",v=document.getElementById("run-btn"),b=document.getElementById("next-btn"),k=document.getElementById("stop-btn"),I=document.getElementById("play-btn"),it=document.getElementById("registers"),ee=document.getElementById("memory"),dt=document.getElementById("code"),M=document.getElementById("errors"),Re=document.getElementById("examples-select"),pe=document.getElementById("registers-format"),ge=document.getElementById("memory-format"),he=document.getElementById("memory-view"),mt=document.getElementById("vim-mode-toggle"),Et=document.getElementById("syntax-highlight-toggle"),ut=document.getElementById("label-align-toggle"),U=document.getElementById("strict-mode-toggle");let L="bin",O="bin";const Rt=["raw","sections","sections-labels"],fe=localStorage.getItem(De);let J=Rt.includes(fe)?fe:"sections-labels",x=!1,w=!1;const ce=new Y,ve=new Y,xe=localStorage.getItem(Se)==="true",Oe=new Y,Me=localStorage.getItem(Ie)!=="false",we=[ot,rt],Ge=new Y,ke=localStorage.getItem(Ce)!=="false",Fe=[lt];let S=localStorage.getItem(ye)!=="false";U&&(U.checked=S,U.addEventListener("change",()=>{S=U.checked,localStorage.setItem(ye,String(S)),S||alert("Non-strict mode is for advanced users - just for fun, to explore more complex/unsafe memory tricks. It does not hold on exams.")}));const W=e=>e.kind==="example"?`example:${e.index}`:`custom:${e.name}`,te=e=>{if(e.startsWith("example:")){const t=Number(e.slice(8));return Number.isInteger(t)?{kind:"example",index:t}:null}return e.startsWith("custom:")?{kind:"custom",name:e.slice(7)}:null},pt=()=>{try{return JSON.parse(localStorage.getItem(Ae)??"{}")}catch{return{}}},ne=e=>{localStorage.setItem(Ae,JSON.stringify(e))};let N=pt();const Z={kind:"example",index:0};let G=(()=>{const e=localStorage.getItem(be),t=e?te(e):null;return!t||t.kind==="custom"&&!(t.name in N)||t.kind==="example"&&!F[t.index]?Z:t})();const z=e=>{G=e,localStorage.setItem(be,W(e))},gt=T.updateListener.of(e=>{if(e.docChanged){const t=e.state.doc.toString();localStorage.setItem(ae,t),G.kind==="custom"&&(N[G.name]=t,ne(N))}});let P=null;const ht=T.updateListener.of(e=>{if(!e.docChanged&&!e.selectionSet)return;if(e.docChanged&&!x){try{const r=new B(e.state.doc.toString(),S);r.preprocess(),d=r}catch{}w&&(w=!1,V("run"))}const{from:t,to:n}=e.state.selection.main;if(t===n)P=null;else{const r=e.state.doc.lineAt(t).number-1,s=e.state.doc.lineAt(n).number-1;P={from:d.getLineAddress(r),to:d.getLineAddress(s+1)}}C()}),Je=e=>{const t=de.define(),n=de.define(),r=y.line({attributes:{style:`background-color: ${e}`}});return{field:nt.define({create(){return y.none},update(c,u){c=c.map(u.changes);for(let a of u.effects)a.is(t)&&(c=y.none,c=c.update({add:[r.range(a.value)]})),a.is(n)&&(c=y.none);return c},provide:c=>T.decorations.from(c)}),highlight:(c,u)=>{if(u<1||u>c.state.doc.lines)return;const a=c.state.doc.line(u).from;c.dispatch({effects:t.of(a)})},clear:c=>{c.dispatch({effects:n.of(null)})}}},K=Je("rgba(37, 99, 235, 0.35)"),_=Je("rgba(170, 34, 34, 0.35)"),oe=(e,t)=>{t.line!==void 0&&_.highlight(e,t.line)},ft=T.theme({"&":{backgroundColor:"#000 !important",color:"#ffffff"},".cm-cursor":{borderLeftColor:"#44aa00ff !important"},"&.cm-focused":{outline:"none",border:"none"}},{dark:!0}),Tt=$e.highest(T.theme({".cm-fat-cursor":{background:"#44aa00ff !important"},"&:not(.cm-focused) .cm-fat-cursor":{background:"none",outline:"solid 1px #44aa00ff !important"},".cm-cursor":{borderLeftColor:"#fff !important"},".cm-vim-panel":{backgroundColor:"#000 !important",color:"#fff !important",borderTop:"1px solid #2E2E2E"}})),Pe=[je(),Tt],Te=(e,t)=>{localStorage.setItem(ae,t),e.dispatch({changes:{from:0,to:e.state.doc.length,insert:t}})},Nt=T.scrollMargins.of(()=>{const e=document.getElementById("editor-toolbar"),t=document.getElementById("editor-bottom-bar");return{top:e?.getBoundingClientRect().height,bottom:t?.getBoundingClientRect().height}});let He=F[0].code;const Ne=localStorage.getItem(ae);Ne&&(He=Ne);let Lt=ze.create({doc:He,extensions:[ve.of(xe?Pe:[]),Oe.of(Me?we:[]),Ge.of(ke?Fe:[]),Xe.of([...et,tt]),qe,ce.of([T.editable.of(!x)]),Qe,K.field,_.field,ft,gt,ht,Nt]}),p=new T({state:Lt,parent:dt});const le=(e,t,n,r,s)=>{e&&(e.checked=n,e.addEventListener("change",()=>{const o=e.checked;localStorage.setItem(t,String(o)),p.dispatch({effects:r.reconfigure(o?s:[])})}))};le(mt,Se,xe,ve,Pe);le(Et,Ie,Me,Oe,we);le(ut,Ce,ke,Ge,Fe);const St="panelCollapsed:",ie=(e,t,n)=>{const r=document.getElementById(e),s=document.getElementById(t),o=document.getElementById(n);if(!r||!s||!o)return;const i=St+e,c=u=>{r.classList.toggle("hidden",u),o.classList.toggle("hidden",!u),localStorage.setItem(i,String(u))};c(localStorage.getItem(i)==="true"),s.addEventListener("click",()=>c(!0)),o.addEventListener("click",()=>c(!1))};ie("registers-panel","registers-collapse-btn","show-registers-btn");ie("code-editor","code-collapse-btn","show-code-btn");ie("memory-panel","memory-collapse-btn","show-memory-btn");let d=new B(p.state.doc.toString(),S);try{d.preprocess()}catch{}const Be=e=>{b.innerHTML=`${e} <span class="text-gray-500 group-hover:text-black">f10</span>`},V=e=>{v&&(v.innerHTML=`${e} <span class="text-gray-500 group-hover:text-black">f5</span>`,v.title=`${e} (F5)`)};let A=null;const It=()=>{A!==null&&(clearInterval(A),A=null),I&&(I.textContent="play"),k?.classList.remove("hidden"),b.classList.remove("hidden")},Ct=()=>{I&&(I.textContent="stop"),k?.classList.add("hidden"),b.classList.add("hidden"),A=setInterval(()=>b.click(),500)};I?.addEventListener("click",()=>{A!==null?It():Ct()});const H=()=>{d.currentLine=0,x=!1,p.dispatch({effects:ce.reconfigure([T.editable.of(!0)])}),K.clear(p),Be("run line by line"),b.classList.remove("hidden"),k?.classList.add("hidden"),v?.classList.remove("hidden"),I?.classList.add("hidden"),A!==null&&(clearInterval(A),A=null),I&&(I.textContent="play"),w=!1,V("run")};b?.addEventListener("click",()=>{if(M.innerHTML="",_.clear(p),!x){try{const e=p.state.doc.toString();d=new B(e,S),d.preprocess(),K.highlight(p,d.currentLine+1),x=!0,p.dispatch({effects:ce.reconfigure([T.editable.of(!1)])}),Be("next line"),k?.classList.remove("hidden"),v?.classList.add("hidden"),I?.classList.remove("hidden"),C()}catch(e){e instanceof X||e instanceof q?(M.innerHTML=e.message,oe(p,e)):console.error(e),H()}return}try{d.interpretNextLine(),K.highlight(p,d.currentLine+1),C()}catch(e){e instanceof X||e instanceof q?(M.innerHTML=e.message,oe(p,e)):console.error(e),H()}d.isAtEnd()&&H()});v?.addEventListener("click",async()=>{if(x){b.click();return}M.innerHTML="",_.clear(p);const e=p.state.doc.toString();if(w){w=!1,V("run"),d=new B(e,S);try{d.preprocess()}catch{}C();return}H(),d=new B(e,S);try{d.interpret(),w=!0,V("reset"),C()}catch(t){t instanceof X||t instanceof q?(M.innerHTML=t.message,oe(p,t)):console.error(t)}});k?.addEventListener("click",()=>{M.innerHTML="",_.clear(p),H()});window.addEventListener("keydown",e=>{e.key==="F5"&&e.shiftKey?(e.preventDefault(),k?.click()):e.key==="F5"?(e.preventDefault(),v?.click()):e.key==="F10"&&(e.preventDefault(),b?.click())});const C=()=>{it?.replaceChildren(...At(d.currentMemoryAddress,d.hasStarted),...bt(d.eflags),...Dt(d.registers)),ee?.replaceChildren(...yt(d.bytes))};pe&&$(pe,[{value:"bin",label:"binary"},{value:"hex",label:"hex"}],L,e=>{L=e,C()});ge&&$(ge,[{value:"bin",label:"binary"},{value:"hex",label:"hex"}],O,e=>{O=e,C()});he&&$(he,[{value:"raw",label:"raw"},{value:"sections",label:"sections"},{value:"sections-labels",label:"sections + labels"}],J,e=>{J=e,localStorage.setItem(De,J),C()});const At=(e,t)=>{const n=document.createElement("div");n.className="register flex justify-between";const r=document.createElement("div");r.innerHTML='<span class="register-name">PC</span>';const s=L==="hex"?8:32,o=t?(L==="hex"?"0x":"0b")+e.toString(L==="hex"?16:2).padStart(s,"0"):(L==="hex"?"0x":"0b")+"~".repeat(s),i=document.createElement("div");return i.innerHTML=o,n.append(r,i),[n]},bt=e=>{const t=e>>me.ZF&1,n=e>>me.SF&1,r=document.createElement("div");r.className="register flex justify-between";const s=document.createElement("div");s.innerHTML='<span class="register-name">EFLAGS</span>';const o=document.createElement("div");return o.innerHTML=`<span class="register-name">ZF</span> ${t}  <span class="register-name">SF</span> ${n}`,r.append(s,o),[r]},Dt=e=>{const t=[];return e.forEach((n,r)=>{const s=document.createElement("div"),o=document.createElement("div");s.className="register";const i="R"+r.toString();o.innerHTML=`<span class="register-name">${i}</span>`+(r<10?"&nbsp;":"");const c=L==="hex"?"0x"+(n>>>0).toString(16).padStart(8,"0"):"0b"+(n>>>0).toString(2).padStart(32,"0"),u=L==="hex"?" 0x":" 0b",a=L==="hex"?11:35;o.innerHTML+=d.isRegisterInitialized[r]?" "+c+" "+n.toString():u.padEnd(a,"~"),s.appendChild(o),t.push(s)}),t},Le=(e,t,n,r)=>{const s=document.createElement("div");s.className="byte-record",r&&s.appendChild(document.createElement("div"));const o=document.createElement("div");o.className=`memory-section-label ${n}`,o.textContent=t,s.appendChild(o);for(let i=0;i<4;i+=1)s.appendChild(document.createElement("div"));s.appendChild(document.createElement("div")),e.push(s)},yt=e=>{const t=[],n=O==="hex"?2:8,r=J!=="raw",s=J==="sections-labels";ee&&(ee.style.gridTemplateColumns=(s?"12ch ":"")+`7ch repeat(4, ${n}ch) auto`);const o=e.findIndex(a=>a.type!=="DATA"&&a.type!=="DATA_HIDDEN"),i=r&&e.length>0&&o!==0,c=r&&o!==-1;if(e.length>0){const a=document.createElement("div");if(a.className="byte-record",s){const E=document.createElement("div");E.className="memory-header-cell",a.appendChild(E)}const m=document.createElement("div");m.className="memory-header-cell",m.textContent="address",a.appendChild(m);for(let E=0;E<4;E+=1){const R=document.createElement("div");R.className="memory-header-cell",a.appendChild(R)}const h=document.createElement("div");h.className="memory-header-cell",h.textContent="value",a.appendChild(h),t.push(a);const l=document.createElement("div");l.className="memory-header-rule",t.push(l)}i&&Le(t,".data","section-data",s);const u=a=>d.labels.find(m=>m.address>=a&&m.address<a+4)?.label??"";for(let a=0;a<e.length;a+=4){c&&a===o&&Le(t,".text","section-text",s);const m=document.createElement("div");if(m.className="byte-record",s){const R=document.createElement("div");R.className="memory-label",R.textContent=u(a),m.appendChild(R)}const h=document.createElement("div");h.className="memory-address",h.textContent=`0x${a.toString(16).padStart(4,"0")}:`,m.appendChild(h);for(let R=a;R<a+4;R+=1){const g=document.createElement("div");if(R>=d.bytes.length){g.innerHTML="&nbsp;".repeat(n),m.appendChild(g);continue}const f=[];x&&R>=d.currentMemoryAddress&&R<d.currentMemoryAddress+d.statements[d.currentLine].byteSize&&d.statements[d.currentLine].byteSize>0&&f.push("current-memory"),P&&R>=P.from&&R<P.to&&f.push("selected-memory");const D=e[R];switch(D.type){case"DATA":f.push("byte-data"),g.innerHTML=O==="hex"?D.val.toString(16).padStart(2,"0"):D.val.toString(2).padStart(8,"0");break;case"INSTRUCTION_OPCODE":f.push("byte-instruction-opcode"),g.innerHTML=O==="hex"?D.val.toString(16).padStart(2,"0"):D.val.toString(2).padStart(8,"0");break;case"INSTRUCTION_OPERAND":f.push("byte-instruction-operand"),g.innerHTML=O==="hex"?D.val.toString(16).padStart(2,"0"):D.val.toString(2).padStart(8,"0");break;case"INSTRUCTION_UNUSED":f.push("byte-instruction-unused"),g.innerHTML="x".repeat(n);break;case"DATA_HIDDEN":f.push("byte-data-hidden"),g.innerHTML="~".repeat(n);break;case"UNKNOWN":f.push("byte-unknown"),g.innerHTML="x".repeat(n)}g.className=f.join(" "),m.appendChild(g)}const l=e[a].type==="DATA"?d.bytesToNumber([e[a],e[a+1],e[a+2],e[a+3]]):"",E=document.createElement("div");E.innerHTML=l.toString(),E.className="rep-data",m.appendChild(E),t.push(m)}return t};C();const se=()=>{if(!Re)return;const e=[...F.map(({name:t},n)=>({value:W({kind:"example",index:n}),label:t})),...Object.keys(N).sort().map(t=>({value:W({kind:"custom",name:t}),label:t,deletable:!0}))];$(Re,e,W(G),t=>{const n=te(t);if(!n)return;const r=n.kind==="example"?F[n.index]?.code:N[n.name];r!==void 0&&(z(n),Te(p,r))},{onDelete:t=>{const n=te(t);!n||n.kind!=="custom"||confirm(`delete "${n.name}"?`)&&(delete N[n.name],ne(N),G.kind==="custom"&&G.name===n.name&&(z(Z),Te(p,F[0].code)),se())},addItem:{label:"+ add file",onClick:()=>{const t=prompt("file name:")?.trim();if(t){if(t in N){alert(`a file named "${t}" already exists.`);return}N[t]=p.state.doc.toString(),ne(N),z({kind:"custom",name:t}),se()}}}})};se();
