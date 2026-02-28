import {
  downloadPdfToNewWindow,
  removeLeadingBlankPage,
  renderHtmlPage,
} from './pdf-renderer.adapter';

describe('pdf-renderer adapter', (): void => {
  it('renders html via callback-based pdf html API', async (): Promise<void> => {
    const pdf = {
      html: jasmine
        .createSpy('html')
        .and.callFake((_source: HTMLElement, options?: { callback?: () => void }): void => {
          options?.callback?.();
        }),
    };

    const source = document.createElement('div');

    await renderHtmlPage({
      pdf,
      source,
      options: {
        margin: [0, 0, 0, 0],
        autoPaging: false,
        width: 100,
        windowWidth: 100,
      },
    });

    expect(pdf.html).toHaveBeenCalled();
  });

  it('removes leading blank page when count is expected + 1', (): void => {
    const pdf = {
      getNumberOfPages: (): number => 3,
      deletePage: jasmine.createSpy('deletePage'),
    };

    removeLeadingBlankPage({ pdf, expectedPages: 2 });

    expect(pdf.deletePage).toHaveBeenCalledWith(1);
  });

  it('downloads pdf using dataurlnewwindow output mode', (): void => {
    const pdf = {
      output: jasmine.createSpy('output'),
    };

    downloadPdfToNewWindow(pdf);

    expect(pdf.output).toHaveBeenCalledWith('dataurlnewwindow');
  });
});
