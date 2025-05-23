import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import '../../assets/fonts/Geist-Variable_pdf-normal.js';
import '../../assets/fonts/GeistMono-SemiBold-bold.js';
import '../../assets/fonts/Geist-SemiBold-normal.js';

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  constructor() {}

  #pdfGenerator: jsPDF = new jsPDF();

  /**
   * Adds Geist font to all HTML tags in a string
   * @param htmlString The HTML string to process
   * @returns Processed HTML string with Geist font added to all tags
   */
  addGeistFontToHtml(htmlString: string): string {
    console.log('htmlString input', htmlString);
    // If the string is empty or not HTML, return as is
    if (!htmlString || !htmlString.includes('<')) {
      console.log('htmlString', htmlString);
      return htmlString;
    }

    console.log('parsing...');

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    // Recursive function to process all elements
    const processElement = (element: Element) => {
      // Add font-family to current element
      const currentStyle = element.getAttribute('style') || '';
      if (!currentStyle.includes('font-family')) {
        element.setAttribute(
          'style',
          `font-family: 'Geist', sans-serif; font-size: 0.875rem; ${currentStyle}`
        );
      }

      // Process all child elements
      Array.from(element.children).forEach((child) => {
        processElement(child as Element);
      });
    };

    // Process all root elements
    Array.from(tempDiv.children).forEach((element) => {
      processElement(element);
    });

    console.log('parsed', tempDiv.innerHTML);

    return tempDiv.innerHTML;
  }

  createPdfFromHtml(html: HTMLElement) {
    this.#pdfGenerator.setFillColor(255, 253, 248);
    this.#pdfGenerator.setFont('Geist');
    this.#pdfGenerator.setFont('GeistMono-SemiBold');
    this.#pdfGenerator.setCharSpace(0);

    this.#pdfGenerator.html(html, {
      callback: function (doc) {
        doc.output('dataurlnewwindow');
      },
      margin: [10, 10, 10, 10],
      html2canvas: {
        letterRendering: true,
      },
      width: 180,
      windowWidth: 650,
    });
  }
}
