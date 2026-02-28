import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import '../../assets/fonts/Geist-SemiBold-normal.js';
import '../../assets/fonts/Geist-Variable_pdf-normal.js';
import '../../assets/fonts/GeistMono-SemiBold-bold.js';
import {
  downloadPdfToNewWindow,
  removeLeadingBlankPage,
  renderHtmlPage,
} from './pdf-renderer.adapter';
import { transformSummaryHtml } from './summary-transform.pipeline';

const A4_WIDTH_PX = Math.round((210 * 96) / 25.4);
const A4_HEIGHT_PX = Math.round((297 * 96) / 25.4);

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  /**
   * The jsPDF instance used to generate the PDF
   */
  #pdfGenerator: jsPDF = new jsPDF({
    unit: 'px',
    format: [A4_WIDTH_PX, A4_HEIGHT_PX],
    hotfixes: ['px_scaling'],
  });

  /**
   * Creates a deep clone of the provided element and copies the computed styles of the
   * original tree into inline styles on the clone so layout is preserved during PDF rendering.
   * @param element The HTMLElement to clone together with its computed styles.
   * @returns A cloned HTMLElement with computed styles applied inline.
   */
  #cloneNodeWithInlineStyles(
    element: HTMLElement,
    options?: { stripHiddenStyles?: boolean }
  ): HTMLElement {
    const clone = element.cloneNode(true) as HTMLElement;
    const stripHiddenStyles = options?.stripHiddenStyles ?? false;

    const sourceElements: Element[] = [element, ...Array.from(element.querySelectorAll('*'))];
    const clonedElements: Element[] = [clone, ...Array.from(clone.querySelectorAll('*'))];

    sourceElements.forEach((source, index): void => {
      const target = clonedElements[index];
      if (!(source instanceof HTMLElement) || !(target instanceof HTMLElement)) {
        return;
      }

      const computedStyle = window.getComputedStyle(source);
      const isRoot = index === 0;
      const styleDeclaration = Array.from(computedStyle)
        .filter((property): boolean => {
          if (!stripHiddenStyles) return true;
          if (property === 'visibility') return false;
          if (
            isRoot &&
            (property === 'position' ||
              property === 'left' ||
              property === 'top' ||
              property === 'right' ||
              property === 'bottom' ||
              property === 'transform' ||
              property === 'opacity')
          ) {
            return false;
          }
          return true;
        })
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
    return transformSummaryHtml(htmlString);
  }

  /**
   * Generates a PDF that mirrors the provided HTML element, including its computed layout.
   * The method clones the element with inline styles, renders it off-screen for html2canvas,
   * and streams the result to a new browser window as a Data URL.
   * @param html The HTML element to convert into a PDF document.
   */
  public async createPdfFromHtml(html: Element): Promise<void> {
    const previewPages = Array.from(
      document.querySelectorAll('.cv-preview-page')
    ) as HTMLElement[];
    if (previewPages.length > 0) {
      await this.#createPdfFromPreview(previewPages);
      return;
    }

    const target = html as HTMLElement;
    this.#pdfGenerator = new jsPDF({
      unit: 'px',
      format: [A4_WIDTH_PX, A4_HEIGHT_PX],
      hotfixes: ['px_scaling'],
    });
    this.#pdfGenerator.setFillColor(255, 253, 248);
    this.#pdfGenerator.setFont('Geist');
    this.#pdfGenerator.setFont('Geist-SemiBold');
    this.#pdfGenerator.setFont('GeistMono-SemiBold');

    const clonedTarget = this.#cloneNodeWithInlineStyles(target, {
      stripHiddenStyles: true,
    });
    const container = document.createElement('div');
    const originalWidth = target.getBoundingClientRect().width || target.clientWidth || 650;
    const pageWidth = this.#pdfGenerator.internal.pageSize.getWidth();
    const baseScale = Math.min(1, pageWidth / Math.max(1, originalWidth));

    clonedTarget.style.maxWidth = 'none';
    clonedTarget.style.width = `${pageWidth}px`;
    clonedTarget.style.padding = '10mm';
    clonedTarget.style.boxSizing = 'border-box';
    clonedTarget.style.visibility = 'visible';
    clonedTarget.style.position = 'static';
    clonedTarget.style.left = '0';
    clonedTarget.style.top = '0';
    clonedTarget.style.transform = 'none';
    clonedTarget.style.opacity = '1';
    clonedTarget.querySelectorAll('*').forEach((node): void => {
      if (!(node instanceof HTMLElement)) return;
      node.style.visibility = 'visible';
    });
    clonedTarget.querySelectorAll('.cv-section-title, .cv-modern-section-title').forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      node.style.fontFamily = "'GeistMono-SemiBold', monospace";
      node.style.fontWeight = '700';
      if (!node.style.letterSpacing) {
        node.style.letterSpacing = '0.2px';
      }
    });

    container.style.position = 'fixed';
    container.style.top = '-10000px';
    container.style.left = '-10000px';
    container.style.width = `${pageWidth}px`;
    container.style.pointerEvents = 'none';
    container.style.opacity = '1';
    const wrapper = document.createElement('div');
    wrapper.style.width = `${pageWidth}px`;
    wrapper.style.padding = '10mm';
    wrapper.style.boxSizing = 'border-box';
    wrapper.style.overflowX = 'hidden';
    wrapper.style.overflowY = 'visible';
    wrapper.appendChild(clonedTarget);
    container.appendChild(wrapper);
    document.body.appendChild(container);

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      if (document.fonts?.load) {
        await Promise.all([
          document.fonts.load("normal 14px 'Geist'"),
          document.fonts.load("600 32px 'Geist-SemiBold'"),
          document.fonts.load("700 14px 'GeistMono-SemiBold'"),
        ]);
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

      const measuredWidthPx = Math.floor(wrapper.getBoundingClientRect().width);
      const renderWidthPx = measuredWidthPx > 100 ? measuredWidthPx : Math.floor(pageWidth);
      await renderHtmlPage({
        pdf: this.#pdfGenerator,
        source: wrapper,
        options: {
          margin: [0, 0, 0, 0],
          html2canvas: {
            letterRendering: true,
            scale: baseScale,
          },
          autoPaging: 'slice',
          width: pageWidth,
          windowWidth: renderWidthPx,
        },
      });
      downloadPdfToNewWindow(this.#pdfGenerator);
    } finally {
      document.body.removeChild(container);
    }
  }

  async #createPdfFromPreview(previewPages: HTMLElement[]): Promise<void> {
    const firstPage = previewPages[0];
    const pageRect = firstPage.getBoundingClientRect();
    const pageWidth = Math.max(1, Math.floor(pageRect.width));
    const pageHeight = Math.max(1, Math.floor(pageRect.height));

    this.#pdfGenerator = new jsPDF({
      unit: 'px',
      format: [pageWidth, pageHeight],
      hotfixes: ['px_scaling'],
    });

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
    if (document.fonts?.load) {
      await Promise.all([
        document.fonts.load("normal 14px 'Geist'"),
        document.fonts.load("600 32px 'Geist-SemiBold'"),
        document.fonts.load("700 14px 'GeistMono-SemiBold'"),
      ]);
    }

    for (let index = 0; index < previewPages.length; index += 1) {
      const page = previewPages[index];
      const pageClone = this.#cloneNodeWithInlineStyles(page);
      pageClone.style.boxShadow = 'none';
      pageClone.style.border = 'none';
      pageClone.style.background = '#fff';
      pageClone.style.margin = '0';
      pageClone.style.position = 'static';
      pageClone.style.transform = 'none';
      pageClone.style.overflow = 'hidden';

      pageClone.querySelectorAll('.cv-section-title, .cv-modern-section-title').forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        node.style.fontFamily = "'GeistMono-SemiBold', monospace";
        node.style.fontWeight = '700';
        if (!node.style.letterSpacing) {
          node.style.letterSpacing = '0.2px';
        }
      });

      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '-10000px';
      container.style.left = '-10000px';
      container.style.width = `${pageWidth}px`;
      container.style.pointerEvents = 'none';
      container.style.opacity = '1';
      container.appendChild(pageClone);
      document.body.appendChild(container);

      const images = Array.from(pageClone.querySelectorAll('img'));
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

      await renderHtmlPage({
        pdf: this.#pdfGenerator,
        source: pageClone,
        options: {
          margin: [0, 0, 0, 0],
          html2canvas: {
            letterRendering: true,
            scale: 1,
          },
          autoPaging: false,
          width: pageWidth,
          windowWidth: pageWidth,
        },
      });

      document.body.removeChild(container);
      if (index < previewPages.length - 1) {
        this.#pdfGenerator.addPage();
      }
    }

    removeLeadingBlankPage({
      pdf: this.#pdfGenerator,
      expectedPages: previewPages.length,
    });
    downloadPdfToNewWindow(this.#pdfGenerator);
  }
}
