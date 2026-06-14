/* =========================================================================
   Central de Comunicados — controle de tema (claro/escuro + cor de destaque)
   Injeta o botão flutuante + popover e persiste a escolha em localStorage.
   Funciona em todas as páginas (index e comunicados) sem markup extra.
   ========================================================================= */
(function(){
  'use strict';
  var KEY_THEME = 'kbr-theme';
  var KEY_ACCENT = 'kbr-accent';
  var root = document.documentElement;

  var ACCENTS = [
    {k:'verde',    c:'#22B865', n:'Verde'},
    {k:'azul',     c:'#2F86D6', n:'Azul'},
    {k:'teal',     c:'#16B3A6', n:'Teal'},
    {k:'roxo',     c:'#8257E5', n:'Roxo'},
    {k:'laranja',  c:'#F08A24', n:'Laranja'},
    {k:'vermelho', c:'#E24D4D', n:'Vermelho'}
  ];

  function get(key){ try{ return localStorage.getItem(key); }catch(e){ return null; } }
  function set(key,val){ try{ localStorage.setItem(key,val); }catch(e){} }

  function currentTheme(){ return root.getAttribute('data-theme') || 'light'; }
  function currentAccent(){ return root.getAttribute('data-accent') || 'verde'; }

  // ---- ícones SVG ----
  var ICON_FAB  = '<svg viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r="1.3"/><circle cx="17.5" cy="10.5" r="1.3"/><circle cx="8.5" cy="7.5" r="1.3"/><circle cx="6.5" cy="12.5" r="1.3"/><path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.2 0-1 .8-1.5 1.7-1.5H16a5 5 0 0 0 5-5c0-3.9-4-7-9-7z"/></svg>';
  var ICON_SUN  = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var ICON_MOON = '<svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function build(){
    if(document.getElementById('kbrTheme')) return;

    var wrap = document.createElement('div');
    wrap.className = 'kbr-theme';
    wrap.id = 'kbrTheme';

    var swatches = ACCENTS.map(function(a){
      return '<button class="kbr-sw" type="button" data-accent="'+a.k+'" '+
             'style="--sw:'+a.c+'" title="'+a.n+'" aria-label="Cor '+a.n+'"></button>';
    }).join('');

    wrap.innerHTML =
      '<div class="kbr-pop" id="kbrPop" role="dialog" aria-label="Aparência da página" hidden>' +
        '<div class="kbr-label">Tema</div>' +
        '<div class="kbr-modes">' +
          '<button class="kbr-mode" type="button" data-mode="light">'+ICON_SUN+'Claro</button>' +
          '<button class="kbr-mode" type="button" data-mode="dark">'+ICON_MOON+'Escuro</button>' +
        '</div>' +
        '<div class="kbr-label">Cor de destaque</div>' +
        '<div class="kbr-swatches">'+swatches+'</div>' +
      '</div>' +
      '<button class="kbr-fab" id="kbrFab" type="button" aria-label="Mudar tema da página" aria-expanded="false">'+ICON_FAB+'</button>';

    document.body.appendChild(wrap);

    var fab = wrap.querySelector('#kbrFab');
    var pop = wrap.querySelector('#kbrPop');

    function sync(){
      var t = currentTheme(), a = currentAccent();
      wrap.querySelectorAll('.kbr-mode').forEach(function(b){
        b.classList.toggle('active', b.dataset.mode === t);
      });
      wrap.querySelectorAll('.kbr-sw').forEach(function(b){
        b.classList.toggle('active', b.dataset.accent === a);
      });
    }

    function openPop(){ pop.hidden = false; fab.setAttribute('aria-expanded','true'); }
    function closePop(){
      if(pop.hidden) return;
      pop.classList.add('closing');
      fab.setAttribute('aria-expanded','false');
      setTimeout(function(){ pop.hidden = true; pop.classList.remove('closing'); }, 160);
    }
    function togglePop(){ pop.hidden ? openPop() : closePop(); }

    fab.addEventListener('click', function(e){ e.stopPropagation(); togglePop(); });

    wrap.querySelectorAll('.kbr-mode').forEach(function(b){
      b.addEventListener('click', function(){
        root.setAttribute('data-theme', b.dataset.mode);
        set(KEY_THEME, b.dataset.mode);
        sync();
      });
    });
    wrap.querySelectorAll('.kbr-sw').forEach(function(b){
      b.addEventListener('click', function(){
        root.setAttribute('data-accent', b.dataset.accent);
        set(KEY_ACCENT, b.dataset.accent);
        sync();
      });
    });

    document.addEventListener('click', function(e){
      if(!wrap.contains(e.target)) closePop();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closePop();
    });

    sync();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
