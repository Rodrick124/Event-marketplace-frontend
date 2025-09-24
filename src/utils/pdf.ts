/**
 * Converts OKLCH color strings in an element's styles to RGB,
 * which is supported by html2canvas.
 * @param {HTMLElement} element The element to process.
 * @returns {() => void} A function to revert the style changes.
 */
export const convertOklchToRgb = (element: HTMLElement): (() => void) => {
  const originalStyles = new Map<HTMLElement, string>();

  const traverseAndConvert = (el: HTMLElement) => {
    const style = window.getComputedStyle(el);
    const colorProperties = ['color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'];

    for (const prop of colorProperties) {
      const value = style.getPropertyValue(prop);
      if (value.includes('oklch')) {
        if (!originalStyles.has(el)) {
          originalStyles.set(el, el.getAttribute('style') || '');
        }
        // The browser's computed style is in RGB, so we can just re-apply it as an inline style.
        el.style.setProperty(prop, value);
      }
    }

    el.childNodes.forEach(child => child.nodeType === 1 && traverseAndConvert(child as HTMLElement));
  };

  traverseAndConvert(element);

  return () => {
    originalStyles.forEach((style, el) => {
      el.setAttribute('style', style);
    });
  };
};