/* eslint-disable */
/* global WebImporter */

/**
 * Parser for Carousel block
 *
 * Source: https://www.business.att.com/
 * Base Block: carousel
 *
 * Block Structure (from block library):
 * - Each row: Image (column 1) | Text content (column 2)
 *   - Text content: heading, description, optional CTA
 *
 * Source HTML Pattern:
 * <div class="story-stack aem-GridColumn">
 *   <div class="storyStackSlider">
 *     <div class="swiper-wrapper">
 *       <div class="swiper-slide">
 *         <div class="story-img-container">
 *           <img class="swiper-image" src="...">
 *         </div>
 *         <div class="story-content-slider">
 *           <div class="heading-sm-storyStack">Heading</div>
 *           <div class="story-description"><p>Description</p></div>
 *         </div>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-16
 */
export default function parse(element, { document }) {
  const cells = [];

  // Get all slides
  // Found in captured DOM: <div class="swiper-slide att-light-theme">
  const slides = element.querySelectorAll('#storystack-container > .swiper-slide');

  slides.forEach((slide) => {
    // Image: Found in captured DOM: <img class="swiper-image" src="...">
    const image = slide.querySelector('img.swiper-image')
      || slide.querySelector('.story-img-container img:not(.is-icon)');

    // Heading: Found in captured DOM: <div class="heading-sm heading-sm-storyStack">
    const headingEl = slide.querySelector('[class*="heading-sm-storyStack"]')
      || slide.querySelector('.ss-desktop-container [class*="heading"]');

    // Description: Found in captured DOM: <div class="story-description"><p>
    const descEl = slide.querySelector('.story-description p')
      || slide.querySelector('.story-description');

    // CTA (optional): links within slide content
    const cta = slide.querySelector('.story-content-slider a[href]:not(.story-arrow-next a)');

    // Build text content cell
    const textCell = [];

    if (headingEl) {
      const h2 = document.createElement('h2');
      h2.textContent = headingEl.textContent.trim();
      textCell.push(h2);
    }

    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      textCell.push(p);
    }

    if (cta) textCell.push(cta);

    // Row: Image | Text content
    if (image && textCell.length > 0) {
      cells.push([image, textCell]);
    } else if (textCell.length > 0) {
      cells.push([textCell]);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
