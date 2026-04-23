import { TestBed } from '@angular/core/testing';
import { jsPDF } from 'jspdf';

import { PdfGeneratorService } from './pdf-generator.service';

declare module 'jspdf' {
  interface jsPDFAPI {
    html?: (
      source: string | HTMLElement,
      options?: {
        callback?: (instance: jsPDF) => void;
        html2canvas?: {
          letterRendering?: boolean;
        };
      }
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
    let capturedHtmlOptions:
      | {
          callback?: (instance: jsPDF) => void;
          html2canvas?: {
            letterRendering?: boolean;
          };
        }
      | undefined;
    const htmlMock = jasmine
      .createSpy('html')
      .and.callFake(function (
        this: jsPDF,
        _source: string | HTMLElement,
        options?: { callback?: (instance: jsPDF) => void }
      ): jsPDF {
        capturedHtmlOptions = options;
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
    expect(capturedHtmlOptions?.html2canvas?.letterRendering).toBeFalse();
    expect(openSpy).toHaveBeenCalled();
    document.body.removeChild(target);

    jsPDF.API.html = originalHtml;
  });

  it('should add Geist font style to every html element', (): void => {
    const html = '<p>Hello <strong>world</strong></p><ul><li>One</li></ul>';

    const processed = service.addGeistFontToHtml(html);

    expect(processed).toContain("font-family: 'Geist', sans-serif;");
    expect(processed).toContain('<p');
    expect(processed).toContain('<strong');
    expect(processed).toContain('<li');
  });

  it('should parse summary html by removing ql helpers and replacing strong tags', (): void => {
    const html =
      '<p><strong>Bold</strong><span class="ql-ui" contenteditable="false"></span></p><ol><li data-list="bullet">Item</li></ol>';

    const processed = service.parseSummaryHtml(html);

    expect(processed).not.toContain('class="ql-ui"');
    expect(processed).not.toContain('<strong>');
    expect(processed).toContain("font-family: 'Geist-SemiBold'");
    expect(processed).toContain('<div');
    expect(processed).toContain('•');
  });
});
