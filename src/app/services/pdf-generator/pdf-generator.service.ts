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
   * Creates a PDF from an HTML string
   * @param html The HTML element to create a PDF from
   */
  public async createPdfFromHtml(html: Element): Promise<void> {
    this.#pdfGenerator.setFillColor(255, 253, 248);
    this.#pdfGenerator.setFont('Geist');
    this.#pdfGenerator.setFont('GeistMono-SemiBold');
    this.#pdfGenerator.setCharSpace(0);

    await this.#pdfGenerator.html(html as HTMLElement, {
      callback: (doc: jsPDF): void => {
        doc.output('dataurlnewwindow');
      },
      margin: [10, 10, 10, 10],
      html2canvas: {
        letterRendering: true,
      },
      autoPaging: 'text',
      width: 180,
      windowWidth: 650,
    });
  }
}
