import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import '../../assets/fonts/Geist-SemiBold-normal.js';
import '../../assets/fonts/Geist-Variable_pdf-normal.js';
import '../../assets/fonts/GeistMono-SemiBold-bold.js';

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  /**
   * The jsPDF instance used to generate the PDF
   */
  #pdfGenerator: jsPDF = new jsPDF({ unit: 'mm', format: 'a4' });

  /**
   * Creates a deep clone of the provided element and copies the computed styles of the
   * original tree into inline styles on the clone so layout is preserved during PDF rendering.
   * @param element The HTMLElement to clone together with its computed styles.
   * @returns A cloned HTMLElement with computed styles applied inline.
   */
  #cloneNodeWithInlineStyles(element: HTMLElement): HTMLElement {
    const clone = element.cloneNode(true) as HTMLElement;

    const sourceElements: Element[] = [element, ...Array.from(element.querySelectorAll('*'))];
    const clonedElements: Element[] = [clone, ...Array.from(clone.querySelectorAll('*'))];

    sourceElements.forEach((source, index): void => {
      const target = clonedElements[index];
      if (!(source instanceof HTMLElement) || !(target instanceof HTMLElement)) {
        return;
      }

      const computedStyle = window.getComputedStyle(source);
      const styleDeclaration = Array.from(computedStyle)
        .map((property): string => `${property}: ${computedStyle.getPropertyValue(property)};`)
        .join(' ');

      const existingStyle = target.getAttribute('style');
      target.setAttribute(
        'style',
        existingStyle ? `${styleDeclaration} ${existingStyle}` : styleDeclaration
      );
    });

    return clone;
  }

  /**
   * Adds Geist font to all HTML tags in a string
   * @param htmlString The HTML string to process
   * @returns Processed HTML string with Geist font added to all tags
   */
  public addGeistFontToHtml(htmlString: string): string {
    // If the string is empty or not HTML, return as is
    if (!htmlString || !htmlString.includes('<')) {
      return htmlString;
    }

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    // Recursive function to process all elements
    const processElement = (element: Element): void => {
      // Add font-family to current element
      const currentStyle = element.getAttribute('style') ?? '';
      if (!currentStyle.includes('font-family')) {
        element.setAttribute(
          'style',
          `font-family: 'Geist', sans-serif; font-size: 0.875rem; ${currentStyle}`
        );
      }

      // Process all child elements
      Array.from(element.children).forEach((child): void => {
        processElement(child);
      });
    };

    // Process all root elements
    Array.from(tempDiv.children).forEach((element): void => {
      processElement(element);
    });

    return tempDiv.innerHTML;
  }

  /**
   * Parses summary HTML to ensure PDF-friendly inline styles and list semantics.
   * - If an <ol> contains <li data-list="bullet"> items, convert that <ol> to a <ul>.
   * - Replace <strong>...</strong> with <span style="font-family: 'GeistMono-SemiBold'; font-weight: bold;">...</span>
   */
  public parseSummaryHtml(htmlString: string): string {
    if (!htmlString) return htmlString;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    // Remove Quill helper spans that interfere with rendering
    tempDiv.querySelectorAll('span.ql-ui').forEach((el): void => el.remove());

    // Convert bullet-marked ordered lists to unordered lists
    const orderedLists = Array.from(tempDiv.querySelectorAll('ol'));
    orderedLists.forEach((ol): void => {
      const hasBulletLis = ol.querySelector('li[data-list="bullet"]') !== null;
      if (hasBulletLis) {
        const ul = document.createElement('ul');
        // Preserve classes and inline style from the original <ol>
        Array.from(ol.attributes).forEach((attr): void => {
          ul.setAttribute(attr.name, attr.value);
        });
        ul.innerHTML = ol.innerHTML;
        ol.replaceWith(ul);
      }
    });

    // Normalise unordered lists to a static layout to avoid bullet misalignment in PDFs
    const unorderedLists = Array.from(tempDiv.querySelectorAll('ul'));
    unorderedLists.forEach((ul): void => {
      const listContainer = document.createElement('div');
      listContainer.setAttribute('style', 'display: flex; flex-direction: column; gap: 6px;');
      Array.from(ul.attributes).forEach((attr): void => {
        listContainer.setAttribute(attr.name, attr.value);
      });

      Array.from(ul.children).forEach((child): void => {
        if (!(child instanceof HTMLLIElement)) {
          listContainer.appendChild(child);
          return;
        }

        const indentLevel =
          Array.from(child.classList)
            .map((cls): number | null =>
              cls.startsWith('ql-indent-') ? Number(cls.replace('ql-indent-', '')) : null
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

      ul.replaceWith(listContainer);
    });

    // Replace <strong> with inline-styled <span>
    const strongs = Array.from(tempDiv.querySelectorAll('strong'));
    strongs.forEach((strongEl): void => {
      const span = document.createElement('span');
      span.setAttribute('style', "font-family: 'Geist-SemiBold'; font-weight: bold;");
      // Keep existing inline styles if present
      const existingStyle = strongEl.getAttribute('style');
      if (existingStyle) {
        span.setAttribute('style', `${span.getAttribute('style')}; ${existingStyle}`);
      }
      span.innerHTML = strongEl.innerHTML;
      strongEl.replaceWith(span);
    });

    // Sanitize inline styles to remove background colors and enforce readable text color
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
  }

  /**
   * Generates a PDF that mirrors the provided HTML element, including its computed layout.
   * The method clones the element with inline styles, renders it off-screen for html2canvas,
   * and streams the result to a new browser window as a Data URL.
   * @param html The HTML element to convert into a PDF document.
   */
  public async createPdfFromHtml(html: Element): Promise<void> {
    const target = html as HTMLElement;
    this.#pdfGenerator = new jsPDF({ unit: 'mm', format: 'a4' });
    this.#pdfGenerator.setFillColor(255, 253, 248);
    this.#pdfGenerator.setFont('Geist');
    this.#pdfGenerator.setFont('Geist-SemiBold');
    this.#pdfGenerator.setFont('GeistMono-SemiBold');

    const clonedTarget = this.#cloneNodeWithInlineStyles(target);
    const container = document.createElement('div');
    const originalWidth = target.getBoundingClientRect().width || target.clientWidth || 650;
    const margin = 10;
    const pageWidth = this.#pdfGenerator.internal.pageSize.getWidth();
    const pdfContentWidth = Math.max(pageWidth - margin * 2, 10);
    const pxPerMm = 96 / 25.4;
    const pdfContentWidthPx = Math.floor(pdfContentWidth * pxPerMm);

    clonedTarget.style.maxWidth = 'none';
    clonedTarget.style.width = `${originalWidth}px`;

    container.style.position = 'fixed';
    container.style.top = '-10000px';
    container.style.left = '-10000px';
    container.style.width = `${originalWidth}px`;
    container.style.pointerEvents = 'none';
    container.style.opacity = '0';
    container.appendChild(clonedTarget);
    document.body.appendChild(container);

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const images = Array.from(clonedTarget.querySelectorAll('img'));
      await Promise.all(
        images.map(
          (img): Promise<void> =>
            img.complete && img.naturalWidth > 0
              ? Promise.resolve()
              : new Promise((resolve): void => {
                  img.addEventListener('load', (): void => resolve(), { once: true });
                  img.addEventListener('error', (): void => resolve(), { once: true });
                })
        )
      );

      await this.#pdfGenerator.html(clonedTarget, {
        callback: (doc: jsPDF): void => {
          doc.output('dataurlnewwindow');
        },
        margin: [margin, margin, margin, margin],
        html2canvas: {
          letterRendering: true,
        },
        autoPaging: 'text',
        width: pdfContentWidth,
        windowWidth: pdfContentWidthPx,
      });
    } finally {
      document.body.removeChild(container);
    }
  }
}
