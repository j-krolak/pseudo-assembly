import{k as Ae,S as De,H as xe,t as G,s as ve,V as ke,E as p,D as T,R as we,W as Me,P as He,v as Je,a as Fe,C as J,b as Be,c as Ge,d as Pe,e as Oe,i as _e,I as V,f as O,g as _,h as ee,j as Ue,F as te}from"./index-C8xyt24a.js";/* empty css              */const y=[{name:"sum vector",code:`# sum all elements of VECTOR
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
 
  `}],Y=(e,t,n,o,s)=>{const r=document.createElement("button");r.type="button",r.className="dropdown-toggle";const l=document.createElement("div");l.className="dropdown-menu";let a=n;const c=t.map(i=>{const g=document.createElement("div");g.className="dropdown-item";const Q=document.createElement("span");if(Q.textContent=i.label,g.appendChild(Q),g.addEventListener("click",()=>{a=i.value,r.textContent=i.label,R(),e.classList.remove("open"),o(a)}),i.deletable&&s?.onDelete){const v=document.createElement("span");v.className="dropdown-item-delete",v.textContent="×",v.addEventListener("click",ye=>{ye.stopPropagation(),s.onDelete(i.value)}),g.appendChild(v)}return{value:i.value,element:g}});let d=null;if(s?.addItem){const i=document.createElement("div");i.className="dropdown-item dropdown-item-add",i.textContent=s.addItem.label,i.addEventListener("click",g=>{g.stopPropagation(),e.classList.remove("open"),s.addItem.onClick()}),d=i}const R=()=>{l.replaceChildren(...c.filter(i=>i.value!==a).map(i=>i.element),...d?[d]:[])};r.textContent=t.find(i=>i.value===a)?.label??a,r.addEventListener("click",i=>{i.stopPropagation(),document.querySelectorAll(".dropdown.open").forEach(g=>{g!==e&&g.classList.remove("open")}),e.classList.toggle("open")}),e.replaceChildren(r,l),l.replaceChildren(...c.map(i=>i.element),...d?[d]:[]);const B=Math.max(...c.map(i=>i.element.offsetWidth));r.style.width=l.style.width=`${B}px`,R()};document.addEventListener("click",()=>{document.querySelectorAll(".dropdown.open").forEach(e=>e.classList.remove("open"))});const U=new Set(Ae);function z(e){const t=e.match(/^\s*/)?.[0].length??0,n=e.slice(t);if(n.startsWith("#")||n.length===0)return null;const o=n.match(/^[^\s,]+/);if(!o)return null;const s=o[0],r=n.slice(s.length).match(/^[ \t]+([^\s,]+)/)?.[1],l=(!U.has(s)||r!==void 0&&U.has(r))&&n[s.length]!==","&&!/^-?\d+$/.test(s);return{leading:t,word:s,looksLikeLabel:l}}const We=De.define({startState(){return{wordIndex:0,instructionWordIndex:null}},token(e,t){if(e.sol()){t.wordIndex=0;const n=z(e.string);t.instructionWordIndex=n===null?null:n.looksLikeLabel?1:0}if(e.eatSpace())return null;if(e.match("#"))return e.skipToEnd(),"comment";if(e.match(/^-?\d+/))return"number";if(e.match(","))return"punctuation";if(e.match("*"))return"operator";if(e.match(/^[()]/))return"bracket";if(e.match(/^[A-Za-z_][A-Za-z0-9_]*/)){const n=e.current(),o=t.wordIndex;return t.wordIndex+=1,n==="INTEGER"?"typeName":o===t.instructionWordIndex&&U.has(n)?"keyword":"labelName"}return e.next(),null}}),Ze=xe.define([{tag:G.keyword,color:"#44aa00ff",fontWeight:"bold"},{tag:G.typeName,color:"#00d8ff"},{tag:G.comment,color:"#666"}]),Ke=ve(Ze);class ne extends Me{width;constructor(t){super(),this.width=t}eq(t){return t.width===this.width}toDOM(t){const n=document.createElement("span");return n.style.display="inline-block",n.style.width=`${this.width}ch`,n.style.borderRight="1px solid #2E2E2E",n.addEventListener("mousedown",o=>{o.preventDefault();const s=t.posAtDOM(n);t.dispatch({selection:{anchor:s}}),t.focus()}),n}get estimatedHeight(){return-1}ignoreEvent(){return!0}}function oe(e){const t=e.state.doc,n=new we,o=[];let s=0;for(let r=1;r<=t.lines;r++){const l=t.line(r),a=l.text,c=z(a);if(c===null){if(a.trimStart().startsWith("#"))continue;const i=a.match(/^\s*/)?.[0].length??0;o.push({hasLabel:!1,gapFrom:l.from,gapTo:l.from+i});continue}const{leading:d,word:R,looksLikeLabel:B}=c;if(!B)o.push({hasLabel:!1,gapFrom:l.from,gapTo:l.from+d});else{const i=l.from+d+R.length,g=a.slice(d+R.length).match(/^[ \t]*/)?.[0].length??0;s=Math.max(s,R.length),o.push({hasLabel:!0,gapFrom:i,gapTo:i+g,labelLen:R.length})}}if(s===0)return T.none;for(const r of o){const l=r.hasLabel?s-r.labelLen+1:s+1;l!==0&&(r.gapFrom===r.gapTo?n.add(r.gapFrom,r.gapFrom,T.widget({widget:new ne(l),side:1})):n.add(r.gapFrom,r.gapTo,T.replace({widget:new ne(l)})))}return n.finish()}const $e=ke.fromClass(class{decorations;constructor(e){this.decorations=oe(e)}update(e){e.docChanged&&(this.decorations=oe(e.view))}},{decorations:e=>e.decorations}),Ve=p.inputHandler.of((e,t,n,o)=>{if(t!==n||!o||/\s/.test(o))return!1;const s=e.state.doc.lineAt(t),r=z(s.text);return!r||r.looksLikeLabel||s.from+r.leading!==t?!1:(e.dispatch({changes:{from:t,to:n,insert:o+" "},selection:{anchor:t+o.length},userEvent:"input.type"}),!0)}),Ye=[$e,Ve],j="code",ce="vimMode",de="syntaxHighlight",me="labelAlign",ue="customFiles",ge="currentFile",F=document.getElementById("run-btn"),L=document.getElementById("next-btn"),I=document.getElementById("stop-btn"),f=document.getElementById("play-btn"),ze=document.getElementById("registers"),je=document.getElementById("memory"),qe=document.getElementById("code"),S=document.getElementById("errors"),re=document.getElementById("examples-select"),se=document.getElementById("registers-format"),ae=document.getElementById("memory-format"),Xe=document.getElementById("vim-mode-toggle"),Qe=document.getElementById("syntax-highlight-toggle"),et=document.getElementById("label-align-toggle");let A="bin",M="bin",N=!1;const q=new J,Ee=new J,pe=localStorage.getItem(ce)==="true",fe=new J,he=localStorage.getItem(de)!=="false",Le=[We,Ke],Re=new J,Te=localStorage.getItem(me)!=="false",Se=[Ye],k=e=>e.kind==="example"?`example:${e.index}`:`custom:${e.name}`,W=e=>{if(e.startsWith("example:")){const t=Number(e.slice(8));return Number.isInteger(t)?{kind:"example",index:t}:null}return e.startsWith("custom:")?{kind:"custom",name:e.slice(7)}:null},tt=()=>{try{return JSON.parse(localStorage.getItem(ue)??"{}")}catch{return{}}},Z=e=>{localStorage.setItem(ue,JSON.stringify(e))};let E=tt();const w={kind:"example",index:0};let b=(()=>{const e=localStorage.getItem(ge),t=e?W(e):null;return!t||t.kind==="custom"&&!(t.name in E)||t.kind==="example"&&!y[t.index]?w:t})();const P=e=>{b=e,localStorage.setItem(ge,k(e))},nt=p.updateListener.of(e=>{if(e.docChanged){const t=e.state.doc.toString();localStorage.setItem(j,t),b.kind==="custom"&&(E[b.name]=t,Z(E))}}),be=e=>{const t=ee.define(),n=ee.define(),o=T.line({attributes:{style:`background-color: ${e}`}});return{field:Ue.define({create(){return T.none},update(a,c){a=a.map(c.changes);for(let d of c.effects)d.is(t)&&(a=T.none,a=a.update({add:[o.range(d.value)]})),d.is(n)&&(a=T.none);return a},provide:a=>p.decorations.from(a)}),highlight:(a,c)=>{if(c<1||c>a.state.doc.lines)return;const d=a.state.doc.line(c).from;a.dispatch({effects:t.of(d)})},clear:a=>{a.dispatch({effects:n.of(null)})}}},H=be("rgba(37, 99, 235, 0.35)"),x=be("rgba(170, 34, 34, 0.35)"),K=(e,t)=>{t.line!==void 0&&x.highlight(e,t.line)},ot=p.theme({"&":{backgroundColor:"#000 !important",color:"#ffffff"},".cm-cursor":{borderLeftColor:"#44aa00ff !important"},"&.cm-focused":{outline:"none",border:"none"}},{dark:!0}),rt=He.highest(p.theme({".cm-fat-cursor":{background:"#44aa00ff !important"},"&:not(.cm-focused) .cm-fat-cursor":{background:"none",outline:"solid 1px #44aa00ff !important"},".cm-cursor":{borderLeftColor:"#fff !important"},".cm-vim-panel":{backgroundColor:"#000 !important",color:"#fff !important",borderTop:"1px solid #2E2E2E"}})),Ne=[Je(),rt],ie=(e,t)=>{localStorage.setItem(j,t),e.dispatch({changes:{from:0,to:e.state.doc.length,insert:t}})},st=p.scrollMargins.of(()=>{const e=document.getElementById("editor-toolbar"),t=document.getElementById("editor-bottom-bar");return{top:e?.getBoundingClientRect().height,bottom:t?.getBoundingClientRect().height}});let Ce=y[0].code;const le=localStorage.getItem(j);le&&(Ce=le);let at=Fe.create({doc:Ce,extensions:[Ee.of(pe?Ne:[]),fe.of(he?Le:[]),Re.of(Te?Se:[]),Be.of([...Oe,_e]),Ge,q.of([p.editable.of(!N)]),Pe,H.field,x.field,ot,nt,st]}),u=new p({state:at,parent:qe});const X=(e,t,n,o,s)=>{e&&(e.checked=n,e.addEventListener("change",()=>{const r=e.checked;localStorage.setItem(t,String(r)),u.dispatch({effects:o.reconfigure(r?s:[])})}))};X(Xe,ce,pe,Ee,Ne);X(Qe,de,he,fe,Le);X(et,me,Te,Re,Se);let m=new V(u.state.doc.toString());const Ie=e=>{L.innerHTML=`${e} <span class="text-gray-500 group-hover:text-black">f10</span>`};let h=null;const it=()=>{h!==null&&(clearInterval(h),h=null),f&&(f.textContent="play"),I?.classList.remove("hidden"),L.classList.remove("hidden")},lt=()=>{f&&(f.textContent="stop"),I?.classList.add("hidden"),L.classList.add("hidden"),h=setInterval(()=>L.click(),500)};f?.addEventListener("click",()=>{h!==null?it():lt()});const D=()=>{m.currentLine=0,N=!1,u.dispatch({effects:q.reconfigure([p.editable.of(!0)])}),H.clear(u),Ie("run line by line"),L.classList.remove("hidden"),I?.classList.add("hidden"),F?.classList.remove("hidden"),f?.classList.add("hidden"),h!==null&&(clearInterval(h),h=null),f&&(f.textContent="play")};L?.addEventListener("click",()=>{if(S.innerHTML="",x.clear(u),!N){try{const e=u.state.doc.toString();m=new V(e),H.highlight(u,m.currentLine+1),m.preprocess(),N=!0,u.dispatch({effects:q.reconfigure([p.editable.of(!1)])}),Ie("next line"),I?.classList.remove("hidden"),F?.classList.add("hidden"),f?.classList.remove("hidden"),C()}catch(e){e instanceof O||e instanceof _?(S.innerHTML=e.message,K(u,e)):console.error(e),D()}return}try{m.interpretNextLine(),H.highlight(u,m.currentLine+1),C()}catch(e){e instanceof O||e instanceof _?(S.innerHTML=e.message,K(u,e)):console.error(e),D()}m.isAtEnd()&&D()});F?.addEventListener("click",async()=>{if(N){L.click();return}S.innerHTML="",x.clear(u),D();const e=u.state.doc.toString();m=new V(e);try{m.interpret(),C()}catch(t){t instanceof O||t instanceof _?(S.innerHTML=t.message,K(u,t)):console.error(t)}});I?.addEventListener("click",()=>{S.innerHTML="",x.clear(u),D()});window.addEventListener("keydown",e=>{e.key==="F5"&&e.shiftKey?(e.preventDefault(),I?.click()):e.key==="F5"?(e.preventDefault(),F?.click()):e.key==="F10"&&(e.preventDefault(),L?.click())});const C=()=>{ze?.replaceChildren(...ct(m.eflags),...dt(m.registers)),je?.replaceChildren(...mt(m.bytes))};se&&Y(se,[{value:"bin",label:"binary"},{value:"hex",label:"hex"}],A,e=>{A=e,C()});ae&&Y(ae,[{value:"bin",label:"binary"},{value:"hex",label:"hex"}],M,e=>{M=e,C()});const ct=e=>{const t=e>>te.ZF&1,n=e>>te.SF&1,o=document.createElement("div");o.className="register flex justify-between";const s=document.createElement("div");s.innerHTML='<span class="register-name">EFLAGS</span>';const r=document.createElement("div");return r.innerHTML=`<span class="register-name">ZF</span> ${t}  <span class="register-name">SF</span> ${n}`,o.append(s,r),[o]},dt=e=>{const t=[];return e.forEach((n,o)=>{const s=document.createElement("div"),r=document.createElement("div");s.className="register";const l="R"+o.toString();r.innerHTML=`<span class="register-name">${l}</span>`+(o<10?"&nbsp;":"");const a=A==="hex"?"0x"+(n>>>0).toString(16).padStart(8,"0"):"0b"+(n>>>0).toString(2).padStart(32,"0"),c=A==="hex"?" 0x":" 0b",d=A==="hex"?11:35;r.innerHTML+=m.isRegisterInitialized[o]?" "+a+" "+n.toString():c.padEnd(d,"~"),s.appendChild(r),t.push(s)}),t},mt=e=>{const t=[],n=M==="hex"?2:8;for(let o=0;o<e.length;o+=4){const s=document.createElement("div");s.className="byte-record",s.innerHTML=`0x${o.toString(16).padStart(4,"0")}: `;for(let a=o;a<o+4;a+=1){const c=document.createElement("div");if(a>=m.bytes.length){c.innerHTML="&nbsp;".repeat(n),s.appendChild(c);continue}N&&a>=m.currentMemoryAddress&&a<m.currentMemoryAddress+m.statements[m.currentLine].byteSize&&m.statements[m.currentLine].byteSize>0&&(c.className="current-memory");const d=e[a];switch(d.type){case"DATA":c.innerHTML=M==="hex"?d.val.toString(16).padStart(2,"0"):d.val.toString(2).padStart(8,"0");break;case"INSTRUCTION":c.innerHTML="x".repeat(n);break;case"DATA_HIDDEN":c.innerHTML="~".repeat(n)}s.appendChild(c)}const r=e[o].type==="DATA"?m.bytesToNumber([e[o],e[o+1],e[o+2],e[o+3]]):"x",l=document.createElement("div");l.innerHTML=r.toString(),l.className="rep-data",s.appendChild(l),t.push(s)}return t};C();const $=()=>{if(!re)return;const e=[...y.map(({name:t},n)=>({value:k({kind:"example",index:n}),label:t})),...Object.keys(E).sort().map(t=>({value:k({kind:"custom",name:t}),label:t,deletable:!0}))];Y(re,e,k(b),t=>{const n=W(t);if(!n)return;const o=n.kind==="example"?y[n.index]?.code:E[n.name];o!==void 0&&(P(n),ie(u,o))},{onDelete:t=>{const n=W(t);!n||n.kind!=="custom"||confirm(`delete "${n.name}"?`)&&(delete E[n.name],Z(E),b.kind==="custom"&&b.name===n.name&&(P(w),ie(u,y[0].code)),$())},addItem:{label:"+ add file",onClick:()=>{const t=prompt("file name:")?.trim();if(t){if(t in E){alert(`a file named "${t}" already exists.`);return}E[t]=u.state.doc.toString(),Z(E),P({kind:"custom",name:t}),$()}}}})};$();
