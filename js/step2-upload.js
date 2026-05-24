(function () {
  function loadImageFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        AppState.sourceImage = img;
        const preview = document.getElementById('previewImg');
        preview.src = e.target.result;
        document.getElementById('previewContainer').style.display = 'block';
        document.getElementById('btnToStep3').disabled = false;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // File picker
  const picker = document.getElementById('filePicker');
  document.getElementById('btnPickFile').addEventListener('click', () => picker.click());
  picker.addEventListener('change', () => {
    if (picker.files[0]) loadImageFile(picker.files[0]);
    picker.value = '';
  });

  // Drag & drop
  const dropZone = document.getElementById('dropZone');
  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) loadImageFile(file);
  });

  // Ctrl+V paste
  document.addEventListener('paste', e => {
    const section = document.getElementById('step2');
    if (!section.classList.contains('active')) return;
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        loadImageFile(item.getAsFile());
        break;
      }
    }
  });
})();
