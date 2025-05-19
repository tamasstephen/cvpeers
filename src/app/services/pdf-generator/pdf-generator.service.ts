import { Injectable } from '@angular/core';
import { HTMLFontFace, jsPDF } from 'jspdf';
import '../../assets/fonts/Geist-Variable_pdf-normal.js';

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  constructor() {}

  #pdfGenerator: jsPDF = new jsPDF();

  createPdfFromHtml(html: HTMLElement) {
    this.#pdfGenerator.setFont('Geist');
    this.#pdfGenerator.html(html, {
      callback: function (doc) {
        doc.output('dataurlnewwindow');
      },
      margin: [10, 10, 10, 10],
      html2canvas: {},
      /*       x: 10,
      y: 10, */
      width: 180,
      windowWidth: 650,
    });
  }
}
