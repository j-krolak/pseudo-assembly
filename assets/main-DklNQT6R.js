import{k as Se,S as be,H as Ie,t as J,s as Ce,V as De,E as f,D as h,R as ye,W as Ae,v as xe,a as ke,C as v,b as ve,c as we,d as Me,e as Je,i as He,I as W,f as G,P as O,g as j,h as Ge}from"./index-jzVXgHYI.js";/* empty css              */const T=[{name:"sum vector",code:`VECTOR DC 20*INTEGER(2)
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
 
  `}],Z=(e,t,n,o,a)=>{const r=document.createElement("button");r.type="button",r.className="dropdown-toggle";const l=document.createElement("div");l.className="dropdown-menu";let s=n;const c=t.map(i=>{const g=document.createElement("div");g.className="dropdown-item";const z=document.createElement("span");if(z.textContent=i.label,g.appendChild(z),g.addEventListener("click",()=>{s=i.value,r.textContent=i.label,p(),e.classList.remove("open"),o(s)}),i.deletable&&a?.onDelete){const I=document.createElement("span");I.className="dropdown-item-delete",I.textContent="×",I.addEventListener("click",Ne=>{Ne.stopPropagation(),a.onDelete(i.value)}),g.appendChild(I)}return{value:i.value,element:g}});let d=null;if(a?.addItem){const i=document.createElement("div");i.className="dropdown-item dropdown-item-add",i.textContent=a.addItem.label,i.addEventListener("click",g=>{g.stopPropagation(),e.classList.remove("open"),a.addItem.onClick()}),d=i}const p=()=>{l.replaceChildren(...c.filter(i=>i.value!==s).map(i=>i.element),...d?[d]:[])};r.textContent=t.find(i=>i.value===s)?.label??s,r.addEventListener("click",i=>{i.stopPropagation(),document.querySelectorAll(".dropdown.open").forEach(g=>{g!==e&&g.classList.remove("open")}),e.classList.toggle("open")}),e.replaceChildren(r,l),l.replaceChildren(...c.map(i=>i.element),...d?[d]:[]);const M=Math.max(...c.map(i=>i.element.offsetWidth));r.style.width=l.style.width=`${M}px`,p()};document.addEventListener("click",()=>{document.querySelectorAll(".dropdown.open").forEach(e=>e.classList.remove("open"))});const B=new Set(Se);function K(e){const t=e.match(/^\s*/)?.[0].length??0,n=e.slice(t);if(n.startsWith("#")||n.length===0)return null;const o=n.match(/^[^\s,]+/);if(!o)return null;const a=o[0],r=n.slice(a.length).match(/^[ \t]+([^\s,]+)/)?.[1],l=(!B.has(a)||r!==void 0&&B.has(r))&&n[a.length]!==","&&!/^-?\d+$/.test(a);return{leading:t,word:a,looksLikeLabel:l}}const Oe=be.define({startState(){return{wordIndex:0,instructionWordIndex:null}},token(e,t){if(e.sol()){t.wordIndex=0;const n=K(e.string);t.instructionWordIndex=n===null?null:n.looksLikeLabel?1:0}if(e.eatSpace())return null;if(e.match("#"))return e.skipToEnd(),"comment";if(e.match(/^-?\d+/))return"number";if(e.match(","))return"punctuation";if(e.match("*"))return"operator";if(e.match(/^[()]/))return"bracket";if(e.match(/^[A-Za-z_][A-Za-z0-9_]*/)){const n=e.current(),o=t.wordIndex;return t.wordIndex+=1,n==="INTEGER"?"typeName":o===t.instructionWordIndex&&B.has(n)?"keyword":"labelName"}return e.next(),null}}),Be=Ie.define([{tag:J.keyword,color:"#44aa00ff",fontWeight:"bold"},{tag:J.typeName,color:"#00d8ff"},{tag:J.comment,color:"#666"}]),Fe=Ce(Be);class q extends Ae{width;constructor(t){super(),this.width=t}eq(t){return t.width===this.width}toDOM(t){const n=document.createElement("span");return n.style.display="inline-block",n.style.width=`${this.width}ch`,n.style.borderRight="1px solid #2E2E2E",n.addEventListener("mousedown",o=>{o.preventDefault();const a=t.posAtDOM(n);t.dispatch({selection:{anchor:a}}),t.focus()}),n}get estimatedHeight(){return-1}ignoreEvent(){return!0}}function X(e){const t=e.state.doc,n=new ye,o=[];let a=0;for(let r=1;r<=t.lines;r++){const l=t.line(r),s=l.text,c=K(s);if(c===null){if(s.trimStart().startsWith("#"))continue;const i=s.match(/^\s*/)?.[0].length??0;o.push({hasLabel:!1,gapFrom:l.from,gapTo:l.from+i});continue}const{leading:d,word:p,looksLikeLabel:M}=c;if(!M)o.push({hasLabel:!1,gapFrom:l.from,gapTo:l.from+d});else{const i=l.from+d+p.length,g=s.slice(d+p.length).match(/^[ \t]*/)?.[0].length??0;a=Math.max(a,p.length),o.push({hasLabel:!0,gapFrom:i,gapTo:i+g,labelLen:p.length})}}if(a===0)return h.none;for(const r of o){const l=r.hasLabel?a-r.labelLen+1:a+1;l!==0&&(r.gapFrom===r.gapTo?n.add(r.gapFrom,r.gapFrom,h.widget({widget:new q(l),side:1})):n.add(r.gapFrom,r.gapTo,h.replace({widget:new q(l)})))}return n.finish()}const Pe=De.fromClass(class{decorations;constructor(e){this.decorations=X(e)}update(e){e.docChanged&&(this.decorations=X(e.view))}},{decorations:e=>e.decorations}),_e=f.inputHandler.of((e,t,n,o)=>{if(t!==n||!o||/\s/.test(o))return!1;const a=e.state.doc.lineAt(t),r=K(a.text);return!r||r.looksLikeLabel||a.from+r.leading!==t?!1:(e.dispatch({changes:{from:t,to:n,insert:o+" "},selection:{anchor:t+o.length},userEvent:"input.type"}),!0)}),Ue=[Pe,_e],V="code",re="vimMode",ae="syntaxHighlight",se="labelAlign",ie="customFiles",le="currentFile",ce=document.getElementById("run-btn"),A=document.getElementById("next-btn"),We=document.getElementById("registers"),Ze=document.getElementById("memory"),Ke=document.getElementById("code"),N=document.getElementById("errors"),Q=document.getElementById("examples-select"),ee=document.getElementById("registers-format"),te=document.getElementById("memory-format"),Ve=document.getElementById("vim-mode-toggle"),Ye=document.getElementById("syntax-highlight-toggle"),$e=document.getElementById("label-align-toggle");let S="bin",x="bin",b=!1;const Y=new v,de=new v,me=localStorage.getItem(re)==="true",ue=new v,ge=localStorage.getItem(ae)!=="false",Ee=[Oe,Fe],fe=new v,pe=localStorage.getItem(se)!=="false",he=[Ue],C=e=>e.kind==="example"?`example:${e.index}`:`custom:${e.name}`,F=e=>{if(e.startsWith("example:")){const t=Number(e.slice(8));return Number.isInteger(t)?{kind:"example",index:t}:null}return e.startsWith("custom:")?{kind:"custom",name:e.slice(7)}:null},ze=()=>{try{return JSON.parse(localStorage.getItem(ie)??"{}")}catch{return{}}},P=e=>{localStorage.setItem(ie,JSON.stringify(e))};let E=ze();const D={kind:"example",index:0};let L=(()=>{const e=localStorage.getItem(le),t=e?F(e):null;return!t||t.kind==="custom"&&!(t.name in E)||t.kind==="example"&&!T[t.index]?D:t})();const H=e=>{L=e,localStorage.setItem(le,C(e))},je=f.updateListener.of(e=>{if(e.docChanged){const t=e.state.doc.toString();localStorage.setItem(V,t),L.kind==="custom"&&(E[L.name]=t,P(E))}}),Le=e=>{const t=j.define(),n=j.define(),o=h.line({attributes:{style:`background-color: ${e}`}});return{field:Ge.define({create(){return h.none},update(s,c){s=s.map(c.changes);for(let d of c.effects)d.is(t)&&(s=h.none,s=s.update({add:[o.range(d.value)]})),d.is(n)&&(s=h.none);return s},provide:s=>f.decorations.from(s)}),highlight:(s,c)=>{if(c<1||c>s.state.doc.lines)return;const d=s.state.doc.line(c).from;s.dispatch({effects:t.of(d)})},clear:s=>{s.dispatch({effects:n.of(null)})}}},k=Le("#44aa00ff"),w=Le("rgba(170, 34, 34, 0.35)"),_=(e,t)=>{t.line!==void 0&&w.highlight(e,t.line)},qe=f.theme({"&":{backgroundColor:"#000 !important",color:"#ffffff"},".cm-cursor":{borderLeftColor:"#44aa00ff !important"},"&.cm-focused":{outline:"none",border:"none"}},{dark:!0}),Xe=f.theme({".cm-fat-cursor":{background:"#44aa00ff !important"},"&:not(.cm-focused) .cm-fat-cursor":{background:"none",outline:"solid 1px #44aa00ff !important"},".cm-vim-panel":{backgroundColor:"#000 !important",color:"#fff !important",borderTop:"1px solid #2E2E2E"}}),Re=[xe(),Xe],ne=(e,t)=>{localStorage.setItem(V,t),e.dispatch({changes:{from:0,to:e.state.doc.length,insert:t}})},Qe=f.scrollMargins.of(()=>{const e=document.getElementById("editor-toolbar"),t=document.getElementById("editor-bottom-bar");return{top:e?.getBoundingClientRect().height,bottom:t?.getBoundingClientRect().height}});let Te=T[0].code;const oe=localStorage.getItem(V);oe&&(Te=oe);let et=ke.create({doc:Te,extensions:[de.of(me?Re:[]),ue.of(ge?Ee:[]),fe.of(pe?he:[]),ve.of([...Je,He]),we,Y.of([f.editable.of(!b)]),Me,k.field,w.field,qe,je,Qe]}),u=new f({state:et,parent:Ke});const $=(e,t,n,o,a)=>{e&&(e.checked=n,e.addEventListener("change",()=>{const r=e.checked;localStorage.setItem(t,String(r)),u.dispatch({effects:o.reconfigure(r?a:[])})}))};$(Ve,re,me,de,Re);$(Ye,ae,ge,ue,Ee);$($e,se,pe,fe,he);let m=new W(u.state.doc.toString());const y=()=>{m.currentLine=0,b=!1,u.dispatch({effects:Y.reconfigure([f.editable.of(!0)])}),k.clear(u),A.innerHTML="run line by line"};A?.addEventListener("click",()=>{if(N.innerHTML="",w.clear(u),!b){try{const e=u.state.doc.toString();m=new W(e),k.highlight(u,m.currentLine+1),m.preprocess(),b=!0,u.dispatch({effects:Y.reconfigure([f.editable.of(!1)])}),A.innerHTML="next line",R()}catch(e){e instanceof G||e instanceof O?(N.innerHTML=e.message,_(u,e)):console.error(e),y()}return}try{m.interpretNextLine(),k.highlight(u,m.currentLine+1),R()}catch(e){e instanceof G||e instanceof O?(N.innerHTML=e.message,_(u,e)):console.error(e),y()}m.isAtEnd()&&y()});ce?.addEventListener("click",async()=>{N.innerHTML="",w.clear(u),y();const e=u.state.doc.toString();m=new W(e);try{m.interpret(),R()}catch(t){t instanceof G||t instanceof O?(N.innerHTML=t.message,_(u,t)):console.error(t)}});window.addEventListener("keydown",e=>{e.key==="F5"?(e.preventDefault(),ce?.click()):e.key==="F10"&&(e.preventDefault(),A?.click())});const R=()=>{We?.replaceChildren(...tt(m.registers)),Ze?.replaceChildren(...nt(m.bytes))};ee&&Z(ee,[{value:"bin",label:"binary"},{value:"hex",label:"hex"}],S,e=>{S=e,R()});te&&Z(te,[{value:"bin",label:"binary"},{value:"hex",label:"hex"}],x,e=>{x=e,R()});const tt=e=>{const t=[];return e.forEach((n,o)=>{const a=document.createElement("div"),r=document.createElement("div");a.className="register";const l="R"+o.toString();r.innerHTML=l+(o<10?"&nbsp;":"");const s=S==="hex"?"0x"+(n>>>0).toString(16).padStart(8,"0"):"0b"+(n>>>0).toString(2).padStart(32,"0"),c=S==="hex"?" 0x":" 0b",d=S==="hex"?11:35;r.innerHTML+=m.isRegisterInitialized[o]?" "+s+" "+n.toString():c.padEnd(d,"~"),a.appendChild(r),t.push(a)}),t},nt=e=>{const t=[],n=x==="hex"?2:8;for(let o=0;o<e.length;o+=4){const a=document.createElement("div");a.className="byte-record",a.innerHTML=`0x${o.toString(16).padStart(4,"0")}: `;for(let s=o;s<o+4;s+=1){const c=document.createElement("div");if(s>=m.bytes.length){c.innerHTML="&nbsp;".repeat(n),a.appendChild(c);continue}b&&s>=m.currentMemoryAddress&&s<m.currentMemoryAddress+m.statements[m.currentLine].byteSize&&m.statements[m.currentLine].byteSize>0&&(c.className="current-memory");const d=e[s];switch(d.type){case"DATA":c.innerHTML=x==="hex"?d.val.toString(16).padStart(2,"0"):d.val.toString(2).padStart(8,"0");break;case"INSTRUCTION":c.innerHTML="x".repeat(n);break;case"DATA_HIDDEN":c.innerHTML="~".repeat(n)}a.appendChild(c)}const r=e[o].type==="DATA"?m.bytesToNumber([e[o],e[o+1],e[o+2],e[o+3]]):"x",l=document.createElement("div");l.innerHTML=r.toString(),l.className="rep-data",a.appendChild(l),t.push(a)}return t};R();const U=()=>{if(!Q)return;const e=[...T.map(({name:t},n)=>({value:C({kind:"example",index:n}),label:t})),...Object.keys(E).sort().map(t=>({value:C({kind:"custom",name:t}),label:t,deletable:!0}))];Z(Q,e,C(L),t=>{const n=F(t);if(!n)return;const o=n.kind==="example"?T[n.index]?.code:E[n.name];o!==void 0&&(H(n),ne(u,o))},{onDelete:t=>{const n=F(t);!n||n.kind!=="custom"||confirm(`delete "${n.name}"?`)&&(delete E[n.name],P(E),L.kind==="custom"&&L.name===n.name&&(H(D),ne(u,T[0].code)),U())},addItem:{label:"+ add file",onClick:()=>{const t=prompt("file name:")?.trim();if(t){if(t in E){alert(`a file named "${t}" already exists.`);return}E[t]=u.state.doc.toString(),P(E),H({kind:"custom",name:t}),U()}}}})};U();
