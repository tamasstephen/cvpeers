export const applySummaryTypographyStep = (container: HTMLElement): void => {
  const strongElements = Array.from(container.querySelectorAll('strong'));
  strongElements.forEach((strongElement): void => {
    const span = document.createElement('span');
    span.setAttribute('style', "font-family: 'Geist-SemiBold'; font-weight: bold;");
    const existingStyle = strongElement.getAttribute('style');
    if (existingStyle) {
      span.setAttribute('style', `${span.getAttribute('style')}; ${existingStyle}`);
    }
    span.innerHTML = strongElement.innerHTML;
    strongElement.replaceWith(span);
  });
};
