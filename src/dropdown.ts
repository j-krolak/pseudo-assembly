export type DropdownOption = {
  value: string;
  label: string;
  deletable?: boolean;
};

export type DropdownExtra = {
  onDelete?: (value: string) => void;
  addItem?: { label: string; onClick: () => void };
};

// Native <select> popups can't be styled consistently across browsers, so we
// render our own button + list instead.
export const createDropdown = (
  container: HTMLElement,
  options: DropdownOption[],
  initialValue: string,
  onSelect: (value: string) => void,
  extra?: DropdownExtra,
) => {
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'dropdown-toggle';

  const menu = document.createElement('div');
  menu.className = 'dropdown-menu';

  let currentValue = initialValue;

  const items = options.map((option) => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';

    const label = document.createElement('span');
    label.textContent = option.label;
    item.appendChild(label);

    item.addEventListener('click', () => {
      currentValue = option.value;
      toggle.textContent = option.label;
      renderMenu();
      container.classList.remove('open');
      onSelect(currentValue);
    });

    if (option.deletable && extra?.onDelete) {
      const del = document.createElement('span');
      del.className = 'dropdown-item-delete';
      del.textContent = '×';
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        extra.onDelete!(option.value);
      });
      item.appendChild(del);
    }

    return { value: option.value, element: item };
  });

  let addItemElement: HTMLElement | null = null;
  if (extra?.addItem) {
    const addEl = document.createElement('div');
    addEl.className = 'dropdown-item dropdown-item-add';
    addEl.textContent = extra.addItem.label;
    addEl.addEventListener('click', (e) => {
      e.stopPropagation();
      container.classList.remove('open');
      extra.addItem!.onClick();
    });
    addItemElement = addEl;
  }

  const renderMenu = () => {
    menu.replaceChildren(
      ...items
        .filter((item) => item.value !== currentValue)
        .map((item) => item.element),
      ...(addItemElement ? [addItemElement] : []),
    );
  };

  toggle.textContent =
    options.find((option) => option.value === currentValue)?.label ??
    currentValue;
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.dropdown.open').forEach((el) => {
      if (el !== container) el.classList.remove('open');
    });
    container.classList.toggle('open');
  });

  container.replaceChildren(toggle, menu);

  // Measure every option before filtering the selected one out, so the
  // dropdown's width stays stable no matter which option is selected.
  menu.replaceChildren(
    ...items.map((item) => item.element),
    ...(addItemElement ? [addItemElement] : []),
  );
  const width = Math.max(...items.map((item) => item.element.offsetWidth));
  toggle.style.width = menu.style.width = `${width}px`;

  renderMenu();
};

document.addEventListener('click', () => {
  document
    .querySelectorAll('.dropdown.open')
    .forEach((el) => el.classList.remove('open'));
});
