window.I18N = (function () {
  const DICT = {
    ko: {
      'intro.desc': '상단바 빠른 설정 버튼에 나만의 이미지를<br>손쉽게 분할해 적용하세요',
      'intro.creator': '제작자:',
      'intro.creatorName': '박상연',
      'intro.sourceCode': '원본 코드:',
      'intro.start': '시작하기',
      'header.subtitle': 'Samsung Galaxy One UI 상단바 버튼 이미지 분할 도구',
      'step.layout': '레이아웃',
      'step.image': '이미지',
      'step.crop': '자르기',
      'step.download': '다운로드',
      'step1.title': '레이아웃 설정',
      'step1.desc': '상단바의 전체 그리드 크기를 입력하고, 각 버튼의 위치를 드래그로 지정하세요.',
      'step1.egLabelPhone': 'One UI 빠른 설정',
      'step1.egLabelGrid': '5 × 4 그리드 설정',
      'step1.egDescHTML': '위 예시처럼 One UI 빠른 설정 패널의 버튼 배치에 맞게 세로 <strong>5</strong> × 가로 <strong>4</strong> 그리드를 설정하고, 각 버튼 영역을 드래그로 지정하세요.',
      'step1.height': '세로 (H)',
      'step1.width': '가로 (W)',
      'step1.rowsPh': '행 수',
      'step1.colsPh': '열 수',
      'step1.build': '그리드 만들기',
      'step1.reset': '초기화',
      'step1.other': '기타',
      'step1.help': '드래그로 버튼 영역을 선택하세요. 선택된 영역을 클릭하면 취소됩니다.',
      'step2.title': '이미지 업로드',
      'step2.desc': '분할할 이미지를 업로드하세요. 드래그&드롭, 파일 선택, 또는 Ctrl+V를 사용할 수 있습니다.',
      'step2.dropHint': '이미지를 여기에 드래그하거나',
      'step2.pick': '파일 선택',
      'step2.or': '또는 Ctrl+V로 붙여넣기',
      'step3.title': '이미지 자르기',
      'step3.desc': '그리드 비율에 맞게 자를 영역을 선택하세요. 핸들을 드래그해서 크기를 조절할 수 있습니다.',
      'step3.cropContinue': '자르기 & 계속',
      'step4.title': '분할 & 다운로드',
      'step4.desc': '레이아웃에 맞게 분할된 결과입니다. 유형을 선택한 뒤 ZIP 파일로 다운로드하세요.',
      'step4.previewHeading': '분할 미리보기',
      'step4.typeHeading': '타일 유형 선택',
      'step4.typeDescHTML': '<strong>버튼 박스 · 미디어 플레이어 · 밝기 조절 · 볼륨 조절</strong>에 해당하는 타일을 체크하세요.<br>(투명도 조절을 위해 사용됩니다)',
      'step4.warn': '⚠️ 미디어 플레이어는 음악 재생 시 설정한 이미지가 나오지 않으므로 설정을 권장하지 않습니다.<br>버튼 박스는 확장할 때 설정한 이미지가 동시에 확장될 수 있습니다.',
      'step4.afterHeading': '다운로드 후',
      'step4.afterHTML': '다운로드한 ZIP 파일을 휴대폰에서 압축 해제한 뒤, <strong>GoodLock → QuickStar → 패널 스타일 편집</strong>에서 각 타일에 이미지를 하나씩 적용해 주세요.',
      'nav.next': '다음',
      'nav.back': '이전',
      'nav.restart': '처음으로',
      'nav.zip': 'ZIP 다운로드',
    },
    en: {
      'intro.desc': "Easily slice your own image to apply<br>to the status bar's Quick Settings buttons",
      'intro.creator': 'Creator:',
      'intro.creatorName': 'Sangyeon Park',
      'intro.sourceCode': 'Source code:',
      'intro.start': 'Get started',
      'header.subtitle': 'Image slicing tool for Samsung Galaxy One UI status bar buttons',
      'step.layout': 'Layout',
      'step.image': 'Image',
      'step.crop': 'Crop',
      'step.download': 'Download',
      'step1.title': 'Set up the layout',
      'step1.desc': "Enter the full grid size of the status bar, then drag to assign each button's region.",
      'step1.egLabelPhone': 'One UI Quick Settings',
      'step1.egLabelGrid': '5 × 4 grid setup',
      'step1.egDescHTML': 'As in the example above, set a <strong>5</strong>-row × <strong>4</strong>-column grid matching the One UI Quick Settings panel layout, and drag to assign each button region.',
      'step1.height': 'Height (H)',
      'step1.width': 'Width (W)',
      'step1.rowsPh': 'Rows',
      'step1.colsPh': 'Cols',
      'step1.build': 'Build grid',
      'step1.reset': 'Reset',
      'step1.other': 'Other',
      'step1.help': 'Drag to select a button region. Click a selected region to deselect.',
      'step2.title': 'Upload image',
      'step2.desc': 'Upload the image to be sliced. Use drag-and-drop, file picker, or Ctrl+V.',
      'step2.dropHint': 'Drag your image here, or',
      'step2.pick': 'Choose file',
      'step2.or': 'or paste with Ctrl+V',
      'step3.title': 'Crop image',
      'step3.desc': 'Select the crop region matching the grid ratio. Drag the handles to resize.',
      'step3.cropContinue': 'Crop & continue',
      'step4.title': 'Slice & download',
      'step4.desc': 'Here are the slices for your layout. Pick the tile types, then download as a ZIP.',
      'step4.previewHeading': 'Slice preview',
      'step4.typeHeading': 'Tile type selection',
      'step4.typeDescHTML': 'Check tiles that correspond to <strong>Button box · Media player · Brightness · Volume</strong>.<br>(Used for transparency adjustment)',
      'step4.warn': "⚠️ Media player is not recommended — the chosen image won't appear during music playback.<br>The button box may expand the set image when expanded.",
      'step4.afterHeading': 'After Download',
      'step4.afterHTML': 'Extract the downloaded ZIP file on your phone, then go to <strong>GoodLock → QuickStar → Edit Panel Style</strong> and apply each image to its tile one by one.',
      'nav.next': 'Next',
      'nav.back': 'Back',
      'nav.restart': 'Restart',
      'nav.zip': 'Download ZIP',
    },
    zh: {
      'intro.desc': '轻松将您自己的图像分割并应用到<br>状态栏快捷设置按钮',
      'intro.creator': '制作者：',
      'intro.creatorName': 'Sangyeon Park',
      'intro.sourceCode': '源代码：',
      'intro.start': '开始使用',
      'header.subtitle': 'Samsung Galaxy One UI 状态栏按钮图像分割工具',
      'step.layout': '布局',
      'step.image': '图像',
      'step.crop': '裁剪',
      'step.download': '下载',
      'step1.title': '设置布局',
      'step1.desc': '输入状态栏的整体网格大小，然后拖动以指定每个按钮的位置。',
      'step1.egLabelPhone': 'One UI 快捷设置',
      'step1.egLabelGrid': '5 × 4 网格设置',
      'step1.egDescHTML': '如上例所示，按 One UI 快捷设置面板的按钮布局设置 <strong>5</strong> 行 × <strong>4</strong> 列网格，然后拖动指定每个按钮区域。',
      'step1.height': '高 (H)',
      'step1.width': '宽 (W)',
      'step1.rowsPh': '行数',
      'step1.colsPh': '列数',
      'step1.build': '创建网格',
      'step1.reset': '重置',
      'step1.other': '其他',
      'step1.help': '拖动以选择按钮区域。点击已选区域可取消选择。',
      'step2.title': '上传图像',
      'step2.desc': '上传要分割的图像。可使用拖放、文件选择或 Ctrl+V。',
      'step2.dropHint': '将图像拖到此处，或',
      'step2.pick': '选择文件',
      'step2.or': '或使用 Ctrl+V 粘贴',
      'step3.title': '裁剪图像',
      'step3.desc': '选择符合网格比例的裁剪区域。拖动手柄可调整大小。',
      'step3.cropContinue': '裁剪并继续',
      'step4.title': '分割并下载',
      'step4.desc': '这是按布局分割后的结果。请选择类型，然后下载为 ZIP 文件。',
      'step4.previewHeading': '分割预览',
      'step4.typeHeading': '选择磁贴类型',
      'step4.typeDescHTML': '勾选对应 <strong>按钮框 · 媒体播放器 · 亮度 · 音量</strong> 的磁贴。<br>（用于透明度调整）',
      'step4.warn': '⚠️ 不建议设置媒体播放器，因为播放音乐时不会显示设定的图像。<br>按钮框在展开时可能会同时扩展设定的图像。',
      'step4.afterHeading': '下载之后',
      'step4.afterHTML': '在手机上解压下载的 ZIP 文件，然后进入 <strong>GoodLock → QuickStar → 编辑面板样式</strong>，将每个图像逐一应用到对应的磁贴。',
      'nav.next': '下一步',
      'nav.back': '上一步',
      'nav.restart': '重新开始',
      'nav.zip': '下载 ZIP',
    },
  };

  const STORAGE_KEY = 'qs.lang';
  const DEFAULT_LANG = 'en';
  const FALLBACK_LANG = 'ko';
  const LANG_LABELS = { ko: '한국어', en: 'English', zh: '中文' };

  let current = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  if (!DICT[current]) current = DEFAULT_LANG;

  function lookup(lang, key) {
    return DICT[lang]?.[key] ?? DICT[FALLBACK_LANG][key];
  }

  function apply(lang) {
    current = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = lookup(lang, el.getAttribute('data-i18n'));
      if (val != null) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const val = lookup(lang, el.getAttribute('data-i18n-html'));
      if (val != null) el.innerHTML = val;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const val = lookup(lang, el.getAttribute('data-i18n-placeholder'));
      if (val != null) el.placeholder = val;
    });

    document.querySelectorAll('.lang-option').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    document.querySelectorAll('.lang-current').forEach(el => {
      el.textContent = LANG_LABELS[lang] || lang;
    });
  }

  function bindMenus() {
    document.querySelectorAll('.lang-trigger').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const menu = btn.closest('.lang-menu');
        const wasOpen = menu.classList.contains('open');
        document.querySelectorAll('.lang-menu').forEach(m => m.classList.remove('open'));
        if (!wasOpen) menu.classList.add('open');
      });
    });
    document.querySelectorAll('.lang-option').forEach(opt => {
      opt.addEventListener('click', e => {
        e.stopPropagation();
        apply(opt.dataset.lang);
        document.querySelectorAll('.lang-menu').forEach(m => m.classList.remove('open'));
      });
    });
    document.addEventListener('click', () => {
      document.querySelectorAll('.lang-menu').forEach(m => m.classList.remove('open'));
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindMenus();
    apply(current);
  });

  return { apply, get: () => current };
})();
