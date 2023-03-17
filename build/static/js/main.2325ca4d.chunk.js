(this.webpackJsonptest=this.webpackJsonptest||[]).push([[0],{15:function(e,t,n){},16:function(e,t,n){},17:function(e,t,n){},19:function(e,t,n){},20:function(e,t,n){},41:function(e,t,n){},42:function(e,t,n){},43:function(e,t,n){"use strict";n.r(t);var a=n(1),s=n(8),c=n.n(s),r=(n(15),n(3)),i=(n(16),n(4)),o=n(5),l=(n(17),function(e){return new Promise((function(t){setTimeout((function(){t()}),e)}))}),u=n(0),p=function(e){var t=e.setIsLoading,n=e.setIsDownloadLinkAvailable,s=e.setPlaylistName,c=e.setBinname,p=e.setGatewayURLS,b=e.setUploadType,d=Object(a.useState)(""),j=Object(r.a)(d,2),f=j[0],y=j[1],h=function(){return!(f.length>=4&&"http"===f.substr(0,4))};return Object(u.jsx)("div",{className:"Playlist",children:Object(u.jsxs)("div",{className:"playlistInput",children:[Object(u.jsx)("input",{onChange:function(e){y(e.target.value)},className:"inputLink",type:"text",placeholder:"Insert the url of spotify playlist"}),Object(u.jsx)("button",{className:"".concat(h()?"disabled":""),onClick:h()?function(){}:function(){if(/http[s]?[:]\/\/open\.spotify\.com\/playlist\/.+[/?]/.test(f)){var e=f;t(!0),n(!1),fetch("".concat("","/getDownloadLinksPlaylist"),{method:"post",mode:"cors",headers:{"content-type":"application/json"},body:JSON.stringify({playlistURL:e})}).then((function(e){return e.json()})).then(function(){var e=Object(o.a)(Object(i.a)().mark((function e(a){var r,o,u,d,j,f,y,h;return Object(i.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log(a);case 1:return e.next=4,l(3e3);case 4:return e.next=6,fetch("".concat("","/getResponseState"));case 6:return r=e.sent,e.next=9,r.json();case 9:if(o=e.sent,console.log("mainData ",o),!1!==o.state){e.next=15;break}return e.next=14,l(2e4);case 14:return e.abrupt("continue",1);case 15:if(u=o.data,d=u.status,j=u.binname,f=u.playListName,y=u.gatewayURLS,h=o.data.type,b(h),t(!1),"ok"==d){e.next=25;break}return console.log(d),s(f),c(j),t(!1),e.abrupt("break",32);case 25:return s(f),n(!0),t(!1),"ipfs"===h?(c(""),p(y)):(p([]),c(j)),e.abrupt("break",32);case 32:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()).catch((function(e){s(""),console.log(e),t(!1),c(""),p([]),alert("some error")}))}else alert("Invalid playlist link")},children:"Generate Link"})]})})},b=(n(19),function(e){e.quality,e.type;var t=e.setIsLoading,n=e.setIsDownloadLinkAvailable,s=e.setDownloadLinks,c=e.setPlaylistName,p=e.setBinname,b=e.setGatewayURLS,d=e.setUploadType,j=Object(a.useState)(""),f=Object(r.a)(j,2),y=f[0],h=f[1],O=function(){return!(y.length>=4&&"http"===y.substr(0,4))};return Object(u.jsx)("div",{className:"IndividualVideos",children:Object(u.jsxs)("div",{className:"videosInput",children:[Object(u.jsx)("input",{onChange:function(e){h(e.target.value)},className:"inputLink",type:"text",placeholder:"Insert spotify track links separated by commas"}),Object(u.jsx)("button",{className:"".concat(O()?"disabled":""),onClick:O()?function(){}:function(){if(/http[s]?[:]\/\/open\.spotify\.com\/track\/.+[/?]/.test(y)){var e=y.split(",");t(!0),n(!1),fetch("".concat("","/getDownloadLinksIndividual"),{method:"post",mode:"cors",headers:{"content-type":"application/json"},body:JSON.stringify({tracks:e})}).then((function(e){return e.json()})).then(function(){var e=Object(o.a)(Object(i.a)().mark((function e(a){var s,r,o,u,j,f,y;return Object(i.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log(a);case 1:return e.next=4,l(1e3);case 4:return e.next=6,fetch("".concat("","/getResponseState"));case 6:return s=e.sent,e.next=9,s.json();case 9:if(r=e.sent,console.log("mainData ",r),!1!==r.state){e.next=15;break}return e.next=14,l(1e4);case 14:return e.abrupt("continue",1);case 15:if(o=r.data,u=o.status,j=o.binname,f=o.gatewayURLS,y=r.data.type,d(y),"ok"==u){e.next=24;break}return c(""),n(!1),p(""),t(!1),e.abrupt("break",31);case 24:return t(!1),c("songs"),"ipfs"===y?(b(f),p("")):(b([]),p(j)),n(!0),e.abrupt("break",31);case 31:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()).catch((function(e){console.log(e),s([]),c(""),t(!1),p(""),alert("some error")}))}else alert("Invalid spotify track link")},children:"Generate Link"})]})})}),d=(n(20),n(9)),j=n.n(d);var f=function(e){var t=e.visible,n=e.text,a=e.type,s=e.classes||"",c=e.color||"#fff",r=e.color;return Object(u.jsxs)("div",{className:"Spinner ".concat(s," ").concat(t?"":"none"),children:[Object(u.jsx)(j.a,{type:a,color:c,height:50,width:50,timeout:0}),Object(u.jsx)("span",{style:r?{color:c}:{},class:"Loading_Text",children:n})]})},y=n(10),h=(n(41),function(e){e.downloadLinks,e.playlistName,e.type;var t=e.binname,n=e.uploadType,a=e.gatewayURLS,s=function(){var e=Object(o.a)(Object(i.a)().mark((function e(t){var n;return Object(i.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:(n=document.createElement("a")).setAttribute("href",t),n.setAttribute("target","_blank"),n.setAttribute("rel","noopener noreferrer"),n.dispatchEvent(new MouseEvent("click",{ctrlKey:!0}));case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),c=function(){var e=Object(o.a)(Object(i.a)().mark((function e(t){var n,a,s,c,r,o;return Object(i.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.url,a=t.title,e.next=3,fetch(n);case 3:return s=e.sent,e.next=6,s.blob();case 6:c=e.sent,r=URL.createObjectURL(c),(o=document.createElement("a")).download="".concat(a,".mp3"),o.href=r,o.click();case 12:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),r=function(){var e=Object(o.a)(Object(i.a)().mark((function e(){var r,o,l,u;return Object(i.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("filebin"!==n){e.next=4;break}return r="".concat("https://filebin.net","/archive/").concat(t,"/zip"),s(r),e.abrupt("return");case 4:console.log(a),o=Object(y.a)(a),e.prev=6,o.s();case 8:if((l=o.n()).done){e.next=14;break}return u=l.value,e.next=12,c(u);case 12:e.next=8;break;case 14:e.next=19;break;case 16:e.prev=16,e.t0=e.catch(6),o.e(e.t0);case 19:return e.prev=19,o.f(),e.finish(19);case 22:case"end":return e.stop()}}),e,null,[[6,16,19,22]])})));return function(){return e.apply(this,arguments)}}();return Object(u.jsx)("div",{className:"Download",children:Object(u.jsx)("button",{onClick:r,children:"Download"})})}),O=(n(42),function(e){return Object(u.jsxs)("div",{className:"Result",children:[Object(u.jsx)("h3",{children:e.playlistName}),Object(u.jsxs)("p",{children:[e.playlistLength?e.playlistLength:0," videos found in playlist"]})]})});var m=function(){var e=Object(a.useState)(!1),t=Object(r.a)(e,2),n=t[0],s=t[1],c=Object(a.useState)(!1),i=Object(r.a)(c,2),o=i[0],l=i[1],d=Object(a.useState)("480"),j=Object(r.a)(d,2),y=j[0],m=(j[1],Object(a.useState)("video")),v=Object(r.a)(m,2),x=v[0],k=(v[1],Object(a.useState)("")),g=Object(r.a)(k,2),w=g[0],L=g[1],N=Object(a.useState)([]),S=Object(r.a)(N,2),I=S[0],R=S[1],U=Object(a.useState)("ipfs"),D=Object(r.a)(U,2),A=D[0],P=D[1],T=Object(a.useState)([]),C=Object(r.a)(T,2),G=C[0],B=C[1],E=Object(a.useState)(""),J=Object(r.a)(E,2),q=J[0],V=J[1],_=Object(a.useState)(0),z=Object(r.a)(_,2),F=z[0],K=z[1];return Object(u.jsxs)("div",{className:"App",children:[Object(u.jsx)(p,{quality:y,type:x,setIsLoading:l,setIsDownloadLinkAvailable:s,setDownloadLinks:B,setPlaylistName:V,setPlaylistLength:K,setBinname:L,setGatewayURLS:R,setUploadType:P}),Object(u.jsx)("div",{className:"OR",children:"OR"}),Object(u.jsx)("div",{className:"labelIndividualVideos",children:"For downloading tracks separately"}),Object(u.jsx)(b,{quality:y,type:x,setIsLoading:l,setIsDownloadLinkAvailable:s,setDownloadLinks:B,setPlaylistName:V,setBinname:L,setGatewayURLS:R,setUploadType:P}),Object(u.jsx)(f,{classes:"center mgtop",visible:o,text:"Loading",type:"Circles",color:"black"}),n?Object(u.jsx)(h,{type:x,downloadLinks:G,playlistName:q,binname:w,uploadType:A,gatewayURLS:I}):"",0!=F?Object(u.jsx)(O,{playlistName:q,playlistLength:F}):""]})};c.a.render(Object(u.jsx)(m,{}),document.getElementById("root"))}},[[43,1,2]]]);
//# sourceMappingURL=main.2325ca4d.chunk.js.map