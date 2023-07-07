/**
 * @param {HTMLElement} element
 * @return {Function}
 */
function focusTrap(element) {
  const focusableElements = getFocusableElements(element);
  const firstFocusableEl = focusableElements[0];
  const lastFocusableEl = focusableElements[focusableElements.length - 1];

  setTimeout(() => firstFocusableEl.focus(), 50);

  /**
   * @param {HTMLElement} element
   * @return {HTMLElement[]}
   */
  function getFocusableElements(element = document) {
    return [
      ...element.querySelectorAll(
        'a, button, details, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ),
    ].filter((e) => !e.hasAttribute("disabled"));
  }

  function handleKeyDown(e) {
    const TAB = 9;
    const isTab = e.key.toLowerCase() === "tab" || e.keyCode === TAB;

    if (!isTab) return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableEl) {
        firstFocusableEl.focus();
        e.preventDefault();
      }
    }
  }

  element.addEventListener("keydown", handleKeyDown);

  return function cleanup() {
    element.removeEventListener("keydown", handleKeyDown);
  };
}
