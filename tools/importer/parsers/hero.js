/* eslint-disable */
/* global WebImporter */

/**
 * Parser for Hero block
 *
 * Source: https://www.business.att.com/
 * Base Block: hero
 *
 * Block Structure (from block library):
 * - Row 1: Background image (optional)
 * - Row 2: Content (heading, subheading, CTAs)
 *
 * Source HTML Pattern:
 * <div class="hero aem-GridColumn">
 *   <div class="hero-wrapper">
 *     <div class="bg-hero-panel"><img src="..."></div>
 *     <div class="content-panel-text">
 *       <div class="eyebrow-lg-*">Eyebrow</div>
 *       <h2 class="heading-xxl-*">Heading</h2>
 *       <div class="wysiwyg-editor"><p>Description</p></div>
 *       <div class="cta-container"><a class="btn-primary">CTA</a></div>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-16
 */
export default function parse(element, { document }) {
  // Extract background image (desktop)
  // Found in captured DOM: <div class="bg-hero-panel"><img src="...">
  const bgImage = element.querySelector('.bg-hero-panel img')
    || element.querySelector('.bg-no-repeat img');

  // Extract mobile image
  // Found in captured DOM: <img class="visible-mobile">
  const mobileImage = element.querySelector('.hero-panel-image img')
    || element.querySelector('img.visible-mobile');

  // Extract eyebrow text
  // Found in captured DOM: <div class="eyebrow-lg-desktop eyebrow-lg-tablet eyebrow-lg-mobile">
  const eyebrowEl = element.querySelector('[class*="eyebrow-lg"], [class*="eyebrow-xxl"]');

  // Extract heading
  // Found in captured DOM: <h2 class="heading-xxl-desktop heading-xxl-tablet heading-xxl-mobile">
  const heading = element.querySelector('h2[class*="heading-"]')
    || element.querySelector('h1, h2, h3');

  // Extract description
  // Found in captured DOM: <div class="wysiwyg-editor"><p>...</p></div>
  const descriptionContainer = element.querySelector('.wysiwyg-editor');

  // Extract CTAs
  // Found in captured DOM: <a class="btn-primary" href="...">
  // Found in captured DOM: <a class="btn-secondary" href="...">
  const ctas = Array.from(
    element.querySelectorAll('.cta-container a, a.btn-primary, a.btn-secondary'),
  );

  // Deduplicate CTAs (some may match both selectors)
  const uniqueCtas = [];
  const seenHrefs = new Set();
  ctas.forEach((cta) => {
    const href = cta.getAttribute('href');
    if (!seenHrefs.has(href)) {
      seenHrefs.add(href);
      uniqueCtas.push(cta);
    }
  });

  // Build cells array matching Hero block structure
  const cells = [];

  // Row 1: Background image (optional)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content cell (eyebrow, heading, description, CTAs)
  const contentCell = [];

  if (eyebrowEl) {
    const eyebrowP = document.createElement('p');
    eyebrowP.textContent = eyebrowEl.textContent.trim();
    contentCell.push(eyebrowP);
  }

  if (heading) contentCell.push(heading);

  if (descriptionContainer) {
    // Include the full description container to preserve lists, paragraphs, etc.
    contentCell.push(descriptionContainer);
  }

  uniqueCtas.forEach((cta) => contentCell.push(cta));

  if (contentCell.length > 0) {
    cells.push([contentCell]);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
