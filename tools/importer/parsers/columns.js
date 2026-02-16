/* eslint-disable */
/* global WebImporter */

/**
 * Parser for Columns block
 *
 * Source: https://www.business.att.com/
 * Base Block: columns
 *
 * Block Structure (from block library):
 * - Each row has multiple columns (cells)
 * - Columns can contain text, images, or inline elements
 *
 * Source HTML Patterns:
 * 1. offer: Two grid-col-6 columns (image + text content)
 * 2. link-farm: Four grid-col-3 columns with link lists
 *
 * Generated: 2026-02-16
 */
export default function parse(element, { document }) {
  const cells = [];

  const isOffer = element.classList.contains('offer');
  const isLinkFarm = element.classList.contains('link-farm');

  if (isOffer) {
    // Pattern 1: Offer component - image left, text right
    // Found in captured DOM: <div class="grid-col-6"> x2

    // Image column
    // Found in captured DOM: <img class="imgOffer gvpImgTarget">
    const image = element.querySelector('img.imgOffer')
      || element.querySelector('.video-modal-target img')
      || element.querySelector('.order-img-top img');

    // Text column
    // Found in captured DOM: <div class="eyebrow-xxl-*">
    const eyebrowEl = element.querySelector('[class*="eyebrow-xxl"], [class*="eyebrow-lg"]');

    // Found in captured DOM: <h2 class="heading-xxl-*">
    const heading = element.querySelector('h2[class*="heading-"]')
      || element.querySelector('h2');

    // Found in captured DOM: <div class="wysiwyg-editor"><p>...</p>
    const descContainer = element.querySelector('.wysiwyg-editor');

    // Found in captured DOM: <a class="btn-primary" href="...">
    const ctas = Array.from(
      element.querySelectorAll('.cta-container a'),
    );

    // Build text content cell
    const textCell = [];
    if (eyebrowEl) {
      const eyebrowP = document.createElement('p');
      eyebrowP.textContent = eyebrowEl.textContent.trim();
      textCell.push(eyebrowP);
    }
    if (heading) textCell.push(heading);
    if (descContainer) textCell.push(descContainer);
    ctas.forEach((cta) => textCell.push(cta));

    // Row: Image | Text content
    if (image && textCell.length > 0) {
      cells.push([image, textCell]);
    } else if (textCell.length > 0) {
      cells.push([textCell]);
    }
  } else if (isLinkFarm) {
    // Pattern 2: Link farm - 4 columns of categorized links
    // Found in captured DOM: <div class="desktop-view-and-tablet">
    //   <div class="row"><div class="grid-col-3">
    //     <ul class="accordion-panel"><li><a class="link-text2">
    const desktopView = element.querySelector('.desktop-view-and-tablet');
    if (desktopView) {
      const columns = desktopView.querySelectorAll('.grid-col-3');

      if (columns.length > 0) {
        const row = [];
        columns.forEach((col) => {
          const columnCell = [];

          // Extract links from this column
          // Found in captured DOM: <ul class="accordion-panel"><li><a class="link-text2">
          const links = col.querySelectorAll('ul.accordion-panel li a');
          links.forEach((link) => {
            const p = document.createElement('p');
            const a = document.createElement('a');
            a.href = link.getAttribute('href');
            a.textContent = link.textContent.trim();
            p.appendChild(a);
            columnCell.push(p);
          });

          if (columnCell.length > 0) {
            row.push(columnCell);
          }
        });

        if (row.length > 0) {
          cells.push(row);
        }
      }
    }
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
