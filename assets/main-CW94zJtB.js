import{S as H,E as N,a as w,D as L,b as Z,k,c as _,C as K,d as F,e as W,I as h,R as S,P as D}from"./tomorrow-D_jCYm-M.js";/* empty css              */const A=[{name:"sum vector",code:`VECTOR DC 20*INTEGER(2)
VECTOR_LEN DC INTEGER(20)

ONE DC INTEGER(1)
ZERO DC INTEGER(0)
WORD_SIZE DC INTEGER(4)

SUM DC INTEGER(0)

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
    `},{name:"gcd",code:`ZERO DC INTEGER(0)
A DC INTEGER(7)
B DC INTEGER(3)
RES DS INTEGER

L 0, A
L 1, B

START SR 0, 1
CR 0, 1
JZ END

L 3, ZERO
AR 3, 0
SR 3, 1

JP START
LR 3, 0
LR 0, 1
LR 1, 3
J START

END ST 0, RES `},{name:"palindrom",code:`ONE DC INTEGER(1)
FOUR DC INTEGER(4)

N DC INTEGER(3)

PA DC INTEGER(3)
DC INTEGER(4)
DC INTEGER(3)

RES DC INTEGER(1)

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
    `},{name:"bubble sort",code:`JEDEN DC INTEGER(1)
CZTERY DC INTEGER(4)

N DC INTEGER(3)

P DC INTEGER(12)
DC INTEGER(-4)
DC INTEGER(8)

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
    `},{name:"merge sort join",code:`M DC INTEGER(2)
A DC INTEGER(1)
DC INTEGER(2)

N DC INTEGER(2)
B DC INTEGER(1)
DC INTEGER(2)

C DS 4*INTEGER
JEDEN DC INTEGER(1)

L 1, JEDEN
LR 2, 1

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
 
  `}],b=(e,t,s,o)=>{const r=document.createElement("button");r.type="button",r.className="dropdown-toggle";const E=document.createElement("div");E.className="dropdown-menu";let d=s;const c=t.map(a=>{const R=document.createElement("div");return R.className="dropdown-item",R.textContent=a.label,R.addEventListener("click",()=>{d=a.value,r.textContent=a.label,i(),e.classList.remove("open"),o(d)}),{value:a.value,element:R}}),i=()=>{E.replaceChildren(...c.filter(a=>a.value!==d).map(a=>a.element))};r.textContent=t.find(a=>a.value===d)?.label??d,r.addEventListener("click",a=>{a.stopPropagation(),document.querySelectorAll(".dropdown.open").forEach(R=>{R!==e&&R.classList.remove("open")}),e.classList.toggle("open")}),e.replaceChildren(r,E),E.replaceChildren(...c.map(a=>a.element));const m=Math.max(...c.map(a=>a.element.offsetWidth));r.style.width=E.style.width=`${m}px`,i()};document.addEventListener("click",()=>{document.querySelectorAll(".dropdown.open").forEach(e=>e.classList.remove("open"))});const y="code",V=document.getElementById("run-btn"),I=document.getElementById("next-btn"),Y=document.getElementById("registers"),z=document.getElementById("memory"),j=document.getElementById("code"),p=document.getElementById("errors"),v=document.getElementById("examples-select"),G=document.getElementById("registers-format"),M=document.getElementById("memory-format");let u="bin",C="bin",f=!1;const J=new K,O=H.define(),U=H.define(),q=N.updateListener.of(e=>{e.docChanged&&localStorage.setItem(y,e.state.doc.toString())}),$=w.define({create(){return L.none},update(e,t){e=e.map(t.changes);for(let s of t.effects)s.is(O)&&(e=L.none,e=e.update({add:[Q.range(s.value)]})),s.is(U)&&(e=L.none);return e},provide:e=>N.decorations.from(e)}),Q=L.line({attributes:{style:"background-color: #44aa00ff"}}),x=(e,t)=>{if(t<1||t>e.state.doc.lines)return;const s=e.state.doc.line(t).from;e.dispatch({effects:O.of(s)})},X=e=>{e.dispatch({effects:U.of(null)})},ee=N.theme({"&":{backgroundColor:"#000 !important",color:"#ffffff"},".cm-cursor":{borderLeftColor:"#44aa00ff !important"},"&.cm-focused":{outline:"none",border:"none"}},{dark:!0}),te=(e,t)=>{localStorage.setItem(y,t),e.dispatch({changes:{from:0,to:e.state.doc.length,insert:t}})};let B=A[0].code;const P=localStorage.getItem(y);P&&(B=P);let ne=Z.create({doc:B,extensions:[k.of(W),_,J.of([N.editable.of(!f)]),F,$,ee,q]}),l=new N({state:ne,parent:j}),n=new h(l.state.doc.toString());const g=()=>{n.currentLine=0,f=!1,l.dispatch({effects:J.reconfigure([N.editable.of(!0)])}),X(l),I.innerHTML="run line by line"};I?.addEventListener("click",()=>{if(p.innerHTML="",!f){try{const e=l.state.doc.toString();n=new h(e),x(l,n.currentLine+1),n.preprocess(),f=!0,l.dispatch({effects:J.reconfigure([N.editable.of(!1)])}),I.innerHTML="next line",T()}catch(e){e instanceof S||e instanceof D?p.innerHTML=e.message:console.error(e),g()}return}try{n.interpretNextLine(),x(l,n.currentLine+1),T()}catch(e){e instanceof S||e instanceof D?p.innerHTML=e.message:console.error(e),g()}n.isAtEnd()&&g()});V?.addEventListener("click",async()=>{p.innerHTML="",g();const e=l.state.doc.toString();n=new h(e);try{n.interpret(),T()}catch(t){t instanceof S||t instanceof D?p.innerHTML=t.message:console.error(t)}});const T=()=>{Y?.replaceChildren(...re(n.registers)),z?.replaceChildren(...oe(n.bytes))};G&&b(G,[{value:"bin",label:"binary"},{value:"hex",label:"hex"}],u,e=>{u=e,T()});M&&b(M,[{value:"bin",label:"binary"},{value:"hex",label:"hex"}],C,e=>{C=e,T()});const re=e=>{const t=[];return e.forEach((s,o)=>{const r=document.createElement("div"),E=document.createElement("div");r.className="register";const d="R"+o.toString();E.innerHTML=d+(o<10?"&nbsp;":"");const c=u==="hex"?"0x"+(s>>>0).toString(16).padStart(8,"0"):"0b"+(s>>>0).toString(2).padStart(32,"0"),i=u==="hex"?" 0x":" 0b",m=u==="hex"?11:35;E.innerHTML+=n.isRegisterInitialized[o]?" "+c+" "+s.toString():i.padEnd(m,"~"),r.appendChild(E),t.push(r)}),t},oe=e=>{const t=[],s=C==="hex"?2:8;for(let o=0;o<e.length;o+=4){const r=document.createElement("div");r.className="byte-record",r.innerHTML=`0x${o.toString(16).padStart(4,"0")}: `;for(let c=o;c<o+4;c+=1){const i=document.createElement("div");if(c>=n.bytes.length){i.innerHTML="&nbsp;".repeat(s),r.appendChild(i);continue}f&&c>=n.currentMemoryAddress&&c<n.currentMemoryAddress+n.statements[n.currentLine].byteSize&&n.statements[n.currentLine].byteSize>0&&(i.className="current-memory");const m=e[c];switch(m.type){case"DATA":i.innerHTML=C==="hex"?m.val.toString(16).padStart(2,"0"):m.val.toString(2).padStart(8,"0");break;case"INSTRUCTION":i.innerHTML="x".repeat(s);break;case"DATA_HIDDEN":i.innerHTML="~".repeat(s)}r.appendChild(i)}const E=e[o].type==="DATA"?n.bytesToNumber([e[o],e[o+1],e[o+2],e[o+3]]):"x",d=document.createElement("div");d.innerHTML=E.toString(),d.className="rep-data",r.appendChild(d),t.push(r)}return t};T();const ae=()=>{v&&b(v,A.map(({name:e},t)=>({value:t.toString(),label:e})),"0",e=>{const t=A[Number(e)].code;te(l,t)})};ae();
