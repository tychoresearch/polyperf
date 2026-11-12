// PolyPerf preview site: shared header/footer, language + theme toggles, chart helpers.
(function(){
  const root=document.documentElement;
  const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
  const qs=new URLSearchParams(location.search);   // ?theme=dark|light&lang=en|zh (also remembered)
  if(qs.get('lang'))store.set('pp-lang',qs.get('lang')); if(qs.get('theme'))store.set('pp-theme',qs.get('theme'));
  root.dataset.lang=store.get('pp-lang')||'en';   // English first; 中文 via the toggle
  const th=store.get('pp-theme'); if(th) root.dataset.theme=th;
  const isDark=()=>root.dataset.theme?root.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
  if(!document.querySelector('link[rel=icon]')){const ic=document.createElement('link');ic.rel='icon';ic.type='image/svg+xml';ic.href='assets/logo.svg';document.head.appendChild(ic)}

  const svg=p=>`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
  const ICON={
    arrow:svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    sun:svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    moon:svg('<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/>'),
    search:svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>'),
  };

  const PAGES=[['index.html','Overview','概览'],['leaderboard.html','Leaderboard','排行榜'],['tasks.html','Task explorer','题目浏览'],
               ['analysis.html','Errors & cases','错误与案例'],['method.html','Method','方法与计分'],['preliminary.html','Preliminary','初步结果']];
  const file=(location.pathname.split('/').pop()||'index.html'), here={'task.html':'tasks.html','case.html':'tasks.html'}[file]||file;
  const hdr=document.createElement('header');hdr.className='nav';
  hdr.innerHTML=`<div class="in"><a class="brand" href="index.html"><img src="assets/logo.svg" alt=""><span><b>PolyPerf</b><small><span class="en">CPU performance benchmark</span><span class="zh">CPU 性能基准</span></small></span></a><nav>${PAGES.map(([h,e,z])=>`<a href="${h}"${h===here?' aria-current="page"':''}><span class="en">${e}</span><span class="zh">${z}</span></a>`).join('')}</nav><div class="tools"><span class="preview-tag">PREVIEW</span><button class="btn" id="langbtn" type="button"><span class="en">中文</span><span class="zh">EN</span></button><button class="btn sq" id="themebtn" type="button" aria-label="toggle light / dark"></button></div></div>`;
  document.body.prepend(hdr);
  const ft=document.createElement('footer');
  ft.innerHTML=`<div class="in"><span class="brandmini"><img src="assets/logo.svg" alt="">PolyPerf</span><a class="tycho" href="../"><img src="assets/tycho.svg" alt=""><span class="en">A Tycho Research benchmark</span><span class="zh">Tycho Research 出品</span></a><span><span class="en">Preview · numbers from the paper's frozen snapshot (2026-11-07) unless a page says <b>preliminary</b> · paper in preparation</span><span class="zh">预览版 · 除标注<b>初步结果</b>的页面外，数字均来自论文冻结快照（2026-11-07）· 论文准备中</span></span><span><span class="en">Want your model evaluated, or found an error? Contact</span><span class="zh">想评测你的模型，或发现错误？请联系</span> <a href="mailto:tychoresearchai@gmail.com">tychoresearchai@gmail.com</a></span></div>`;
  document.body.appendChild(ft);
  const tip=document.createElement('div');tip.className='tip';document.body.appendChild(tip);

  // model badge = the mark of the company that makes the model (assets/logos); unknown ids fall back to initials
  const LOGO={"claude": "<svg class=\"lg\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z\" fill=\"#D97757\" fill-rule=\"nonzero\"></path></svg>", "openai": "<svg class=\"lg\" aria-hidden=\"true\" fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z\"></path></svg>", "grok": "<svg class=\"lg\" aria-hidden=\"true\" fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815\"></path></svg>", "zhipu": "<svg class=\"lg\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M11.991 23.503a.24.24 0 00-.244.248.24.24 0 00.244.249.24.24 0 00.245-.249.24.24 0 00-.22-.247l-.025-.001zM9.671 5.365a1.697 1.697 0 011.099 2.132l-.071.172-.016.04-.018.054c-.07.16-.104.32-.104.498-.035.71.47 1.279 1.186 1.314h.366c1.309.053 2.338 1.173 2.286 2.523-.052 1.332-1.152 2.38-2.478 2.327h-.174c-.715.018-1.274.64-1.239 1.368 0 .124.018.23.053.337.209.373.54.658.96.8.75.23 1.517-.125 1.9-.782l.018-.035c.402-.64 1.17-.96 1.92-.711.854.284 1.378 1.226 1.099 2.167a1.661 1.661 0 01-2.077 1.102 1.711 1.711 0 01-.907-.711l-.017-.035c-.2-.323-.463-.58-.851-.711l-.056-.018a1.646 1.646 0 00-1.954.746 1.66 1.66 0 01-1.065.764 1.677 1.677 0 01-1.989-1.279c-.209-.906.332-1.83 1.257-2.043a1.51 1.51 0 01.296-.035h.018c.68-.071 1.151-.622 1.116-1.333a1.307 1.307 0 00-.227-.693 2.515 2.515 0 01-.366-1.403 2.39 2.39 0 01.366-1.208c.14-.195.21-.444.227-.693.018-.71-.506-1.261-1.186-1.332l-.07-.018a1.43 1.43 0 01-.299-.07l-.05-.019a1.7 1.7 0 01-1.047-2.114 1.68 1.68 0 012.094-1.101zm-5.575 10.11c.26-.264.639-.367.994-.27.355.096.633.379.728.74.095.362-.007.748-.267 1.013-.402.41-1.053.41-1.455 0a1.062 1.062 0 010-1.482zm14.845-.294c.359-.09.738.024.992.297.254.274.344.665.237 1.025-.107.36-.396.634-.756.718-.551.128-1.1-.22-1.23-.781a1.05 1.05 0 01.757-1.26zm-.064-4.39c.314.32.49.753.49 1.206 0 .452-.176.886-.49 1.206-.315.32-.74.5-1.185.5-.444 0-.87-.18-1.184-.5a1.727 1.727 0 010-2.412 1.654 1.654 0 012.369 0zm-11.243.163c.364.484.447 1.128.218 1.691a1.665 1.665 0 01-2.188.923c-.855-.36-1.26-1.358-.907-2.228a1.68 1.68 0 011.33-1.038c.593-.08 1.183.169 1.547.652zm11.545-4.221c.368 0 .708.2.892.524.184.324.184.724 0 1.048a1.026 1.026 0 01-.892.524c-.568 0-1.03-.47-1.03-1.048 0-.579.462-1.048 1.03-1.048zm-14.358 0c.368 0 .707.2.891.524.184.324.184.724 0 1.048a1.026 1.026 0 01-.891.524c-.569 0-1.03-.47-1.03-1.048 0-.579.461-1.048 1.03-1.048zm10.031-1.475c.925 0 1.675.764 1.675 1.706s-.75 1.705-1.675 1.705-1.674-.763-1.674-1.705c0-.942.75-1.706 1.674-1.706zm-2.626-.684c.362-.082.653-.356.761-.718a1.062 1.062 0 00-.238-1.028 1.017 1.017 0 00-.996-.294c-.547.14-.881.7-.752 1.257.13.558.675.907 1.225.783zm0 16.876c.359-.087.644-.36.75-.72a1.062 1.062 0 00-.237-1.019 1.018 1.018 0 00-.985-.301 1.037 1.037 0 00-.762.717c-.108.361-.017.754.239 1.028.245.263.606.377.953.305l.043-.01zM17.19 3.5a.631.631 0 00.628-.64c0-.355-.279-.64-.628-.64a.631.631 0 00-.628.64c0 .355.28.64.628.64zm-10.38 0a.631.631 0 00.628-.64c0-.355-.28-.64-.628-.64a.631.631 0 00-.628.64c0 .355.279.64.628.64zm-5.182 7.852a.631.631 0 00-.628.64c0 .354.28.639.628.639a.63.63 0 00.627-.606l.001-.034a.62.62 0 00-.628-.64zm5.182 9.13a.631.631 0 00-.628.64c0 .355.279.64.628.64a.631.631 0 00.628-.64c0-.355-.28-.64-.628-.64zm10.38.018a.631.631 0 00-.628.64c0 .355.28.64.628.64a.631.631 0 00.628-.64c0-.355-.279-.64-.628-.64zm5.182-9.148a.631.631 0 00-.628.64c0 .354.279.639.628.639a.631.631 0 00.628-.64c0-.355-.28-.64-.628-.64zm-.384-4.992a.24.24 0 00.244-.249.24.24 0 00-.244-.249.24.24 0 00-.244.249c0 .142.122.249.244.249zM11.991.497a.24.24 0 00.245-.248A.24.24 0 0011.99 0a.24.24 0 00-.244.249c0 .133.108.236.223.247l.021.001zM2.011 6.36a.24.24 0 00.245-.249.24.24 0 00-.244-.249.24.24 0 00-.244.249.24.24 0 00.244.249zm0 11.263a.24.24 0 00-.243.248.24.24 0 00.244.249.24.24 0 00.244-.249.252.252 0 00-.244-.248zm19.995-.018a.24.24 0 00-.245.248.24.24 0 00.245.25.24.24 0 00.244-.25.252.252 0 00-.244-.248z\" fill=\"#3859FF\" fill-rule=\"nonzero\"></path></svg>", "minimax": "<svg class=\"lg\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"lobe-icons-minimax-_R_0_\" x1=\"0%\" x2=\"100.182%\" y1=\"50.057%\" y2=\"50.057%\"><stop offset=\"0%\" stop-color=\"#E2167E\"></stop><stop offset=\"100%\" stop-color=\"#FE603C\"></stop></linearGradient></defs><path d=\"M16.278 2c1.156 0 2.093.927 2.093 2.07v12.501a.74.74 0 00.744.709.74.74 0 00.743-.709V9.099a2.06 2.06 0 012.071-2.049A2.06 2.06 0 0124 9.1v6.561a.649.649 0 01-.652.645.649.649 0 01-.653-.645V9.1a.762.762 0 00-.766-.758.762.762 0 00-.766.758v7.472a2.037 2.037 0 01-2.048 2.026 2.037 2.037 0 01-2.048-2.026v-12.5a.785.785 0 00-.788-.753.785.785 0 00-.789.752l-.001 15.904A2.037 2.037 0 0113.441 22a2.037 2.037 0 01-2.048-2.026V18.04c0-.356.292-.645.652-.645.36 0 .652.289.652.645v1.934c0 .263.142.506.372.638.23.131.514.131.744 0a.734.734 0 00.372-.638V4.07c0-1.143.937-2.07 2.093-2.07zm-5.674 0c1.156 0 2.093.927 2.093 2.07v11.523a.648.648 0 01-.652.645.648.648 0 01-.652-.645V4.07a.785.785 0 00-.789-.78.785.785 0 00-.789.78v14.013a2.06 2.06 0 01-2.07 2.048 2.06 2.06 0 01-2.071-2.048V9.1a.762.762 0 00-.766-.758.762.762 0 00-.766.758v3.8a2.06 2.06 0 01-2.071 2.049A2.06 2.06 0 010 12.9v-1.378c0-.357.292-.646.652-.646.36 0 .653.29.653.646V12.9c0 .418.343.757.766.757s.766-.339.766-.757V9.099a2.06 2.06 0 012.07-2.048 2.06 2.06 0 012.071 2.048v8.984c0 .419.343.758.767.758.423 0 .766-.339.766-.758V4.07c0-1.143.937-2.07 2.093-2.07z\" fill=\"url(#lobe-icons-minimax-_R_0_)\" fill-rule=\"nonzero\"></path></svg>", "hunyuan": "<svg class=\"lg\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"12\" cy=\"12\" fill=\"#0055E9\" r=\"12\"></circle><path d=\"M12 0c.518 0 1.028.033 1.528.096A6.188 6.188 0 0112.12 12.28l-.12.001c-2.99 0-5.242 2.179-5.554 5.11-.223 2.086.353 4.412 2.242 6.146C3.672 22.1 0 17.479 0 12 0 5.373 5.373 0 12 0z\" fill=\"#A8DFF5\"></path><path d=\"M5.286 5a2.438 2.438 0 01.682 3.38c-3.962 5.966-3.215 10.743 2.648 15.136C3.636 22.056 0 17.452 0 12c0-1.787.39-3.482 1.09-5.006.253-.435.525-.872.817-1.311A2.438 2.438 0 015.286 5z\" fill=\"#0055E9\"></path><path d=\"M12.98.04c.272.021.543.053.81.093.583.106 1.117.254 1.538.44 6.638 2.927 8.07 10.052 1.748 15.642a4.125 4.125 0 01-5.822-.358c-1.51-1.706-1.3-4.184.357-5.822.858-.848 3.108-1.223 4.045-2.441 1.257-1.634 2.122-6.009-2.523-7.506L12.98.039z\" fill=\"#00BCFF\"></path><path d=\"M13.528.096A6.187 6.187 0 0112 12.281a5.75 5.75 0 00-1.71.255c.147-.905.595-1.784 1.321-2.501.858-.848 3.108-1.223 4.045-2.441 1.27-1.651 2.14-6.104-2.676-7.554.184.014.367.033.548.056z\" fill=\"#ECECEE\"></path></svg>"};
  const vendor=id=>/^claude/.test(id)?'claude':/^gpt/.test(id)?'openai':/^grok/.test(id)?'grok':/^glm/.test(id)?'zhipu':/^minimax/.test(id)?'minimax':/^tencent-hy|^hy\d/.test(id)?'hunyuan':null;
  const subs=[];
  const PP=window.PP={
    ICON,
    lang:()=>root.dataset.lang,
    t:(en,zh)=>root.dataset.lang==='zh'?zh:en,
    onRender(fn){subs.push(fn);fn()},
    rerender(){subs.forEach(f=>f())},
    css:n=>getComputedStyle(root).getPropertyValue(n).trim(),
    NS:'http://www.w3.org/2000/svg',
    el(tag,attrs,parent,text){const e=document.createElementNS(PP.NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(text!=null)e.textContent=text;if(parent)parent.appendChild(e);return e},
    // fixed-pixel SVG (text never scales); pick w from the host with PP.w so charts fill their card
    svg(host,w,h){host.innerHTML='';const s=PP.el('svg',{viewBox:`0 0 ${w} ${h}`,width:w,height:h,role:'img'});s.style.display='block';host.appendChild(s);return s},
    w:(host,min,max)=>Math.round(Math.max(min,Math.min(max||1e4,host.clientWidth||min))),
    tip(e,html){tip.innerHTML=html;tip.style.display='block';const w=tip.offsetWidth,h=tip.offsetHeight;let x=e.clientX+14,y=e.clientY+14;if(x+w>innerWidth-8)x=e.clientX-w-14;if(y+h>innerHeight-8)y=e.clientY-h-14;tip.style.left=Math.max(8,x)+'px';tip.style.top=Math.max(8,y)+'px'},
    untip(){tip.style.display='none'},
    hover(node,fn){node.addEventListener('mousemove',e=>PP.tip(e,fn()));node.addEventListener('mouseleave',PP.untip)},
    // one listener per host: any descendant carrying data-i (and data-j) gets a tooltip from get(i,j)
    tips(host,get){host.onmousemove=e=>{const t=e.target.closest('[data-i]');const h=t&&get(+t.dataset.i,+t.dataset.j);h?PP.tip(e,h):PP.untip()};host.onmouseleave=PP.untip},
    mix(a,b,t){const p=h=>{if(h.startsWith('rgb'))return h.match(/[\d.]+/g).slice(0,3).map(Number);h=h.replace('#','');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16))};const A=p(a),B=p(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')'},
    div(lr,lim){const t=Math.max(-1,Math.min(1,lr/lim));const m=PP.css('--div-mid');return t>=0?PP.mix(m,PP.css('--div-pos'),Math.pow(t,.8)):PP.mix(m,PP.css('--div-neg'),Math.pow(-t,.8))},
    inkOn(lr,lim){const t=Math.abs(lr/lim);if(t<=0.55)return PP.css('--text');return isDark()?'#0e141b':'#ffffff'},
    cell:(lr,lim)=>`background:${PP.div(lr,lim)};color:${PP.inkOn(lr,lim)}`,
    f0:x=>Math.round(x).toLocaleString('en-US'), f2:x=>(+x).toFixed(2),
    fr:r=>r>=100?Math.round(r).toString():r>=10?r.toFixed(1):r>=0.1?r.toFixed(2):r.toPrecision(2),
    json:p=>fetch(p,{cache:'no-store'}).then(r=>r.json()),
    LANG:{c:'C',cpp:'C++',csharp:'C#',go:'Go',java:'Java',js:'JavaScript',kotlin:'Kotlin',rust:'Rust',ts:'TypeScript'},
    ntasks:n=>PP.t(n===1?`${n} task`:`${n} tasks`,`${n} 题`),
    av(id,name,cls){const v=vendor(id);return `<span class="av${cls?' '+cls:''}"${name?` title="${name}"`:''}>${v?LOGO[v]:(name||id).slice(0,2)}</span>`},
    harness:id=>id.includes('@claude-code')?'Claude Code':'OpenHands CodeAct',
    // ink that stays readable on each categorical fill
    INK:{'--s1':'#ffffff','--s2':'#1f0e05','--s3':'#03271a','--s4':'#261900','--s5':'#2a0714','--s6':'#ffffff','--s7':'#ffffff'},
  };

  // diverging colour scale as a legend: lo/hi captions, a gradient bar, tick labels at log positions
  PP.scale=function(lim,ticks,lo,hi){
    const n=16,g=[...Array(n+1)].map((_,i)=>PP.div(-lim+2*lim*i/n,lim)).join(',');
    return `<span class="scale">${lo?`<span>${lo}</span>`:''}<span class="sc"><span class="gbar" style="display:block;background:linear-gradient(90deg,${g})"></span><span class="ticks" style="display:block">${ticks.map(([lr,t],i)=>`<span${i&&i!==ticks.length-1&&i!==(ticks.length-1)/2?' class="mn"':''} style="left:${(50+50*lr/lim).toFixed(1)}%">${t}</span>`).join('')}</span></span>${hi?`<span>${hi}</span>`:''}</span>`;
  };

  // heat grid. o: {corner, cols:[{h,sub,cls}], rows:[{label,sep,cells:[{lr|style|cls,text,tip}|null]}], lim, cls, minw}
  const heatSort={};
  PP.heat=function(host,o){
    const can=o.sort!==false, st=can?heatSort[host.id]:null, ord=o.rows.map((_,i)=>i);
    if(st){const v=i=>{if(st.j<0)return o.rows[i].label.replace(/<[^>]+>/g,'').toLowerCase();const c=o.rows[i].cells[st.j];return c&&c.lr!=null?c.lr:null};
      ord.sort((a,b)=>{const x=v(a),y=v(b);if(x===null||y===null)return (x===null)-(y===null)||a-b;return (typeof x==='number'?x-y:x.localeCompare(y))*st.dir||a-b})}
    const sa=j=>can?` data-s="${j}" role="button" tabindex="0" title="${PP.t('Sort by this column','按这一列排序')}" aria-sort="${st&&st.j===j?(st.dir>0?'ascending':'descending'):'none'}"`:'';
    host.innerHTML=`<div class="hm${o.cls?' '+o.cls:''}" style="--n:${o.cols.length};${o.minw?`min-width:${o.minw}px`:''}"><div class="hm-h hm-corner${can?' sortable':''}"${sa(-1)}><span>${o.corner||''}</span></div>`+
      o.cols.map((c,j)=>`<div class="hm-h${c.cls?' '+c.cls:''}${can?' sortable':''}"${sa(j)}><b>${c.h}</b>${c.sub?`<small>${c.sub}</small>`:''}</div>`).join('')+
      ord.map(i=>{const r=o.rows[i],sep=r.sep&&!st?' sep':'';return `<div class="hm-l${sep}">${r.label}</div>`+r.cells.map((c,j)=>{
        if(!c)return `<div class="hm-c na${sep}"></div>`;
        return `<div class="hm-c${c.cls?' '+c.cls:''}${sep}"${c.tip?` data-i="${i}" data-j="${j}"`:''} style="${c.style!=null?c.style:PP.cell(c.lr,o.lim)}">${c.text}</div>`}).join('')}).join('')+`</div>`;
    PP.tips(host,(i,j)=>{const c=o.rows[i].cells[j];return c&&c.tip&&c.tip()});
    if(can)host.onclick=host.onkeydown=e=>{if(e.type==='keydown'&&e.key!=='Enter'&&e.key!==' ')return;const h=e.target.closest('[data-s]');if(!h)return;e.preventDefault();
      const j=+h.dataset.s,first=j<0?1:-1,cur=heatSort[host.id];   // names A→Z first, numbers high→low first; a third click restores the default order
      if(cur&&cur.j===j){if(cur.dir===first)cur.dir=-first;else delete heatSort[host.id]}else heatSort[host.id]={j,dir:first};
      PP.heat(host,o)};
  };

  // score by language (overview + leaderboard)
  PP.langHeat=function(host,legendHost,D,note){
    const langs=Object.keys(D.lang_n),lim=Math.log(3);
    PP.heat(host,{lim,minw:780,corner:PP.t('System','系统'),
      cols:langs.map(l=>({h:PP.LANG[l],sub:PP.ntasks(D.lang_n[l])})),
      rows:D.systems.map(d=>({label:PP.av(d.id,d.name,'sm')+`<span>${d.name}</span>`,cells:langs.map(l=>{const v=d.lang[l];
        return {lr:Math.log(v/1000),text:PP.f0(v),tip:()=>`<b>${d.name}</b> · ${PP.LANG[l]}<br>${PP.t('score','分数')} ${PP.f0(v)} (${PP.ntasks(D.lang_n[l])})`}})}))});
    legendHost.innerHTML=`<div class="legend">${PP.scale(lim,[333,577,1000,1732,3000].map(v=>[Math.log(v/1000),PP.f0(v)]),PP.t('Lower','更低'),PP.t('Higher','更高'))}<span class="muted">${note}</span></div>`;
  };

  // horizontal stacked bars. o: {rows:[{label,bold,end,segs:[{v,c,tip}]}], max, ticks, lw}
  PP.stack=function(host,o){
    host.innerHTML=`<div class="sbars${o.left?' left':''}"${o.lw?` style="--lw:${o.lw}px"`:''}>`+o.rows.map((r,i)=>{const tot=r.segs.reduce((s,x)=>s+x.v,0);
      return `<div class="sb-row"><span class="sb-l${r.bold?' b':''}">${r.label}</span><span class="sb-t">${r.segs.map((s,j)=>s.v?`<i data-i="${i}" data-j="${j}" style="flex:${s.v} 0 0;background:var(${s.c});color:${PP.INK[s.c]||'#fff'}">${s.v/o.max>=.045?s.v:''}</i>`:'').join('')}${tot<o.max?`<em style="flex:${+(o.max-tot).toFixed(3)} 0 0">${r.end!=null?r.end:''}</em>`:''}</span></div>`}).join('')+
      (o.ticks?`<div class="sb-row"><span></span><span class="sb-ax">${o.ticks.map(t=>`<span style="left:${100*t/o.max}%">${t}</span>`).join('')}</span></div>`:'')+`</div>`;
    PP.tips(host,(i,j)=>{const s=o.rows[i].segs[j];return s&&s.tip&&s.tip()});
  };

  // one r = S/S_ref chip per model for a task
  PP.rchips=function(t,models,lim,label,link){
    return models.map(m=>{const r=t.r[m.id],nm=label(m),tag=link?'a':'span',hr=link?` href="${PP.caseUrl(t.id,m.id)}"`:'';if(r==null)return `<span class="rchip"><small>${nm}</small><b>–</b></span>`;
      const s=t.st[m.id],lr=Math.log(r);
      return `<${tag}${hr} class="rchip" style="${PP.cell(lr,lim)};border-color:transparent" title="${m.name}: ${s==='pass'?PP.t(`${PP.fr(r)}× the human fix's speedup`,`提速是人类修复的 ${PP.fr(r)} 倍`):(s==='fail'?PP.t('failing patch','补丁失败'):PP.t('no patch','未交补丁'))+PP.t(`, counted as no speedup (r = ${PP.fr(r)})`,`，按没有提速计（r = ${PP.fr(r)}）`)}"><small>${nm}</small><b>${s==='pass'?PP.fr(r)+'×':s==='fail'?PP.t('failed','失败'):PP.t('no patch','未交')}</b></${tag}>`}).join('');
  };

  // leaderboard rows in the SecPRBench style: rank, badge, score, meter (with CI and the human-fix mark), extras
  const lbSort={};
  PP.lbRows=function(host,D,o){o=o||{};const max=2200,pc=v=>+Math.min(100,100*v/max).toFixed(2),hf=pc(1000);
    const st=lbSort[host.id], rank=new Map(D.systems.map((x,i)=>[x.id,i+1]));
    const ref={best:{ref:1,name:PP.t('Best of six (per task)','六系统逐题最优'),score:D.refs.best.score,ci:D.refs.best.ci,capped:D.refs.best.capped,solved:D.refs.best.solved,beyond:D.refs.best.beyond},human:{ref:1,name:PP.t('Human fix','人类修复'),score:1000,capped:100,solved:D.n_tasks},nothing:{ref:1,name:PP.t('Do nothing','什么都不改'),score:D.refs.nothing,capped:0,solved:0,beyond:0}};
    let rows=[];
    if(!st){   // default: by score, reference points at their place in the ranking
      if(o.refs)rows.push(ref.best);
      D.systems.forEach((x,i)=>{rows.push(x);if(o.refs&&x.score>1000&&!(D.systems[i+1]&&D.systems[i+1].score>1000))rows.push(ref.human)});
      if(o.refs)rows.push(ref.nothing);
    }else{
      rows=[...D.systems].sort((a,b)=>(st.k==='name'?a.name.localeCompare(b.name):a[st.k]-b[st.k])*st.dir||rank.get(a.id)-rank.get(b.id));
      if(o.refs)rows.push(ref.best,ref.human,ref.nothing);
    }
    const cur=st||{k:'score',dir:-1}, sa=k=>` class="sortable" data-s="${k}" role="button" tabindex="0" title="${PP.t('Sort by this column','按这一列排序')}" aria-sort="${cur.k===k?(cur.dir>0?'ascending':'descending'):'none'}"`;
    const ci=r=>r.ci?PP.f0(r.ci[0])+'–'+PP.f0(r.ci[1]):'';
    const meter=r=>`<span class="meter"${r.ci?` title="95% CI ${ci(r)}"`:''}><span class="trk"><i style="width:${pc(r.score)}%"></i>${r.ci?`<s style="left:${pc(r.ci[0])}%;width:${+(pc(r.ci[1])-pc(r.ci[0])).toFixed(2)}%"></s>`:''}</span><u style="left:${hf}%"></u></span>`;
    host.innerHTML=`<div class="lb${o.compact?' compact':''}${o.full?' full':''}"><div class="lb-head"><span>#</span><span${sa('name')}>${PP.t('System','系统')}</span><span${sa('score')}>${PP.t('Score','分数')}</span><span class="axis"><em style="left:0">0</em><em class="hf" style="left:${hf}%">${PP.t('human fix','人类修复')}</em><em style="left:${pc(2000)}%">2,000</em></span><span class="ci">95% CI</span>${o.full?`<span${sa('capped').replace('class="sortable"','class="xtra sortable"')}>0–100</span>`:''}<span${sa('solved').replace('class="sortable"','class="xtra sortable"')}>${PP.t('Solved','解决')}</span>${o.full?`<span${sa('beyond').replace('class="sortable"','class="xtra sortable"')}>${PP.t('Beyond human','超越人类')}</span><span class="xtra">${PP.t('Pass / fail / none','通过/失败/无')}</span>`:''}<span></span></div>`+rows.map(r=>{
      if(r.ref)return `<div class="lb-row ref"><span class="rk"></span><span class="who"><span class="nm">${r.name}</span></span><span class="score">${PP.f0(r.score)}</span>${meter(r)}<span class="ci">${ci(r)}</span>${o.full?`<span class="xtra">${r.capped??'–'}</span>`:''}<span class="xtra">${o.full?(r.solved??'–'):''}</span>${o.full?`<span class="xtra">${r.beyond??'–'}</span><span class="xtra">–</span>`:''}<span class="go"></span></div>`;
      return `<div class="lb-row"><span class="rk">${String(rank.get(r.id)).padStart(2,'0')}</span><span class="who">${PP.av(r.id,r.name)}<span class="nm"><b>${r.name}</b><small>${r.harness}</small></span></span><span class="score">${PP.f0(r.score)}</span>${meter(r)}<span class="ci">${ci(r)}</span>${o.full?`<span class="xtra">${r.capped}</span>`:''}<span class="xtra">${r.solved}/${D.n_tasks}</span>${o.full?`<span class="xtra">${r.beyond}</span><span class="xtra">${r.passing} / ${r.failing} / ${r.no_patch}</span>`:''}<a class="go" href="tasks.html" aria-label="tasks">${ICON.arrow}</a></div>`}).join('')+`</div>`;
    host.onclick=host.onkeydown=e=>{if(e.type==='keydown'&&e.key!=='Enter'&&e.key!==' ')return;const h=e.target.closest('.lb-head [data-s]');if(!h)return;e.preventDefault();
      const k=h.dataset.s,nx=cur.k===k?{k,dir:-cur.dir}:{k,dir:k==='name'?1:-1};
      if(nx.k==='score'&&nx.dir===-1)delete lbSort[host.id];else lbSort[host.id]=nx;
      PP.lbRows(host,D,o)};
  };

  // click-to-sort for plain tables. Row 0 is the header; a row with class "why" travels with the row above it.
  // Header cells sort unless they carry data-nosort. First click: names A→Z, numbers high→low; second: reversed; third: default order.
  const tblSort={};
  PP.sortable=function(tb){
    if(!tb||tb.rows.length<2)return;const key=tb.id, head=tb.rows[0], ths=[...head.cells];
    const val=(row,j)=>{const c=row.cells[j];if(!c)return null;if(c.dataset.v!==undefined)return c.dataset.v===''?null:+c.dataset.v;
      const x=c.textContent.trim();if(!x||x==='–'||x==='—')return null;const m=x.replace(/,/g,'').replace(/−/g,'-').match(/^[+-]?(\d+\.?\d*|\.\d+)/);return m?+m[0]:x.toLowerCase()};
    const st=tblSort[key];
    ths.forEach((th,j)=>{if(th.dataset.nosort!==undefined)return;th.classList.add('sortable');th.tabIndex=0;th.title=PP.t('Sort by this column','按这一列排序');th.setAttribute('aria-sort',st&&st.j===j?(st.dir>0?'ascending':'descending'):'none')});
    if(st){const groups=[];[...tb.rows].slice(1).forEach(r=>{if(r.classList.contains('why')&&groups.length)groups[groups.length-1].push(r);else groups.push([r])});
      groups.forEach((g,i)=>{g.v=val(g[0],st.j);g.i=i});
      groups.sort((a,b)=>{if(a.v===null||b.v===null)return (a.v===null)-(b.v===null)||a.i-b.i;
        return (typeof a.v==='number'&&typeof b.v==='number'?a.v-b.v:String(a.v).localeCompare(String(b.v)))*st.dir||a.i-b.i});
      groups.forEach(g=>g.forEach(r=>head.parentNode.appendChild(r)))}
    head.onclick=head.onkeydown=e=>{if(e.type==='keydown'&&e.key!=='Enter'&&e.key!==' ')return;const th=e.target.closest('th');if(!th||th.dataset.nosort!==undefined)return;e.preventDefault();
      const j=ths.indexOf(th),probe=[...tb.rows].slice(1).map(r=>val(r,j)).find(v=>v!==null),first=typeof probe==='string'?1:-1,cur=tblSort[key];
      if(cur&&cur.j===j){if(cur.dir===first)cur.dir=-first;else delete tblSort[key]}else tblSort[key]={j,dir:first};
      PP.rerender()};
  };

  // ---------- task and case pages: links, escaping, step kinds, diffs, statements ----------
  PP.esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  PP.q=k=>qs.get(k);
  PP.taskUrl=t=>'task.html?id='+encodeURIComponent(t);
  PP.caseUrl=(t)=>PP.taskUrl(t);   // public build: no trajectory pages yet
  PP.CLS={algorithm:['algorithm','算法'],allocation:['allocation','内存分配'],branch:['branch','分支'],'data-structure':['data structure','数据结构'],io:['I/O','I/O'],'jit-unfriendly':['JIT-unfriendly','JIT 不友好'],locking:['locking','锁'],'memory-layout':['memory layout','内存布局'],other:['other','其他'],simd:['SIMD','SIMD'],syscall:['syscall','系统调用']};
  PP.cls=c=>PP.t(...(PP.CLS[c]||[c,c]));
  PP.track=t=>t==='library'?PP.t('library','库'):PP.t('application','应用');
  PP.FTYPE={semantic:['Wrong result','结果错误'],memory:['Memory safety','内存安全'],runtime:['Runtime exception / panic','运行时异常'],build:['Does not build','编译失败']};
  PP.CAUGHT={build:['caught by the build','在构建时拦下'],visible:['caught by the visible tests','被可见测试拦下'],hidden:['caught by the hidden checks','被隐藏检查拦下']};
  PP.why=f=>`<span class="chip accent">${PP.t(...PP.FTYPE[f.type])}</span><span>${PP.t(...PP.CAUGHT[f.caught])}</span><span>${PP.esc(f.evidence)}</span>`+(f.log?`<details><summary>${PP.t('Log of the failing stage','失败阶段的日志')}</summary><pre class="logtail">${PP.esc(f.log)}</pre></details>`:'');
  // a per-workload speedup, coloured by how it compares with the human fix on the same workload
  PP.wchip=(w,lim)=>w&&w.p!=null?`<span class="wchip" style="${w.h?PP.cell(Math.log(w.p/w.h),lim):''};border-color:transparent"><b>${PP.fr(w.p)}×</b><small>${PP.t('human','人类')} ${w.h!=null?PP.fr(w.h)+'×':'–'}</small></span>`:'<span class="muted">–</span>';
  PP.OUTCOME={pass:['passing patch','通过'],fail:['failing patch','补丁失败'],no_patch:['no patch','未交补丁']};
  PP.outcome=st=>`<span class="oc ${st}">${PP.t(...PP.OUTCOME[st])}</span>`;
  // what a trajectory step did; the letter comes from the data (classified by tool and command pattern)
  PP.KIND={L:['look','查看'],E:['edit','修改'],B:['build','构建'],T:['test','测试'],M:['measure','测量'],G:['git','git'],K:['think','思考'],F:['finish','结束'],O:['other','其他']};
  PP.kind=k=>PP.t(...(PP.KIND[k]||PP.KIND.O));
  PP.strip=(str,w,href)=>`<span class="strip" style="--w:${w}px">${[...str].map((k,i)=>href?`<a class="k-${k}" href="${href(i+1)}" data-i="${i}"></a>`:`<i class="k-${k}" data-i="${i}"></i>`).join('')}</span>`;
  PP.kindLegend=ks=>ks.map(k=>`<span><i class="k-${k}"></i>${PP.kind(k)}</span>`).join('');
  // unified diff -> one collapsible block per file
  PP.diff=function(text){
    if(!text||!text.trim())return `<p class="muted small" style="margin:0">${PP.t('No patch.','没有补丁。')}</p>`;
    const files=[];let cur=null;const open=()=>{cur={path:'',lines:[],add:0,del:0};files.push(cur)};
    for(const ln of text.replace(/\n$/,'').split('\n')){
      if(ln.startsWith('diff --git ')){open();cur.path=(ln.match(/ b\/(.+)$/)||[])[1]||'';continue}
      if(/^(index |new file mode|deleted file mode|similarity index|rename from|rename to|old mode|new mode|Binary files|\\ No newline)/.test(ln))continue;
      if(ln.startsWith('--- ')){if(!cur||cur.lines.length)open();continue}
      if(ln.startsWith('+++ ')){if(!cur)open();if(!cur.path)cur.path=ln.slice(4).replace(/^b\//,'');continue}
      if(!cur)open();
      const c=ln[0]==='+'?'a':ln[0]==='-'?'d':ln.startsWith('@@')?'h':'';
      if(c==='a')cur.add++;else if(c==='d')cur.del++;
      cur.lines.push(`<span class="${c}">${PP.esc(ln)||' '}</span>`);
    }
    const big=files.reduce((n,f)=>n+f.lines.length,0)>500;
    return files.map((f,i)=>`<details class="dfile"${!big||i<2?' open':''}><summary><span class="fn">${PP.esc(f.path)}</span><span class="pm"><b class="pa">+${f.add}</b><b class="pd">−${f.del}</b></span></summary><div class="diff">${f.lines.join('')}</div></details>`).join('');
  };
  PP.pm=(a,d)=>`<span class="pm"><b class="pa">+${a}</b><b class="pd">−${d}</b></span>`;
  // the small subset of Markdown that task statements use
  PP.md=function(src){
    const inl=s=>PP.esc(s).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>');
    const out=[];let para=[],list=null,code=null;
    const flushP=()=>{if(para.length){out.push('<p>'+inl(para.join(' '))+'</p>');para=[]}};
    const flush=()=>{flushP();if(list){out.push('<ul>'+list.map(x=>'<li>'+inl(x)+'</li>').join('')+'</ul>');list=null}};
    for(const ln of String(src||'').split('\n')){
      if(code){if(/^\s*```/.test(ln)){out.push('<pre class="mdcode">'+PP.esc(code.join('\n'))+'</pre>');code=null}else code.push(ln);continue}
      if(/^\s*```/.test(ln)){flush();code=[];continue}
      const h=ln.match(/^(#{1,4})\s+(.*)$/);if(h){flush();out.push(`<h4 class="md-h${h[1].length}">${inl(h[2])}</h4>`);continue}
      const li=ln.match(/^\s*(?:[-*]|\d+\.)\s+(.*)$/);if(li){flushP();(list=list||[]).push(li[1]);continue}
      if(!ln.trim()){flush();continue}
      if(list&&/^\s+\S/.test(ln)){list[list.length-1]+=' '+ln.trim();continue}
      if(list)flush();para.push(ln.trim());
    }
    if(code)out.push('<pre class="mdcode">'+PP.esc(code.join('\n'))+'</pre>');flush();return out.join('');
  };

  const themeBtn=document.getElementById('themebtn'), paintTheme=()=>{themeBtn.innerHTML=isDark()?ICON.sun:ICON.moon};
  paintTheme();
  document.getElementById('langbtn').onclick=()=>{root.dataset.lang=root.dataset.lang==='zh'?'en':'zh';store.set('pp-lang',root.dataset.lang);PP.rerender()};
  themeBtn.onclick=()=>{root.dataset.theme=isDark()?'light':'dark';store.set('pp-theme',root.dataset.theme);paintTheme();PP.rerender()};
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{paintTheme();PP.rerender()});
  document.addEventListener('scroll',PP.untip,{passive:true});
  let lastW=innerWidth,rz;addEventListener('resize',()=>{if(innerWidth===lastW)return;lastW=innerWidth;clearTimeout(rz);rz=setTimeout(PP.rerender,120)});
  if(qs.get('check')) setTimeout(()=>{const w=document.documentElement.scrollWidth,c=document.documentElement.clientWidth;const wide=[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>c+1&&!e.closest('.scroll,.nav nav,.diff')).slice(0,5).map(e=>e.tagName+'.'+e.className).join(',');document.body.setAttribute('data-overflow',w+'/'+c+' '+wide)},2500);
  // keep <html lang> in step and swap figure sources by language (data-en / data-zh on <img>)
  PP.onRender(()=>{root.lang=root.dataset.lang==='zh'?'zh-CN':'en';document.querySelectorAll('img[data-zh]').forEach(i=>{const s=root.dataset.lang==='zh'?i.dataset.zh:i.dataset.en;if(i.getAttribute('src')!==s)i.src=s})});
})();
