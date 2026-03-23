// @ts-nocheck
'use client';

import { useEffect } from 'react';
import './donate.css';

export default function DonatePage() {
  useEffect(() => {
    /* ════════════════════════════════════════════
       CURSOR TOOLTIP
    ════════════════════════════════════════════ */
    const cursorTip = document.getElementById('cursor-tooltip');
    
    document.querySelectorAll('.book-obj').forEach(book => {
      const tipText = book.querySelector('.scene-tooltip')?.textContent || '';
    
      book.addEventListener('mouseenter', () => {
        cursorTip.textContent = tipText;
        cursorTip.classList.add('visible');
      });
      book.addEventListener('mouseleave', () => {
        cursorTip.classList.remove('visible');
      });
    });
    
    document.addEventListener('mousemove', e => {
      cursorTip.style.left = e.clientX + 'px';
      cursorTip.style.top  = e.clientY + 'px';
    });
    
    /* ════════════════════════════════════════════
       MAGIC FLOATING PARTICLES
    ════════════════════════════════════════════ */
    (function() {
      const canvas = document.getElementById('particleCanvas');
      const ctx    = canvas.getContext('2d');
    
      function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize);
    
      const COUNT = 38;
      const particles = [];
    
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x:     Math.random() * window.innerWidth,
          y:     Math.random() * window.innerHeight,
          r:     Math.random() * 2.2 + 0.7,       // radius 0.7~2.9px
          vx:    (Math.random() - 0.5) * 0.18,
          vy:    -(Math.random() * 0.22 + 0.06),  // drift upward slowly
          alpha: Math.random() * 0.65 + 0.30,   // 更亮，範圍 0.30~0.95
          pulse: Math.random() * Math.PI * 2,     // phase offset for twinkle
          hue:   Math.random() * 40 + 22,         // warm gold-orange 22-62
        });
      }
    
      let _animId;
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        particles.forEach(p => {
          p.pulse += 0.018;
          p.x += p.vx + Math.sin(p.pulse * 0.7) * 0.12;  // gentle sway
          p.y += p.vy;
    
          // wrap around
          if (p.y < -4)              p.y = canvas.height + 4;
          if (p.x < -4)              p.x = canvas.width  + 4;
          if (p.x > canvas.width +4) p.x = -4;
    
          const twinkle = 0.5 + 0.5 * Math.sin(p.pulse);
          const a = p.alpha * twinkle;
    
          // soft glow dot
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
          g.addColorStop(0,   `hsla(${p.hue}, 90%, 88%, ${a})`);   // 更飽和更亮
          g.addColorStop(0.4, `hsla(${p.hue}, 80%, 72%, ${a * 0.55})`);  // 中層更亮
          g.addColorStop(1,   `hsla(${p.hue}, 70%, 55%, 0)`);  // 外圍留更多色
    
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);  // 擴大光暈
          ctx.fillStyle = g;
          ctx.fill();
        });
    
        _animId = requestAnimationFrame(draw);
      }
      draw();
    })();
    
    /* ════════════════════════════════════════════
       BOOK CLICK — 羊皮紙捲起 + 祝福紙片
    ════════════════════════════════════════════ */
    const BLESSINGS = [
      '願你每一天，都有意外的驚喜降臨。',
      '星辰為你指路，願所有的願望悄悄成真。',
      '書頁翻動間，願智慧與你同行。',
      '燭光搖曳，願溫暖永遠環繞著你。',
      '魔法無處不在，你只需要相信。',
      '願每一次贊助，都帶給你三倍的幸運回來。',
      '深夜書房的秘密：凡是善意，終將得到回應。',
      '羊皮卷上記載：此人心地善良，諸事順遂。',
    ];
    
    const overlay     = document.getElementById('blessingOverlay');
    const blessingTxt = document.getElementById('blessingText');
    const blessingRune= document.getElementById('blessingRune');
    const closeBtn    = document.getElementById('blessingClose');
    const parchWrap   = document.querySelector('.parchment-wrap');
    const parchTop    = document.getElementById('parchmentTop');   // 羊皮紙上方區域
    const RUNES_BL    = ['ᚱ','ᛟ','ᚷ','ᚠ','ᛋ','ᚾ','ᛁ','ᚢ'];
    
    let blessingOpen = false;
    let formCollapsed = false;
    
    /* 純收合/展開表單，不觸發祝福紙片 */
    function toggleForm() {
      formCollapsed = !formCollapsed;
      if (formCollapsed) {
        parchWrap.classList.add('rolled');
        carrier.style.opacity = '0';
        carrier.style.pointerEvents = 'none';
      } else {
        parchWrap.classList.remove('rolled');
        carrier.style.opacity = '1';
        carrier.style.pointerEvents = '';
      }
    }
    
    function openBlessing() {
      if (blessingOpen) return;
      blessingOpen = true;
    
      // 隨機選祝福語
      blessingTxt.textContent = BLESSINGS[Math.floor(Math.random() * BLESSINGS.length)];
      blessingRune.textContent = RUNES_BL[Math.floor(Math.random() * RUNES_BL.length)];
    
      // 羊皮紙內容區收折（保留 ornament 露出）
      parchWrap.classList.add('rolled');
      carrier.style.opacity = '0';
      carrier.style.pointerEvents = 'none';
      formCollapsed = false;
    
      // 紙片浮出
      setTimeout(() => {
        overlay.classList.add('active');
      }, 280);
    }
    
    function closeBlessing() {
      if (!blessingOpen) return;
      overlay.classList.remove('active');
    
      setTimeout(() => {
        if (!formCollapsed) {
          parchWrap.classList.remove('rolled');
          carrier.style.opacity = '1';
          carrier.style.pointerEvents = '';
        }
        blessingOpen = false;
      }, 380);
    }
    
    // 書本點擊
    document.querySelectorAll('.book-obj').forEach(book => {
      book.addEventListener('click', e => {
        e.stopPropagation();
        cursorTip.classList.remove('visible');
        openBlessing();
      });
    });
    
    // 點擊關閉按鈕或 overlay 背景
    closeBtn.addEventListener('click', closeBlessing);
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeBlessing();
    });
    // ESC 關閉
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeBlessing();
    });
    
    // Ornament 常態點擊：只做表單收合/展開，不觸發祝福紙片
    parchTop.addEventListener('click', (e) => {
      e.stopPropagation();  // 不冒泡到 parchWrap
      if (blessingOpen) {
        // 如果祝福紙片開著，先關掉紙片，不自動展開表單
        closeBlessing();
      } else {
        // 純收合/展開表單
        toggleForm();
      }
    });
    
    // 點擊羊皮紙區域也可收起
    // 但排除 ornament（parchTop）本身，避免與 toggle 衝突
    parchWrap.addEventListener('click', (e) => {
      if (!blessingOpen) return;
      // 如果點到的是 ornament 區域，讓 parchTop 的 listener 處理
      if (parchTop.contains(e.target)) return;
      closeBlessing();
    });
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.textContent.replace(/[^\d]/g, '');
        const input = chip.closest('.field-group').querySelector('input');
        if (input) { input.value = val; syncValidity(); }
      });
    });
    
    /* ════════════════════════════════════════════
       ELEMENTS
    ════════════════════════════════════════════ */
    const inputName   = document.getElementById('inputName');
    const inputAmount = document.getElementById('inputAmount');
    const carrier     = document.getElementById('btnCarrier');
    const jelly       = document.getElementById('btnJelly');
    const btnSubmit   = document.getElementById('btnSubmit');
    const ghost       = document.getElementById('btnGhost');
    
    // 把 carrier 移到 body，脫離 parchment 的任何裁切
    document.body.appendChild(carrier);
    
    
    /* ════════════════════════════════════════════
       GLITCH INPUT ENGINE
      原理：
      - 監聽每個 input/textarea 的 input 事件
      - 在 overlay 上渲染「已定型字元 + 最新字元的亂碼動畫」
      - 每個新打的字先用隨機亂碼字元閃爍 ~280ms，再隱藏 overlay
      - input 本身透明色，視覺上看到的是 overlay 的內容
      - 亂碼結束後 overlay 清空，顯示回 input 原本的文字
    ════════════════════════════════════════════ */
    const GLITCH_CHARS = 'ᚱᚾᛟᚷᛋᚠᛁᚢᛏᚦ#@$%&!?*█▓▒░╳⌘⚡✦∆Ωλψ';
    const GLITCH_DURATION = 280; // ms 每個字的亂碼持續時間
    
    function randomGlyphFor(ch) {
      // 數字用數字亂碼，文字用符文/符號
      if (/\d/.test(ch)) return String(Math.floor(Math.random() * 10));
      return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    }
    
    function setupGlitch(input, overlay) {
      // 讓 input 文字在「有 overlay 時」變透明（overlay 覆蓋顯示）
      // 沒有 overlay 內容時顯示回正常顏色
      let glitchTimer = null;
    
      input.addEventListener('input', () => {
        const val = input.value;
        if (!val) { overlay.innerHTML = ''; return; }
    
        // 清掉舊 timer
        if (glitchTimer) clearTimeout(glitchTimer);
    
        // 讓 input 原本的字變透明（overlay 接管顯示）
        input.style.color = 'transparent';
        input.style.caretColor = '#2a1405'; // 但保留游標顏色
    
        // 渲染 overlay：前 n-1 字已定型，最後一字亂碼
        renderOverlay(overlay, val);
    
        // 亂碼持續 GLITCH_DURATION 後恢復
        glitchTimer = setTimeout(() => {
          overlay.innerHTML = '';
          input.style.color = '';
          input.style.caretColor = '';
        }, GLITCH_DURATION);
      });
    
      // 清空時清掉 overlay
      input.addEventListener('change', () => {
        if (!input.value) {
          overlay.innerHTML = '';
          input.style.color = '';
        }
      });
    }
    
    function renderOverlay(overlay, val) {
      // 把所有字元分成「已定型」和「最新字元（亂碼）」
      const settled = val.slice(0, -1);
      const latest  = val.slice(-1);
    
      let html = '';
    
      // 已定型的字元（正常顯示）
      for (const ch of settled) {
        if (ch === ' ') {
          html += '<span class="settled-char">&nbsp;</span>';
        } else {
          html += `<span class="settled-char">${escHtml(ch)}</span>`;
        }
      }
    
      // 最新輸入的字：先閃幾個亂碼 span，再接真實字元
      // 視覺上看到的：亂碼在最新字元位置跳動
      const glyphs = Array.from({ length: 3 }, () => randomGlyphFor(latest));
      for (let i = 0; i < glyphs.length; i++) {
        html += `<span class="glitch-char" style="animation-delay:${i * 60}ms;position:absolute;margin-left:${i === 0 ? 0 : -1}ch">${escHtml(glyphs[i])}</span>`;
      }
      // 真實字元（在亂碼消失後才"出現"——其實是 input 恢復顯示）
      html += `<span class="settled-char" style="opacity:0">${escHtml(latest)}</span>`;
    
      overlay.innerHTML = html;
    }
    
    function escHtml(str) {
      return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
    
    // 初始化三個欄位
    setupGlitch(inputName,   document.getElementById('glitchName'));
    setupGlitch(inputAmount, document.getElementById('glitchAmount'));
    setupGlitch(document.getElementById('inputMsg'), document.getElementById('glitchMsg'));
    
    /* ════════════════════════════════════════════
       STATE
    ════════════════════════════════════════════ */
    let offsetX = 0, offsetY = 0;
    let lastRunAt = 0;
    const PAD = 8; // min distance from viewport edge
    
    /* ════════════════════════════════════════════
       VALIDATION
    ════════════════════════════════════════════ */
    function isValid() {
      const name   = inputName.value.trim();
      const amount = parseFloat(inputAmount.value);
      return name.length > 0 && !isNaN(amount) && amount >= 30;
    }
    
    function syncValidity() {
      if (isValid()) {
        carrier.classList.add('valid-mode');
        back();
        ghost.classList.remove('visible');
      } else {
        carrier.classList.remove('valid-mode');
      }
    }
    [inputName, inputAmount].forEach(el => el.addEventListener('input', syncValidity));
    
    // 初始對齊
    requestAnimationFrame(() => applyTransform());
    
    
    /* ════════════════════════════════════════════
       BACK — return to origin
    ════════════════════════════════════════════ */
    function back() {
      offsetX = 0;
      offsetY = 0;
      applyTransform();
    }
    
    /* ════════════════════════════════════════════
       APPLY TRANSFORM
    ════════════════════════════════════════════ */
    function applyTransform() {
      // zone 的 viewport 中心座標（固定不動的佔位 div）
      const zone = document.getElementById('btnZone');
      const zr   = zone.getBoundingClientRect();
      const zx   = zr.left + zr.width  / 2;
      const zy   = zr.top  + zr.height / 2;
      // carrier 從 fixed(0,0) 出發，translate 到 zone 中心 + offset
      const hw   = carrier.offsetWidth  / 2;
      const hh   = carrier.offsetHeight / 2;
      carrier.style.transform = `translate(${zx + offsetX - hw}px, ${zy + offsetY - hh}px)`;
    }
    
    /* ════════════════════════════════════════════
       HELPERS
    ════════════════════════════════════════════ */
    function unitVector(x, y) {
      const len = Math.sqrt(x * x + y * y) || 1;
      return { x: x / len, y: y / len };
    }
    function vecLen(x, y) {
      return Math.sqrt(x * x + y * y);
    }
    
    /* ════════════════════════════════════════════
       PARCHMENT BOUNDS — 取得羊皮紙邊界
      邊界基準是 .parchment 元素本身，
      在任何視窗尺寸下都準確（預覽視窗也沒問題）。
    ════════════════════════════════════════════ */
    function getParchmentBounds() {
      const zone = document.getElementById('btnZone');
      const zr   = zone.getBoundingClientRect();
      const bw = carrier.offsetWidth;
      const bh = carrier.offsetHeight;
      const hw = bw / 2, hh = bh / 2;
      const homeX = zr.left + zr.width  / 2;
      const homeY = zr.top  + zr.height / 2;
    
      const pw  = document.querySelector('.parchment-wrap');
      const pwr = pw.getBoundingClientRect();
    
      // minY：從 ornament 區域（parchmentTop）的下緣開始
      // 這樣收合狀態下按鈕也不會跑到 ornament 上方看不見
      const orn    = document.getElementById('parchmentTop');
      const ornR   = orn.getBoundingClientRect();
      const topY   = ornR.bottom;   // ornament 下緣
    
      // bottom：用 scrollHeight 確保展開高度（不受 rolled 影響）
      const fullBottom = pwr.top + pw.scrollHeight;
    
      return {
        homeX, homeY,
        minX: pwr.left   + hw + PAD - homeX,
        maxX: pwr.right  - hw - PAD - homeX,
        minY: topY       + hh + PAD - homeY,
        maxY: fullBottom - hh - PAD - homeY,
      };
    }
    
    /* ════════════════════════════════════════════
       RUN — 一次離散跳躍 + 撞邊反彈
      流程：
      1. 計算逃離方向與步距
      2. 嘗試移動到新位置
      3. 如果超出羊皮紙邊界 → 反彈（方向翻轉）再夾邊
      4. 撞邊時觸發額外 jelly bounce 表現撞擊感
    ════════════════════════════════════════════ */
    function run(mouseXInCarrier, mouseYInCarrier) {
      const now = Date.now();
      if (now - lastRunAt < 10) return;
      lastRunAt = now;
    
      const bw = carrier.offsetWidth;
      const bh = carrier.offsetHeight;
    
      // 逃離方向
      const dx = bw / 2 - mouseXInCarrier;
      const dy = bh / 2 - mouseYInCarrier;
      const dir = unitVector(dx, dy);
    
      const step = bw * 1.6;
      let newX = offsetX + dir.x * step;
      let newY = offsetY + dir.y * step;
    
      const b = getParchmentBounds();
      let bounced = false;
    
      // 撞左右邊 → X 反彈
      if (newX < b.minX) { newX = b.minX + (b.minX - newX) * 0.5; bounced = true; }
      if (newX > b.maxX) { newX = b.maxX - (newX - b.maxX) * 0.5; bounced = true; }
      // 撞上下邊 → Y 反彈
      if (newY < b.minY) { newY = b.minY + (b.minY - newY) * 0.5; bounced = true; }
      if (newY > b.maxY) { newY = b.maxY - (newY - b.maxY) * 0.5; bounced = true; }
    
      // 最終再夾一次確保絕對不出界
      newX = Math.max(b.minX, Math.min(b.maxX, newX));
      newY = Math.max(b.minY, Math.min(b.maxY, newY));
    
      offsetX = newX;
      offsetY = newY;
    
      applyTransform();
      triggerJelly(bounced);   // 撞邊時給更強的 bounce
      ghost.classList.add('visible');
      spawnRune(bounced);
    }
    
    /* ════════════════════════════════════════════
       JELLY BOUNCE
      bounced=true 時加上 .hard 讓壓扁更誇張
    ════════════════════════════════════════════ */
    function triggerJelly(bounced = false) {
      jelly.classList.remove('bouncing', 'bounce-hard');
      void jelly.offsetWidth; // force reflow
      jelly.classList.add('bouncing');
      if (bounced) jelly.classList.add('bounce-hard');
    }
    
    carrier.addEventListener('transitionend', () => {
      // transition 結束後什麼都不用做，offset 已正確
    });
    
    /* ════════════════════════════════════════════
       RUNE FLASH — 撞邊時噴更多符文
    ════════════════════════════════════════════ */
    const RUNES = ['ᚱ','ᚾ','ᛟ','ᚷ','ᛋ','ᚠ','ᛁ','ᚢ','ᛏ','ᚦ'];
    let runeCooldown = false;
    
    function spawnRune(bounced = false) {
      if (runeCooldown) return;
      runeCooldown = true;
      setTimeout(() => { runeCooldown = false; }, 300);
    
      const count = bounced ? 3 : 1;   // 撞邊噴 3 顆，正常逃跑噴 1 顆
      const r = carrier.getBoundingClientRect();
    
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const el = document.createElement('span');
          el.className   = 'rune-flash';
          el.textContent = RUNES[Math.floor(Math.random() * RUNES.length)];
          el.style.left  = (r.left + r.width  / 2 + (Math.random() - 0.5) * 60) + 'px';
          el.style.top   = (r.top  + r.height / 2 + (Math.random() - 0.5) * 36) + 'px';
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 520);
        }, i * 80);
      }
    }
    
    /* ════════════════════════════════════════════
       MOUSEMOVE — 全域監聽（問題3修正）
      改成監聽整個 document 而非 carrier 本身，
      所以即使按鈕被 YT 按鈕或其他元素蓋住也能偵測。
      感應半徑 = 按鈕對角線 * 0.9。
    ════════════════════════════════════════════ */
    document.addEventListener('mousemove', e => {
      if (isValid()) return;
    
      const r  = carrier.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dist = vecLen(e.clientX - cx, e.clientY - cy);
    
      // 感應半徑：按鈕對角線 0.9 倍
      const sense = vecLen(r.width, r.height) * 0.5;  // 縮短感應距離
    
      if (dist < sense) {
        run(e.clientX - r.left, e.clientY - r.top);
      }
    });
    
    /* ════════════════════════════════════════════
       CLICK
    ════════════════════════════════════════════ */
    carrier.addEventListener('click', async (e) => {
      if (!isValid()) {
        [inputName, inputAmount].forEach(inp => {
          const bad = inp === inputName
            ? !inp.value.trim()
            : (isNaN(parseFloat(inp.value)) || parseFloat(inp.value) < 30);
          if (bad) {
            inp.classList.add('error');
            const lbl = inp.closest('.field-group')?.querySelector('.field-label');
            if (lbl) lbl.classList.add('error-label');
            setTimeout(() => {
              inp.classList.remove('error');
              if (lbl) lbl.classList.remove('error-label');
            }, 700);
          }
        });
        const r = carrier.getBoundingClientRect();
        run(e.clientX - r.left, e.clientY - r.top);
        return;
      }
    
      btnSubmit.textContent = '✦ 正在封印… ✦';
      btnSubmit.style.pointerEvents = 'none';
      try {
        const inputMsg = document.getElementById('inputMsg');
        const res = await fetch('https://localhost:44333/api/Ecpay/CreateOrder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: inputName.value.trim(),
            message: inputMsg ? inputMsg.value.trim() : '',
            amount: parseInt(inputAmount.value, 10)
          })
        });
        if (!res.ok) throw new Error('Server error: ' + res.status);
        const ecpayHtml = await res.text();
        document.open();
        document.write(ecpayHtml);
        document.close();
      } catch (err) {
        console.error('ECPay error:', err);
        btnSubmit.innerHTML = '✦  封印並送出  ✦';
        btnSubmit.style.pointerEvents = '';
        alert('⚠️ 連線失敗，請稍後再試');
      }
    });
    
    /* ════════════════════════════════════════════
       INTERSECTION OBSERVER — 跑出視窗時回家
    ════════════════════════════════════════════ */
    new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) back();
    }).observe(carrier);
    
    /* ════════════════════════════════════════════
       RESIZE
    ════════════════════════════════════════════ */
    window.addEventListener('resize', () => {
      if (offsetX !== 0 || offsetY !== 0) {
        // 視窗縮放後重新用羊皮紙邊界夾一次
        const b = getParchmentBounds();
        offsetX = Math.max(b.minX, Math.min(b.maxX, offsetX));
        offsetY = Math.max(b.minY, Math.min(b.maxY, offsetY));
        applyTransform();
      }
    });
    
    
    
    /* ════════════════════════════════════════════
       LAMP CLICK — 迷霧效果 + 文字散架 + 丟字入迷霧
    ════════════════════════════════════════════ */
    const lampOverlay   = document.getElementById('lampOverlay');
    const lampMistClose = document.getElementById('lampMistClose');
    const lampWordsEl   = document.getElementById('lampMistWords');
    const lampScatter   = document.getElementById('lampMistScatter');
    const lampInput     = document.getElementById('lampMistInput');
    const lampSend      = document.getElementById('lampMistSend');
    const scene         = document.getElementById('mainScene');
    
    // 預設散架文字
    const SCATTER_TEXT = '燭火搖曳，霧氣瀰漫，一切皆在夢與醒之間。';
    
    /* ── 文字散架：把文字拆成字元 span，滑鼠靠近時彈開 ── */
    function buildScatterText(text) {
      lampScatter.innerHTML = '';
      [...text].forEach(ch => {
        const span = document.createElement('span');
        span.className = 'scatter-char';
        span.textContent = ch;
        span.dataset.ox = 0;  // original offset
        span.dataset.oy = 0;
        lampScatter.appendChild(span);
      });
    }
    
    // 追蹤滑鼠，讓字元彈開
    const EVADE_R = 55;  // 感應半徑
    function handleScatterMouse(e) {
      const chars = lampScatter.querySelectorAll('.scatter-char');
      chars.forEach(span => {
        const r  = span.getBoundingClientRect();
        const cx = r.left + r.width  / 2;
        const cy = r.top  + r.height / 2;
        const dx = cx - e.clientX;
        const dy = cy - e.clientY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < EVADE_R) {
          const force = (1 - dist / EVADE_R) * 28;
          const ux = dist > 0 ? dx/dist : 0;
          const uy = dist > 0 ? dy/dist : 0;
          span.style.transform = `translate(${ux*force}px, ${uy*force}px)`;
        } else {
          span.style.transform = '';
        }
      });
    }
    
    /* ── 丟字入迷霧 ── */
    function throwWord(text) {
      if (!text.trim()) return;
      const el = document.createElement('div');
      el.className = 'mist-word';
      el.textContent = text;
    
      // 全視窗隨機位置：水平 10~90%，垂直從下半部往上飄
      const left   = 8 + Math.random() * 82;
      const startY = 50 + Math.random() * 38;   // 視窗高度 50~88%
      const dx     = (Math.random() - 0.5) * 160;
      const dur    = 5 + Math.random() * 5;
      // 字體大小：1~3rem，分三段隨機（小/中/大）
      const sizeGroup = Math.random();
      const size = sizeGroup < 0.4
        ? 1.0 + Math.random() * 0.6    // 小：1~1.6rem
        : sizeGroup < 0.75
          ? 1.8 + Math.random() * 0.8  // 中：1.8~2.6rem
          : 2.8 + Math.random() * 0.8; // 大：2.8~3.6rem
      el.style.cssText = `left:${left}%; top:${startY}vh; font-size:${size}rem; --dur:${dur}s; --dx:${dx}px;`;
    
      lampWordsEl.appendChild(el);
      setTimeout(() => el.remove(), dur * 1000 + 300);
    }
    
    /* ── 開啟 / 關閉 ── */
    function openLampMist() {
      scene.classList.add('lamp-click');
      setTimeout(() => scene.classList.remove('lamp-click'), 500);
      buildScatterText(SCATTER_TEXT);
      lampOverlay.classList.add('active');
      setTimeout(() => lampInput.focus(), 600);
    }
    function closeLampMist() {
      lampOverlay.classList.remove('active');
      // 重置字元位置
      lampScatter.querySelectorAll('.scatter-char').forEach(s => {
        s.style.transform = '';
      });
    }
    
    // 事件
    document.getElementById('obj-lamp').addEventListener('click', openLampMist);
    lampMistClose.addEventListener('click', closeLampMist);
    lampOverlay.addEventListener('click', e => {
      if (e.target === lampOverlay) closeLampMist();
    });
    lampOverlay.addEventListener('mousemove', handleScatterMouse);
    lampOverlay.addEventListener('mouseleave', () => {
      lampScatter.querySelectorAll('.scatter-char').forEach(s => {
        s.style.transform = '';
      });
    });
    
    // 送出文字
    function sendMistWord() {
      const val = lampInput.value.trim();
      if (!val) return;
      throwWord(val);
      lampInput.value = '';
      lampInput.focus();
    }
    lampSend.addEventListener('click', sendMistWord);
    lampInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') sendMistWord();
    });
    
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeLampMist(); closeBlessing(); }
    });
    
    
    /* ════════════════════════════════════════════
       羽毛筆竄改金額
    ════════════════════════════════════════════ */
    const penObj    = document.getElementById('obj-pen');
    let penBusy = false;
    
    function penTamperAmount() {
      if (penBusy) return;
      penBusy = true;
    
      const amountInput = document.getElementById('inputAmount');
      const current = parseFloat(amountInput.value) || 0;
    
      // 竄改：原本有數字就加倍+隨機，沒有就填隨機
      const newVal = current > 0
        ? Math.floor(current * (1.5 + Math.random()) + Math.random() * 300 + 88)
        : Math.floor(Math.random() * 900 + 100);
    
      // 計算筆需要飛到金額欄的相對位移
      const penR    = penObj.getBoundingClientRect();
      const inputR  = amountInput.getBoundingClientRect();
      const flyX = inputR.left + inputR.width/2  - (penR.left + penR.width/2);
      const flyY = inputR.top  + inputR.height/2 - (penR.top  + penR.height/2);
    
      penObj.style.setProperty('--fly-x', flyX + 'px');
      penObj.style.setProperty('--fly-y', flyY + 'px');
      penObj.classList.add('pen-flying');
      const penShadow = document.getElementById('obj-pen-shadow');
      if (penShadow) { penShadow.style.transition = 'opacity 0.3s ease'; penShadow.style.opacity = '0'; }
    
      // 飛到金額欄後，竄改數字
      setTimeout(() => {
        // 金額欄加刪除線效果
        if (current > 0) {
          amountInput.classList.add('amount-strike');
        }
    
        // 亂碼閃爍後換成新數字
        let flicker = 0;
        const flickerInterval = setInterval(() => {
          amountInput.value = Math.floor(Math.random() * 9999);
          flicker++;
          if (flicker >= 6) {
            clearInterval(flickerInterval);
            amountInput.value = newVal;
            amountInput.classList.remove('amount-strike');
            amountInput.classList.add('amount-new');
            // 觸發 validation 更新
            amountInput.dispatchEvent(new Event('input'));
            setTimeout(() => amountInput.classList.remove('amount-new'), 500);
          }
        }, 80);
      }, 1000);  // 飛行 1s 後開始竄改
    
      // 竄改完後筆飛回
      setTimeout(() => {
        penObj.classList.remove('pen-flying');
        penObj.style.removeProperty('--fly-x');
        penObj.style.removeProperty('--fly-y');
        const penShadowBack = document.getElementById('obj-pen-shadow');
        if (penShadowBack) { penShadowBack.style.opacity = '1'; }
        if (formCollapsed) toggleForm();
        penBusy = false;
      }, 2200);
    }
    
    // 綁定點擊
    penObj.addEventListener('click', () => {
      // 如果表單是收合的，先展開再竄改
      if (formCollapsed) {
        toggleForm();
        setTimeout(penTamperAmount, 400);
      } else {
        penTamperAmount();
      }
    });
    
    // tooltip
    penObj.addEventListener('mouseenter', () => {
      cursorTip.textContent = '羽毛筆';
      cursorTip.classList.add('visible');
    });
    penObj.addEventListener('mouseleave', () => {
      cursorTip.classList.remove('visible');
    });
    
    
    

    /* ════════════════════════════════════════════
       桌上書本 — 規則說明卡
    ════════════════════════════════════════════ */
    const bookOpenObj     = document.getElementById('obj-bookopen');
    const infoCardOverlay = document.getElementById('infoCardOverlay');
    const infoCardClose   = document.getElementById('infoCardClose');
    const infoCornerWrap  = document.getElementById('infoCornerWrap');

    // path 元素（描線用）
    const cornerEls = {
      tl: infoCardOverlay.querySelector('.info-corner.tl path'),
      tr: infoCardOverlay.querySelector('.info-corner.tr path'),
      bl: infoCardOverlay.querySelector('.info-corner.bl path'),
      br: infoCardOverlay.querySelector('.info-corner.br path'),
    };
    const infoContent = document.getElementById('infoCardContent');

    function cancelWaapi(el) {
      if (!el) return;
      el.getAnimations().forEach(a => a.cancel());
    }

    function openInfoCard() {
      infoCardOverlay.classList.add('active');

      // ── wrapper scale(0→1)：四角從中心同時散開 ──
      cancelWaapi(infoCornerWrap);
      infoCornerWrap.animate(
        [{ transform: 'scale(0)' }, { transform: 'scale(1)' }],
        { duration: 400, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
      );

      // ── 角落描線：角落展開後開始畫 ──
      Object.values(cornerEls).forEach(path => {
        if (!path) return;
        cancelWaapi(path);
        path.setAttribute('stroke-dashoffset', '44');
        path.animate(
          [{ strokeDashoffset: '44' }, { strokeDashoffset: '0' }],
          { duration: 300, delay: 350, easing: 'ease', fill: 'forwards' }
        );
      });

      // ── 內容閃爍淡入 ──
      if (infoContent) {
        cancelWaapi(infoContent);
        infoContent.animate(
          [
            { opacity: 0 },
            { opacity: 0.08 },
            { opacity: 0.75 },
            { opacity: 0.25 },
            { opacity: 1 },
          ],
          { duration: 280, delay: 720, easing: 'steps(4, end)', fill: 'forwards' }
        );
      }
    }

    function closeInfoCard() {
      // ── 內容退場 ──
      if (infoContent) {
        cancelWaapi(infoContent);
        infoContent.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: 140, easing: 'ease', fill: 'forwards' }
        );
      }

      // ── 描線退場 ──
      Object.values(cornerEls).forEach(path => {
        if (!path) return;
        cancelWaapi(path);
        path.animate(
          [{ strokeDashoffset: '0' }, { strokeDashoffset: '44' }],
          { duration: 160, easing: 'ease-in', fill: 'forwards' }
        );
      });

      // ── wrapper scale(1→0)：四角往中心收攏 ──
      cancelWaapi(infoCornerWrap);
      infoCornerWrap.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(0)' }],
        { duration: 300, delay: 60, easing: 'cubic-bezier(0.64, 0, 0.78, 0)', fill: 'forwards' }
      );

      requestAnimationFrame(() => infoCardOverlay.classList.remove('active'));
    }

    bookOpenObj.addEventListener('click', openInfoCard);
    infoCardClose.addEventListener('click', closeInfoCard);
    infoCardOverlay.addEventListener('click', (e) => {
      if (e.target === infoCardOverlay) closeInfoCard();
    });

    /* ════════════════════════════════════════════
       骷髏互動
    ════════════════════════════════════════════ */
    const skeletonObj = document.getElementById('obj-skeleton2-2');
    const SKELETON_JOKES = [
      '嘎～你終於看到我了。',
      '我在這守了三百年，你有什麼資格打擾？',
      '…（空洞的眼神凝視著你）',
      '那些書？都是我生前沒讀完的。',
      '你知道嗎，孤單比死亡更可怕。',
      '哼，又來一個好奇的人類。',
      '我已經忘記自己的名字了，但我記得每一本書。',
    ];
    skeletonObj.addEventListener('click', () => {
      const joke = SKELETON_JOKES[Math.floor(Math.random() * SKELETON_JOKES.length)];
      cursorTip.textContent = joke;
      cursorTip.classList.add('visible');
      setTimeout(() => cursorTip.classList.remove('visible'), 2800);
    });
    skeletonObj.addEventListener('mouseenter', () => {
      cursorTip.textContent = '守護者';
      cursorTip.classList.add('visible');
    });
    skeletonObj.addEventListener('mouseleave', () => {
      cursorTip.classList.remove('visible');
    });

    /* ════════════════════════════════════════════
       香爐互動 — 煙霧粒子
    ════════════════════════════════════════════ */
    const urnObj = document.getElementById('obj-urn');
    let urnSmokeInterval = null;

    function spawnSmoke() {
      const r = urnObj.getBoundingClientRect();
      const particle = document.createElement('div');
      particle.className = 'smoke-particle';
      const dx = (Math.random() - 0.5) * 50;
      const dur = 2.2 + Math.random() * 1.5;
      const size = 14 + Math.random() * 14;
      particle.style.cssText = `
        left:${r.left + r.width * 0.5 - size / 2}px;
        top:${r.top + r.height * 0.12}px;
        width:${size}px; height:${size}px;
        --smoke-dx:${dx}px; --smoke-dur:${dur}s;
      `;
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), dur * 1000 + 200);
    }

    urnObj.addEventListener('mouseenter', () => {
      cursorTip.textContent = '香爐';
      cursorTip.classList.add('visible');
      spawnSmoke();
      urnSmokeInterval = setInterval(spawnSmoke, 380);
    });
    urnObj.addEventListener('mouseleave', () => {
      cursorTip.classList.remove('visible');
      if (urnSmokeInterval) { clearInterval(urnSmokeInterval); urnSmokeInterval = null; }
    });

    const INCENSE_MSGS = [
      '香火嫋嫋，願你所求皆如願。',
      '煙霧中，有人在聆聽你的心願。',
      '此香已燃，誠意上達天聽。',
      '迷霧散去，祝福留存。',
      '深吸一口氣，讓心靜下來。',
    ];
    urnObj.addEventListener('click', () => {
      const msg = INCENSE_MSGS[Math.floor(Math.random() * INCENSE_MSGS.length)];
      const r = urnObj.getBoundingClientRect();
      const el = document.createElement('div');
      el.className = 'mist-word';
      el.textContent = msg;
      el.style.cssText = `left:${r.left + r.width / 2}px; top:${r.top}px; font-size:0.9rem; --dur:4s; --dx:0px;`;
      document.getElementById('lampMistWords').appendChild(el);
      setTimeout(() => el.remove(), 4300);
    });

    return () => {
      if (typeof _animId !== 'undefined') cancelAnimationFrame(_animId);
      if (urnSmokeInterval) clearInterval(urnSmokeInterval);
    };
  }, []);

  return (
    <>
      
      <div id="lampOverlay">
        <div id="lampMist">
          <div id="lampMistClose">✕</div>
      
          
          <div id="lampMistSilhouette"></div>
      
          
          <div id="lampMistTitle">迷霧之中</div>
      
          
          <div id="lampMistScatter"></div>
      
          
          <div id="lampMistInputWrap">
            <input id="lampMistInput" type="text" placeholder="寫下任意文字，投入迷霧…" maxLength="30" autoComplete="off" />
            <button id="lampMistSend">↑</button>
          </div>
        </div>
      </div>
      
      <div id="lampMistWords"></div>
      
      <div id="cursor-tooltip"></div>
      
      <canvas id="particleCanvas"></canvas>
      
      <div id="blessingOverlay">
        <div id="blessingScroll">
          <div id="blessingClose">✕</div>
          <div id="blessingRune">ᚱ</div>
          <div id="blessingText"></div>
          <div id="blessingAuthor">— 魔法書房</div>
        </div>
      </div>
      
      <div className="scene" id="mainScene">
        
        <div className="scene-bg">
          <img src="/assets/magic-library-bg.png" alt="魔法書房" className="scene-bg-img" />
        </div>
      
        
        <div className="scene-objects">
          <div className="scene-obj book-obj" data-book="true" id="obj-book1-8" style={{left: '24.09%', top: '8.06%', width: '7.23%', height: '17.80%'}}>
            <img src="/assets/scroll-book.png" alt="捲頁古書" />
            <div className="scene-tooltip">捲頁古書</div>
          </div>
          <div className="scene-obj book-obj" data-book="true" id="obj-book1-7" style={{left: '21.42%', top: '7.96%', width: '7.49%', height: '16.81%'}}>
            <img src="/assets/dragon-tome.png" alt="龍紋典籍" />
            <div className="scene-tooltip">龍紋典籍</div>
          </div>
          <div className="scene-obj book-obj" data-book="true" id="obj-book1-6" style={{left: '19.27%', top: '10.52%', width: '6.77%', height: '13.47%'}}>
            <img src="/assets/twin-books.png" alt="雙冊秘要" />
            <div className="scene-tooltip">雙冊秘要</div>
          </div>
          <div className="scene-obj book-obj" data-book="true" id="obj-book1-5" style={{left: '17.51%', top: '9.64%', width: '6.25%', height: '14.06%'}}>
            <img src="/assets/star-manuscript.png" alt="星紋手稿" />
            <div className="scene-tooltip">星紋手稿</div>
          </div>
          <div className="scene-obj book-obj" data-book="true" id="obj-book1-4" style={{left: '9.77%', top: '3.24%', width: '7.55%', height: '19.08%'}}>
            <img src="/assets/feather-tome.png" alt="羽毛密典" />
            <div className="scene-tooltip">羽毛密典</div>
          </div>
          <div className="scene-obj book-obj" data-book="true" id="obj-book1-3" style={{left: '6.38%', top: '0.39%', width: '7.94%', height: '21.14%'}}>
            <img src="/assets/secret-scroll.png" alt="秘法書卷" />
            <div className="scene-tooltip">秘法書卷</div>
          </div>
          <div className="scene-obj book-obj" data-book="true" id="obj-book1-2" style={{left: '3.39%', top: '0.00%', width: '7.81%', height: '20.75%'}}>
            <img src="/assets/ancient-tome-2.png" alt="古代典籍 II" />
            <div className="scene-tooltip">古代典籍 II</div>
          </div>
          <div className="scene-obj book-obj" data-book="true" id="obj-book1-1" style={{left: '0.00%', top: '0.00%', width: '8.01%', height: '20.45%'}}>
            <img src="/assets/ancient-tome-1.png" alt="古代典籍 I" />
            <div className="scene-tooltip">古代典籍 I</div>
          </div>
          <div className="scene-obj deco-obj"  id="obj-bottle2-8" style={{left: '26.04%', top: '32.94%', width: '5.01%', height: '12.00%'}}>
            <img src="/assets/round-bottle.png" alt="圓底瓶" />
            <div className="scene-tooltip">圓底瓶</div>
          </div>
          <div className="scene-obj deco-obj"  id="obj-bottle2-7" style={{left: '22.53%', top: '30.38%', width: '5.14%', height: '14.26%'}}>
            <img src="/assets/test-tube.png" alt="試管瓶" />
            <div className="scene-tooltip">試管瓶</div>
          </div>
          <div className="scene-obj book-obj" data-book="true" id="obj-book2-6" style={{left: '17.06%', top: '29.89%', width: '5.79%', height: '14.85%'}}>
            <img src="/assets/rune-tome.png" alt="符文密典" />
            <div className="scene-tooltip">符文密典</div>
          </div>
          <div className="scene-obj book-obj" data-book="true" id="obj-book2-5" style={{left: '14.97%', top: '29.60%', width: '6.12%', height: '15.14%'}}>
            <img src="/assets/torn-page-book.png" alt="碎頁古冊" />
            <div className="scene-tooltip">碎頁古冊</div>
          </div>
          <div className="scene-obj book-obj" data-book="true" id="obj-book2-4" style={{left: '12.50%', top: '27.53%', width: '6.97%', height: '17.11%'}}>
            <img src="/assets/dark-scroll.png" alt="暗紋書卷" />
            <div className="scene-tooltip">暗紋書卷</div>
          </div>
          <div className="scene-obj book-obj" data-book="true" id="obj-book2-3" style={{left: '9.96%', top: '26.75%', width: '7.49%', height: '18.39%'}}>
            <img src="/assets/purple-tome.png" alt="紫封典籍" />
            <div className="scene-tooltip">紫封典籍</div>
          </div>
          <div className="scene-obj deco-obj"  id="obj-skeleton2-2" style={{left: '2.28%', top: '25.66%', width: '10.55%', height: '18.68%'}}>
            <img src="/assets/guardian.png" alt="守護者" />
            <div className="scene-tooltip">守護者</div>
          </div>
          <div className="scene-obj book-obj" data-book="true" id="obj-book2-1" style={{left: '0.00%', top: '24.88%', width: '3.84%', height: '19.47%'}}>
            <img src="/assets/lower-tome.png" alt="下層典籍" />
            <div className="scene-tooltip">下層典籍</div>
          </div>
          {/* 提燈陰影（在提燈下層） */}
          <div className="scene-obj deco-obj" id="obj-lamp-shadow" style={{left: '55.2%', top: '45.5%', width: '12.5%', height: '30%'}}>
            <img src="/assets/lantern-shadow.png" alt="" />
          </div>
          <div className="scene-obj deco-obj"  id="obj-lamp" style={{left: '51.8%', top: '43.5%', width: '14.91%', height: '35.79%'}}>
            <img src="/assets/lantern.png" alt="提燈" />
            <div className="scene-tooltip">提燈</div>
          </div>
          {/* 香爐煙霧（在香爐上層，無互動） */}
          <div className="scene-obj deco-obj" id="obj-incense-smoke" style={{left: '32%', top: '22%', width: '12%', height: '18%'}}>
            <img src="/assets/incense-burner-smoke.png" alt="" />
          </div>
          <div className="scene-obj deco-obj"  id="obj-urn" style={{left: '31.5%', top: '37%', width: '15%', height: '44%'}}>
            <img src="/assets/incense-burner.png" alt="香爐" />
            <div className="scene-tooltip">香爐</div>
          </div>
        </div>
      
          
          <div className="scene-obj deco-obj" id="obj-pen-shadow" style={{left: '69.79%', top: '83.48%', width: '12.63%', height: '12.19%'}}>
            <img src="/assets/pen-shadow.png" alt="筆影" />
          </div>
          
          <div className="scene-obj deco-obj" id="obj-pen" style={{left: '69.66%', top: '81.12%', width: '12.89%', height: '13.57%'}}>
            <img src="/assets/quill-pen.png" alt="羽毛筆" />
            <div className="scene-tooltip">羽毛筆</div>
          </div>
          
          <div className="scene-obj deco-obj" id="obj-bookopen" style={{left: '40.30%', top: '75.32%', width: '33.85%', height: '18.09%', cursor: 'pointer', pointerEvents: 'all', zIndex: 20}}>
            <img src="/assets/open-book.png" alt="攤開的書" />
          </div>
      
          
        <div className="form-overlay">
          <div className="parchment-wrap">
            <div className="parchment">
              <div className="parchment-shadow-top"></div>
              <div className="parchment-shadow-bot"></div>
      
              
              <div className="parchment-ornament" id="parchmentTop">
                <div className="ornament-line">
                  <span className="ornament-glyph">⚜</span>
                  <span className="ornament-text">Donation Scroll</span>
                  <span className="ornament-glyph">⚜</span>
                </div>
                
                <div className="parchment-top-hint" id="parchmentTopHint">▲ 點此收起</div>
              </div>
      
              <div className="form-title">贊助魔法書房</div>
              <div className="form-subtitle">以靈魂之名，留下你的心意</div>
      
              
              <div className="parchment-body" id="parchmentBody">
              
              <div className="fields">
      
                
                <div className="field-group">
                  <label className="field-label">
                    <span className="label-glyph">✒</span>
                    贊助者之名
                    <span className="req">（必填）</span>
                  </label>
                  <div className="glitch-wrap">
                    <input className="field-input" id="inputName" type="text" placeholder="請留下你的名字…" maxLength="30" autoComplete="off" />
                    <div className="glitch-overlay" id="glitchName" aria-hidden="true"></div>
                  </div>
                </div>
      
                
                <div className="field-group">
                  <label className="field-label">
                    <span className="label-glyph">🪙</span>
                    贊助金額
                    <span className="req">（必填）</span>
                  </label>
                  <div className="amount-row">
                    <div className="amount-prefix">NT$</div>
                    <div className="glitch-wrap" style={{flex: '1'}}>
                      <input className="field-input" id="inputAmount" type="number" placeholder="50" min="30" step="1" />
                      <div className="glitch-overlay" id="glitchAmount" aria-hidden="true"></div>
                    </div>
                  </div>
                  <div className="amount-presets">
                    <span className="preset-chip">NT$ 50</span>
                    <span className="preset-chip">NT$ 100</span>
                    <span className="preset-chip">NT$ 200</span>
                    <span className="preset-chip">NT$ 500</span>
                    <span className="preset-chip">NT$ 1,000</span>
                  </div>
                </div>
      
                
                <div className="field-group">
                  <label className="field-label">
                    <span className="label-glyph">💬</span>
                    想說的話
                    <span style={{color: 'rgba(60,30,5,0.4)', fontSize: '0.62rem', marginLeft: '0.2rem'}}>（選填）</span>
                  </label>
                  <div className="glitch-wrap">
                    <textarea className="field-textarea" id="inputMsg" placeholder="留下一句話給魔法師…" maxLength="100"></textarea>
                    <div className="glitch-overlay" id="glitchMsg" aria-hidden="true"></div>
                  </div>
                </div>
      
              </div>
      
              
              <div className="submit-area">
                <div className="submit-divider">
                  <span className="submit-divider-glyph">✦ ✦ ✦</span>
                </div>
                
                <div className="btn-submit-zone" id="btnZone">
                  
                  <div className="btn-ghost" id="btnGhost">施咒失敗…請填妥卷軸</div>
                  
                  <div className="btn-carrier" id="btnCarrier">
                    
                    <div className="btn-jelly" id="btnJelly">
                      <button className="btn-submit" id="btnSubmit">
                        ✦ &nbsp;封印並送出&nbsp; ✦
                      </button>
                    </div>
                  </div>
                </div>
              </div>
      
              
              <div className="yt-section">
                <div className="yt-label">連結帳號以查看贊助紀錄</div>
                <a className="btn-yt" href="#">
                  <div className="yt-icon"></div>
                  <span className="yt-text">以 YouTube 帳號登入</span>
                </a>
              </div>
      
              </div>
            </div>
          </div>
      
        
        </div>
      
      </div>

      {/* 書本說明卡 */}
      <div id="infoCardOverlay">
        <div id="infoCard">
          <div id="infoCornerWrap">
            <svg className="info-corner tl" viewBox="0 0 30 30" aria-hidden="true"><path d="M0 20 L0 0 L20 0" strokeDasharray="44" strokeDashoffset="44" /></svg>
            <svg className="info-corner tr" viewBox="0 0 30 30" aria-hidden="true"><path d="M10 0 L30 0 L30 20" strokeDasharray="44" strokeDashoffset="44" /></svg>
            <svg className="info-corner bl" viewBox="0 0 30 30" aria-hidden="true"><path d="M0 10 L0 30 L20 30" strokeDasharray="44" strokeDashoffset="44" /></svg>
            <svg className="info-corner br" viewBox="0 0 30 30" aria-hidden="true"><path d="M10 30 L30 30 L30 10" strokeDasharray="44" strokeDashoffset="44" /></svg>
          </div>
          <div id="infoCardClose">✕</div>
          <div id="infoCardContent">
            <div className="info-card-title">書房奇談 ── 規則書</div>
            <div className="info-card-subtitle">本書房的規則，知道的人不多…</div>
            <ul className="info-card-list">
              <li><span className="info-glyph">✦</span> <strong>書架上的書</strong> ── 輕觸書脊可得一句祝福</li>
              <li><span className="info-glyph">✦</span> <strong>提燈</strong> ── 點擊可開啟迷霧空間，向霧中投入文字</li>
              <li><span className="info-glyph">✦</span> <strong>羽毛筆</strong> ── 請勿輕易點擊，它有自己的打算</li>
              <li><span className="info-glyph">✦</span> <strong>守護者</strong> ── 守在這裡很久了，偶爾願意說話</li>
              <li><span className="info-glyph">✦</span> <strong>香爐</strong> ── 靠近可聞得煙香，點擊傳遞心意</li>
            </ul>
            <div className="info-card-divider"></div>
            <div className="info-card-footer">
              <p>連結 YouTube 帳號以累積贊助足跡，並查閱歷次贊助紀錄。</p>
              <p className="info-card-contact">問題與委託：<a href="mailto:wuyan1234yyy@gmail.com">wuyan1234yyy@gmail.com</a></p>
            </div>
          </div>
        </div>
      </div>

      {/* 社群圖示 */}
      <div className="social-icons">
        <a className="social-icon-btn" href="https://x.com/wuyan4411" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.635 5.903-5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a className="social-icon-btn" href="https://www.youtube.com/@%E5%90%B3%E8%A8%80-o9q" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
      </div>
    </>
  );
}
