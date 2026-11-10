(function(){
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches, tactil=matchMedia('(hover: none)').matches;
var $=function(s,c){return (c||document).querySelector(s)}, $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var ED=document.body.classList.contains('editando'), CFG=window.STUDIO||{};

/* palabras animadas */
if(!ED)$$('.palabras').forEach(function(h){
  var html='';h.childNodes.forEach(function(n){
    if(n.nodeType===3){n.textContent.split(/(\s+)/).forEach(function(w){html+=/^\s+$/.test(w)?w:(w?'<span class="w"><span>'+w+'</span></span>':'')})}
    else{var t=n.textContent.split(/(\s+)/).map(function(w){return /^\s+$/.test(w)?w:(w?'<span class="w"><span>'+w+'</span></span>':'')}).join('');var c=n.cloneNode(false);c.innerHTML=t;html+=c.outerHTML}
  });h.innerHTML=html;
  $$('.w>span',h).forEach(function(s,i){s.style.transitionDelay=(i*0.045)+'s'});
});

/* revelar al hacer scroll + contadores */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('vis');
  $$('.cont',e.target).forEach(function(c){var n=+c.dataset.n,t0=null;function f(t){t0=t0||t;var p=Math.min((t-t0)/1400,1);c.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)});
  io.unobserve(e.target)}})},{threshold:.15,rootMargin:'0px 0px -6% 0px'});
if(ED){$$('.rv,.palabras').forEach(function(el){el.classList.add('vis')});$$('.cont').forEach(function(c){c.textContent=c.dataset.n})}else{$$('.rv,.palabras').forEach(function(el){io.observe(el)})}

/* nav, progreso, parallax */
var nav=$('#nav'),prog=$('#progreso'),par=$('#parCab'),cab=$('#cabina'),flot=$('#flot');
function onScroll(){var y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  nav.classList.toggle('sc',y>30);prog.style.transform='scaleX('+(h>0?y/h:0)+')';
  flot.classList.toggle('vis',y>innerHeight*.6);
  if(!reduce&&par){var r=cab.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){par.style.transform='scale(1.12) translateY('+((r.top/innerHeight)*-40)+'px)'}}
  var ya=false;$$('.nav ul a').forEach(function(a){var s=$(a.getAttribute('href'));if(!s)return;var r=s.getBoundingClientRect(),en=!ya&&r.top<140&&r.bottom>140;if(en)ya=true;a.classList.toggle('on',en)});
}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* menú celular */
$('#hamb').addEventListener('click',function(){document.body.classList.toggle('menu-on')});
$$('#menu a').forEach(function(a){a.addEventListener('click',function(){document.body.classList.remove('menu-on')})});

/* palabra que rota */
var rb=$$('#rota b'),ri=0;
if(rb.length>1)setInterval(function(){if(document.body.classList.contains('editando'))return;var a=rb[ri];a.classList.remove('on');a.classList.add('sale');setTimeout(function(){a.classList.remove('sale')},700);ri=(ri+1)%rb.length;rb[ri].classList.add('on')},2300);

/* pantallas del teléfono del inicio */
var ph=$$('#pantHero img'),pp=$$('#puntosHero i'),pi=0;
if(ph.length>1)setInterval(function(){ph[pi].classList.remove('on');pp[pi].classList.remove('on');pi=(pi+1)%ph.length;ph[pi].classList.add('on');pp[pi].classList.add('on')},2800);

/* inclinación 3D del teléfono + luz del cursor + botones magnéticos */
if(!tactil&&!reduce){
  var esc=$('#escena'),tel=$('#telHero'),luz=$('#luz');
  esc.addEventListener('mousemove',function(e){var r=esc.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;tel.style.transform='rotateY('+(x*22)+'deg) rotateX('+(-y*16)+'deg)'});
  esc.addEventListener('mouseleave',function(){tel.style.transform=''});
  addEventListener('mousemove',function(e){luz.style.left=e.clientX+'px';luz.style.top=e.clientY+'px'});
  $$('.mag').forEach(function(b){b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.25)+'px,'+((e.clientY-r.top-r.height/2)*.35)+'px)'});b.addEventListener('mouseleave',function(){b.style.transform=''})});
}else{$('#luz').style.display='none'}

/* servicios: tarjetas con luz que sigue al cursor y vista previa */
var vista=$('#vista'),vi=$$('#vista img'),vx=0,vy=0,tx=0,ty=0;
$$('.scard').forEach(function(f){
  f.addEventListener('mouseenter',function(){if(tactil||ED)return;vista.classList.add('on');vi.forEach(function(im,i){im.classList.toggle('on',i==f.dataset.img)})});
  f.addEventListener('mouseleave',function(){vista.classList.remove('on')});
  f.addEventListener('mousemove',function(e){var r=f.getBoundingClientRect();f.style.setProperty('--mx',(e.clientX-r.left)+'px');f.style.setProperty('--my',(e.clientY-r.top)+'px')});
  f.addEventListener('click',function(){if(ED||f.tagName==='A')return;elegir(f.querySelector('h3').textContent);$('#contacto').scrollIntoView({behavior:reduce?'auto':'smooth'})});
});
addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY});
(function loop(){vx+=(tx-vx)*.14;vy+=(ty-vy)*.14;vista.style.left=vx+'px';vista.style.top=vy+'px';requestAnimationFrame(loop)})();

/* apps: botones que cambian el teléfono (avanza solo hasta que el visitante toca uno) */
var pa=$$('#pantApp img'),chip=$('#chipApp'),chipBox=$('.chip-app'),halo=$('#halo'),telA=$('#telApp'),tabs=$$('#tabs .tab'),dets=$$('#detalle .det'),tabsBox=$('#tabs');
var colores=['rgba(0,177,242,.34)','rgba(255,0,51,.22)','rgba(247,168,35,.34)','rgba(0,177,242,.3)','rgba(255,90,120,.26)','rgba(120,200,120,.32)','rgba(247,168,35,.34)'],actual=0,auto=null,DUR=5000,enVista=false,tocado=false;
function mostrar(n,animar){if(!tabs.length)return;n=(n+tabs.length)%tabs.length;var t=tabs[n],cambia=n!==actual;actual=n;
  tabs.forEach(function(o,i){o.classList.toggle('on',i===n);o.setAttribute('aria-selected',i===n?'true':'false')});
  dets.forEach(function(d,i){d.classList.toggle('on',i===n)});
  var s=+t.dataset.s;pa.forEach(function(im,i){im.classList.toggle('on',i===s)});
  chip.textContent=t.dataset.t;halo.style.background='radial-gradient(circle,'+colores[n%colores.length]+',transparent 65%)';
  if(animar&&cambia&&!reduce){telA.classList.toggle('gira',false);chipBox.classList.toggle('salta',false);void telA.offsetWidth;telA.classList.add('gira');chipBox.classList.add('salta')}
  if(tabsBox.scrollWidth>tabsBox.clientWidth+4){tabsBox.scrollTo({left:t.offsetLeft-16,behavior:reduce?'auto':'smooth'})}
  if(auto){tabsBox.classList.toggle('auto',false);void tabsBox.offsetWidth;tabsBox.classList.add('auto')}}
function arranca(){if(ED||reduce||auto||!enVista)return;tabsBox.style.setProperty('--dur',DUR+'ms');auto=setInterval(function(){mostrar(actual+1,true)},DUR);tabsBox.classList.add('auto')}
function para(){clearInterval(auto);auto=null;tabsBox.classList.toggle('auto',false)}
tabs.forEach(function(t,i){t.addEventListener('click',function(){tocado=true;para();mostrar(i,true)})});
if(tabsBox)tabsBox.addEventListener('keydown',function(e){if(e.target.isContentEditable)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();tocado=true;para();mostrar(actual+(e.key==='ArrowRight'?1:-1),true);tabs[actual].focus()}});
if(tabs.length)new IntersectionObserver(function(es){es.forEach(function(e){enVista=e.isIntersecting;if(enVista&&!tocado)arranca();else para()})},{threshold:.35}).observe($('#apps'));
mostrar(0,false);

/* planes: interruptor mensual / anual */
var bola=$('#bola'),bs=$$('#interr button');
function ponBola(b){bola.style.left=b.offsetLeft+'px';bola.style.width=b.offsetWidth+'px'}
bs.forEach(function(b){b.addEventListener('click',function(){bs.forEach(function(o){o.classList.toggle('on',o===b)});ponBola(b);$('#grid4').classList.toggle('anual',b.dataset.m==='anual')})});
addEventListener('load',function(){ponBola($('#interr button.on'))});addEventListener('resize',function(){ponBola($('#interr button.on'))});setTimeout(function(){ponBola($('#interr button.on'))},300);

/* formulario por pasos */
var pasos=$$('.fpaso'),fb=$('#fbarra');
function ir(n){pasos.forEach(function(p){p.classList.toggle('on',+p.dataset.p===n)});fb.style.width=Math.min(n,3)/3*100+'%'}
$$('#opc button').forEach(function(b){b.addEventListener('click',function(){b.classList.toggle('on')})});
function elegir(t){$$('#opc button').forEach(function(b){if(b.textContent.toLowerCase().indexOf(t.toLowerCase().slice(0,10))>-1||t.toLowerCase().indexOf(b.textContent.toLowerCase().slice(0,10))>-1)b.classList.add('on')});ir(1)}
$$('[data-opc]').forEach(function(a){a.addEventListener('click',function(){elegir(a.dataset.opc)})});
$$('.sig').forEach(function(b){b.addEventListener('click',function(){var p=+b.closest('.fpaso').dataset.p;if(p===2&&(!$('#fn').value.trim()||!$('#fc').value.trim())){($('#fn').value.trim()?$('#fc'):$('#fn')).focus();return}if(p===1&&!$$('#opc button.on').length){$('#opc').animate([{transform:'translateX(0)'},{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'translateX(0)'}],{duration:350});return}ir(p+1)})});
$$('.atras').forEach(function(b){b.addEventListener('click',function(){ir(+b.closest('.fpaso').dataset.p-1)})});
$('#enviar').addEventListener('click',function(){var b=this;if(b.disabled)return;
  var datos={servicios:$$('#opc button.on').map(function(x){return x.textContent}).join(', '),nombre:$('#fn').value.trim(),contacto:$('#fc').value.trim(),mensaje:$('#fm').value.trim(),web:($('#fweb')||{}).value||''};
  if(!datos.nombre||!datos.contacto){ir(2);($('#fn').value?$('#fc'):$('#fn')).focus();return}
  b.disabled=true;b.style.opacity=.6;
  fetch('api/studio.php?accion=solicitud',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)}).then(function(r){return r.json()}).then(function(d){
    b.disabled=false;b.style.opacity='';if(d.ok){ir(4);fb.style.width='100%'}else{alert(d.error||'No se pudo enviar. Intenta de nuevo.')}
  }).catch(function(){b.disabled=false;b.style.opacity='';alert('No se pudo enviar. Revisa tu conexión e intenta de nuevo.')});
});

/* radio en vivo: reproducción, visualizador y canción actual */
var ios=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1),au=$("#radioA"),ctx,an,datos,suena=false,viz=$('#viz'),vm=$('#vizMini');
function ui(on){suena=on;document.body.classList.toggle('suena',on);$$('.js-play .lbl').forEach(function(l){l.textContent=on?'Pausar':'En vivo'})}
function audio(){if(ctx||ios)return;try{ctx=new (window.AudioContext||window.webkitAudioContext)();var src=ctx.createMediaElementSource(au);an=ctx.createAnalyser();an.fftSize=128;datos=new Uint8Array(an.frequencyBinCount);src.connect(an);an.connect(ctx.destination)}catch(e){an=null}}
$$('.js-play').forEach(function(b){b.addEventListener('click',function(){if(document.body.classList.contains('editando')&&!b.classList.contains('bpl'))return;if(au.paused){audio();if(ctx&&ctx.state==='suspended')ctx.resume();au.play().then(function(){ui(true)}).catch(function(){ui(false)})}else{au.pause();ui(false)}})});
function dibuja(cv,barras,alto){var c=cv.getContext('2d'),dpr=devicePixelRatio||1,w=cv.clientWidth,h=cv.clientHeight;if(!w)return;if(cv.width!==w*dpr){cv.width=w*dpr;cv.height=h*dpr}c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
  var t=performance.now()/1000,bw=w/barras;for(var i=0;i<barras;i++){var v;
    if(suena&&an){v=datos[Math.floor(i/barras*datos.length*.75)]/255}else{v=.12+.1*Math.abs(Math.sin(t*1.4+i*.35))*Math.abs(Math.cos(t*.6+i*.11))}
    var bh=Math.max(3,v*h*alto),x=i*bw+bw*.22;c.fillStyle=i%4===0?'#f7a823':'#00b1f2';c.globalAlpha=.35+v*.65;
    c.beginPath();if(c.roundRect)c.roundRect(x,(h-bh)/2,bw*.56,bh,3);else c.rect(x,(h-bh)/2,bw*.56,bh);c.fill()}
  c.globalAlpha=1}
var lr=$('.logo-radio img');
(function loop(){if(an&&suena){an.getByteFrequencyData(datos);if(lr){var m=0;for(var k=0;k<8;k++)m+=datos[k];lr.style.transform='scale('+(1+m/8/255*.12)+')'}}else if(lr&&lr.style.transform)lr.style.transform='';dibuja(viz,innerWidth<860?40:64,.92);if(innerWidth>860)dibuja(vm,14,.95);requestAnimationFrame(loop)})();
function np(){if(!CFG.np)return;fetch(CFG.np).then(function(r){return r.json()}).then(function(d){var s=d.now_playing&&d.now_playing.song;if(!s||!s.title)return;
  $('#npT').textContent=s.title;$('#npA').textContent=s.artist||'iLatina Radio';$('#npT2').textContent=s.title;$('#npA2').textContent=s.artist||'iLatina Radio';
  if(s.art){$('#artR').src=s.art;$('#artF').src=s.art}}).catch(function(){})}
np();setInterval(np,30000);
})();
