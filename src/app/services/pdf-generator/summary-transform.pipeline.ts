import { applySummaryListNormalizerStep } from './summary-list-normalizer.step';
import { applySummarySanitizerStep } from './summary-sanitizer.step';
import { applySummaryTypographyStep } from './summary-typography.step';

export const transformSummaryHtml = (htmlString: string): string => {
  if (!htmlString) {
    return htmlString;
  }

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;

  applySummarySanitizerStep(tempDiv);
  applySummaryListNormalizerStep(tempDiv);
  applySummaryTypographyStep(tempDiv);

  return tempDiv.innerHTML;
};
