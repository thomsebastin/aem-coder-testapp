/* eslint-disable */
/* global WebImporter */

/**
 * Parser for Cards block
 *
 * Source: https://www.business.att.com/
 * Base Block: cards
 *
 * Block Structure (from block library):
 * - Each row: Image (column 1) | Text content (column 2)
 *   - Text content: heading, description, CTA
 *
 * Source HTML Patterns:
 * 1. multi-tile-cards: .tile-card > .card > .card-img img + .card-content
 * 2. flex-cards: .flex-card > card content with image and text
 * 3. generic-list-value-prop: .generic-list-icon-vp with icon and text
 *
 * Generated: 2026-02-16
 */
export default function parse(element, { document }) {
  const cells = [];

  // Determine which source pattern we're dealing with
  const isMultiTile = element.classList.contains('multi-tile-cards');
  const isFlexCards = element.classList.contains('flex-cards');
  const isValueProp = element.classList.contains('generic-list-value-prop');

  if (isMultiTile) {
    // Pattern 1: Multi-tile cards
    // Found in captured DOM: <div class="tile-card">
    const tileCards = element.querySelectorAll('.tile-card');

    tileCards.forEach((card) => {
      // Image: Found in captured DOM: <div class="card-img"><img>
      const image = card.querySelector('.card-img img');

      // Heading: Found in captured DOM: <h3 class="js-heading-section">
      const heading = card.querySelector('h3, h2, [class*="heading-section"]');

      // Description: Found in captured DOM: <div class="tileSubheading"><p>
      const descEl = card.querySelector('.tileSubheading p')
        || card.querySelector('.js-textBody-section p');

      // CTA: Found in captured DOM: <a class="tile-anchor btn-primary">
      const cta = card.querySelector('.cta-container a')
        || card.querySelector('a.tile-anchor')
        || card.querySelector('a.btn-primary');

      // Build row: Image | Text content
      const textCell = [];
      if (heading) textCell.push(heading);
      if (descEl) textCell.push(descEl);
      if (cta) textCell.push(cta);

      if (image && textCell.length > 0) {
        cells.push([image, textCell]);
      } else if (textCell.length > 0) {
        cells.push([textCell]);
      }
    });
  } else if (isFlexCards) {
    // Pattern 2: Flex cards
    // Found in captured DOM: <div class="card flex-card">
    const flexCards = element.querySelectorAll('.card.flex-card');

    flexCards.forEach((card) => {
      // Image: within card image container
      const image = card.querySelector('img');

      // Eyebrow: Found in captured DOM: <p class="type-eyebrow-md">
      const eyebrow = card.querySelector('[class*="eyebrow"]');

      // Heading: Found in captured DOM: h3 or similar heading
      const heading = card.querySelector('h3, h2, [class*="heading-section"]');

      // Description: Found in captured DOM: <div class="tileSubheading"><p>
      const descEl = card.querySelector('.tileSubheading p')
        || card.querySelector('.js-textBody-section p');

      // CTA: Found in captured DOM: <a class="btn-primary">
      const cta = card.querySelector('.cta-container a')
        || card.querySelector('a.btn-primary')
        || card.querySelector('a.tile-anchor');

      // Build row: Image | Text content
      const textCell = [];
      if (eyebrow && eyebrow.textContent.trim()) {
        const eyebrowP = document.createElement('p');
        eyebrowP.textContent = eyebrow.textContent.trim();
        textCell.push(eyebrowP);
      }
      if (heading) textCell.push(heading);
      if (descEl) textCell.push(descEl);
      if (cta) textCell.push(cta);

      if (image && textCell.length > 0) {
        cells.push([image, textCell]);
      } else if (textCell.length > 0) {
        cells.push([textCell]);
      }
    });
  } else if (isValueProp) {
    // Pattern 3: Generic list value prop
    // Found in captured DOM: <div class="generic-list-icon-vp">
    const vpItems = element.querySelectorAll('.generic-list-icon-vp');

    vpItems.forEach((item) => {
      // Icon image: Found in captured DOM: img within icon container
      const icon = item.querySelector('img');

      // Heading: Found in captured DOM: heading elements
      const heading = item.querySelector('h3, h2, [class*="heading"]');

      // Description: Found in captured DOM: paragraph text
      const descEl = item.querySelector('.wysiwyg-editor p')
        || item.querySelector('p:not([class*="eyebrow"])');

      // CTA: Found in captured DOM: <a> link
      const cta = item.querySelector('.cta-container a')
        || item.querySelector('a.btn-primary')
        || item.querySelector('a[href]:not([href="#"])');

      // Build row: Image | Text content
      const textCell = [];
      if (heading) textCell.push(heading);
      if (descEl) textCell.push(descEl);
      if (cta) textCell.push(cta);

      if (icon && textCell.length > 0) {
        cells.push([icon, textCell]);
      } else if (textCell.length > 0) {
        cells.push([textCell]);
      }
    });
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
