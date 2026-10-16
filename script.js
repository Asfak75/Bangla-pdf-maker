(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const textInput = $('textInput');
  const statusMessage = $('statusMessage');
  $('year').textContent = new Date().getFullYear().toLocaleString('bn-BD');

  // Fixed PDF defaults: 8 mm margin, 20 px font, 1.2 line spacing.
  // The user-facing controls are intentionally hidden/removed.
  function countText() {
    const text = textInput.value;
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/u).length : 0;
    $('wordCount').textContent = `${words.toLocaleString('bn-BD')} শব্দ · ${text.length.toLocaleString('bn-BD')} অক্ষর`;
  }

  function getPrintDocument() {
    let printDocument = $('printDocument');
    if (!printDocument) {
      printDocument = document.createElement('article');
      printDocument.id = 'printDocument';
      printDocument.setAttribute('aria-label', 'PDF ডকুমেন্ট');
      document.body.appendChild(printDocument);
    }
    printDocument.textContent = textInput.value;
    return printDocument;
  }

  function savePDF() {
    if (!textInput.value.trim()) {
      statusMessage.textContent = 'আগে বাংলা বা ইংরেজি লেখা পেস্ট করুন।';
      textInput.focus();
      return;
    }
    statusMessage.textContent = 'প্রিন্ট উইন্ডো খুলছে—সেখানে “Save as PDF” নির্বাচন করুন।';
    const oldTitle = document.title;
    const firstLine = textInput.value.trim().split(/\r?\n/u).find(line => line.trim()) || 'bangla-document';
    const safeTitle = firstLine.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').slice(0, 80) || 'bangla-document';
    document.title = safeTitle;
    getPrintDocument();
    document.body.classList.add('printing');

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      document.body.classList.remove('printing');
      document.title = oldTitle;
      window.removeEventListener('afterprint', cleanup);
      window.removeEventListener('focus', onFocus);
    };
    const onFocus = () => window.setTimeout(cleanup, 250);
    window.addEventListener('afterprint', cleanup, { once: true });
    window.addEventListener('focus', onFocus, { once: true });
    window.print();
  }

  textInput.addEventListener('input', () => {
    countText();
    statusMessage.textContent = '';
  });

  $('clearBtn').addEventListener('click', () => {
    if (!textInput.value) return;
    if (window.confirm('আপনার লেখা মুছে ফেলবেন?')) {
      textInput.value = '';
      countText();
      statusMessage.textContent = 'লেখা মুছে ফেলা হয়েছে।';
      textInput.focus();
    }
  });

  $('sampleBtn').addEventListener('click', () => {
    textInput.value = `বাংলাদেশ আমাদের প্রিয় মাতৃভূমি। এ দেশের প্রাকৃতিক সৌন্দর্য, নদ-নদী, সবুজ মাঠ এবং মানুষের আন্তরিকতা আমাদের মুগ্ধ করে।\n\nশিক্ষা মানুষের জীবনে উন্নতির পথ খুলে দেয়। নিয়মিত পড়াশোনা, সময়ের সঠিক ব্যবহার এবং কঠোর পরিশ্রমের মাধ্যমে জীবনে সফলতা অর্জন করা সম্ভব।\n\nবাংলা যুক্তাক্ষর পরীক্ষা: ক্ষ, জ্ঞ, ত্র, শ্র, ষ্ট, ন্দ, প্র, ক্র, গ্র, স্ত।\n\nBangladesh is a beautiful country. Education, honesty, and hard work can help us build a better future.\n\nসংখ্যা: ০১২৩৪৫৬৭৮৯ | 0123456789`;
    countText();
    statusMessage.textContent = 'ডেমো লেখা যোগ করা হয়েছে। চাইলে নিজের লেখা দিয়ে বদলে নিন।';
    textInput.focus();
  });

  $('pdfBtn').addEventListener('click', savePDF);
  countText();
})();
