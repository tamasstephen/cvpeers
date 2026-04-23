import { KeepTogetherBlockMeasurement } from './preview-pagination.util';

interface MeasureSemanticBlocksOptions {
  previewSource: HTMLElement;
  selector: string;
  pageHeightPx: number;
}

interface GetPageContentHeightPxOptions {
  container: HTMLElement;
  pageContentWidthMm: number;
  pageContentHeightMm: number;
  contentWidthPx?: number;
}

export const mmToPx = (mm: number): number => {
  const pxPerMm = 96 / 25.4;
  return Math.round(mm * pxPerMm);
};

export const resolvePageContentHeightFromWidthPx = ({
  contentWidthPx,
  pageContentWidthMm,
  pageContentHeightMm,
}: {
  contentWidthPx: number;
  pageContentWidthMm: number;
  pageContentHeightMm: number;
}): number => {
  if (contentWidthPx <= 0 || pageContentWidthMm <= 0 || pageContentHeightMm <= 0) {
    return 0;
  }

  return contentWidthPx * (pageContentHeightMm / pageContentWidthMm);
};

export const getPageContentHeightPx = ({
  container,
  pageContentWidthMm,
  pageContentHeightMm,
  contentWidthPx,
}: GetPageContentHeightPxOptions): number => {
  if ((contentWidthPx ?? 0) > 0) {
    const heightFromWidth = resolvePageContentHeightFromWidthPx({
      contentWidthPx: contentWidthPx ?? 0,
      pageContentWidthMm,
      pageContentHeightMm,
    });
    if (heightFromWidth > 0) {
      return heightFromWidth;
    }
  }

  const probe = document.createElement('div');
  probe.style.position = 'absolute';
  probe.style.top = '0';
  probe.style.left = '0';
  probe.style.width = `${pageContentWidthMm}mm`;
  probe.style.height = `${pageContentHeightMm}mm`;
  probe.style.visibility = 'hidden';
  container.appendChild(probe);
  const measured = probe.getBoundingClientRect().height;
  container.removeChild(probe);
  return measured > 0 ? measured : mmToPx(pageContentHeightMm);
};

export const measureSemanticBlocks = ({
  previewSource,
  selector,
  pageHeightPx,
}: MeasureSemanticBlocksOptions): KeepTogetherBlockMeasurement[] => {
  const keepTogetherElements = Array.from(
    new Set(previewSource.querySelectorAll(selector))
  ).filter((element): element is HTMLElement => element instanceof HTMLElement);

  if (keepTogetherElements.length === 0 || pageHeightPx <= 0) {
    return [];
  }

  const rootTop = previewSource.getBoundingClientRect().top;
  const blocks = keepTogetherElements
    .map((element): KeepTogetherBlockMeasurement => {
      const blockRect = element.getBoundingClientRect();
      return {
        top: blockRect.top - rootTop,
        height: blockRect.height,
      };
    })
    .filter((block): boolean => block.height >= 8 && block.top >= 0)
    .sort((first, second): number => first.top - second.top);

  if (blocks.length === 0) {
    return [];
  }

  return blocks.reduce<KeepTogetherBlockMeasurement[]>(
    (accumulator, block): KeepTogetherBlockMeasurement[] => {
      const previous = accumulator.at(-1);
      if (previous === undefined) {
        accumulator.push(block);
        return accumulator;
      }

      const sameTop = Math.abs(previous.top - block.top) < 0.5;
      const sameHeight = Math.abs(previous.height - block.height) < 0.5;
      if (sameTop && sameHeight) {
        return accumulator;
      }

      accumulator.push(block);
      return accumulator;
    },
    []
  );
};
