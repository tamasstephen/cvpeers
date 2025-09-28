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
  #pdfGenerator: jsPDF = new jsPDF();

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
   * Creates a PDF from an HTML string
   * @param html The HTML element to create a PDF from
   */
  public async createPdfFromHtml(html: Element): Promise<void> {
    this.#pdfGenerator.setFillColor(255, 253, 248);
    this.#pdfGenerator.setFont('Geist');
    this.#pdfGenerator.setFont('Geist-SemiBold');
    this.#pdfGenerator.setFont('GeistMono-SemiBold');
    this.#pdfGenerator.setCharSpace(0);

    const target = html as HTMLElement;
    const computedWidth = Math.min(180, target.scrollWidth || 650);

    await this.#pdfGenerator.html(target, {
      callback: (doc: jsPDF): void => {
        doc.output('dataurlnewwindow');
      },
      margin: [10, 10, 10, 10],
      html2canvas: {
        letterRendering: true,
      },
      autoPaging: 'text',
      width: computedWidth,
      windowWidth: target.scrollWidth || 650,
    });
  }
}
