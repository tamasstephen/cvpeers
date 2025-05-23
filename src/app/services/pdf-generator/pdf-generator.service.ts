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

  createPdfFromHtml(html: HTMLElement) {
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
