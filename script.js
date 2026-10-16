(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const textInput = $('textInput');
  const docTitle = $('docTitle');
  const pageSize = $('pageSize');
  const fontSize = $('fontSize');
  const lineSpacing = $('lineSpacing');
  const margin = $('margin');
  const previewSection = $('previewSection');
  const previewPaper = $('previewPaper');

  $('year').textContent = new Date().getFullYear().toLocaleString('bn-BD');

  function countText() {
    const text = textInput.value;
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/u).length : 0;
    $('wordCount').textContent = `${words.toLocaleString('bn-BD')} শব্দ · ${text.length.toLocaleString('bn-BD')} অক্ষর`;
    $('fontSizeValue').textContent = `${fontSize.value} pt`;
    $('lineSpacingValue').textContent = (Number(lineSpacing.value) / 10).toLocaleString('bn-BD', {minimumFractionDigits:1, maximumFractionDigits:1});
  }

  function makePreview() {
    previewPaper.replaceChildren();
    const title = docTitle.value.trim();
    if (title) {
      const heading = document.createElement('h1');
      heading.textContent = title;
      previewPaper.appendChild(heading);
    }
    const content = document.createElement('div');
    content.className = 'print-content';
    content.textContent = textInput.value || 'এখানে আপনার লেখা দেখা যাবে।';
    previewPaper.appendChild(content);
    previewPaper.style.fontSize = `${fontSize.value}pt`;
    previewPaper.style.lineHeight = `${Number(lineSpacing.value) / 10}`;
    previewPaper.style.padding = `${margin.value}mm`;
    previewPaper.style.fontFamily = 'system-ui, "Noto Sans Bengali", "Nirmala UI", "Vrinda", sans-serif';
    previewPaper.style.width = pageSize.value === 'A4' ? '210mm' : '216mm';
    previewPaper.style.minHeight = pageSize.value === 'A4' ? '297mm' : '279mm';
    previewPaper.style.maxWidth = '100%';
    previewPaper.style.marginInline = 'auto';
  }

  function showPreview() {
    makePreview();
    previewSection.hidden = false;
    previewSection.scrollIntoView({behavior:'smooth', block:'start'});
  }

  function savePDF() {
    if (!textInput.value.trim() && !docTitle.value.trim()) {
      textInput.focus();
      alert('আগে বাংলা বা ইংরেজি কিছু লেখা পেস্ট করুন।');
      return;
    }
    makePreview();
    document.documentElement.style.setProperty('--pdf-margin', `${margin.value}mm`);
    document.documentElement.style.setProperty('--print-font-size', `${fontSize.value}pt`);
    document.documentElement.style.setProperty('--print-line-height', `${Number(lineSpacing.value) / 10}`);
    const oldTitle = document.title;
    const safeTitle = (docTitle.value.trim() || 'Bangla-PDF').replace(/[\\/:*?"<>|]/g, '-').slice(0, 100);
    document.title = safeTitle;
    document.body.classList.add('print-preview');
    const printStyle = document.createElement('style');
    printStyle.id = 'runtimePrintStyle';
    printStyle.textContent = `@media print{@page{size:${pageSize.value};margin:${margin.value}mm}body.print-preview #previewPaper{padding:0!important;width:auto!important;min-height:0!important;font-size:${fontSize.value}pt!important;line-height:${Number(lineSpacing.value)/10}!important}body.print-preview #previewPaper h1{font-size:${Math.round(Number(fontSize.value)*1.5)}pt!important}}`;
    document.head.appendChild(printStyle);
    const cleanup = () => {
      document.body.classList.remove('print-preview');
      document.title = oldTitle;
      printStyle.remove();
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup, {once:true});
    // Some mobile browsers do not reliably fire afterprint, so restore on focus too.
    window.addEventListener('focus', () => { if (document.body.classList.contains('print-preview')) cleanup(); }, {once:true});
    window.print();
  }

  textInput.addEventListener('input', countText);
  fontSize.addEventListener('input', countText);
  lineSpacing.addEventListener('input', countText);
  $('clearBtn').addEventListener('click', () => {
    if (!textInput.value && !docTitle.value) return;
    if (confirm('আপনার লেখা ও শিরোনাম মুছে ফেলবেন?')) {
      textInput.value = '';
      docTitle.value = '';
      countText();
      textInput.focus();
      if (!previewSection.hidden) makePreview();
    }
  });
  $('sampleBtn').addEventListener('click', () => {
    docTitle.value = 'আমার নোট';
    textInput.value = 'বাংলা ও ইংরেজি PDF তৈরির নমুনা\n\nএখানে আপনার প্রয়োজনীয় লেখা লিখুন বা পেস্ট করুন। বাংলা যুক্তাক্ষর, যতিচিহ্ন ও ইংরেজি লেখা একসঙ্গে ব্যবহার করতে পারবেন।\n\nYou can paste English text here as well. Use the settings to change font size, line spacing, paper size and margins.';
    countText();
    if (!previewSection.hidden) makePreview();
  });
  $('previewBtn').addEventListener('click', showPreview);
  $('closePreviewBtn').addEventListener('click', () => { previewSection.hidden = true; });
  $('pdfBtn').addEventListener('click', savePDF);
  [docTitle, pageSize, fontSize, lineSpacing, margin].forEach((el) => el.addEventListener('change', () => {
    countText();
    if (!previewSection.hidden) makePreview();
  }));
  countText();
})();
