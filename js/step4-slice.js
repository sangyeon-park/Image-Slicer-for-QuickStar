window.Step4 = (function () {
  // Matches PALETTE border colors in step1-grid.js
  const TILE_COLORS = ['#4f8ef7','#f7834f','#34c97a','#f7d24f','#c97af7','#f7524f','#4ff7d9','#f74fb0'];

  // ── Slicing ────────────────────────────────────────────────
  function sliceAll() {
    const imgReal = AppState.imgReal;
    const { rows, cols, buttons } = AppState;

    // k: one grid unit in natural pixels
    // imgReal height = (10H+1)k — content 10Hk + 0.5k padding each side
    const k   = imgReal.height / (10 * rows + 1);
    const pad = AppState.imgRealPad ?? Math.round(k * 0.5);

    AppState.slices = buttons.map(btn => {
      // Outer edges of the whole grid extend to photo boundary;
      // inner edges land on cell content (skip the 0.5k cell border)
      const x1 = btn.leftCol, x2 = btn.leftCol + btn.colSpan;
      const y1 = btn.topRow,  y2 = btn.topRow  + btn.rowSpan;
      const leftG  = x1 === 0    ? 0             : (11 * x1 + 0.5) * k;
      const rightG = x2 === cols ? 11 * cols * k : (11 * x2 - 0.5) * k;
      const topG   = y1 === 0    ? 0             : (10 * y1 + 0.5) * k;
      const botG   = y2 === rows ? 10 * rows * k : (10 * y2 - 0.5) * k;

      const px = Math.round(leftG + pad);
      const py = Math.round(topG  + pad);
      const pw = Math.max(1, Math.round(rightG - leftG));
      const ph = Math.max(1, Math.round(botG  - topG));

      const c = document.createElement('canvas');
      c.width  = pw;
      c.height = ph;
      c.getContext('2d').drawImage(imgReal, px, py, pw, ph, 0, 0, pw, ph);
      return c;
    });
  }

  // ── Layout Preview ─────────────────────────────────────────
  function renderLayoutPreview() {
    const container = document.getElementById('layoutPreviewContainer');
    container.innerHTML = '';

    const imgReal = AppState.imgReal;
    const { rows, cols, buttons } = AppState;
    const k   = imgReal.height / (10 * rows + 1);
    const pad = AppState.imgRealPad ?? Math.round(k * 0.5);

    // Draw only the photo content (exclude transparent pad border)
    const photoW = imgReal.width  - 2 * pad;
    const photoH = imgReal.height - 2 * pad;
    const MAX = 400;
    const scale = Math.min(MAX / photoW, MAX / photoH);
    const PW = Math.round(photoW * scale);
    const PH = Math.round(photoH * scale);

    const canvas = document.createElement('canvas');
    canvas.width  = PW;
    canvas.height = PH;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(imgReal, pad, pad, photoW, photoH, 0, 0, PW, PH);

    // Draw colored outlines and number badges per button
    buttons.forEach((btn, i) => {
      const color = TILE_COLORS[(btn.id - 1) % TILE_COLORS.length];

      // Outer edges of the whole grid extend to photo boundary;
      // inner edges land on cell content (skip the 0.5k cell border)
      const x1 = btn.leftCol, x2 = btn.leftCol + btn.colSpan;
      const y1 = btn.topRow,  y2 = btn.topRow  + btn.rowSpan;
      const leftG  = x1 === 0    ? 0             : (11 * x1 + 0.5) * k;
      const rightG = x2 === cols ? 11 * cols * k : (11 * x2 - 0.5) * k;
      const topG   = y1 === 0    ? 0             : (10 * y1 + 0.5) * k;
      const botG   = y2 === rows ? 10 * rows * k : (10 * y2 - 0.5) * k;

      // Map to preview coordinates (canvas origin = photo content top-left, no pad offset)
      const px = leftG * scale, py = topG  * scale;
      const pw = (rightG - leftG) * scale, ph = (botG - topG) * scale;

      // Colored pill outline (max corner radius)
      const rad = Math.min(pw, ph) / 2;
      ctx.strokeStyle = color;
      ctx.lineWidth   = 2.5;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(px, py, pw, ph, rad);
      } else {
        ctx.moveTo(px + rad, py);
        ctx.arcTo(px + pw, py,      px + pw, py + ph, rad);
        ctx.arcTo(px + pw, py + ph, px,      py + ph, rad);
        ctx.arcTo(px,      py + ph, px,      py,      rad);
        ctx.arcTo(px,      py,      px + pw, py,      rad);
        ctx.closePath();
      }
      ctx.stroke();

      // Number badge (centered in the button area)
      const cx = px + pw / 2;
      const cy = py + ph / 2;
      const label = String(i + 1);
      const fontSize = Math.max(10, Math.min(22, ph * 0.4, pw * 0.4));
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      const tw  = ctx.measureText(label).width;
      const bpad = Math.max(3, fontSize * 0.25);
      const bw  = tw + bpad * 2;
      const bh  = fontSize + bpad * 2;
      const br  = 5;

      // Pill background
      ctx.fillStyle = 'rgba(0,0,0,0.72)';
      ctx.beginPath();
      ctx.roundRect
        ? ctx.roundRect(cx - bw / 2, cy - bh / 2, bw, bh, br)
        : ctx.rect(cx - bw / 2, cy - bh / 2, bw, bh);
      ctx.fill();

      // Text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, cx, cy);

      // Green checkmark if tile is marked special
      const cardEl = document.querySelector(`.tt-card[data-idx="${i}"]`);
      if (cardEl && cardEl.classList.contains('special')) {
        const ckSize = Math.max(7, Math.min(14, fontSize * 0.85));
        ctx.font = `bold ${ckSize}px sans-serif`;
        ctx.fillStyle = '#34c97a';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('✓', cx + bw / 2 + 3, cy);
      }
    });

    container.appendChild(canvas);
  }

  // ── Tile Type Selection ────────────────────────────────────
  function renderTileTypeSection() {
    const grid = document.getElementById('tileTypeGrid');
    grid.innerHTML = '';

    AppState.slices.forEach((slice, i) => {
      const card = document.createElement('div');
      card.className = 'tt-card';
      card.dataset.idx = i;

      const THUMB = 64;
      const scale = Math.min(THUMB / Math.max(1, slice.width), THUMB / Math.max(1, slice.height));
      const tw = Math.max(1, Math.round(slice.width  * scale));
      const th = Math.max(1, Math.round(slice.height * scale));
      const thumb = document.createElement('canvas');
      thumb.width = tw; thumb.height = th;
      thumb.getContext('2d').drawImage(slice, 0, 0, tw, th);

      const num = document.createElement('span');
      num.className = 'tt-num';
      num.textContent = '#' + (i + 1);

      card.appendChild(thumb);
      card.appendChild(num);
      grid.appendChild(card);

      card.addEventListener('click', () => {
        card.classList.toggle('special');
        renderLayoutPreview();
      });
    });
  }

  // ── Download ZIP ───────────────────────────────────────────
  async function downloadZip() {
    const zip = new JSZip();

    for (let i = 0; i < AppState.slices.length; i++) {
      const card = document.querySelector(`.tt-card[data-idx="${i}"]`);
      const isSpecial = card?.classList.contains('special') ?? false;
      const src = AppState.slices[i];

      const exportCanvas = document.createElement('canvas');
      exportCanvas.width  = src.width;
      exportCanvas.height = src.height;
      const ectx = exportCanvas.getContext('2d');

      // Flatten alpha onto white background (QuickStar has no alpha support)
      ectx.fillStyle = '#ffffff';
      ectx.fillRect(0, 0, src.width, src.height);
      ectx.drawImage(src, 0, 0);

      if (!isSpecial) {
        // Dim: brightness × 0.92, then mix 19.2% white
        // x_new = x × 0.92 × (1 − 0.192) + 255 × 0.192 = x × 0.74336 + 48.96
        const imgData = ectx.getImageData(0, 0, src.width, src.height);
        const d = imgData.data;
        for (let j = 0; j < d.length; j += 4) {
          d[j]   = Math.round(d[j]   * 0.74336 + 48.96);
          d[j+1] = Math.round(d[j+1] * 0.74336 + 48.96);
          d[j+2] = Math.round(d[j+2] * 0.74336 + 48.96);
        }
        ectx.putImageData(imgData, 0, 0);
      }

      const blob = await new Promise(res => exportCanvas.toBlob(res, 'image/png'));
      zip.file(`image_${i + 1}.png`, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quickstar_tiles.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── Init ───────────────────────────────────────────────────
  function init() {
    sliceAll();
    renderLayoutPreview();
    renderTileTypeSection();
  }

  document.getElementById('btnDownloadZip').addEventListener('click', downloadZip);

  return { init };
})();
