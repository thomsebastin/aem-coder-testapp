/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-offer block
 *
 * Source: https://www.business.att.com/
 * Base Block: columns
 *
 * Block Structure (2-column):
 * - Row 1: text content | image
 *
 * Handles: offer sections with text + image side by side
 *
 * Generated: 2026-02-26
 */
export default function parse(element, { document }) {
  // Extract heading
  const heading = element.querySelector('h2, h1');

  // Extract eyebrow
  const eyebrow = element.querySelector('[class*="eyebrow"]');

  // Extract body text
  const bodyEl = element.querySelector('[class*="wysiwyg"], [class*="type-base"], p:not([class*="eyebrow"])');

  // Extract checklist items
  const checklistItems = Array.from(element.querySelectorAll('[class*="checklist"] li, [class*="check-list"] span'));

  // Extract CTAs
  const ctas = Array.from(element.querySelectorAll('a[class*="btn-"]'));

  // Extract legal text
  const legal = element.querySelector('[class*="legal"], [class*="disclaimer"]');

  // Extract image
  const img = element.querySelector('.offer-image img, [class*="image-panel"] img, img');

  // Build text cell content
  const textCell = [];
  if (eyebrow) {
    textCell.push(document.createTextNode(eyebrow.textContent.trim() + ' '));
  }
  if (heading) {
    const strong = document.createElement('strong');
    strong.textContent = heading.textContent.trim();
    textCell.push(strong);
    textCell.push(document.createTextNode(' '));
  }
  if (bodyEl) {
    textCell.push(document.createTextNode(bodyEl.textContent.trim() + ' '));
  }
  if (checklistItems.length) {
    checklistItems.forEach((item) => {
      textCell.push(document.createTextNode('- ' + item.textContent.trim() + ' '));
    });
  }
  if (legal) {
    textCell.push(document.createTextNode(legal.textContent.trim() + ' '));
  }
  ctas.forEach((cta) => {
    const link = document.createElement('a');
    link.href = cta.href;
    link.textContent = cta.textContent.trim();
    textCell.push(link);
    textCell.push(document.createTextNode(' '));
  });

  // Build image cell
  const imageCell = [];
  if (img) {
    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.alt = img.alt || '';
    imageCell.push(imgEl);
  }

  const cells = [
    [textCell, imageCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Offer', cells });
  element.replaceWith(block);
}
