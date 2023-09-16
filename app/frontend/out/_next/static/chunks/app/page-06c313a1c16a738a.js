(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{8075:function(e,t,l){Promise.resolve().then(l.bind(l,9994))},9994:function(e,t,l){"use strict";l.r(t),l.d(t,{default:function(){return N}});var r=l(7437),a=l(2265),n=l(1110),s=l(9222),c=l(981),i=l.n(c),o=l(7026),d=l(3969);function h(e){let{value:t,refreshTime:l}=e,[n,s]=(0,a.useState)(t);(0,a.useEffect)(()=>{if(0===t){s(0);return}s(100*Math.pow((t/100+n/100)/2,1.3))},[t,l]);let c=(0,d.v)({domain:[0,100],startAngle:90,endAngle:270,numTicks:21,diameter:200}),i=(0,a.useMemo)(()=>c.getNeedleProps({value:0,baseRadius:8,tipRadius:2}),[]);return(0,r.jsxs)("svg",{className:"w-full overflow-visible p-2",...c.getSVGProps(),children:[(0,r.jsx)("g",{id:"ticks",children:c.ticks.map(e=>{let t=c.angleToValue(e);return(0,r.jsxs)(a.Fragment,{children:[(0,r.jsx)("line",{className:(0,o.Z)(["stroke-gray-300",{"stroke-red-300":t<=20,"stroke-yellow-300":t>=60&&t<=80,"stroke-green-400":t>=80}]),strokeWidth:2,...c.getTickProps({angle:e,length:8})}),t%20==0&&(0,r.jsx)("text",{className:"fill-gray-400 text-sm font-medium",...c.getLabelProps({angle:e,offset:20}),children:t})]})})}),(0,r.jsxs)("g",{id:"needle",children:[(0,r.jsx)("circle",{className:"fill-gray-300",...i.base,r:12}),(0,r.jsx)("circle",{className:"fill-gray-700",...i.base}),(0,r.jsx)("circle",{className:"fill-gray-700",...i.tip}),(0,r.jsx)("polyline",{className:"fill-gray-700/80 transition-all duration-[300ms] ease-linear",points:i.points,style:{transform:"rotate(".concat(n/100*180,"deg)")}}),(0,r.jsx)("circle",{className:"fill-white",...i.base,r:4})]})]})}function x(){return(0,r.jsxs)("div",{className:"flex w-full items-center justify-center",children:[(0,r.jsx)("div",{className:"absolute right-[18px] top-[18px] flex",children:(0,r.jsx)("img",{src:"/logo-dark.svg",width:36})}),(0,r.jsx)("h1",{className:"flex w-full flex-col items-center justify-center gap-0 tracking-tight text-white",children:(0,r.jsx)("span",{className:"text-3xl font-extrabold text-[#4f98c4]",children:"Horizontal Scaling"})}),(0,r.jsx)("div",{className:"relative ml-[-8px] mt-2 flex text-white/60"})]})}var f=l(6470),u=l.n(f);let p="horizontal-scaling-demo.up.railway.app",m="https";function k(e){let{index:t,trains:l,ip:c,onBreak:i,onRepair:o,breakPoint:d}=e,h=async()=>{let e=await s.Z.post("".concat(m,"://").concat(p,"/breakTrack?ip=").concat(c));return e.data},x=async()=>{let e=await s.Z.post("".concat(m,"://").concat(p,"/repairTrack?ip=").concat(c));return e.data},[f,k]=(0,a.useState)(!1),v=(0,n.D)(h,{onSuccess:()=>{i&&i(t)}}),g=(0,n.D)(x,{onSuccess:()=>{o&&o(t)}});return(0,r.jsxs)("div",{className:"flex h-full w-full flex-col items-center justify-center gap-2 px-4 pt-7",onMouseEnter:()=>k(!0),onMouseLeave:()=>k(!1),children:[(0,r.jsxs)("div",{className:"relative flex h-[1vw] w-full border-b-2 border-t-2 border-[#5bade0cc]",style:{background:"linear-gradient(90deg,\n          rgb(255 255 255/0) 0%,\n          hsla(220, 62%, 25%, .5) 15%,\n          hsla(220, 62%, 25%, .5) 85%,\n          rgb(255 255 255/0) 100%)"},children:[f&&!d&&(0,r.jsx)("div",{className:"absolute right-0 top-[-40px] cursor-pointer text-2xl transition-all hover:scale-125",onClick:()=>{v.mutate()},children:"\uD83D\uDCA3"}),f&&d&&(0,r.jsx)("div",{className:"absolute right-0 top-[-40px] cursor-pointer text-2xl transition-all hover:scale-125",onClick:()=>{g.mutate()},children:"\uD83E\uDDBA"}),(0,r.jsx)("div",{className:"flex h-full w-full",style:{background:"linear-gradient(\n              to right,\n              #0000 1px,\n              #305973 3px,\n              #0000 0px\n              )",backgroundSize:"3% 100%"}}),d&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("div",{className:"absolute top-[-12px] animate-poke text-2xl",style:{left:"".concat(d,"%")},children:"\uD83D\uDCA5"}),(0,r.jsx)("div",{className:"absolute top-0 flex h-full bg-red-300/50 px-4",style:{left:"".concat(d+1,"%"),width:"".concat(99-d,"%")}})]}),l.map(e=>{let l=-4-92*t;return(0,r.jsxs)("div",{className:"absolute h-full w-full items-center justify-center transition-all",style:{top:100===e.position?l:e.position<3?-(80*t):"calc(50% - 12.5px)",left:e.position<3?"calc(0% - 120px)":100===e.position?"calc(100% + 76px)":"".concat(1*e.position,"%"),transformOrigin:"center left",transitionDuration:"".concat(e.position<3||100===e.position?.8:.3,"s"),opacity:e.position<3||100===e.position?0:1,transitionTimingFunction:100===e.position?"ease-out":"linear",scale:e.position<3||100===e.position?.5:1},children:[e.rerouted&&(0,r.jsx)("span",{className:"absolute left-[28px] top-[-7px] text-2xl",children:"⚠️"}),(0,r.jsx)(u(),{className:"transition-all",style:{width:"12%",height:"25",color:e.braking?"red":100===e.position?"lightblue":e.rerouted&&e.speed<0?"#fad002":"white"}})]},e.id)})]}),(0,r.jsxs)("span",{className:"flex items-center gap-2 text-[#4f98c4]",children:[(0,r.jsxs)("span",{className:"font-bold",children:["Track ",t+1]}),(0,r.jsxs)("span",{className:"text-xs",children:[" [",c,"]"]})]})]})}var v=l(5567),g=l.n(v),y=l(560),j=l.n(y);function w(e){let{trains:t}=e;return(0,r.jsxs)("div",{className:"relative flex h-[300px] w-fit flex-col items-center gap-4\n    ".concat(12===t?"animate-poke":t>0?"":"    ","\n    "),children:[(0,r.jsx)(j(),{style:{height:120}}),(0,r.jsx)("div",{className:"flex w-[140px] flex-wrap justify-center gap-2 transition-all duration-1000",children:[...Array(12)].map((e,l)=>(0,r.jsx)(g(),{className:"transition-all duration-1000",style:{width:40,height:20,color:l<t?"#62abd9":"#fff2",scale:l<t?1.1:1}}))})]})}var b=l(7798),E=l.n(b);function C(e){let{trainsRemaining:t,duration:l,timerStart:n}=e,[s,c]=a.useState(0);return(0,a.useEffect)(()=>{let e;return n&&(e=setInterval(()=>{c(Date.now()-n)},20)),()=>clearInterval(e)},[n]),(0,r.jsx)("div",{className:"h-8 text-lg text-white/80",children:12!==t||l||n?l?(0,r.jsxs)("div",{className:"flex items-center justify-center gap-1 text-emerald-500",children:[(0,r.jsx)(E(),{style:{height:20}}),(0,r.jsx)("span",{children:"All ".concat(12," trains reached their destination in ")}),(0,r.jsx)("span",{className:"mt-1 font-mono",children:(l/1e3).toFixed(3)}),(0,r.jsx)("span",{children:" seconds!"})]}):(0,r.jsxs)("div",{className:"flex items-center justify-center gap-2",children:[(0,r.jsx)("span",{children:"Waiting for ".concat(t," trains to arrive...")}),(0,r.jsxs)("div",{className:"flex items-center justify-center gap-0",children:[(0,r.jsx)(E(),{style:{height:20}}),(0,r.jsxs)("span",{className:"mt-1 font-mono",children:[(s/1e3).toFixed(1),"s"]})]})]}):(0,r.jsx)("div",{children:(0,r.jsx)("span",{className:"text-[17px] text-white/60",children:"Let's move all trains across as fast as we can..."})})})}function N(){let e=async e=>{let{speed:t,id:l}=e;try{let e=await s.Z.post("".concat(m,"://").concat(p,"/startTrain?speed=").concat(t||"","&id=").concat(l||""));return E(e=>e+1),e.data}catch(e){console.log(e)}},t=(0,n.D)(e),[l,c]=(0,a.useState)([]),[o,d]=(0,a.useState)({}),[f,u]=(0,a.useState)(null),[v,g]=(0,a.useState)(null),[y,j]=(0,a.useState)(12),[b,E]=(0,a.useState)(0);(0,a.useEffect)(()=>{0===y&&f&&(g(Date.now()-f),u(null))},[f,y]),(0,a.useEffect)(()=>{console.log("Connecting to WebSocket");let e=new WebSocket("".concat("wss","://").concat(p,"/ws"));return e.addEventListener("open",()=>{console.log("WebSocket connection opened")}),e.addEventListener("close",()=>{console.log("WebSocket connection closed"),setTimeout(()=>e=new WebSocket("".concat("wss","://").concat(p,"/ws")))}),e.addEventListener("message",e=>{let l=JSON.parse(e.data);if(l.track&&d(e=>(e[l.track.ip]?(e[l.track.ip].ip=l.track.ip,void 0!==l.track.breakPoint&&(e[l.track.ip].breakPoint=l.track.breakPoint)):e[l.track.ip]={ip:l.track.ip,breakPoint:l.track.breakPoint},{...e})),l.removed&&d(e=>(delete e[l.removed],{...e})),!l.train)return;let r=l.train;r.track=l.track.ip,c(e=>{let t=e.findIndex(e=>e.id===r.id);if(t>=0){let l=[...e];return l[t]=r,l}return[...e,r]}),100===r.position&&j(e=>e-1),setTimeout(()=>{100===r.position&&c(e=>e.filter(e=>e.id!==r.id)),0===r.position&&r.rerouted&&(c(e=>e.filter(e=>e.id!==r.id)),E(e=>e-1),t.mutate({speed:-r.speed,id:r.id}))},500)}),()=>{e.close()}},[]);let N=l.filter(e=>e.braking).length;return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(i(),{children:[(0,r.jsx)("title",{children:"Railway Horizontal Scaling"}),(0,r.jsx)("link",{rel:"icon",href:"/train1.svg"})]}),(0,r.jsxs)("main",{className:"app flex h-fit min-h-screen w-full min-w-0 flex-col items-center overflow-hidden px-2 pt-8",style:{},children:[(0,r.jsx)(x,{}),(0,r.jsx)(C,{trainsRemaining:y,duration:v,timerStart:f}),(0,r.jsxs)("div",{className:"mt-5 flex h-full min-h-[800px] w-full flex-col items-center gap-2 overflow-y-scroll text-white",children:[(0,r.jsxs)("div",{className:"flex items-center gap-4",children:[y>0?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("button",{className:"flex w-fit rounded border-2 border-[#4f98c4] px-2 py-1 text-xs text-[#4f98c4] transition-all duration-100 hover:bg-gray-700 hover:text-white disabled:cursor-not-allowed disabled:text-gray-500",disabled:b>=12,onClick:()=>{f||u(Date.now()),12-b<=0||t.mutate({})},children:["Start ",Math.min(12-b,1)," Train"]}),(0,r.jsxs)("button",{disabled:b>=12,className:"flex w-fit rounded border-2 border-[#4f98c4] px-2 py-1 text-xs text-[#4f98c4] transition-all duration-100 hover:bg-gray-700 hover:text-white disabled:cursor-not-allowed disabled:text-gray-500",onClick:()=>{f||u(Date.now());for(let e=0;e<Math.min(12-b,10);e++)t.mutate({})},children:["Start ",Math.min(12-b,10)," Trains"]})]}):null,(0,r.jsx)("button",{className:"flex w-fit rounded border-2 border-[#4f98c4] px-2 py-1 text-xs text-[#4f98c4] transition-all duration-100 hover:bg-gray-700 hover:text-white disabled:cursor-not-allowed disabled:text-gray-500",disabled:l.filter(e=>e.position<100).length>0,onClick:()=>{u(null),g(null),j(12),E(0)},children:"Try again!"})]}),(0,r.jsxs)("div",{className:"flex w-full justify-between gap-10 px-10 text-[#519ac6]",children:[(0,r.jsx)(w,{trains:12-b}),(0,r.jsxs)("div",{className:"flex h-full w-full flex-col",children:[(0,r.jsx)("div",{className:"mt-9 flex h-10 w-full items-center justify-center",children:(0,r.jsx)("div",{className:"flex w-40",children:(0,r.jsx)(h,{value:l.length&&b?100-N/l.length*100:0,refreshTime:Date.now()})})}),(0,r.jsx)("div",{className:"mt-9 flex h-full w-full flex-col",children:Object.values(o).sort((e,t)=>e.ip.localeCompare(t.ip)).map((e,t)=>(0,r.jsx)(k,{breakPoint:e.breakPoint,totalTracks:Object.keys(o).length,ip:e.ip,trains:l.filter(t=>t.track===e.ip),index:t},e.ip))})]}),(0,r.jsx)(w,{trains:12-y})]})]})]})]})}l(6829)},6829:function(){},560:function(e,t,l){var r=l(2265);function a(e){return r.createElement("svg",e,[r.createElement("g",{transform:"scale(0.045 0.045) translate(2320 1200)",key:0},[r.createElement("path",{d:"M4.756 438.175A520.713 520.713 0 0 0 0 489.735h777.799c-2.716-5.306-6.365-10.09-10.045-14.772-132.97-171.791-204.498-156.896-306.819-161.26-34.114-1.403-57.249-1.967-193.037-1.967-72.677 0-151.688.185-228.628.39-9.96 26.884-19.566 52.942-24.243 74.14h398.571v51.909H4.756ZM783.93 541.696H.399c.82 13.851 2.112 27.517 3.978 40.999h723.39c32.248 0 50.299-18.297 56.162-40.999ZM45.017 724.306S164.941 1018.77 511.46 1024c207.112 0 385.071-123.006 465.907-299.694H45.017Z",fill:"currentColor",key:0}),r.createElement("path",{d:"M511.454 0C319.953 0 153.311 105.16 65.31 260.612c68.771-.144 202.704-.226 202.704-.226h.031v-.051c158.309 0 164.193.707 195.118 1.998l19.149.706c66.7 2.224 148.683 9.384 213.19 58.19 35.015 26.471 85.571 84.896 115.708 126.52 27.861 38.499 35.876 82.756 16.933 125.158-17.436 38.97-54.952 62.215-100.383 62.215H16.69s4.233 17.944 10.58 37.751h970.632A510.385 510.385 0 0 0 1024 512.218C1024.01 229.355 794.532 0 511.454 0Z",fill:"currentcolor",key:1})]),r.createElement("g",{key:1},[r.createElement("path",{fill:"currentColor",d:"M100.6,6.3c-0.3,0.1-1.3,0.3-2.2,0.6c-1.2,0.3-5,3.7-13.1,11.8L73.7,30.1v4.5c0,3.4,0.3,4.8,1.1,6.2c1.1,1.8,3.7,3.5,5.3,3.5c0.7,0,0.8,2.7,0.8,23.5v23.5H58.8c-18.7,0-22.5,0.1-24.3,0.8c-1.3,0.6-6.1,4.9-13.2,12.1L10,115.5v4.3c0,6,1.4,8.4,5.7,9.5l1.5,0.3v57.2c0,56.1,0,57.2,1.1,59c0.6,1,1.9,2.3,2.9,2.9c1.8,1.1,3,1.1,106.7,1.1c116.2,0,106.6,0.3,109.6-3.7l1.6-2l0.3-57.4l0.3-57.4l1.3-0.2c0.7-0.1,2.1-1.1,3.2-2.1c1.9-1.9,1.9-2,1.9-6.8v-4.9l-11.6-11.2c-6.5-6.2-12.5-11.6-13.6-12c-1.6-0.6-6-0.8-23.8-0.8h-21.9V67.8c0-22.1,0.1-23.5,1-23.5c1.6,0,4.4-2.1,5.4-3.8c0.6-1.1,0.8-3.2,0.8-6v-4.3l-11.2-11.2c-6.2-6.1-11.9-11.5-12.6-11.9c-1.1-0.6-7-0.8-29.4-0.9C113.7,6.2,100.9,6.2,100.6,6.3z M163.9,25c4.9,4.9,9,9.1,9,9.4s-20.2,0.4-44.9,0.4c-24.7,0-44.9-0.2-44.9-0.4s4-4.4,9-9.4l9-9H128h26.9L163.9,25z M165.8,86.8l0.2,42.5l31.7,0.2l31.7,0.1V185v55.4H128H26.6V185v-55.4l31.7-0.1l31.7-0.2l0.2-42.5l0.1-42.5H128h37.7L165.8,86.8z M80.8,110.3l0.1,9.3H50.1H19.1l9.4-9.4l9.4-9.4l21.3,0.1l21.3,0.2L80.8,110.3z M225.1,108.4c4.3,4.2,8.8,8.4,9.8,9.4l1.9,1.8H206h-30.9v-9c0-5,0.2-9.3,0.4-9.4c0.2-0.2,9.7-0.4,21.1-0.4h20.7L225.1,108.4z",key:0}),r.createElement("path",{fill:"currentColor",d:"M52.4,146.3c-0.2,0.4-0.2,6.9-0.2,14.3l0.2,13.6h4.7h4.7v-14.1v-14.1l-4.6-0.2C53.8,145.7,52.5,145.8,52.4,146.3z",key:1}),r.createElement("path",{fill:"currentColor",d:"M87.8,146.3c-0.2,0.4-0.2,6.9-0.2,14.3l0.2,13.6h4.7h4.7v-14.1v-14.1l-4.6-0.2C89.3,145.7,88,145.8,87.8,146.3z",key:2}),r.createElement("path",{fill:"currentColor",d:"M123.3,146.3c-0.2,0.4-0.2,6.9-0.2,14.3l0.2,13.6h4.7h4.7v-14.1v-14.1l-4.6-0.2C124.7,145.7,123.5,145.8,123.3,146.3z",key:3}),r.createElement("path",{fill:"currentColor",d:"M158.7,146.3c-0.2,0.4-0.2,6.9-0.2,14.3l0.2,13.6h4.7h4.7v-14.1v-14.1l-4.6-0.2C160.2,145.7,158.9,145.8,158.7,146.3z",key:4}),r.createElement("path",{fill:"currentColor",d:"M194.2,146.3c-0.2,0.4-0.2,6.9-0.2,14.3l0.2,13.6h4.7h4.7v-14.1v-14.1l-4.6-0.2C195.6,145.7,194.4,145.8,194.2,146.3z",key:5}),r.createElement("path",{fill:"currentColor",d:"M52.5,188.6c-0.2,0.2-0.4,6.6-0.4,14.2v13.7h5h5l-0.1-14l-0.2-14l-4.4-0.2C54.9,188.4,52.7,188.4,52.5,188.6z",key:6}),r.createElement("path",{fill:"currentColor",d:"M87.9,188.6c-0.2,0.2-0.4,6.6-0.4,14.2v13.7h5h5l-0.1-14l-0.2-14l-4.4-0.2C90.3,188.4,88.2,188.4,87.9,188.6z",key:7}),r.createElement("path",{fill:"currentColor",d:"M123.4,188.6c-0.2,0.2-0.4,9.9-0.4,21.4V231h5h5l-0.1-21.2l-0.2-21.2l-4.4-0.2C125.8,188.4,123.6,188.4,123.4,188.6z",key:8}),r.createElement("path",{fill:"currentColor",d:"M158.9,188.6c-0.2,0.2-0.4,6.6-0.4,14.2v13.7h5h5l-0.1-14l-0.2-14l-4.4-0.2C161.2,188.4,159.1,188.4,158.9,188.6z",key:9}),r.createElement("path",{fill:"currentColor",d:"M194.3,188.6c-0.2,0.2-0.4,6.6-0.4,14.2v13.7h5h5l-0.1-14l-0.2-14l-4.4-0.2C196.7,188.4,194.5,188.4,194.3,188.6z",key:10})])])}a.defaultProps={version:"1.1",x:"0px",y:"0px",viewBox:"0 0 256 256",enableBackground:"new 0 0 256 256",xmlSpace:"preserve"},e.exports=a,a.default=a},6470:function(e,t,l){var r=l(2265);function a(e){return r.createElement("svg",e,[r.createElement("g",{transform:"translate(0, 25) rotate(-90)",key:0},[r.createElement("path",{d:"M13 .5c3.072 0 5.94 2.183 8.073 5.297C23.197 8.9 24.5 12.803 24.5 16v75c0 3.22-1.099 7.38-3.116 10.727-2.022 3.355-4.889 5.773-8.384 5.773-3.05 0-5.919-2.404-8.063-5.783C2.807 98.36 1.5 94.202 1.5 91V16c0-3.197 1.303-7.1 3.427-10.203C7.06 2.683 9.928.5 13 .5Z",fill:"url(#e4sqbxb6za)",stroke:"#62abd9",key:0}),r.createElement("path",{transform:"translate (0 -83) scale(1 2)",d:"M21 85.273V84s-2.214 2.727-8 2.727S5 84 5 84v1.273S7.857 90 13 90s8-4.727 8-4.727Z",fill:"currentColor",key:1}),r.createElement("path",{d:"M7 16.5a.5.5 0 0 1 1 0v60a.5.5 0 0 1-1 0v-60Zm11 0a.5.5 0 0 1 1 0v60a.5.5 0 0 1-1 0v-60Z",fill:"#1D4596",key:2}),r.createElement("path",{d:"M20 103c-2-4.627-5.783-5-7-5-1.217 0-5 .373-7 5m18.5-35c0-4.627-9.5-5-11.5-5s-11.5.373-11.5 5m23-34c0-4.627-9.5-5-11.5-5s-11.5.373-11.5 5",stroke:"#03639f",key:3}),r.createElement("rect",{x:"21",y:"37",width:"1",height:"8",rx:".5",fill:"#8CAEF2",key:4}),r.createElement("rect",{x:"21",y:"18",width:"1",height:"8",rx:".5",fill:"#8CAEF2",key:5}),r.createElement("rect",{x:"21",y:"71",width:"1",height:"8",rx:".5",fill:"#8CAEF2",key:6}),r.createElement("rect",{x:"21",y:"51",width:"1",height:"8",rx:".5",fill:"#8CAEF2",key:7}),r.createElement("rect",{x:"4",y:"37",width:"1",height:"8",rx:".5",fill:"#8CAEF2",key:8}),r.createElement("rect",{x:"4",y:"18",width:"1",height:"8",rx:".5",fill:"#8CAEF2",key:9}),r.createElement("rect",{x:"4",y:"51",width:"1",height:"8",rx:".5",fill:"#8CAEF2",key:10}),r.createElement("rect",{x:"4",y:"71",width:"1",height:"8",rx:".5",fill:"#8CAEF2",key:11}),r.createElement("path",{opacity:".35",d:"M11 139.4C11 125.35 8.937 97 5.5 97 2.462 97 0 125.35 0 139.4c0 6.36 2.462 10.6 5.5 10.6s5.5-5.03 5.5-10.6Z",fill:"currentColor",key:12}),r.createElement("path",{opacity:".35",d:"M26 139.4c0-14.05-2.063-42.4-5.5-42.4-3.038 0-5.5 28.35-5.5 42.4 0 6.36 2.462 10.6 5.5 10.6s5.5-5.03 5.5-10.6Z",fill:"currentColor",key:13})]),r.createElement("defs",{key:1},r.createElement("linearGradient",{id:"e4sqbxb6za",x1:"13",y1:"0",x2:"13",y2:"108",gradientUnits:"userSpaceOnUse"},[r.createElement("stop",{stopColor:"#62abd9",key:0}),r.createElement("stop",{offset:"1",stopColor:"#305973",key:1})]))])}a.defaultProps={width:"26",height:"150",viewBox:"0 0 116 24",fill:"none"},e.exports=a,a.default=a},5567:function(e,t,l){var r=l(2265);function a(e){return r.createElement("svg",e,[r.createElement("g",{transform:"translate(0, 25) rotate(-90)",key:0},[r.createElement("path",{d:"M13 .5c3.072 0 5.94 2.183 8.073 5.297C23.197 8.9 24.5 12.803 24.5 16v75c0 3.22-1.099 7.38-3.116 10.727-2.022 3.355-4.889 5.773-8.384 5.773-3.05 0-5.919-2.404-8.063-5.783C2.807 98.36 1.5 94.202 1.5 91V16c0-3.197 1.303-7.1 3.427-10.203C7.06 2.683 9.928.5 13 .5Z",stroke:"currentColor",strokeWidth:"5",key:0}),r.createElement("path",{fill:"currentColor",transform:"translate (0 -86) scale(1 2)",d:"M21 85.273V84s-2.214 2.727-8 2.727S5 84 5 84v1.273S7.857 90 13 90s8-4.727 8-4.727Z",key:1}),r.createElement("path",{d:"M20 103c-2-4.627-5.783-5-7-5-1.217 0-5 .373-7 5m18.5-35c0-4.627-9.5-5-11.5-5s-11.5.373-11.5 5m23-34c0-4.627-9.5-5-11.5-5s-11.5.373-11.5 5",stroke:"currentColor",strokeWidth:"3",key:2}),r.createElement("path",{opacity:".35",d:"M11 139.4C11 125.35 8.937 97 5.5 97 2.462 97 0 125.35 0 139.4c0 6.36 2.462 10.6 5.5 10.6s5.5-5.03 5.5-10.6Z",fill:"currentColor",key:3}),r.createElement("path",{opacity:".35",d:"M26 139.4c0-14.05-2.063-42.4-5.5-42.4-3.038 0-5.5 28.35-5.5 42.4 0 6.36 2.462 10.6 5.5 10.6s5.5-5.03 5.5-10.6Z",fill:"currentColor",key:4})]),r.createElement("defs",{key:1})])}a.defaultProps={width:"26",height:"150",viewBox:"-4 0 126 24",fill:"none"},e.exports=a,a.default=a},7798:function(e,t,l){var r=l(2265);function a(e){return r.createElement("svg",e,[r.createElement("circle",{cx:"12",cy:"12",r:"7",key:0}),r.createElement("path",{d:"M12 9v3l1.5 1.5m3.01 3.85-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83",key:1})])}a.defaultProps={width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"feather feather-watch"},e.exports=a,a.default=a}},function(e){e.O(0,[410,171,971,596,744],function(){return e(e.s=8075)}),_N_E=e.O()}]);