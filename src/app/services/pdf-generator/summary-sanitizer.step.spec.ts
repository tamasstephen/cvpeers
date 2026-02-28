import { applySummarySanitizerStep } from './summary-sanitizer.step';

describe('applySummarySanitizerStep', (): void => {
  const applyStepToHtml = (html: string): string => {
    const container = document.createElement('div');
    container.innerHTML = html;
    applySummarySanitizerStep(container);
    return container.innerHTML;
  };

  it('removes Quill helper spans', (): void => {
    const result = applyStepToHtml(
      '<p>Text<span class="ql-ui" contenteditable="false"></span></p>'
    );

    expect(result).not.toContain('class="ql-ui"');
    expect(result).toContain('Text');
  });

  it('strips background styles and enforces readable text color', (): void => {
    const result = applyStepToHtml('<p style="background: red;">Hello</p>');

    expect(result).not.toContain('background: red');
    expect(result).toContain('color: #323232;');
  });

  it('keeps existing non-background styles', (): void => {
    const result = applyStepToHtml('<p style="font-size: 16px; background-color: yellow;">Hello</p>');

    expect(result).toContain('font-size: 16px;');
    expect(result).not.toContain('background-color: yellow');
  });
});
