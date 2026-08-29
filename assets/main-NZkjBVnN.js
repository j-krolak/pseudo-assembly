import{k as Pe,S as Je,H as Fe,t as Z,s as _e,V as Ge,E as L,D as v,R as Oe,W as Ue,I as O,P as We,v as Ke,a as Ze,C as U,b as Ve,c as $e,d as Ye,e as je,i as ze,f as $,g as Y,h as ae,j as qe,F as le}from"./index-B7dxPleB.js";/* empty css              */const M=[{name:"sum vector",code:`# sum all elements of VECTOR
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
 
  `}],W=(e,t,n,o,a)=>{const s=document.createElement("button");s.type="button",s.className="dropdown-toggle";const i=document.createElement("div");i.className="dropdown-menu";let l=n;const g=t.map(c=>{const u=document.createElement("div");u.className="dropdown-item";const p=document.createElement("span");if(p.textContent=c.label,u.appendChild(p),u.addEventListener("click",()=>{l=c.value,s.textContent=c.label,m(),e.classList.remove("open"),o(l)}),c.deletable&&a?.onDelete){const h=document.createElement("span");h.className="dropdown-item-delete",h.textContent="×",h.addEventListener("click",b=>{b.stopPropagation(),a.onDelete(c.value)}),u.appendChild(h)}return{value:c.value,element:u}});let r=null;if(a?.addItem){const c=document.createElement("div");c.className="dropdown-item dropdown-item-add",c.textContent=a.addItem.label,c.addEventListener("click",u=>{u.stopPropagation(),e.classList.remove("open"),a.addItem.onClick()}),r=c}const m=()=>{i.replaceChildren(...g.filter(c=>c.value!==l).map(c=>c.element),...r?[r]:[])};s.textContent=t.find(c=>c.value===l)?.label??l,s.addEventListener("click",c=>{c.stopPropagation(),document.querySelectorAll(".dropdown.open").forEach(u=>{u!==e&&u.classList.remove("open")}),e.classList.toggle("open")}),e.replaceChildren(s,i),i.replaceChildren(...g.map(c=>c.element),...r?[r]:[]);const f=Math.max(...g.map(c=>c.element.offsetWidth));s.style.width=i.style.width=`${f}px`,m()};document.addEventListener("click",()=>{document.querySelectorAll(".dropdown.open").forEach(e=>e.classList.remove("open"))});const j=new Set(Pe);function te(e){const t=e.match(/^\s*/)?.[0].length??0,n=e.slice(t);if(n.startsWith("#")||n.length===0)return null;const o=n.match(/^[^\s,]+/);if(!o)return null;const a=o[0],s=n.slice(a.length).match(/^[ \t]+([^\s,]+)/)?.[1],i=(!j.has(a)||s!==void 0&&j.has(s))&&n[a.length]!==","&&!/^-?\d+$/.test(a);return{leading:t,word:a,looksLikeLabel:i}}const Xe=Je.define({startState(){return{wordIndex:0,instructionWordIndex:null}},token(e,t){if(e.sol()){t.wordIndex=0;const n=te(e.string);t.instructionWordIndex=n===null?null:n.looksLikeLabel?1:0}if(e.eatSpace())return null;if(e.match("#"))return e.skipToEnd(),"comment";if(e.match(/^-?\d+/))return"number";if(e.match(","))return"punctuation";if(e.match("*"))return"operator";if(e.match(/^[()]/))return"bracket";if(e.match(/^[A-Za-z_][A-Za-z0-9_]*/)){const n=e.current(),o=t.wordIndex;return t.wordIndex+=1,n==="INTEGER"?"typeName":o===t.instructionWordIndex&&j.has(n)?"keyword":"labelName"}return e.next(),null}}),Qe=Fe.define([{tag:Z.keyword,color:"#44aa00ff",fontWeight:"bold"},{tag:Z.typeName,color:"#00d8ff"},{tag:Z.comment,color:"#666"}]),et=_e(Qe);class ce extends Ue{width;constructor(t){super(),this.width=t}eq(t){return t.width===this.width}toDOM(){const t=document.createElement("span");return t.style.display="inline-block",t.style.width=`${this.width}ch`,t.style.borderRight="1px solid #2E2E2E",t}get estimatedHeight(){return-1}}function ie(e){const t=e.state.doc,n=new Oe,o=[];let a=0;for(let s=1;s<=t.lines;s++){const i=t.line(s),l=i.text,g=te(l);if(g===null){if(l.trimStart().startsWith("#"))continue;const c=l.match(/^\s*/)?.[0].length??0;o.push({hasLabel:!1,gapFrom:i.from,gapTo:i.from+c});continue}const{leading:r,word:m,looksLikeLabel:f}=g;if(!f)o.push({hasLabel:!1,gapFrom:i.from,gapTo:i.from+r});else{const c=i.from+r+m.length,u=l.slice(r+m.length).match(/^[ \t]*/)?.[0].length??0;a=Math.max(a,m.length),o.push({hasLabel:!0,gapFrom:c,gapTo:c+u,labelLen:m.length})}}if(a===0)return v.none;for(const s of o){const i=s.hasLabel?a-s.labelLen+1:a+1;i!==0&&(s.gapFrom===s.gapTo?n.add(s.gapFrom,s.gapFrom,v.widget({widget:new ce(i),side:1})):n.add(s.gapFrom,s.gapTo,v.replace({widget:new ce(i)})))}return n.finish()}const tt=Ge.fromClass(class{decorations;constructor(e){this.decorations=ie(e)}update(e){e.docChanged&&(this.decorations=ie(e.view))}},{decorations:e=>e.decorations}),nt=L.inputHandler.of((e,t,n,o)=>{if(t!==n||!o||/\s/.test(o))return!1;const a=e.state.doc.lineAt(t),s=te(a.text);return!s||s.looksLikeLabel||a.from+s.leading!==t?!1:(e.dispatch({changes:{from:t,to:n,insert:o+" "},selection:{anchor:t+o.length},userEvent:"input.type"}),!0)}),ot=[tt,nt],ne="code",Le="vimMode",be="syntaxHighlight",Se="labelAlign",Re="customFiles",Ne="currentFile",ye="memoryView",K=document.getElementById("run-btn"),T=document.getElementById("next-btn"),k=document.getElementById("stop-btn"),N=document.getElementById("play-btn"),st=document.getElementById("registers"),z=document.getElementById("memory"),rt=document.getElementById("code"),D=document.getElementById("errors"),de=document.getElementById("examples-select"),me=document.getElementById("registers-format"),ue=document.getElementById("memory-format"),ge=document.getElementById("memory-view"),at=document.getElementById("vim-mode-toggle"),lt=document.getElementById("syntax-highlight-toggle"),ct=document.getElementById("label-align-toggle");let R="bin",A="bin";const it=["raw","sections","sections-labels"],pe=localStorage.getItem(ye);let H=it.includes(pe)?pe:"sections-labels",x=!1;const oe=new U,Te=new U,Ce=localStorage.getItem(Le)==="true",Ie=new U,ve=localStorage.getItem(be)!=="false",xe=[Xe,et],Ae=new U,De=localStorage.getItem(Se)!=="false",we=[ot],F=e=>e.kind==="example"?`example:${e.index}`:`custom:${e.name}`,q=e=>{if(e.startsWith("example:")){const t=Number(e.slice(8));return Number.isInteger(t)?{kind:"example",index:t}:null}return e.startsWith("custom:")?{kind:"custom",name:e.slice(7)}:null},dt=()=>{try{return JSON.parse(localStorage.getItem(Re)??"{}")}catch{return{}}},X=e=>{localStorage.setItem(Re,JSON.stringify(e))};let S=dt();const _={kind:"example",index:0};let w=(()=>{const e=localStorage.getItem(Ne),t=e?q(e):null;return!t||t.kind==="custom"&&!(t.name in S)||t.kind==="example"&&!M[t.index]?_:t})();const V=e=>{w=e,localStorage.setItem(Ne,F(e))},mt=L.updateListener.of(e=>{if(e.docChanged){const t=e.state.doc.toString();localStorage.setItem(ne,t),w.kind==="custom"&&(S[w.name]=t,X(S))}});let B=null;const ut=L.updateListener.of(e=>{if(!e.docChanged&&!e.selectionSet)return;if(e.docChanged&&!x)try{const o=new O(e.state.doc.toString());o.preprocess(),d=o}catch{}const{from:t,to:n}=e.state.selection.main;if(t===n)B=null;else{const o=e.state.doc.lineAt(t).number-1,a=e.state.doc.lineAt(n).number-1;B={from:d.getLineAddress(o),to:d.getLineAddress(a+1)}}C()}),ke=e=>{const t=ae.define(),n=ae.define(),o=v.line({attributes:{style:`background-color: ${e}`}});return{field:qe.define({create(){return v.none},update(l,g){l=l.map(g.changes);for(let r of g.effects)r.is(t)&&(l=v.none,l=l.update({add:[o.range(r.value)]})),r.is(n)&&(l=v.none);return l},provide:l=>L.decorations.from(l)}),highlight:(l,g)=>{if(g<1||g>l.state.doc.lines)return;const r=l.state.doc.line(g).from;l.dispatch({effects:t.of(r)})},clear:l=>{l.dispatch({effects:n.of(null)})}}},G=ke("rgba(37, 99, 235, 0.35)"),J=ke("rgba(170, 34, 34, 0.35)"),Q=(e,t)=>{t.line!==void 0&&J.highlight(e,t.line)},gt=L.theme({"&":{backgroundColor:"#000 !important",color:"#ffffff"},".cm-cursor":{borderLeftColor:"#44aa00ff !important"},"&.cm-focused":{outline:"none",border:"none"}},{dark:!0}),pt=We.highest(L.theme({".cm-fat-cursor":{background:"#44aa00ff !important"},"&:not(.cm-focused) .cm-fat-cursor":{background:"none",outline:"solid 1px #44aa00ff !important"},".cm-cursor":{borderLeftColor:"#fff !important"},".cm-vim-panel":{backgroundColor:"#000 !important",color:"#fff !important",borderTop:"1px solid #2E2E2E"}})),Me=[Ke(),pt],Ee=(e,t)=>{localStorage.setItem(ne,t),e.dispatch({changes:{from:0,to:e.state.doc.length,insert:t}})},Et=L.scrollMargins.of(()=>{const e=document.getElementById("editor-toolbar"),t=document.getElementById("editor-bottom-bar");return{top:e?.getBoundingClientRect().height,bottom:t?.getBoundingClientRect().height}});let He=M[0].code;const he=localStorage.getItem(ne);he&&(He=he);let ht=Ze.create({doc:He,extensions:[Te.of(Ce?Me:[]),Ie.of(ve?xe:[]),Ae.of(De?we:[]),Ve.of([...je,ze]),$e,oe.of([L.editable.of(!x)]),Ye,G.field,J.field,gt,mt,ut,Et]}),E=new L({state:ht,parent:rt});const se=(e,t,n,o,a)=>{e&&(e.checked=n,e.addEventListener("change",()=>{const s=e.checked;localStorage.setItem(t,String(s)),E.dispatch({effects:o.reconfigure(s?a:[])})}))};se(at,Le,Ce,Te,Me);se(lt,be,ve,Ie,xe);se(ct,Se,De,Ae,we);const ft="panelCollapsed:",re=(e,t,n)=>{const o=document.getElementById(e),a=document.getElementById(t),s=document.getElementById(n);if(!o||!a||!s)return;const i=ft+e,l=g=>{o.classList.toggle("hidden",g),s.classList.toggle("hidden",!g),localStorage.setItem(i,String(g))};l(localStorage.getItem(i)==="true"),a.addEventListener("click",()=>l(!0)),s.addEventListener("click",()=>l(!1))};re("registers-panel","registers-collapse-btn","show-registers-btn");re("code-editor","code-collapse-btn","show-code-btn");re("memory-panel","memory-collapse-btn","show-memory-btn");let d=new O(E.state.doc.toString());try{d.preprocess()}catch{}const Be=e=>{T.innerHTML=`${e} <span class="text-gray-500 group-hover:text-black">f10</span>`};let y=null;const Lt=()=>{y!==null&&(clearInterval(y),y=null),N&&(N.textContent="play"),k?.classList.remove("hidden"),T.classList.remove("hidden")},bt=()=>{N&&(N.textContent="stop"),k?.classList.add("hidden"),T.classList.add("hidden"),y=setInterval(()=>T.click(),500)};N?.addEventListener("click",()=>{y!==null?Lt():bt()});const P=()=>{d.currentLine=0,x=!1,E.dispatch({effects:oe.reconfigure([L.editable.of(!0)])}),G.clear(E),Be("run line by line"),T.classList.remove("hidden"),k?.classList.add("hidden"),K?.classList.remove("hidden"),N?.classList.add("hidden"),y!==null&&(clearInterval(y),y=null),N&&(N.textContent="play")};T?.addEventListener("click",()=>{if(D.innerHTML="",J.clear(E),!x){try{const e=E.state.doc.toString();d=new O(e),d.preprocess(),G.highlight(E,d.currentLine+1),x=!0,E.dispatch({effects:oe.reconfigure([L.editable.of(!1)])}),Be("next line"),k?.classList.remove("hidden"),K?.classList.add("hidden"),N?.classList.remove("hidden"),C()}catch(e){e instanceof $||e instanceof Y?(D.innerHTML=e.message,Q(E,e)):console.error(e),P()}return}try{d.interpretNextLine(),G.highlight(E,d.currentLine+1),C()}catch(e){e instanceof $||e instanceof Y?(D.innerHTML=e.message,Q(E,e)):console.error(e),P()}d.isAtEnd()&&P()});K?.addEventListener("click",async()=>{if(x){T.click();return}D.innerHTML="",J.clear(E),P();const e=E.state.doc.toString();d=new O(e);try{d.interpret(),C()}catch(t){t instanceof $||t instanceof Y?(D.innerHTML=t.message,Q(E,t)):console.error(t)}});k?.addEventListener("click",()=>{D.innerHTML="",J.clear(E),P()});window.addEventListener("keydown",e=>{e.key==="F5"&&e.shiftKey?(e.preventDefault(),k?.click()):e.key==="F5"?(e.preventDefault(),K?.click()):e.key==="F10"&&(e.preventDefault(),T?.click())});const C=()=>{st?.replaceChildren(...St(d.currentMemoryAddress,d.hasStarted),...Rt(d.eflags),...Nt(d.registers)),z?.replaceChildren(...yt(d.bytes))};me&&W(me,[{value:"bin",label:"binary"},{value:"hex",label:"hex"}],R,e=>{R=e,C()});ue&&W(ue,[{value:"bin",label:"binary"},{value:"hex",label:"hex"}],A,e=>{A=e,C()});ge&&W(ge,[{value:"raw",label:"raw"},{value:"sections",label:"sections"},{value:"sections-labels",label:"sections + labels"}],H,e=>{H=e,localStorage.setItem(ye,H),C()});const St=(e,t)=>{const n=document.createElement("div");n.className="register flex justify-between";const o=document.createElement("div");o.innerHTML='<span class="register-name">PC</span>';const a=R==="hex"?8:32,s=t?(R==="hex"?"0x":"0b")+e.toString(R==="hex"?16:2).padStart(a,"0"):(R==="hex"?"0x":"0b")+"~".repeat(a),i=document.createElement("div");return i.innerHTML=s,n.append(o,i),[n]},Rt=e=>{const t=e>>le.ZF&1,n=e>>le.SF&1,o=document.createElement("div");o.className="register flex justify-between";const a=document.createElement("div");a.innerHTML='<span class="register-name">EFLAGS</span>';const s=document.createElement("div");return s.innerHTML=`<span class="register-name">ZF</span> ${t}  <span class="register-name">SF</span> ${n}`,o.append(a,s),[o]},Nt=e=>{const t=[];return e.forEach((n,o)=>{const a=document.createElement("div"),s=document.createElement("div");a.className="register";const i="R"+o.toString();s.innerHTML=`<span class="register-name">${i}</span>`+(o<10?"&nbsp;":"");const l=R==="hex"?"0x"+(n>>>0).toString(16).padStart(8,"0"):"0b"+(n>>>0).toString(2).padStart(32,"0"),g=R==="hex"?" 0x":" 0b",r=R==="hex"?11:35;s.innerHTML+=d.isRegisterInitialized[o]?" "+l+" "+n.toString():g.padEnd(r,"~"),a.appendChild(s),t.push(a)}),t},fe=(e,t,n)=>{const o=document.createElement("div");o.className=`memory-section-label ${n}`,o.textContent=t,e.push(o)},yt=e=>{const t=[],n=A==="hex"?2:8,o=H!=="raw",a=H==="sections-labels";z&&(z.style.gridTemplateColumns=(a?"12ch ":"")+`7ch repeat(4, ${n}ch) auto`);const s=e.findIndex(r=>r.type!=="DATA"&&r.type!=="DATA_HIDDEN"),i=o&&e.length>0&&s!==0,l=o&&s!==-1;if(e.length>0){const r=document.createElement("div");if(r.className="byte-record",a){const u=document.createElement("div");u.className="memory-header-cell",r.appendChild(u)}const m=document.createElement("div");m.className="memory-header-cell",m.textContent="address",r.appendChild(m);for(let u=0;u<4;u+=1){const p=document.createElement("div");p.className="memory-header-cell",r.appendChild(p)}const f=document.createElement("div");f.className="memory-header-cell",f.textContent="value",r.appendChild(f),t.push(r);const c=document.createElement("div");c.className="memory-header-rule",t.push(c)}i&&fe(t,".data","section-data");const g=r=>d.labels.find(m=>m.address>=r&&m.address<r+4)?.label??"";for(let r=0;r<e.length;r+=4){l&&r===s&&fe(t,".text","section-text");const m=document.createElement("div");if(m.className="byte-record",a){const p=document.createElement("div");p.className="memory-label",p.textContent=g(r),m.appendChild(p)}const f=document.createElement("div");f.className="memory-address",f.textContent=`0x${r.toString(16).padStart(4,"0")}:`,m.appendChild(f);for(let p=r;p<r+4;p+=1){const h=document.createElement("div");if(p>=d.bytes.length){h.innerHTML="&nbsp;".repeat(n),m.appendChild(h);continue}const b=[];x&&p>=d.currentMemoryAddress&&p<d.currentMemoryAddress+d.statements[d.currentLine].byteSize&&d.statements[d.currentLine].byteSize>0&&b.push("current-memory"),B&&p>=B.from&&p<B.to&&b.push("selected-memory");const I=e[p];switch(I.type){case"DATA":b.push("byte-data"),h.innerHTML=A==="hex"?I.val.toString(16).padStart(2,"0"):I.val.toString(2).padStart(8,"0");break;case"INSTRUCTION_OPCODE":b.push("byte-instruction-opcode"),h.innerHTML=A==="hex"?I.val.toString(16).padStart(2,"0"):I.val.toString(2).padStart(8,"0");break;case"INSTRUCTION_OPERAND":b.push("byte-instruction-operand"),h.innerHTML=A==="hex"?I.val.toString(16).padStart(2,"0"):I.val.toString(2).padStart(8,"0");break;case"INSTRUCTION_UNUSED":b.push("byte-instruction-unused"),h.innerHTML="x".repeat(n);break;case"DATA_HIDDEN":b.push("byte-data-hidden"),h.innerHTML="~".repeat(n)}h.className=b.join(" "),m.appendChild(h)}const c=e[r].type==="DATA"?d.bytesToNumber([e[r],e[r+1],e[r+2],e[r+3]]):"",u=document.createElement("div");u.innerHTML=c.toString(),u.className="rep-data",m.appendChild(u),t.push(m)}return t};C();const ee=()=>{if(!de)return;const e=[...M.map(({name:t},n)=>({value:F({kind:"example",index:n}),label:t})),...Object.keys(S).sort().map(t=>({value:F({kind:"custom",name:t}),label:t,deletable:!0}))];W(de,e,F(w),t=>{const n=q(t);if(!n)return;const o=n.kind==="example"?M[n.index]?.code:S[n.name];o!==void 0&&(V(n),Ee(E,o))},{onDelete:t=>{const n=q(t);!n||n.kind!=="custom"||confirm(`delete "${n.name}"?`)&&(delete S[n.name],X(S),w.kind==="custom"&&w.name===n.name&&(V(_),Ee(E,M[0].code)),ee())},addItem:{label:"+ add file",onClick:()=>{const t=prompt("file name:")?.trim();if(t){if(t in S){alert(`a file named "${t}" already exists.`);return}S[t]=E.state.doc.toString(),X(S),V({kind:"custom",name:t}),ee()}}}})};ee();
