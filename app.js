(() => {
  'use strict';

  const config = window.FLOADMIT_CONFIG || {};
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const safeEmail = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(config.contactEmail || '') ? config.contactEmail : '';
  const safeHttps = value => {
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; }
    catch { return ''; }
  };
  const bookingUrl = safeHttps(config.bookingUrl);
  const productionUrl = safeHttps(config.productionUrl);

  let pilotBrief = '';
  let toastTimer;
  let lastDialogOpener = null;

  function announce(message) {
    clearTimeout(toastTimer);
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('visible');
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 4200);
  }

  function openDialog(dialog,opener=document.activeElement) {
    lastDialogOpener = opener;
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
  function closeDialog(dialog) { dialog.close(); }
  function downloadText(filename,text) {
    const blob = new Blob([text],{type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = filename;
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url),15000);
  }

  $$('dialog').forEach(dialog => {
    dialog.addEventListener('click',event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog(dialog);
    });
    dialog.addEventListener('close',() => {
      document.body.classList.remove('modal-open');
      if (lastDialogOpener && document.contains(lastDialogOpener)) lastDialogOpener.focus({preventScroll:true});
    });
    $$('[data-close-dialog]',dialog).forEach(button => button.addEventListener('click',() => closeDialog(dialog)));
  });
  $$('[data-open-pilot]').forEach(button => button.addEventListener('click',() => {
    const returnTarget = $('#site-navigation').contains(button) && menu.getAttribute('aria-expanded') === 'true' ? menu : button;
    closeNavigation(); openDialog($('#pilot-dialog'),returnTarget);
  }));
  $$('[data-open-privacy]').forEach(button => button.addEventListener('click',() => openDialog($('#privacy-dialog'),button)));

  $('#pilot-form').addEventListener('submit',event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const form = new FormData(event.currentTarget);
    const value = name => String(form.get(name) || '').trim();
    if (!value('organization') || !value('role') || !value('name')) { announce('Please add your organization, role, and name.'); return; }
    pilotBrief = [
      'FLOadmit | Referral-to-care pilot brief',
      'Prepared by the visitor for discussion — no enquiry has been submitted.','',
      `Organization: ${value('organization')}`,`Contact: ${value('name')}`,`Role: ${value('role')}`,`Work email: ${value('email')}`,'',
      `Starting workflow: ${value('workflow')}`,'','What we would like to make easier:',value('notes') || 'To be discussed with the team.','',
      'Suggested first conversation:',
      '1. Map the referral documents, medical-fit criteria, and receiving facility capabilities.',
      '2. Define the insurance inputs, payer rules, and rates used for financial estimates.',
      '3. Agree on the 24-hour and 72-hour care-plan templates, source references, and missing-information checks.',
      '4. Name the staff responsible for reviewing assessments, insurance estimates, and care-plan drafts.',
      '5. For a discharge-report workflow, define the documentation-completion signal and approved output destination.',
      '6. Scope any Epic access and reviewed writeback with the hospital IT team.',
      '7. Agree on data handling and measure preparation time, correction effort, and completeness.','',
      'This brief contains general planning information only. Do not include patient information.'
    ].join('\n');
    $('#pilot-preview').textContent = pilotBrief;
    $('#pilot-form').hidden = true; $('#pilot-result').hidden = false;
    if (safeEmail) {
      $('#email-brief').href = `mailto:${safeEmail}?subject=${encodeURIComponent(`FLOadmit pilot — ${value('organization')}`)}&body=${encodeURIComponent(pilotBrief)}`;
      $('#email-brief').hidden = false; $('#email-explanation').hidden = false;
    }
    if (bookingUrl) { $('#book-call').href = bookingUrl; $('#book-call').hidden = false; }
    $('#download-brief').focus();
  });
  $('#download-brief').addEventListener('click',() => {
    downloadText('FLOadmit_Pilot_Brief.txt',pilotBrief);
    announce('Pilot brief download started.');
  });
  $('#edit-brief').addEventListener('click',() => {
    $('#pilot-result').hidden = true; $('#pilot-form').hidden = false;
    $('#pilot-form input').focus();
  });

  const menu = $('#menu-toggle');
  function closeNavigation() {
    menu.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-label','Open navigation');
    $('#site-navigation').classList.remove('is-open');
  }
  menu.addEventListener('click',() => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open ? 'Close navigation' : 'Open navigation');
    $('#site-navigation').classList.toggle('is-open',open);
  });
  $$('#site-navigation a').forEach(link => link.addEventListener('click',closeNavigation));
  document.addEventListener('keydown',event => { if (event.key === 'Escape') closeNavigation(); });
  document.addEventListener('click',event => { if (!event.target.closest('.site-header')) closeNavigation(); });
  if (safeEmail) { $('#footer-email').href = `mailto:${safeEmail}`; $('#footer-email').hidden = false; }
  if (productionUrl) {
    const canonical = document.createElement('link'); canonical.rel = 'canonical'; canonical.href = productionUrl; document.head.appendChild(canonical);
    const og = document.createElement('meta'); og.setAttribute('property','og:url'); og.content = productionUrl; document.head.appendChild(og);
  }
  $('#founder-name').textContent = config.founderName || 'Arnav Nambiar';
  $('#copyright-year').textContent = String(new Date().getFullYear());
})();
