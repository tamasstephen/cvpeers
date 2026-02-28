export const applySummaryListNormalizerStep = (container: HTMLElement): void => {
  const orderedLists = Array.from(container.querySelectorAll('ol'));
  orderedLists.forEach((orderedList): void => {
    const hasBulletListItems = orderedList.querySelector('li[data-list="bullet"]') !== null;
    if (hasBulletListItems) {
      const unorderedList = document.createElement('ul');
      Array.from(orderedList.attributes).forEach((attribute): void => {
        unorderedList.setAttribute(attribute.name, attribute.value);
      });
      unorderedList.innerHTML = orderedList.innerHTML;
      orderedList.replaceWith(unorderedList);
    }
  });

  const unorderedLists = Array.from(container.querySelectorAll('ul'));
  unorderedLists.forEach((unorderedList): void => {
    const listContainer = document.createElement('div');
    listContainer.setAttribute('style', 'display: flex; flex-direction: column; gap: 6px;');
    Array.from(unorderedList.attributes).forEach((attribute): void => {
      listContainer.setAttribute(attribute.name, attribute.value);
    });

    Array.from(unorderedList.children).forEach((child): void => {
      if (!(child instanceof HTMLLIElement)) {
        listContainer.appendChild(child);
        return;
      }

      const indentLevel =
        Array.from(child.classList)
          .map((className): number | null =>
            className.startsWith('ql-indent-') ? Number(className.replace('ql-indent-', '')) : null
          )
          .find((value): value is number => value !== null) ?? 0;
      const indentOffset = indentLevel * 18;

      const row = document.createElement('div');
      row.setAttribute(
        'style',
        `position: relative; padding-left: ${indentOffset + 14}px; font-family: 'Geist'; font-size: 0.875rem; line-height: 1.5;`
      );

      const bullet = document.createElement('span');
      bullet.innerHTML = '&#8226;';
      bullet.setAttribute(
        'style',
        `position: absolute; left: ${indentOffset}px; top: 0; font-family: 'Geist-SemiBold'; font-size: 0.875rem; line-height: 1.5;`
      );

      const content = document.createElement('div');
      content.setAttribute(
        'style',
        "display: block; font-family: 'Geist'; font-size: 0.875rem; line-height: 1.5; white-space: normal;"
      );
      content.innerHTML = child.innerHTML;

      row.appendChild(bullet);
      row.appendChild(content);
      listContainer.appendChild(row);
    });

    unorderedList.replaceWith(listContainer);
  });
};
