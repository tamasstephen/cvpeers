import { transformSummaryHtml } from './summary-transform.pipeline';

const parseSummaryHtmlFromMain = (htmlString: string): string => {
  if (!htmlString) {
    return htmlString;
  }

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;

  tempDiv.querySelectorAll('span.ql-ui').forEach((element): void => element.remove());

  const orderedLists = Array.from(tempDiv.querySelectorAll('ol'));
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

  const unorderedLists = Array.from(tempDiv.querySelectorAll('ul'));
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

  const strongElements = Array.from(tempDiv.querySelectorAll('strong'));
  strongElements.forEach((strongElement): void => {
    const span = document.createElement('span');
    span.setAttribute('style', "font-family: 'Geist-SemiBold'; font-weight: bold;");
    const existingStyle = strongElement.getAttribute('style');
    if (existingStyle) {
      span.setAttribute('style', `${span.getAttribute('style')}; ${existingStyle}`);
    }
    span.innerHTML = strongElement.innerHTML;
    strongElement.replaceWith(span);
  });

  const ensureStyle = (styles: string[], property: string, value: string): void => {
    const normalizedProperty = property.toLowerCase();
    const hasProperty = styles.some((style): boolean =>
      style.trim().toLowerCase().startsWith(`${normalizedProperty}:`)
    );
    if (!hasProperty) {
      styles.push(`${property}: ${value}`);
    }
  };

  const sanitizeElement = (element: Element): void => {
    if (element instanceof HTMLElement) {
      const style = element.getAttribute('style');
      if (style) {
        const sanitizedStyle = style
          .replace(/background(-color)?:[^;]+;?/gi, '')
          .replace(/background:[^;]+;?/gi, '')
          .trim();
        const styles: string[] = sanitizedStyle
          ? sanitizedStyle
              .split(';')
              .map((value): string => value.trim())
              .filter(Boolean)
          : [];

        ensureStyle(styles, 'color', '#323232');

        if (element.tagName === 'UL') {
          ensureStyle(styles, 'font-family', 'Geist');
          ensureStyle(styles, 'font-size', '0.875rem');
        }

        if (element.tagName === 'LI') {
          ensureStyle(styles, 'font-family', 'Geist');
          ensureStyle(styles, 'font-size', '0.875rem');
          ensureStyle(styles, 'list-style-position', 'outside');
        }

        if (element.tagName === 'SPAN') {
          const fontWeight = element.style.fontWeight;
          ensureStyle(styles, 'font-family', fontWeight === 'bold' ? 'Geist-SemiBold' : 'Geist');
          ensureStyle(styles, 'font-size', '0.875rem');
        }

        if (element.tagName === 'SPAN') {
          const fontWeight = element.style.fontWeight;
          ensureStyle(styles, 'font-family', fontWeight === 'bold' ? 'Geist-SemiBold' : 'Geist');
          ensureStyle(styles, 'font-size', '0.875rem');
        }

        if (styles.length > 0) {
          element.setAttribute('style', `${styles.join('; ')};`);
        } else {
          element.removeAttribute('style');
        }
      } else {
        const styles: string[] = [];
        ensureStyle(styles, 'color', '#323232');
        ensureStyle(
          styles,
          'font-family',
          element.style.fontWeight === 'bold' ? 'Geist-SemiBold' : 'Geist'
        );

        if (element.tagName === 'UL' || element.tagName === 'OL') {
          ensureStyle(styles, 'font-family', 'Geist');
          ensureStyle(styles, 'font-size', '0.875rem');
        }

        if (element.tagName === 'LI') {
          ensureStyle(styles, 'font-family', 'Geist');
          ensureStyle(styles, 'font-size', '0.875rem');
          ensureStyle(styles, 'list-style-position', 'outside');
        }

        if (element.tagName === 'SPAN') {
          const fontWeight = element.style.fontWeight;
          ensureStyle(styles, 'font-family', fontWeight === 'bold' ? 'Geist-SemiBold' : 'Geist');
          ensureStyle(styles, 'font-size', '0.875rem');
        }

        if (styles.length > 0) {
          element.setAttribute('style', `${styles.join('; ')};`);
        }
      }
    }

    Array.from(element.children).forEach((child): void => sanitizeElement(child));
  };

  Array.from(tempDiv.children).forEach((element): void => sanitizeElement(element));
  return tempDiv.innerHTML;
};

describe('summary transform compatibility with main parser', (): void => {
  const fixtures = [
    '<p style="background: red;"><strong>Bold</strong><span class="ql-ui"></span></p>',
    '<ol><li data-list="bullet">One</li><li data-list="bullet" class="ql-indent-2"><strong>Two</strong></li></ol>',
    '<p><span style="background-color: yellow;">A</span> <span style="font-size: 16px;">B</span></p>',
    '<ul><li>Alpha</li><li><strong style="letter-spacing: 0.1px;">Beta</strong></li></ul>',
  ];

  fixtures.forEach((fixture, index): void => {
    it(`matches main parser output for fixture ${index + 1}`, (): void => {
      const expected = parseSummaryHtmlFromMain(fixture);
      const actual = transformSummaryHtml(fixture);
      expect(actual).toBe(expected);
    });
  });
});
