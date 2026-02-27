/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for AT&T Business site cleanup
 * Removes non-content elements common across all AT&T Business pages
 *
 * Source: https://www.business.att.com/
 * Generated: 2026-02-26
 */
export default function transform(hookName, element) {
  if (hookName === 'beforeTransform') {
    // Remove global navigation
    const globalNav = element.querySelector('div.global-navigation');
    if (globalNav) globalNav.remove();

    // Remove skip-to-content links
    const skipLinks = element.querySelectorAll('a.skip-to-content-link');
    skipLinks.forEach((el) => el.remove());

    // Remove cookie/consent dialogs
    const cookieBanners = element.querySelectorAll('[class*="cookie"], [class*="consent"]');
    cookieBanners.forEach((el) => el.remove());

    // Remove chat widgets
    const chatWidgets = element.querySelectorAll('[class*="chat-widget"], [class*="live-chat"]');
    chatWidgets.forEach((el) => el.remove());

    // Remove tracking pixels and hidden iframes
    const trackingElements = element.querySelectorAll('iframe[width="0"], iframe[height="0"], img[width="1"][height="1"]');
    trackingElements.forEach((el) => el.remove());

    // Remove footer section
    const footer = element.querySelector('footer, [class*="footer"]');
    if (footer) footer.remove();

    // Remove RAI form / lead capture forms
    const raiForms = element.querySelectorAll('div.rai-form, form[class*="eloqua"]');
    raiForms.forEach((el) => el.remove());

    // Remove empty layout divs
    const emptyDivs = element.querySelectorAll('div.max-width-background:empty');
    emptyDivs.forEach((el) => el.remove());
  }

  if (hookName === 'afterTransform') {
    // Clean up remaining empty elements
    const emptySections = element.querySelectorAll('div:empty');
    emptySections.forEach((el) => {
      if (!el.children.length && !el.textContent.trim()) {
        el.remove();
      }
    });
  }
}
