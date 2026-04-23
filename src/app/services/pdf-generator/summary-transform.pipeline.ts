import { applySummaryListNormalizerStep } from './summary-list-normalizer.step';
import { applySummarySanitizerStep } from './summary-sanitizer.step';
import { applySummaryTypographyStep } from './summary-typography.step';

export const transformSummaryHtml = (htmlString: string): string => {
  if (!htmlString) {
    return htmlString;
  }

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;

  applySummaryListNormalizerStep(tempDiv);
  applySummaryTypographyStep(tempDiv);
  applySummarySanitizerStep(tempDiv);

  return tempDiv.innerHTML;
};
