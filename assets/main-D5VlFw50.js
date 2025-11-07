import{S as J,E as a,a as O,D as N,b as y,k as H,c as P,C as U,d as B,e as v,I as f,R as L,P as C}from"./tomorrow-BNdOAJQP.js";/* empty css              */const S=[{name:"SUM VECTOR",code:`VECTOR DC 20*INTEGER(2)
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
    `},{name:"GCD",code:`ZERO DC INTEGER(0)
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

END ST 0, RES `},{name:"PALINDROM",code:`ONE DC INTEGER(1)
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
    `},{name:"BUBBLE SORT",code:`JEDEN DC INTEGER(1)
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
    `},{name:"MERGE SORT JOIN",code:`M DC INTEGER(2)
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
 
  `}],p="code",x=document.getElementById("run-btn"),D=document.getElementById("next-btn"),Z=document.getElementById("registers"),_=document.getElementById("memory"),k=document.getElementById("code"),R=document.getElementById("errors"),I=document.getElementById("examples-select");let T=!1;const g=new U,G=J.define(),M=J.define(),K=a.updateListener.of(e=>{e.docChanged&&localStorage.setItem(p,e.state.doc.toString())}),W=O.define({create(){return N.none},update(e,n){e=e.map(n.changes);for(let t of n.effects)t.is(G)&&(e=N.none,e=e.update({add:[F.range(t.value)]})),t.is(M)&&(e=N.none);return e},provide:e=>a.decorations.from(e)}),F=N.line({attributes:{style:"background-color: #44aa00ff"}}),u=(e,n)=>{if(n<1||n>e.state.doc.lines)return;const t=e.state.doc.line(n).from;e.dispatch({effects:G.of(t)})},V=e=>{e.dispatch({effects:M.of(null)})},w=a.theme({"&":{backgroundColor:"#000 !important",color:"#ffffff"},".cm-cursor":{borderLeftColor:"#44aa00ff !important"},"&.cm-focused":{outline:"none",border:"none"}},{dark:!0}),Y=(e,n)=>{localStorage.setItem(p,n),e.dispatch({changes:{from:0,to:e.state.doc.length,insert:n}})};let b=S[0].code;const h=localStorage.getItem(p);h&&(b=h);let z=y.create({doc:b,extensions:[H.of(v),P,g.of([a.editable.of(!T)]),B,W,w,K]}),s=new a({state:z,parent:k}),r=new f(s.state.doc.toString());const l=()=>{r.currentLine=0,T=!1,s.dispatch({effects:g.reconfigure([a.editable.of(!0)])}),V(s),D.innerHTML="Run line by line"};D?.addEventListener("click",()=>{if(R.innerHTML="",!T){try{const e=s.state.doc.toString();r=new f(e),u(s,r.currentLine+1),r.preprocess(),T=!0,s.dispatch({effects:g.reconfigure([a.editable.of(!1)])}),D.innerHTML="Next line",m()}catch(e){e instanceof L||e instanceof C?R.innerHTML=e.message:console.error(e),l()}return}try{r.interpretNextLine(),u(s,r.currentLine+1),m()}catch(e){e instanceof L||e instanceof C?R.innerHTML=e.message:console.error(e),l()}r.isAtEnd()&&l()});x?.addEventListener("click",async()=>{R.innerHTML="",l();const e=s.state.doc.toString();r=new f(e);try{r.interpret(),m()}catch(n){n instanceof L||n instanceof C?R.innerHTML=n.message:console.error(n)}});const m=()=>{Z?.replaceChildren(...j(r.registers)),_?.replaceChildren(...$(r.bytes))},j=e=>{const n=[];return e.forEach((t,o)=>{const d=document.createElement("div"),E=document.createElement("div");d.className="register";const c="R"+o.toString();E.innerHTML=c+(o<10?"&nbsp;":""),E.innerHTML+=r.isRegisterInitialized[o]?" 0b"+(t>>>0).toString(2).padStart(32,"0")+" "+t.toString():" 0b".padEnd(35,"~"),d.appendChild(E),n.push(d)}),n},$=e=>{const n=[];for(let t=0;t<e.length;t+=4){const o=document.createElement("div");o.className="byte-record",o.innerHTML=`0x${t.toString(16).padStart(4,"0")}: `;for(let c=t;c<t+4;c+=1){const i=document.createElement("div");if(c>=r.bytes.length){i.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",o.appendChild(i);continue}T&&c>=r.currentMemoryAddress&&c<r.currentMemoryAddress+r.statements[r.currentLine].byteSize&&r.statements[r.currentLine].byteSize>0&&(i.className="current-memory");const A=e[c];switch(A.type){case"DATA":i.innerHTML=A.val.toString(2).padStart(8,"0");break;case"INSTRUCTION":i.innerHTML="xxxxxxxx";break;case"DATA_HIDDEN":i.innerHTML="~~~~~~~~"}o.appendChild(i)}const d=e[t].type==="DATA"?r.bytesToNumber([e[t],e[t+1],e[t+2],e[t+3]]):"x",E=document.createElement("div");E.innerHTML=d.toString(),E.className="rep-data",o.appendChild(E),n.push(o)}return n};m();const q=()=>{S.map(({name:e},n)=>{const t=document.createElement("option");t.innerHTML=e,t.value=n.toString(),I?.appendChild(t)}),I?.addEventListener("change",e=>{const n=e.target,t=S[Number(n.value)].code;Y(s,t)})};q();
