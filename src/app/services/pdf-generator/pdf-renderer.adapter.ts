interface PdfHtmlOptions {
  margin: [number, number, number, number];
  html2canvas?: {
    letterRendering: boolean;
    scale: number;
  };
  autoPaging: boolean | 'slice';
  width: number;
  windowWidth: number;
}

interface HtmlCapablePdf {
  html: (
    source: HTMLElement,
    options: PdfHtmlOptions & {
      callback: () => void;
    }
  ) => void;
}

interface PageCountCapablePdf {
  getNumberOfPages?: () => number;
  internal?: unknown;
  deletePage: (pageNumber: number) => void;
}

interface OutputCapablePdf {
  output: (type: 'dataurlnewwindow') => void;
}

interface RenderHtmlPageCommand {
  pdf: HtmlCapablePdf;
  source: HTMLElement;
  options: PdfHtmlOptions;
}

export const renderHtmlPage = async ({ pdf, source, options }: RenderHtmlPageCommand): Promise<void> =>
  new Promise((resolve): void => {
    pdf.html(source, {
      ...options,
      callback: (): void => resolve(),
    });
  });

export const removeLeadingBlankPage = ({
  pdf,
  expectedPages,
}: {
  pdf: PageCountCapablePdf;
  expectedPages: number;
}): void => {
  const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;
  const getNumericFunctionResult = (candidate: unknown): number | undefined => {
    if (typeof candidate !== 'function') {
      return undefined;
    }

    const result: unknown = candidate();
    return typeof result === 'number' ? result : undefined;
  };

  const directPageCount = getNumericFunctionResult(pdf.getNumberOfPages);
  let internalPageCount: number | undefined;
  if (isRecord(pdf.internal)) {
    const getNumberOfPages = pdf.internal['getNumberOfPages'];
    internalPageCount = getNumericFunctionResult(getNumberOfPages);
  }
  const totalPages = directPageCount ?? internalPageCount;

  if (typeof totalPages !== 'number') {
    return;
  }

  if (totalPages === expectedPages + 1) {
    pdf.deletePage(1);
  }
};

export const downloadPdfToNewWindow = (pdf: OutputCapablePdf): void => {
  pdf.output('dataurlnewwindow');
};
