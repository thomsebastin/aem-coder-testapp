/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-business block
 *
 * Source: https://www.business.att.com/
 * Base Block: hero
 *
 * Block Structure:
 * - Row 1: Background image
 * - Row 2: Eyebrow + heading + body text + CTAs
 *
 * Generated: 2026-02-26
 */
export default function parse(element, { document }) {
  // Extract background image
  const bgImage = element.querySelector('.bg-hero-panel img, .hero-panel-image img, picture img');

  // Extract eyebrow text
  const eyebrowEl = element.querySelector('[class*="eyebrow"]');
  const eyebrow = eyebrowEl ? eyebrowEl.textContent.trim() : '';

  // Extract heading
  const heading = element.querySelector('h1, h2');

  // Extract body text
  const bodyEl = element.querySelector('.wysiwyg-editor, [class*="type-base"]');
  const body = bodyEl ? bodyEl.textContent.trim() : '';

  // Extract CTAs
  const ctas = Array.from(element.querySelectorAll('a[class*="btn-"], a.att-track[href]:not([class*="dropdown"])'));
  const ctaElements = ctas
    .filter((a) => a.textContent.trim())
    .map((a) => {
      const link = document.createElement('a');
      link.href = a.href;
      link.textContent = a.textContent.trim();
      return link;
    });

  // Build image cell
  const imageCell = [];
  if (bgImage) {
    const img = document.createElement('img');
    img.src = bgImage.src;
    img.alt = bgImage.alt || '';
    imageCell.push(img);
  }

  // Build content cell
  const contentCell = [];
  if (eyebrow) {
    const eyebrowNode = document.createTextNode(eyebrow + ' ');
    contentCell.push(eyebrowNode);
  }
  if (heading) {
    const h = document.createElement('strong');
    h.textContent = heading.textContent.trim();
    contentCell.push(h);
    contentCell.push(document.createTextNode(' '));
  }
  if (body) {
    contentCell.push(document.createTextNode(body + ' '));
  }
  ctaElements.forEach((cta) => {
    contentCell.push(cta);
    contentCell.push(document.createTextNode(' '));
  });

  const cells = [
    [imageCell],
    [contentCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Business', cells });
  element.replaceWith(block);
}
