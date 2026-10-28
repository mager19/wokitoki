// Accessible tabs (WAI-ARIA tabs pattern, automatic activation).
// Without JS the tablist stays hidden and every panel is shown, so no content is lost.
for (const list of document.querySelectorAll('[role="tablist"]')) {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const panelOf = (tab) => document.getElementById(tab.getAttribute('aria-controls'));

  const select = (next, focus) => {
    for (const tab of tabs) {
      const on = tab === next;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      panelOf(tab).hidden = !on;
    }
    if (focus) next.focus();
  };

  list.addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (tab) select(tab, false);
  });

  list.addEventListener('keydown', (event) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    select(tabs[(keys[event.key] + tabs.length) % tabs.length], true);
  });

  select(tabs.find((t) => t.getAttribute('aria-selected') === 'true') ?? tabs[0], false);
  list.hidden = false;
}
