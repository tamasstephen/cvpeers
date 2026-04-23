import { PreviewPageSlice } from './preview-pagination.util';

interface ResolvePreviewViewportHeightPxOptions {
  sliceHeightPx: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  leadingOverlapPx?: number;
  trailingTrimPx?: number;
}

interface ResolvePreviewSliceOffsetPxOptions {
  sliceOffsetPx: number;
  isFirstPage: boolean;
  leadingOverlapPx?: number;
}

interface NormalizePreviewSlicesForRenderingOptions {
  slices: PreviewPageSlice[];
  totalHeightPx: number;
}

const DEFAULT_PREVIEW_SLICE_LEADING_OVERLAP_PX = 0;
const DEFAULT_PREVIEW_SLICE_TRAILING_TRIM_PX = 0;

export const normalizePreviewSlicesForRendering = ({
  slices,
  totalHeightPx,
}: NormalizePreviewSlicesForRenderingOptions): PreviewPageSlice[] => {
  if (slices.length === 0) {
    return [];
  }

  const normalizedTotalHeight = Math.max(1, Math.ceil(totalHeightPx));
  const normalizedSlices: PreviewPageSlice[] = [];
  let currentOffset = 0;

  slices.forEach((slice, index): void => {
    const isLastSlice = index === slices.length - 1;
    const minimumEnd = currentOffset + 1;
    let resolvedEnd = minimumEnd;

    if (isLastSlice) {
      resolvedEnd = Math.max(minimumEnd, normalizedTotalHeight);
    } else {
      const desiredEnd = Math.ceil(slice.offset + slice.height);
      const remainingSlices = slices.length - index - 1;
      const maxEnd = Math.max(minimumEnd, normalizedTotalHeight - remainingSlices);
      resolvedEnd = Math.min(Math.max(minimumEnd, desiredEnd), maxEnd);
    }

    normalizedSlices.push({
      offset: currentOffset,
      height: resolvedEnd - currentOffset,
    });
    currentOffset = resolvedEnd;
  });

  return normalizedSlices;
};

export const resolvePreviewViewportHeightPx = ({
  sliceHeightPx,
  isFirstPage,
  isLastPage,
  leadingOverlapPx = DEFAULT_PREVIEW_SLICE_LEADING_OVERLAP_PX,
  trailingTrimPx = DEFAULT_PREVIEW_SLICE_TRAILING_TRIM_PX,
}: ResolvePreviewViewportHeightPxOptions): number => {
  if (sliceHeightPx <= 0) {
    return 0;
  }

  const leadingOverlap = isFirstPage ? 0 : Math.max(0, leadingOverlapPx);
  const trailingTrim = isLastPage ? 0 : Math.max(0, trailingTrimPx);

  return Math.max(0, sliceHeightPx + leadingOverlap - trailingTrim);
};

export const resolvePreviewSliceOffsetPx = ({
  sliceOffsetPx,
  isFirstPage,
  leadingOverlapPx = DEFAULT_PREVIEW_SLICE_LEADING_OVERLAP_PX,
}: ResolvePreviewSliceOffsetPxOptions): number => {
  if (sliceOffsetPx <= 0 || isFirstPage || leadingOverlapPx <= 0) {
    return Math.max(0, sliceOffsetPx);
  }

  return Math.max(0, sliceOffsetPx - leadingOverlapPx);
};
