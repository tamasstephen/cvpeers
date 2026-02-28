const ensureStyle = (styles: string[], property: string, value: string): void => {
  const normalizedProperty = property.toLowerCase();
  const hasProperty = styles.some((style): boolean =>
    style.trim().toLowerCase().startsWith(`${normalizedProperty}:`)
  );
  if (!hasProperty) {
    styles.push(`${property}: ${value}`);
  }
};

const sanitizeElementStyles = (element: Element): void => {
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

  Array.from(element.children).forEach((child): void => sanitizeElementStyles(child));
};

export const applySummarySanitizerStep = (container: HTMLElement): void => {
  container.querySelectorAll('span.ql-ui').forEach((element): void => element.remove());
  Array.from(container.children).forEach((element): void => sanitizeElementStyles(element));
};
