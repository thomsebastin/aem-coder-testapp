/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for AT&T Business website cleanup
 * Purpose: Remove navigation, footer, tracking elements, and non-content widgets
 * Applies to: www.business.att.com (all templates)
 * Tested: / (homepage)
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 * - Page structure analysis from page migration workflow
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove global navigation header
    // Found in captured DOM: <div class="global-navigation parbase aem-GridColumn">
    WebImporter.DOMUtils.remove(element, [
      '.global-navigation',
    ]);

    // Remove modal navigation overlay
    // Found in captured DOM: <div class="modal-global-navigation">
    WebImporter.DOMUtils.remove(element, [
      '.modal-global-navigation',
    ]);

    // Remove skip-to-content link
    // Found in captured DOM: <a class="skip-to-content-link">
    WebImporter.DOMUtils.remove(element, [
      '.skip-to-content-link',
    ]);

    // Remove footer section (second .xfpage element contains footer)
    // Found in captured DOM: <div class="footer-page-css-includes aem-GridColumn">
    WebImporter.DOMUtils.remove(element, [
      '.footer-page-css-includes',
    ]);

    // Remove swiper UI elements (navigation buttons, pagination, notifications)
    // Found in captured DOM: <div class="swipeButton swiper-button-prev">
    // Found in captured DOM: <div class="swipeButton swiper-button-next">
    // Found in captured DOM: <div class="swiper-pagination">
    // Found in captured DOM: <span class="swiper-notification">
    WebImporter.DOMUtils.remove(element, [
      '.swiper-button-prev',
      '.swiper-button-next',
      '.swiper-pagination',
      '.swiper-notification',
    ]);

    // Remove search forms (desktop and mobile)
    // Found in captured DOM: <form id="cludo-search-form">
    // Found in captured DOM: <form id="cludo-mob-search">
    WebImporter.DOMUtils.remove(element, [
      '#cludo-search-form',
      '#cludo-mob-search',
      '.search-mobile-view',
      '.search-tablet-view',
    ]);

    // Remove login dropdown menu
    // Found in captured DOM: <ul class="login-menu-dropdown dropdown-menu">
    WebImporter.DOMUtils.remove(element, [
      '.login-menu-dropdown',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove tracking class from links (leave element, clean class)
    // Found in captured DOM: <a class="att-track" href="...">
    const trackedLinks = element.querySelectorAll('.att-track');
    trackedLinks.forEach((el) => {
      el.classList.remove('att-track');
    });

    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'source',
    ]);

    // Remove data-tracking attributes
    // Found in captured DOM: various elements with data-* tracking attributes
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-analytics');
      el.removeAttribute('data-link-name');
    });
  }
}
