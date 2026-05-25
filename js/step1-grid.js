(function () {
  // Color palette for button regions
  const PALETTE = [
    { bg: 'rgba(79,142,247,0.18)',  border: '#4f8ef7' },
    { bg: 'rgba(247,131,79,0.18)', border: '#f7834f' },
    { bg: 'rgba(52,201,122,0.18)', border: '#34c97a' },
    { bg: 'rgba(247,210,79,0.18)', border: '#f7d24f' },
    { bg: 'rgba(201,122,247,0.18)',border: '#c97af7' },
    { bg: 'rgba(247,82,79,0.18)',  border: '#f7524f' },
    { bg: 'rgba(79,247,217,0.18)', border: '#4ff7d9' },
    { bg: 'rgba(247,79,176,0.18)', border: '#f74fb0' },
  ];

  function btnColor(btn) {
    return PALETTE[(btn.id - 1) % PALETTE.length];
  }

  let occupancy = [];
  let dragStart = null;
  let dragging  = false;
  let previewCells = new Set();

  function getCell(el) {
    const c = el && el.closest && el.closest('.grid-cell');
    if (!c) return null;
    return { r: +c.dataset.row, c: +c.dataset.col, el: c };
  }

  function getCellFromPoint(x, y) {
    return getCell(document.elementFromPoint(x, y));
  }

  function buildOccupancy(rows, cols) {
    occupancy = Array.from({ length: rows }, () => new Array(cols).fill(0));
  }

  function markOccupancy(btn, value) {
    btn.cells.forEach(([r, c]) => { occupancy[r][c] = value; });
  }

  function rectCells(r1, c1, r2, c2) {
    const cells = [];
    for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++)
      for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++)
        cells.push([r, c]);
    return cells;
  }

  function rectHasOccupied(rMin, cMin, rMax, cMax) {
    for (let r = rMin; r <= rMax; r++)
      for (let c = cMin; c <= cMax; c++)
        if (occupancy[r][c] !== 0) return true;
    return false;
  }

  function clampDrag(r1, c1, r2, c2) {
    const rMin = Math.min(r1, r2), rMax = Math.max(r1, r2);
    const cMin = Math.min(c1, c2), cMax = Math.max(c1, c2);

    // row-first: shrink rMax then cMax
    let vRMax = rMax;
    while (vRMax >= rMin && rectHasOccupied(rMin, cMin, vRMax, cMax)) vRMax--;
    let vCMax = cMax;
    if (vRMax >= rMin) {
      while (vCMax >= cMin && rectHasOccupied(rMin, cMin, vRMax, vCMax)) vCMax--;
    }
    const areaA = (vRMax >= rMin && vCMax >= cMin)
      ? (vRMax - rMin + 1) * (vCMax - cMin + 1) : 0;

    // col-first: shrink cMax then rMax
    let vCMax2 = cMax;
    while (vCMax2 >= cMin && rectHasOccupied(rMin, cMin, rMax, vCMax2)) vCMax2--;
    let vRMax2 = rMax;
    if (vCMax2 >= cMin) {
      while (vRMax2 >= rMin && rectHasOccupied(rMin, cMin, vRMax2, vCMax2)) vRMax2--;
    }
    const areaB = (vRMax2 >= rMin && vCMax2 >= cMin)
      ? (vRMax2 - rMin + 1) * (vCMax2 - cMin + 1) : 0;

    let useRMax, useCMax;
    if (areaA === 0 && areaB === 0)       { useRMax = rMin; useCMax = cMin; }
    else if (areaA >= areaB)              { useRMax = vRMax;  useCMax = vCMax; }
    else                                   { useRMax = vRMax2; useCMax = vCMax2; }

    return {
      r2: r2 >= r1 ? useRMax : rMin + (rMax - useRMax),
      c2: c2 >= c1 ? useCMax : cMin + (cMax - useCMax),
    };
  }

  function renderAllCells() {
    const container = document.getElementById('gridContainer');
    const cells = container.querySelectorAll('.grid-cell');

    cells.forEach(cell => {
      const r = +cell.dataset.row, c = +cell.dataset.col;
      cell.classList.remove('selected', 'occupied', 'hover-preview');
      cell.innerHTML = '';
      cell.style.backgroundColor = '';
      cell.style.boxShadow = '';

      const btnId = occupancy[r][c];
      if (!btnId) return;

      cell.classList.add('selected', 'occupied');
      const btn = AppState.buttons.find(b => b.id === btnId);
      if (!btn) return;

      const col = btnColor(btn);
      cell.style.backgroundColor = col.bg;

      // Build inset box-shadow for outer edges of the region
      const shadows = [];
      const W = 2; // border width in px
      if (r === btn.topRow)                    shadows.push(`inset 0 ${W}px 0 0 ${col.border}`);
      if (r === btn.topRow + btn.rowSpan - 1)  shadows.push(`inset 0 -${W}px 0 0 ${col.border}`);
      if (c === btn.leftCol)                   shadows.push(`inset ${W}px 0 0 0 ${col.border}`);
      if (c === btn.leftCol + btn.colSpan - 1) shadows.push(`inset -${W}px 0 0 0 ${col.border}`);
      if (shadows.length) cell.style.boxShadow = shadows.join(', ');

      // Number label only in the top-left cell
      if (btn.topRow === r && btn.leftCol === c) {
        const label = document.createElement('span');
        label.className = 'cell-label';
        label.style.color = col.border;
        label.textContent = btn.id;
        cell.appendChild(label);
      }
    });

    document.getElementById('btnToStep2').disabled = AppState.buttons.length === 0;
  }

  function applyPreview(cells) {
    clearPreview();
    cells.forEach(([r, c]) => {
      const el = document.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
      if (el) { el.classList.add('hover-preview'); previewCells.add(el); }
    });
  }

  function clearPreview() {
    previewCells.forEach(el => el.classList.remove('hover-preview'));
    previewCells.clear();
  }

  function removeButton(id) {
    const idx = AppState.buttons.findIndex(b => b.id === id);
    if (idx === -1) return;
    markOccupancy(AppState.buttons[idx], 0);
    AppState.buttons.splice(idx, 1);
    renderAllCells();
  }

  function readDim(selectId, customId) {
    const sel = document.getElementById(selectId);
    if (sel.value === 'other') {
      return parseInt(document.getElementById(customId).value, 10);
    }
    return parseInt(sel.value, 10);
  }

  function buildGrid() {
    const rows = readDim('inputRows', 'inputRowsCustom');
    const cols = readDim('inputCols', 'inputColsCustom');
    if (!rows || !cols || rows < 1 || cols < 1) return;

    // Preserve buttons that still fit within the new dimensions
    const validButtons = AppState.buttons.filter(b =>
      b.topRow + b.rowSpan <= rows && b.leftCol + b.colSpan <= cols
    );

    AppState.rows = rows;
    AppState.cols = cols;
    AppState.buttons = validButtons;

    buildOccupancy(rows, cols);
    validButtons.forEach(b => markOccupancy(b, b.id));

    const container = document.getElementById('gridContainer');
    container.innerHTML = '';

    const table = document.createElement('div');
    table.className = 'grid-table';
    table.style.gridTemplateColumns = `repeat(${cols}, var(--cell-size))`;
    table.style.gridTemplateRows    = `repeat(${rows}, var(--cell-size))`;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        table.appendChild(cell);
      }
    }

    container.appendChild(table);
    document.getElementById('gridHelp').style.display = 'block';
    attachGridEvents(table);
    renderAllCells();
  }

  function resetGrid() {
    AppState.buttons = [];
    buildOccupancy(AppState.rows, AppState.cols);
    renderAllCells();
  }

  function attachGridEvents(table) {
    table.addEventListener('pointerdown',  onPointerDown);
    table.addEventListener('pointermove',  onPointerMove);
    table.addEventListener('pointerup',    onPointerUp);
    table.addEventListener('pointerleave', onPointerUp);
  }

  function onPointerDown(e) {
    const info = getCellFromPoint(e.clientX, e.clientY);
    if (!info) return;
    const { r, c } = info;

    e.preventDefault();

    if (occupancy[r][c] !== 0) {
      removeButton(occupancy[r][c]);
      return;
    }

    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart = { r, c };
    dragging  = true;
    applyPreview([[r, c]]);
  }

  function onPointerMove(e) {
    if (!dragging || !dragStart) return;
    e.preventDefault();
    const info = getCellFromPoint(e.clientX, e.clientY);
    if (!info) return;
    const { r2, c2 } = clampDrag(dragStart.r, dragStart.c, info.r, info.c);
    applyPreview(rectCells(dragStart.r, dragStart.c, r2, c2));
  }

  function onPointerUp(e) {
    if (!dragging || !dragStart) return;
    dragging = false;

    const info = getCellFromPoint(e.clientX, e.clientY);
    let r2 = dragStart.r, c2 = dragStart.c;
    if (info) {
      const clamped = clampDrag(dragStart.r, dragStart.c, info.r, info.c);
      r2 = clamped.r2; c2 = clamped.c2;
    }

    clearPreview();

    const topRow  = Math.min(dragStart.r, r2), botRow  = Math.max(dragStart.r, r2);
    const leftCol = Math.min(dragStart.c, c2), rightCol = Math.max(dragStart.c, c2);

    if (topRow > botRow || leftCol > rightCol) { dragStart = null; return; }

    const nextId = AppState.buttons.length > 0
      ? Math.max(...AppState.buttons.map(b => b.id)) + 1 : 1;

    const btn = {
      id: nextId,
      topRow,
      leftCol,
      rowSpan:  botRow  - topRow  + 1,
      colSpan:  rightCol - leftCol + 1,
      cells: rectCells(dragStart.r, dragStart.c, r2, c2),
    };

    AppState.buttons.push(btn);
    markOccupancy(btn, nextId);
    renderAllCells();
    dragStart = null;
  }

  function bindDimToggle(selectId, customId) {
    const sel = document.getElementById(selectId);
    const cus = document.getElementById(customId);
    sel.addEventListener('change', () => {
      const isOther = sel.value === 'other';
      cus.hidden = !isOther;
      if (isOther) cus.focus();
    });
  }
  bindDimToggle('inputRows', 'inputRowsCustom');
  bindDimToggle('inputCols', 'inputColsCustom');

  document.getElementById('btnBuildGrid').addEventListener('click', buildGrid);
  document.getElementById('btnResetGrid').addEventListener('click', resetGrid);

  // Auto-build default grid on page load
  buildGrid();

  // Expose reset for app.js restart()
  window.Step1 = { reset: resetGrid };
})();
