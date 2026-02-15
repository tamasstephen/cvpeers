export interface KeepTogetherBlockMeasurement {
  top: number;
  height: number;
}

export interface PreviewPageSlice {
  offset: number;
  height: number;
}

interface ResolveSemanticPageSlicesOptions {
  pageHeight: number;
  totalHeight: number;
  blocks: KeepTogetherBlockMeasurement[];
}

const PAGE_SLICE_EPSILON = 0.5;

/**
 * Calculates spacer heights to keep blocks together across fixed-height pages.
 * Each returned value maps to the block at the same index.
 */
export function computeKeepTogetherSpacers(
  pageHeight: number,
  blocks: KeepTogetherBlockMeasurement[]
): number[] {
  if (pageHeight <= 0) {
    return blocks.map((): number => 0);
  }

  let accumulatedShift = 0;

  return blocks.map((block): number => {
    if (block.height <= 0 || block.height >= pageHeight) {
      return 0;
    }

    const adjustedTop = block.top + accumulatedShift;
    const adjustedBottom = adjustedTop + block.height;
    const pageEnd = (Math.floor(adjustedTop / pageHeight) + 1) * pageHeight;
    const crossesBoundary = adjustedTop < pageEnd && adjustedBottom > pageEnd;

    if (!crossesBoundary) {
      return 0;
    }

    const spacerHeight = Math.ceil(pageEnd - adjustedTop);
    if (spacerHeight <= 0) {
      return 0;
    }

    accumulatedShift += spacerHeight;
    return spacerHeight;
  });
}

function normalizeBlocks(blocks: KeepTogetherBlockMeasurement[]): KeepTogetherBlockMeasurement[] {
  return blocks
    .filter((block): boolean => block.height > 0 && block.top >= 0)
    .sort((first, second): number => first.top - second.top);
}

function findCrossingBlock({
  blocks,
  pageStart,
  pageEnd,
  pageHeight,
}: {
  blocks: KeepTogetherBlockMeasurement[];
  pageStart: number;
  pageEnd: number;
  pageHeight: number;
}): KeepTogetherBlockMeasurement | undefined {
  return blocks.find((block): boolean => {
    const blockBottom = block.top + block.height;
    const crossesBoundary = block.top < pageEnd - PAGE_SLICE_EPSILON && blockBottom > pageEnd + PAGE_SLICE_EPSILON;
    const isSplittableCandidate = block.height < pageHeight - PAGE_SLICE_EPSILON;
    const canMoveToNextPage = block.top > pageStart + PAGE_SLICE_EPSILON;
    return crossesBoundary && isSplittableCandidate && canMoveToNextPage;
  });
}

export function resolveSemanticPageSlices({
  pageHeight,
  totalHeight,
  blocks,
}: ResolveSemanticPageSlicesOptions): PreviewPageSlice[] {
  const boundedTotalHeight = Math.max(0, totalHeight);
  if (boundedTotalHeight <= 0) {
    return [{ offset: 0, height: 0 }];
  }

  if (pageHeight <= 0) {
    return [{ offset: 0, height: boundedTotalHeight }];
  }

  const normalizedBlocks = normalizeBlocks(blocks);
  const slices: PreviewPageSlice[] = [];
  let currentOffset = 0;

  const maxIterations = Math.ceil(boundedTotalHeight / pageHeight) + normalizedBlocks.length + 8;
  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    if (currentOffset >= boundedTotalHeight - PAGE_SLICE_EPSILON) {
      break;
    }

    const hardPageEnd = Math.min(currentOffset + pageHeight, boundedTotalHeight);
    let resolvedPageEnd = hardPageEnd;

    if (hardPageEnd < boundedTotalHeight - PAGE_SLICE_EPSILON) {
      const crossingBlock = findCrossingBlock({
        blocks: normalizedBlocks,
        pageStart: currentOffset,
        pageEnd: hardPageEnd,
        pageHeight,
      });
      if (crossingBlock) {
        resolvedPageEnd = crossingBlock.top;
      }
    }

    if (resolvedPageEnd <= currentOffset + PAGE_SLICE_EPSILON) {
      resolvedPageEnd = hardPageEnd;
    }

    const pageHeightSlice = resolvedPageEnd - currentOffset;
    if (pageHeightSlice <= PAGE_SLICE_EPSILON) {
      break;
    }

    slices.push({
      offset: currentOffset,
      height: pageHeightSlice,
    });
    currentOffset = resolvedPageEnd;
  }

  if (slices.length === 0) {
    return [{ offset: 0, height: boundedTotalHeight }];
  }

  const coveredHeight = slices.reduce((total, slice): number => total + slice.height, 0);
  if (coveredHeight < boundedTotalHeight - PAGE_SLICE_EPSILON) {
    const lastSlice = slices[slices.length - 1];
    const trailingOffset = lastSlice.offset + lastSlice.height;
    slices.push({
      offset: trailingOffset,
      height: boundedTotalHeight - trailingOffset,
    });
  }

  return slices;
}
