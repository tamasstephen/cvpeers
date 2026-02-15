import { TestBed } from '@angular/core/testing';
import { jsPDF } from 'jspdf';

import { PdfGeneratorService } from './pdf-generator.service';

declare module 'jspdf' {
  interface jsPDFAPI {
    html?: (
      source: string | HTMLElement,
      options?: { callback?: (instance: jsPDF) => void }
    ) => jsPDF;
  }
}

describe('PdfGeneratorService', (): void => {
  let service: PdfGeneratorService;

  beforeEach((): void => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfGeneratorService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  it('should open the generated pdf in a new window after rendering html', async (): Promise<void> => {
    const originalHtml = jsPDF.API.html;
    const htmlMock = jasmine
      .createSpy('html')
      .and.callFake(function (
        this: jsPDF,
        _source: string | HTMLElement,
        options?: { callback?: (instance: jsPDF) => void }
      ): jsPDF {
        options?.callback?.(this);
        return this;
      });
    jsPDF.API.html = htmlMock;
    const openSpy = spyOn(window, 'open').and.returnValue(null);
    const testService = new PdfGeneratorService();

    const target = document.createElement('div');
    target.innerHTML = '<p>Download test</p>';
    document.body.appendChild(target);

    await testService.createPdfFromHtml(target);

    expect(htmlMock).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalled();
    document.body.removeChild(target);

    jsPDF.API.html = originalHtml;
  });
});
