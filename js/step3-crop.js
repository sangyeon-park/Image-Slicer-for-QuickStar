window.Step3 = (function () {
  // Handle sizes are kept in CSS pixels and converted to natural px at runtime
  const HANDLE_HIT_CSS = 14;  // hit-test half-size in CSS px
  const HANDLE_SIZE_CSS = 9;  // draw half-size in CSS px
  const MIN_SIZE = 20;        // minimum crop dimension in natural px

  let canvas, ctx;
  let displayScale = 1;
  let activeHandle = null;
  let dragOrigin = null;   // { mx, my, rect snapshot }

  function hitNat()  { return HANDLE_HIT_CSS  / displayScale; }
  function sizeNat() { return HANDLE_SIZE_CSS / displayScale; }

  const CURSORS = {
    nw: 'nw-resize', n: 'n-resize', ne: 'ne-resize',
    e:  'e-resize',  se: 'se-resize', s: 's-resize',
    sw: 'sw-resize', w: 'w-resize',  move: 'move',
  };

  function handlePoints(r) {
    return {
      nw: [r.x,           r.y          ],
      n:  [r.x + r.w / 2, r.y          ],
      ne: [r.x + r.w,     r.y          ],
      e:  [r.x + r.w,     r.y + r.h / 2],
      se: [r.x + r.w,     r.y + r.h    ],
      s:  [r.x + r.w / 2, r.y + r.h    ],
      sw: [r.x,           r.y + r.h    ],
      w:  [r.x,           r.y + r.h / 2],
    };
  }

  function getHandle(mx, my) {
    const r = AppState.cropRect;
    const pts = handlePoints(r);
    const hit = hitNat();
    for (const [name, [hx, hy]] of Object.entries(pts)) {
      if (Math.abs(mx - hx) <= hit && Math.abs(my - hy) <= hit)
        return name;
    }
    if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h)
      return 'move';
    return null;
  }

  function draw() {
    const src = AppState.sourceImage;
    const r = AppState.cropRect;
    const W = canvas.width, H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(src, 0, 0);

    // Dim outside
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, W, r.y);
    ctx.fillRect(0, r.y + r.h, W, H - r.y - r.h);
    ctx.fillRect(0, r.y, r.x, r.h);
    ctx.fillRect(r.x + r.w, r.y, W - r.x - r.w, r.h);

    // Crop border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(r.x, r.y, r.w, r.h);

    // Rule-of-thirds guides
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 0.8;
    for (let i = 1; i < 3; i++) {
      const x = r.x + r.w * i / 3;
      const y = r.y + r.h * i / 3;
      ctx.beginPath(); ctx.moveTo(x, r.y); ctx.lineTo(x, r.y + r.h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(r.x, y); ctx.lineTo(r.x + r.w, y); ctx.stroke();
    }

    // Handles
    const pts = handlePoints(r);
    const hs = sizeNat();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = Math.max(0.5, 1 / displayScale);
    for (const [hx, hy] of Object.values(pts)) {
      ctx.beginPath();
      ctx.rect(hx - hs, hy - hs, hs * 2, hs * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  function toNatural(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      mx: (e.clientX - rect.left) / displayScale,
      my: (e.clientY - rect.top) / displayScale,
    };
  }

  function applyDrag(mx, my) {
    const { mx: ox, my: oy, rect: snap } = dragOrigin;
    const dx = mx - ox, dy = my - oy;
    const aspect = (11 * AppState.cols) / (10 * AppState.rows);
    let { x, y, w, h } = snap;

    const h_name = activeHandle;

    if (h_name === 'move') {
      x = snap.x + dx;
      y = snap.y + dy;
    } else if (h_name === 'nw') {
      const fixX = snap.x + snap.w, fixY = snap.y + snap.h;
      w = Math.max(MIN_SIZE, fixX - (snap.x + dx));
      h = w / aspect;
      x = fixX - w;
      y = fixY - h;
    } else if (h_name === 'ne') {
      const fixY = snap.y + snap.h;
      w = Math.max(MIN_SIZE, snap.w + dx);
      h = w / aspect;
      y = fixY - h;
    } else if (h_name === 'se') {
      w = Math.max(MIN_SIZE, snap.w + dx);
      h = w / aspect;
    } else if (h_name === 'sw') {
      const fixX = snap.x + snap.w;
      w = Math.max(MIN_SIZE, fixX - (snap.x + dx));
      h = w / aspect;
      x = fixX - w;
    } else if (h_name === 'n') {
      const fixY = snap.y + snap.h;
      const centerX = snap.x + snap.w / 2;
      h = Math.max(MIN_SIZE, fixY - (snap.y + dy));
      w = h * aspect;
      y = fixY - h;
      x = centerX - w / 2;
    } else if (h_name === 's') {
      const centerX = snap.x + snap.w / 2;
      h = Math.max(MIN_SIZE, snap.h + dy);
      w = h * aspect;
      x = centerX - w / 2;
    } else if (h_name === 'e') {
      const centerY = snap.y + snap.h / 2;
      w = Math.max(MIN_SIZE, snap.w + dx);
      h = w / aspect;
      y = centerY - h / 2;
    } else if (h_name === 'w') {
      const fixX = snap.x + snap.w;
      const centerY = snap.y + snap.h / 2;
      w = Math.max(MIN_SIZE, fixX - (snap.x + dx));
      h = w / aspect;
      x = fixX - w;
      y = centerY - h / 2;
    }

    AppState.cropRect = { x, y, w, h };
    draw();
  }

  function onMouseDown(e) {
    const { mx, my } = toNatural(e);
    const h = getHandle(mx, my);
    if (!h) return;
    activeHandle = h;
    dragOrigin = { mx, my, rect: { ...AppState.cropRect } };
    canvas.setPointerCapture(e.pointerId);
  }

  function onMouseMove(e) {
    const { mx, my } = toNatural(e);
    if (activeHandle) {
      applyDrag(mx, my);
    } else {
      const h = getHandle(mx, my);
      canvas.style.cursor = CURSORS[h] || 'crosshair';
    }
  }

  function onMouseUp() {
    activeHandle = null;
    dragOrigin = null;
  }

  function init() {
    canvas = document.getElementById('cropCanvas');
    ctx = canvas.getContext('2d');

    const src = AppState.sourceImage;
    const imgW = src.naturalWidth, imgH = src.naturalHeight;

    // Fit within display area (constrain both width and height)
    const maxDisplayW = Math.min(900, window.innerWidth - 80);
    const maxDisplayH = Math.min(600, window.innerHeight - 300);
    displayScale = Math.min(1, maxDisplayW / imgW, maxDisplayH / imgH);

    canvas.width = imgW;
    canvas.height = imgH;
    canvas.style.width  = Math.round(imgW * displayScale) + 'px';
    canvas.style.height = Math.round(imgH * displayScale) + 'px';

    // Initial crop box: largest centered rect with correct aspect ratio
    // Each cell is 9k×10k with 0.5k borders → total grid = 10H×11W
    const aspect = (11 * AppState.cols) / (10 * AppState.rows);
    let cw, ch;
    if (imgW / imgH >= aspect) {
      ch = imgH; cw = ch * aspect;
    } else {
      cw = imgW; ch = cw / aspect;
    }
    AppState.cropRect = {
      x: (imgW - cw) / 2,
      y: (imgH - ch) / 2,
      w: cw,
      h: ch,
    };

    canvas.removeEventListener('pointerdown', onMouseDown);
    canvas.removeEventListener('pointermove', onMouseMove);
    canvas.removeEventListener('pointerup', onMouseUp);
    canvas.addEventListener('pointerdown', onMouseDown);
    canvas.addEventListener('pointermove', onMouseMove);
    canvas.addEventListener('pointerup', onMouseUp);

    draw();
  }

  function commit() {
    const src = AppState.sourceImage;
    const cr = AppState.cropRect;

    const outW = Math.max(1, Math.round(cr.w));
    const outH = Math.max(1, Math.round(cr.h));

    // Add 0.5k transparent padding on each side so sliceAll's 0.5k offset
    // removes only this padding, not actual image content at the edges.
    const k   = outH / (10 * AppState.rows);
    const pad = Math.max(1, Math.round(k * 0.5));

    const paddedW = outW + 2 * pad;
    const paddedH = outH + 2 * pad;

    const offscreen = document.createElement('canvas');
    offscreen.width  = paddedW;
    offscreen.height = paddedH;
    const octx = offscreen.getContext('2d');
    octx.clearRect(0, 0, paddedW, paddedH);

    // intersection of cropRect with image bounds
    const srcX  = Math.max(0, cr.x);
    const srcY  = Math.max(0, cr.y);
    const srcX2 = Math.min(src.naturalWidth,  cr.x + cr.w);
    const srcY2 = Math.min(src.naturalHeight, cr.y + cr.h);

    if (srcX2 > srcX && srcY2 > srcY) {
      const dstX = (srcX - cr.x) + pad;
      const dstY = (srcY - cr.y) + pad;
      octx.drawImage(src,
        srcX, srcY, srcX2 - srcX, srcY2 - srcY,
        dstX, dstY, srcX2 - srcX, srcY2 - srcY
      );
    }

    AppState.imgReal = offscreen;
    AppState.imgRealPad = pad;
  }

  return { init, commit };
})();
