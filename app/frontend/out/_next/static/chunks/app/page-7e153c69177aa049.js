(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{8075:function(e,t,l){Promise.resolve().then(l.bind(l,1101))},1101:function(e,t,l){"use strict";l.r(t),l.d(t,{default:function(){return k}});var n=l(7437),r=l(2265),a=l(165),s=l(1110),i=l(9222),c=l(981),o=l.n(c),h=l(6470),d=l.n(h);function f(e){let{index:t,trains:l,ip:r,totalTracks:a}=e;return(0,n.jsxs)("div",{className:"flex h-full w-full flex-col items-center justify-center gap-2 px-4 pt-14",children:[(0,n.jsxs)("div",{className:"relative flex h-[1vw] w-full border-b-2 border-t-2 border-[#5bade0cc]",style:{background:"linear-gradient(90deg,\n          rgb(255 255 255/0) 0%,\n          hsla(220, 62%, 25%, .5) 15%,\n          hsla(220, 62%, 25%, .5) 85%,\n          rgb(255 255 255/0) 100%)"},children:[(0,n.jsx)("div",{className:"flex h-full w-full",style:{background:"linear-gradient(\n              to right,\n              #0000 1px,\n              #305973 3px,\n              #0000 0px\n              )",backgroundSize:"3% 100%"}}),l.map(e=>(0,n.jsx)("div",{className:"absolute h-full w-full items-center justify-center transition-all",style:{top:100===e.position||e.position<8?((a+1)/2-t)*80:"calc(50% - 12.5px)",left:e.position<5?"calc(0% - 400px)":100===e.position?"calc(100% + 76px)":"".concat(e.position,"%"),transformOrigin:"center left",transitionDuration:"".concat(e.position<5||100===e.position?.8:.3,"s"),opacity:100===e.position?0:1,transitionTimingFunction:100===e.position?"ease-out":"linear"},children:(0,n.jsx)(d(),{className:"transition-all",style:{width:"12%",height:25,color:e.braking?"red":100===e.position?"lightblue":"white"}})},e.id))]}),(0,n.jsxs)("span",{className:"flex items-center gap-2 text-[#4f98c4]",children:[(0,n.jsxs)("span",{className:"font-bold",children:["Track ",t+1]}),(0,n.jsxs)("span",{className:"text-xs",children:[" [",r,"]"]})]})]})}var p=l(2624),x=l.n(p),m=l(7798),u=l.n(m),g=l(7026),y=l(3969);function v(e){let{value:t}=e,l=(0,y.v)({domain:[0,100],startAngle:90,endAngle:270,numTicks:21,diameter:200}),a=(0,r.useMemo)(()=>l.getNeedleProps({value:0,baseRadius:8,tipRadius:2}),[]);return(0,n.jsxs)("svg",{className:"w-full overflow-visible p-2",...l.getSVGProps(),children:[(0,n.jsx)("g",{id:"ticks",children:l.ticks.map(e=>{let t=l.angleToValue(e);return(0,n.jsxs)(r.Fragment,{children:[(0,n.jsx)("line",{className:(0,g.Z)(["stroke-gray-300",{"stroke-red-300":t<=20,"stroke-yellow-300":t>=60&&t<=80,"stroke-green-400":t>=80}]),strokeWidth:2,...l.getTickProps({angle:e,length:8})}),t%20==0&&(0,n.jsx)("text",{className:"fill-gray-400 text-sm font-medium",...l.getLabelProps({angle:e,offset:20}),children:t})]},"tick-group-".concat(e))})}),(0,n.jsxs)("g",{id:"needle",children:[(0,n.jsx)("circle",{className:"fill-gray-300",...a.base,r:12}),(0,n.jsx)("circle",{className:"fill-gray-700",...a.base}),(0,n.jsx)("circle",{className:"fill-gray-700",...a.tip}),(0,n.jsx)("polyline",{className:"fill-gray-700/50 transition-all duration-[300ms] ease-linear",points:a.points,style:{transform:"rotate(".concat(t/100*180,"deg)")}}),(0,n.jsx)("circle",{className:"fill-white",...a.base,r:4})]})]})}function k(){let e="horizontal-scaling.up.railway.app",t=(0,a.NL)(),l=async()=>{let t=await i.Z.post("".concat("https","://").concat(e,"/startTrain"));return t.data},c=(0,s.D)(l,{onSuccess:()=>{t.invalidateQueries(["trains"])}}),[h,d]=(0,r.useState)([]),[p,m]=(0,r.useState)([]),[g,y]=(0,r.useState)(null),[k,E]=(0,r.useState)(null);(0,r.useEffect)(()=>{g&&Date.now()-g>800&&0===h.length&&(E(Date.now()-g),y(null))},[g,h.length]),(0,r.useEffect)(()=>{console.log("Connecting to WebSocket");let t=new WebSocket("".concat("wss","://").concat(e,"/ws"));return t.addEventListener("open",()=>{console.log("WebSocket connection opened")}),t.addEventListener("close",()=>{console.log("WebSocket connection closed"),setTimeout(()=>t=new WebSocket("".concat("wss","://").concat(e,"/ws")))}),t.addEventListener("message",e=>{let t=JSON.parse(e.data);if(t.track&&m(e=>[...e.filter(e=>e!==t.track),t.track]),t.removed&&m(e=>[...e.filter(e=>e!==t.removed)]),!t.train)return;let l=t.train;l.track=t.track,d(e=>{let t=e.findIndex(e=>e.id===l.id);if(t>=0){let n=[...e];return n[t]=l,n}return[...e,l]}),setTimeout(()=>{100===l.position&&(console.log("TRAIN ARRIVED"),d(e=>e.filter(e=>e.id!==l.id)))},1e3)}),()=>{t.close()}},[]);let w=h.filter(e=>e.position<100).length,b=h.filter(e=>e.braking).length;return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(o(),{children:[(0,n.jsx)("title",{children:"Railway Horizontal Scaling"}),(0,n.jsx)("link",{rel:"icon",href:"/train1.svg"})]}),(0,n.jsx)("main",{className:"flex min-h-screen w-full min-w-0 flex-col items-center overflow-hidden px-2 pb-8 pt-8 lg:h-screen",style:{backgroundColor:"rgb(19, 17, 28)",backgroundImage:"linear-gradient(\n              327.21deg, \n              rgba(33, 0, 75, 0.24) 3.65%, \n              rgba(60, 0, 136, 0) 40.32%\n            ), \n            linear-gradient(\n              245.93deg, \n              rgba(209, 21, 111, 0.16) 0%, \n              rgba(209, 25, 80, 0) 36.63%\n            ), \n            linear-gradient(\n              147.6deg, \n              rgba(58, 19, 255, 0) 29.79%, \n              rgba(98, 19, 255, 0.01) 85.72%\n            )"},children:(0,n.jsxs)("div",{className:"flex h-full w-full flex-col items-center gap-4 overflow-y-scroll text-white",children:[(0,n.jsxs)("div",{className:"flex items-center gap-4",children:[(0,n.jsx)("button",{className:"flex w-fit rounded border border-[#3e7698] px-2 py-1 text-[#3e7698] transition-all duration-100 hover:bg-gray-700 hover:text-[#4f98c4] hover:text-white",onClick:()=>{0===h.filter(e=>e.position<100).length&&y(Date.now()),E(null),c.mutate()},children:"Start 1 Train"}),(0,n.jsx)("button",{className:"flex w-fit rounded border border-[#3e7698] px-2 py-1 text-[#3e7698] transition-all duration-100 hover:bg-gray-700 hover:text-[#4f98c4] hover:text-white",onClick:()=>{0===h.filter(e=>e.position<100).length&&y(Date.now()),E(null);for(let e=0;e<10;e++)c.mutate()},children:"Start 10 Trains"})]}),(0,n.jsx)("div",{className:"text-lg",children:0!==w||k||g?k?(0,n.jsxs)("div",{className:"flex items-center gap-1",children:[(0,n.jsx)(u(),{style:{height:20}}),(0,n.jsx)("span",{children:"Duration: ".concat((k/1e3).toFixed(3)," seconds")})]}):(0,n.jsx)("div",{children:(0,n.jsx)("span",{children:"Waiting for ".concat(w," trains to arrive...")})}):(0,n.jsx)("div",{children:(0,n.jsx)("span",{className:"italic text-white/70",children:"Let's move some trains!"})})}),(0,n.jsx)("div",{className:"flex w-32 items-center gap-1",children:(0,n.jsx)(v,{value:w?100-b/h.length*100:0})}),(0,n.jsxs)("div",{className:"flex w-full items-center text-[#3e7698]",children:[(0,n.jsx)("div",{className:"flex w-fit flex-col items-center pl-10 pr-20",children:(0,n.jsx)(x(),{style:{height:80,opacity:.7}})}),(0,n.jsx)("div",{className:"flex h-full w-full flex-col",children:p.sort().map((e,t)=>(0,n.jsx)(f,{totalTracks:p.length,ip:e,trains:h.filter(t=>t.track===e),index:t},e))}),(0,n.jsx)("div",{className:"flex w-fit flex-col items-center pl-20 pr-10",children:(0,n.jsx)(x(),{style:{height:80,opacity:.7}})})]})]})})]})}},2624:function(e,t,l){var n=l(2265);function r(e){return n.createElement("svg",e,[n.createElement("path",{fill:"currentColor",d:"M85.5,17.2L74.7,27.9v3.5V35h3.3h3.3v32.4v32.4H56.5h-25l-10.7,10.7L10,121.2v2.8c0,1.6,0.3,3.1,0.7,3.5c0.4,0.4,2,0.7,3.6,0.7h3v59.6c0,50.6,0.1,59.8,0.8,60.7c0.8,1.1,2.6,1.1,110,1.1s109.2,0,110-1.1c0.7-0.9,0.8-10.1,0.8-60.7v-59.6h3.1c3.5,0,4.2-0.7,4.2-4.5c0-2.3-0.2-2.6-10.7-13.2l-10.7-10.8h-25h-25V67.3V35h3.3h3.3v-3.5v-3.5l-10.8-10.7L159.7,6.5H128H96.3L85.5,17.2z M160.1,81.6v46.6h32.1h32.1v49.9V228h-42.7h-42.7v-21.2v-21.2H128h-10.9v21.2V228H74.4H31.8v-49.9v-49.9h32.1h32.1V81.6V35H128h32.1V81.6z",key:0}),n.createElement("path",{fill:"white",d:"M121.6,57.6c-7.1,1.9-12.9,6.7-16.1,13.4c-1.6,3.3-2,4.9-2.3,8.8c-0.7,10.8,4.5,19.6,14.4,24.4c3.5,1.7,3.9,1.8,10.3,1.8c6.5,0,6.8-0.1,10.6-1.9c15.8-7.8,19.1-28.2,6.5-40.6C139.1,57.8,129.8,55.4,121.6,57.6z M130.7,65.2c0.7,0.9,0.9,2.7,0.9,7v5.7h5.7c6.6,0,8.2,0.7,8.2,3.5c0,3.5-0.8,3.8-10.4,3.8c-11.3,0-10.8,0.6-10.8-10.7c0-7.1,0.2-8.6,0.9-9.5C126.6,63.5,129.7,63.6,130.7,65.2z",key:1}),n.createElement("g",{fill:"white",key:2},[n.createElement("path",{d:"M45.7,156.9v14.2l10.8-0.1l10.7-0.2l0.2-14.1l0.1-14.1H56.6H45.7V156.9z",key:0}),n.createElement("path",{d:"M81.4,156.9v14.2l10.8-0.1l10.7-0.2l0.2-14.1l0.1-14.1H92.3H81.4V156.9z",key:1}),n.createElement("path",{d:"M117.1,156.9v14.2l10.8-0.1l10.7-0.2l0.2-14.1l0.1-14.1H128h-10.9V156.9z",key:2}),n.createElement("path",{d:"M152.8,156.9v14.2l10.8-0.1l10.7-0.2l0.2-14.1l0.1-14.1h-10.9h-10.9L152.8,156.9L152.8,156.9z",key:3}),n.createElement("path",{d:"M188.5,156.9v14.2l10.8-0.1l10.7-0.2l0.2-14.1l0.1-14.1h-10.9h-10.9V156.9L188.5,156.9z",key:4}),n.createElement("path",{d:"M153.1,185.7c-0.2,0.4-0.2,6.9-0.2,14.4l0.2,13.7h10.6h10.6v-14.2v-14.2l-10.5-0.2C155.7,185,153.3,185.2,153.1,185.7z",key:5}),n.createElement("path",{d:"M45.8,199.7l0.2,14.1h10.6h10.6l0.2-14.1l0.1-14.1H56.6H45.7L45.8,199.7z",key:6}),n.createElement("path",{d:"M81.5,199.7l0.2,14.1h10.6h10.6l0.2-14.1l0.1-14.1H92.3H81.4L81.5,199.7z",key:7}),n.createElement("path",{d:"M188.6,199.7l0.2,14.1h10.6H210l0.2-14.1l0.1-14.1h-10.9h-10.9L188.6,199.7z",key:8})])])}r.defaultProps={version:"1.1",x:"0px",y:"0px",viewBox:"0 0 256 256",enableBackground:"new 0 0 256 256",xmlSpace:"preserve"},e.exports=r,r.default=r},6470:function(e,t,l){var n=l(2265);function r(e){return n.createElement("svg",e,[n.createElement("g",{transform:"translate(0, 25) rotate(-90)",key:0},[n.createElement("path",{d:"M13 .5c3.072 0 5.94 2.183 8.073 5.297C23.197 8.9 24.5 12.803 24.5 16v75c0 3.22-1.099 7.38-3.116 10.727-2.022 3.355-4.889 5.773-8.384 5.773-3.05 0-5.919-2.404-8.063-5.783C2.807 98.36 1.5 94.202 1.5 91V16c0-3.197 1.303-7.1 3.427-10.203C7.06 2.683 9.928.5 13 .5Z",fill:"url(#e4sqbxb6za)",stroke:"#306EE8",key:0}),n.createElement("path",{d:"M21 85.273V84s-2.214 2.727-8 2.727S5 84 5 84v1.273S7.857 90 13 90s8-4.727 8-4.727Z",fill:"currentColor",key:1}),n.createElement("path",{d:"M7 16.5a.5.5 0 0 1 1 0v60a.5.5 0 0 1-1 0v-60Zm11 0a.5.5 0 0 1 1 0v60a.5.5 0 0 1-1 0v-60Z",fill:"#1D4596",key:2}),n.createElement("path",{d:"M20 103c-2-4.627-5.783-5-7-5-1.217 0-5 .373-7 5m18.5-35c0-4.627-9.5-5-11.5-5s-11.5.373-11.5 5m23-34c0-4.627-9.5-5-11.5-5s-11.5.373-11.5 5",stroke:"#306EE8",key:3}),n.createElement("rect",{x:"21",y:"37",width:"1",height:"8",rx:".5",fill:"#8CAEF2",key:4}),n.createElement("rect",{x:"21",y:"18",width:"1",height:"8",rx:".5",fill:"#8CAEF2",key:5}),n.createElement("rect",{x:"21",y:"71",width:"1",height:"8",rx:".5",fill:"#8CAEF2",key:6}),n.createElement("rect",{x:"21",y:"51",width:"1",height:"8",rx:".5",fill:"#8CAEF2",key:7}),n.createElement("rect",{x:"4",y:"37",width:"1",height:"8",rx:".5",fill:"#8CAEF2",key:8}),n.createElement("rect",{x:"4",y:"18",width:"1",height:"8",rx:".5",fill:"#8CAEF2",key:9}),n.createElement("rect",{x:"4",y:"51",width:"1",height:"8",rx:".5",fill:"#8CAEF2",key:10}),n.createElement("rect",{x:"4",y:"71",width:"1",height:"8",rx:".5",fill:"#8CAEF2",key:11}),n.createElement("path",{opacity:".35",d:"M11 139.4C11 125.35 8.937 97 5.5 97 2.462 97 0 125.35 0 139.4c0 6.36 2.462 10.6 5.5 10.6s5.5-5.03 5.5-10.6Z",fill:"currentColor",key:12}),n.createElement("path",{opacity:".35",d:"M26 139.4c0-14.05-2.063-42.4-5.5-42.4-3.038 0-5.5 28.35-5.5 42.4 0 6.36 2.462 10.6 5.5 10.6s5.5-5.03 5.5-10.6Z",fill:"currentColor",key:13})]),n.createElement("defs",{key:1},[n.createElement("linearGradient",{id:"e4sqbxb6za",x1:"13",y1:"0",x2:"13",y2:"108",gradientUnits:"userSpaceOnUse",key:0},[n.createElement("stop",{stopColor:"#0B1426",key:0}),n.createElement("stop",{offset:"1",stopColor:"#1A4DB3",key:1})]),n.createElement("linearGradient",{id:"1vqmv16osb",x1:"5.5",y1:"150",x2:"5.5",y2:"97",gradientUnits:"userSpaceOnUse",key:1},[n.createElement("stop",{offset:".115",stopColor:"#fff",stopOpacity:"0",key:0}),n.createElement("stop",{offset:".531",stopColor:"#999",stopOpacity:".448",key:1}),n.createElement("stop",{offset:"1",stopColor:"#fff",stopOpacity:".4",key:2})]),n.createElement("linearGradient",{id:"ubdt96w3ec",x1:"20.5",y1:"150",x2:"20.5",y2:"97",gradientUnits:"userSpaceOnUse",key:2},[n.createElement("stop",{offset:".115",stopColor:"#fff",stopOpacity:"0",key:0}),n.createElement("stop",{offset:".531",stopColor:"#999",stopOpacity:".448",key:1}),n.createElement("stop",{offset:"1",stopColor:"#fff",stopOpacity:".4",key:2})])])])}r.defaultProps={width:"26",height:"150",viewBox:"0 0 116 24",fill:"none"},e.exports=r,r.default=r},7798:function(e,t,l){var n=l(2265);function r(e){return n.createElement("svg",e,[n.createElement("circle",{cx:"12",cy:"12",r:"7",key:0}),n.createElement("path",{d:"M12 9v3l1.5 1.5m3.01 3.85-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83",key:1})])}r.defaultProps={width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"feather feather-watch"},e.exports=r,r.default=r}},function(e){e.O(0,[410,171,971,596,744],function(){return e(e.s=8075)}),_N_E=e.O()}]);