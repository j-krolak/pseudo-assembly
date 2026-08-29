import{k as He,S as Pe,H as Be,t as $,s as Ue,V as _e,E as f,D,R as We,W as Ze,I as P,P as Ke,v as Ve,a as $e,C as K,b as Ye,c as ze,d as je,e as Xe,i as qe,f as z,g as j,h as ce,j as Qe,F as ie}from"./index-B7dxPleB.js";/* empty css              */const G=[{name:"sum vector",code:`# sum all elements of VECTOR
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
`}],V=(e,t,n,r,s)=>{const o=document.createElement("button");o.type="button",o.className="dropdown-toggle";const i=document.createElement("div");i.className="dropdown-menu";let l=n;const u=t.map(c=>{const E=document.createElement("div");E.className="dropdown-item";const p=document.createElement("span");if(p.textContent=c.label,E.appendChild(p),E.addEventListener("click",()=>{l=c.value,o.textContent=c.label,m(),e.classList.remove("open"),r(l)}),c.deletable&&s?.onDelete){const R=document.createElement("span");R.className="dropdown-item-delete",R.textContent="×",R.addEventListener("click",N=>{N.stopPropagation(),s.onDelete(c.value)}),E.appendChild(R)}return{value:c.value,element:E}});let a=null;if(s?.addItem){const c=document.createElement("div");c.className="dropdown-item dropdown-item-add",c.textContent=s.addItem.label,c.addEventListener("click",E=>{E.stopPropagation(),e.classList.remove("open"),s.addItem.onClick()}),a=c}const m=()=>{i.replaceChildren(...u.filter(c=>c.value!==l).map(c=>c.element),...a?[a]:[])};o.textContent=t.find(c=>c.value===l)?.label??l,o.addEventListener("click",c=>{c.stopPropagation(),document.querySelectorAll(".dropdown.open").forEach(E=>{E!==e&&E.classList.remove("open")}),e.classList.toggle("open")}),e.replaceChildren(o,i),i.replaceChildren(...u.map(c=>c.element),...a?[a]:[]);const h=Math.max(...u.map(c=>c.element.offsetWidth));o.style.width=i.style.width=`${h}px`,m()};document.addEventListener("click",()=>{document.querySelectorAll(".dropdown.open").forEach(e=>e.classList.remove("open"))});const X=new Set(He);function oe(e){const t=e.match(/^\s*/)?.[0].length??0,n=e.slice(t);if(n.startsWith("#")||n.length===0)return null;const r=n.match(/^[^\s,]+/);if(!r)return null;const s=r[0],o=n.slice(s.length).match(/^[ \t]+([^\s,]+)/)?.[1],i=(!X.has(s)||o!==void 0&&X.has(o))&&n[s.length]!==","&&!/^-?\d+$/.test(s);return{leading:t,word:s,looksLikeLabel:i}}const et=Pe.define({startState(){return{wordIndex:0,instructionWordIndex:null}},token(e,t){if(e.sol()){t.wordIndex=0;const n=oe(e.string);t.instructionWordIndex=n===null?null:n.looksLikeLabel?1:0}if(e.eatSpace())return null;if(e.match("#"))return e.skipToEnd(),"comment";if(e.match(/^-?\d+/))return"number";if(e.match(","))return"punctuation";if(e.match("*"))return"operator";if(e.match(/^[()]/))return"bracket";if(e.match(/^[A-Za-z_][A-Za-z0-9_]*/)){const n=e.current(),r=t.wordIndex;return t.wordIndex+=1,n==="INTEGER"?"typeName":r===t.instructionWordIndex&&X.has(n)?"keyword":"labelName"}return e.next(),null}}),tt=Be.define([{tag:$.keyword,color:"#44aa00ff",fontWeight:"bold"},{tag:$.typeName,color:"#00d8ff"},{tag:$.comment,color:"#666"}]),nt=Ue(tt);class de extends Ze{width;constructor(t){super(),this.width=t}eq(t){return t.width===this.width}toDOM(){const t=document.createElement("span");return t.style.display="inline-block",t.style.width=`${this.width}ch`,t.style.borderRight="1px solid #2E2E2E",t}get estimatedHeight(){return-1}}function me(e){const t=e.state.doc,n=new We,r=[];let s=0;for(let o=1;o<=t.lines;o++){const i=t.line(o),l=i.text,u=oe(l);if(u===null){if(l.trimStart().startsWith("#"))continue;const c=l.match(/^\s*/)?.[0].length??0;r.push({hasLabel:!1,gapFrom:i.from,gapTo:i.from+c});continue}const{leading:a,word:m,looksLikeLabel:h}=u;if(!h)r.push({hasLabel:!1,gapFrom:i.from,gapTo:i.from+a});else{const c=i.from+a+m.length,E=l.slice(a+m.length).match(/^[ \t]*/)?.[0].length??0;s=Math.max(s,m.length),r.push({hasLabel:!0,gapFrom:c,gapTo:c+E,labelLen:m.length})}}if(s===0)return D.none;for(const o of r){const i=o.hasLabel?s-o.labelLen+1:s+1;i!==0&&(o.gapFrom===o.gapTo?n.add(o.gapFrom,o.gapFrom,D.widget({widget:new de(i),side:1})):n.add(o.gapFrom,o.gapTo,D.replace({widget:new de(i)})))}return n.finish()}const ot=_e.fromClass(class{decorations;constructor(e){this.decorations=me(e)}update(e){e.docChanged&&(this.decorations=me(e.view))}},{decorations:e=>e.decorations}),st=f.inputHandler.of((e,t,n,r)=>{if(t!==n||!r||/\s/.test(r))return!1;const s=e.state.doc.lineAt(t),o=oe(s.text);return!o||o.looksLikeLabel||s.from+o.leading!==t?!1:(e.dispatch({changes:{from:t,to:n,insert:r+" "},selection:{anchor:t+r.length},userEvent:"input.type"}),!0)}),rt=[ot,st],se="code",Te="vimMode",Le="syntaxHighlight",Se="labelAlign",Ce="customFiles",Ie="currentFile",be="memoryView",y=document.getElementById("run-btn"),b=document.getElementById("next-btn"),k=document.getElementById("stop-btn"),S=document.getElementById("play-btn"),at=document.getElementById("registers"),q=document.getElementById("memory"),lt=document.getElementById("code"),M=document.getElementById("errors"),Ee=document.getElementById("examples-select"),ue=document.getElementById("registers-format"),pe=document.getElementById("memory-format"),ge=document.getElementById("memory-view"),ct=document.getElementById("vim-mode-toggle"),it=document.getElementById("syntax-highlight-toggle"),dt=document.getElementById("label-align-toggle");let L="bin",x="bin";const mt=["raw","sections","sections-labels"],Re=localStorage.getItem(be);let J=mt.includes(Re)?Re:"sections-labels",v=!1,w=!1;const re=new K,Ae=new K,De=localStorage.getItem(Te)==="true",ye=new K,ve=localStorage.getItem(Le)!=="false",xe=[et,nt],Me=new K,we=localStorage.getItem(Se)!=="false",Oe=[rt],U=e=>e.kind==="example"?`example:${e.index}`:`custom:${e.name}`,Q=e=>{if(e.startsWith("example:")){const t=Number(e.slice(8));return Number.isInteger(t)?{kind:"example",index:t}:null}return e.startsWith("custom:")?{kind:"custom",name:e.slice(7)}:null},Et=()=>{try{return JSON.parse(localStorage.getItem(Ce)??"{}")}catch{return{}}},ee=e=>{localStorage.setItem(Ce,JSON.stringify(e))};let T=Et();const _={kind:"example",index:0};let O=(()=>{const e=localStorage.getItem(Ie),t=e?Q(e):null;return!t||t.kind==="custom"&&!(t.name in T)||t.kind==="example"&&!G[t.index]?_:t})();const Y=e=>{O=e,localStorage.setItem(Ie,U(e))},ut=f.updateListener.of(e=>{if(e.docChanged){const t=e.state.doc.toString();localStorage.setItem(se,t),O.kind==="custom"&&(T[O.name]=t,ee(T))}});let F=null;const pt=f.updateListener.of(e=>{if(!e.docChanged&&!e.selectionSet)return;if(e.docChanged&&!v){try{const r=new P(e.state.doc.toString());r.preprocess(),d=r}catch{}w&&(w=!1,Z("run"))}const{from:t,to:n}=e.state.selection.main;if(t===n)F=null;else{const r=e.state.doc.lineAt(t).number-1,s=e.state.doc.lineAt(n).number-1;F={from:d.getLineAddress(r),to:d.getLineAddress(s+1)}}C()}),ke=e=>{const t=ce.define(),n=ce.define(),r=D.line({attributes:{style:`background-color: ${e}`}});return{field:Qe.define({create(){return D.none},update(l,u){l=l.map(u.changes);for(let a of u.effects)a.is(t)&&(l=D.none,l=l.update({add:[r.range(a.value)]})),a.is(n)&&(l=D.none);return l},provide:l=>f.decorations.from(l)}),highlight:(l,u)=>{if(u<1||u>l.state.doc.lines)return;const a=l.state.doc.line(u).from;l.dispatch({effects:t.of(a)})},clear:l=>{l.dispatch({effects:n.of(null)})}}},W=ke("rgba(37, 99, 235, 0.35)"),B=ke("rgba(170, 34, 34, 0.35)"),te=(e,t)=>{t.line!==void 0&&B.highlight(e,t.line)},gt=f.theme({"&":{backgroundColor:"#000 !important",color:"#ffffff"},".cm-cursor":{borderLeftColor:"#44aa00ff !important"},"&.cm-focused":{outline:"none",border:"none"}},{dark:!0}),Rt=Ke.highest(f.theme({".cm-fat-cursor":{background:"#44aa00ff !important"},"&:not(.cm-focused) .cm-fat-cursor":{background:"none",outline:"solid 1px #44aa00ff !important"},".cm-cursor":{borderLeftColor:"#fff !important"},".cm-vim-panel":{backgroundColor:"#000 !important",color:"#fff !important",borderTop:"1px solid #2E2E2E"}})),Ge=[Ve(),Rt],he=(e,t)=>{localStorage.setItem(se,t),e.dispatch({changes:{from:0,to:e.state.doc.length,insert:t}})},ht=f.scrollMargins.of(()=>{const e=document.getElementById("editor-toolbar"),t=document.getElementById("editor-bottom-bar");return{top:e?.getBoundingClientRect().height,bottom:t?.getBoundingClientRect().height}});let Je=G[0].code;const fe=localStorage.getItem(se);fe&&(Je=fe);let ft=$e.create({doc:Je,extensions:[Ae.of(De?Ge:[]),ye.of(ve?xe:[]),Me.of(we?Oe:[]),Ye.of([...Xe,qe]),ze,re.of([f.editable.of(!v)]),je,W.field,B.field,gt,ut,pt,ht]}),g=new f({state:ft,parent:lt});const ae=(e,t,n,r,s)=>{e&&(e.checked=n,e.addEventListener("change",()=>{const o=e.checked;localStorage.setItem(t,String(o)),g.dispatch({effects:r.reconfigure(o?s:[])})}))};ae(ct,Te,De,Ae,Ge);ae(it,Le,ve,ye,xe);ae(dt,Se,we,Me,Oe);const Nt="panelCollapsed:",le=(e,t,n)=>{const r=document.getElementById(e),s=document.getElementById(t),o=document.getElementById(n);if(!r||!s||!o)return;const i=Nt+e,l=u=>{r.classList.toggle("hidden",u),o.classList.toggle("hidden",!u),localStorage.setItem(i,String(u))};l(localStorage.getItem(i)==="true"),s.addEventListener("click",()=>l(!0)),o.addEventListener("click",()=>l(!1))};le("registers-panel","registers-collapse-btn","show-registers-btn");le("code-editor","code-collapse-btn","show-code-btn");le("memory-panel","memory-collapse-btn","show-memory-btn");let d=new P(g.state.doc.toString());try{d.preprocess()}catch{}const Fe=e=>{b.innerHTML=`${e} <span class="text-gray-500 group-hover:text-black">f10</span>`},Z=e=>{y&&(y.innerHTML=`${e} <span class="text-gray-500 group-hover:text-black">f5</span>`,y.title=`${e} (F5)`)};let I=null;const Tt=()=>{I!==null&&(clearInterval(I),I=null),S&&(S.textContent="play"),k?.classList.remove("hidden"),b.classList.remove("hidden")},Lt=()=>{S&&(S.textContent="stop"),k?.classList.add("hidden"),b.classList.add("hidden"),I=setInterval(()=>b.click(),500)};S?.addEventListener("click",()=>{I!==null?Tt():Lt()});const H=()=>{d.currentLine=0,v=!1,g.dispatch({effects:re.reconfigure([f.editable.of(!0)])}),W.clear(g),Fe("run line by line"),b.classList.remove("hidden"),k?.classList.add("hidden"),y?.classList.remove("hidden"),S?.classList.add("hidden"),I!==null&&(clearInterval(I),I=null),S&&(S.textContent="play"),w=!1,Z("run")};b?.addEventListener("click",()=>{if(M.innerHTML="",B.clear(g),!v){try{const e=g.state.doc.toString();d=new P(e),d.preprocess(),W.highlight(g,d.currentLine+1),v=!0,g.dispatch({effects:re.reconfigure([f.editable.of(!1)])}),Fe("next line"),k?.classList.remove("hidden"),y?.classList.add("hidden"),S?.classList.remove("hidden"),C()}catch(e){e instanceof z||e instanceof j?(M.innerHTML=e.message,te(g,e)):console.error(e),H()}return}try{d.interpretNextLine(),W.highlight(g,d.currentLine+1),C()}catch(e){e instanceof z||e instanceof j?(M.innerHTML=e.message,te(g,e)):console.error(e),H()}d.isAtEnd()&&H()});y?.addEventListener("click",async()=>{if(v){b.click();return}M.innerHTML="",B.clear(g);const e=g.state.doc.toString();if(w){w=!1,Z("run"),d=new P(e);try{d.preprocess()}catch{}C();return}H(),d=new P(e);try{d.interpret(),w=!0,Z("reset"),C()}catch(t){t instanceof z||t instanceof j?(M.innerHTML=t.message,te(g,t)):console.error(t)}});k?.addEventListener("click",()=>{M.innerHTML="",B.clear(g),H()});window.addEventListener("keydown",e=>{e.key==="F5"&&e.shiftKey?(e.preventDefault(),k?.click()):e.key==="F5"?(e.preventDefault(),y?.click()):e.key==="F10"&&(e.preventDefault(),b?.click())});const C=()=>{at?.replaceChildren(...St(d.currentMemoryAddress,d.hasStarted),...Ct(d.eflags),...It(d.registers)),q?.replaceChildren(...bt(d.bytes))};ue&&V(ue,[{value:"bin",label:"binary"},{value:"hex",label:"hex"}],L,e=>{L=e,C()});pe&&V(pe,[{value:"bin",label:"binary"},{value:"hex",label:"hex"}],x,e=>{x=e,C()});ge&&V(ge,[{value:"raw",label:"raw"},{value:"sections",label:"sections"},{value:"sections-labels",label:"sections + labels"}],J,e=>{J=e,localStorage.setItem(be,J),C()});const St=(e,t)=>{const n=document.createElement("div");n.className="register flex justify-between";const r=document.createElement("div");r.innerHTML='<span class="register-name">PC</span>';const s=L==="hex"?8:32,o=t?(L==="hex"?"0x":"0b")+e.toString(L==="hex"?16:2).padStart(s,"0"):(L==="hex"?"0x":"0b")+"~".repeat(s),i=document.createElement("div");return i.innerHTML=o,n.append(r,i),[n]},Ct=e=>{const t=e>>ie.ZF&1,n=e>>ie.SF&1,r=document.createElement("div");r.className="register flex justify-between";const s=document.createElement("div");s.innerHTML='<span class="register-name">EFLAGS</span>';const o=document.createElement("div");return o.innerHTML=`<span class="register-name">ZF</span> ${t}  <span class="register-name">SF</span> ${n}`,r.append(s,o),[r]},It=e=>{const t=[];return e.forEach((n,r)=>{const s=document.createElement("div"),o=document.createElement("div");s.className="register";const i="R"+r.toString();o.innerHTML=`<span class="register-name">${i}</span>`+(r<10?"&nbsp;":"");const l=L==="hex"?"0x"+(n>>>0).toString(16).padStart(8,"0"):"0b"+(n>>>0).toString(2).padStart(32,"0"),u=L==="hex"?" 0x":" 0b",a=L==="hex"?11:35;o.innerHTML+=d.isRegisterInitialized[r]?" "+l+" "+n.toString():u.padEnd(a,"~"),s.appendChild(o),t.push(s)}),t},Ne=(e,t,n,r)=>{const s=document.createElement("div");s.className="byte-record",r&&s.appendChild(document.createElement("div"));const o=document.createElement("div");o.className=`memory-section-label ${n}`,o.textContent=t,s.appendChild(o);for(let i=0;i<4;i+=1)s.appendChild(document.createElement("div"));s.appendChild(document.createElement("div")),e.push(s)},bt=e=>{const t=[],n=x==="hex"?2:8,r=J!=="raw",s=J==="sections-labels";q&&(q.style.gridTemplateColumns=(s?"12ch ":"")+`7ch repeat(4, ${n}ch) auto`);const o=e.findIndex(a=>a.type!=="DATA"&&a.type!=="DATA_HIDDEN"),i=r&&e.length>0&&o!==0,l=r&&o!==-1;if(e.length>0){const a=document.createElement("div");if(a.className="byte-record",s){const E=document.createElement("div");E.className="memory-header-cell",a.appendChild(E)}const m=document.createElement("div");m.className="memory-header-cell",m.textContent="address",a.appendChild(m);for(let E=0;E<4;E+=1){const p=document.createElement("div");p.className="memory-header-cell",a.appendChild(p)}const h=document.createElement("div");h.className="memory-header-cell",h.textContent="value",a.appendChild(h),t.push(a);const c=document.createElement("div");c.className="memory-header-rule",t.push(c)}i&&Ne(t,".data","section-data",s);const u=a=>d.labels.find(m=>m.address>=a&&m.address<a+4)?.label??"";for(let a=0;a<e.length;a+=4){l&&a===o&&Ne(t,".text","section-text",s);const m=document.createElement("div");if(m.className="byte-record",s){const p=document.createElement("div");p.className="memory-label",p.textContent=u(a),m.appendChild(p)}const h=document.createElement("div");h.className="memory-address",h.textContent=`0x${a.toString(16).padStart(4,"0")}:`,m.appendChild(h);for(let p=a;p<a+4;p+=1){const R=document.createElement("div");if(p>=d.bytes.length){R.innerHTML="&nbsp;".repeat(n),m.appendChild(R);continue}const N=[];v&&p>=d.currentMemoryAddress&&p<d.currentMemoryAddress+d.statements[d.currentLine].byteSize&&d.statements[d.currentLine].byteSize>0&&N.push("current-memory"),F&&p>=F.from&&p<F.to&&N.push("selected-memory");const A=e[p];switch(A.type){case"DATA":N.push("byte-data"),R.innerHTML=x==="hex"?A.val.toString(16).padStart(2,"0"):A.val.toString(2).padStart(8,"0");break;case"INSTRUCTION_OPCODE":N.push("byte-instruction-opcode"),R.innerHTML=x==="hex"?A.val.toString(16).padStart(2,"0"):A.val.toString(2).padStart(8,"0");break;case"INSTRUCTION_OPERAND":N.push("byte-instruction-operand"),R.innerHTML=x==="hex"?A.val.toString(16).padStart(2,"0"):A.val.toString(2).padStart(8,"0");break;case"INSTRUCTION_UNUSED":N.push("byte-instruction-unused"),R.innerHTML="x".repeat(n);break;case"DATA_HIDDEN":N.push("byte-data-hidden"),R.innerHTML="~".repeat(n)}R.className=N.join(" "),m.appendChild(R)}const c=e[a].type==="DATA"?d.bytesToNumber([e[a],e[a+1],e[a+2],e[a+3]]):"",E=document.createElement("div");E.innerHTML=c.toString(),E.className="rep-data",m.appendChild(E),t.push(m)}return t};C();const ne=()=>{if(!Ee)return;const e=[...G.map(({name:t},n)=>({value:U({kind:"example",index:n}),label:t})),...Object.keys(T).sort().map(t=>({value:U({kind:"custom",name:t}),label:t,deletable:!0}))];V(Ee,e,U(O),t=>{const n=Q(t);if(!n)return;const r=n.kind==="example"?G[n.index]?.code:T[n.name];r!==void 0&&(Y(n),he(g,r))},{onDelete:t=>{const n=Q(t);!n||n.kind!=="custom"||confirm(`delete "${n.name}"?`)&&(delete T[n.name],ee(T),O.kind==="custom"&&O.name===n.name&&(Y(_),he(g,G[0].code)),ne())},addItem:{label:"+ add file",onClick:()=>{const t=prompt("file name:")?.trim();if(t){if(t in T){alert(`a file named "${t}" already exists.`);return}T[t]=g.state.doc.toString(),ee(T),Y({kind:"custom",name:t}),ne()}}}})};ne();
