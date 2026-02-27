/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-product block
 *
 * Source: https://www.business.att.com/
 * Base Block: cards
 *
 * Block Structure (2-column):
 * - Row N: image | heading + description + pricing + CTA
 *
 * Handles: multi-tile-cards, flex-cards, generic-list-value-prop, story-stack
 *
 * Generated: 2026-02-26
 */
export default function parse(element, { document }) {
  // Find all card items across different component types
  const cards = [];

  // Multi-tile cards (tile-card pattern)
  const tileCards = element.querySelectorAll('.tile-card, .swiper-slide');
  if (tileCards.length) {
    tileCards.forEach((card) => {
      const img = card.querySelector('img');
      const heading = card.querySelector('h3, h4, [class*="heading"]');
      const desc = card.querySelector('[class*="tileSubheading"], [class*="textBody"], p');
      const pricing = card.querySelector('[class*="price"]');
      const cta = card.querySelector('a[class*="btn-"], a.tile-anchor');

      if (heading) {
        cards.push({ img, heading, desc, pricing, cta });
      }
    });
  }

  // Flex cards pattern
  const flexCards = element.querySelectorAll('.card.flex-card');
  if (flexCards.length) {
    flexCards.forEach((card) => {
      const img = card.querySelector('img');
      const heading = card.querySelector('h3, h4');
      const eyebrow = card.querySelector('[class*="eyebrow"]');
      const desc = card.querySelector('[class*="type-base"], [class*="wysiwyg"]');
      const cta = card.querySelector('a[class*="btn-"]');

      if (heading) {
        cards.push({ img, heading, desc, cta, eyebrow });
      }
    });
  }

  // Value prop / generic list pattern
  const valuePropItems = element.querySelectorAll('.flex-card-item, [class*="value-prop-item"], .grid-col-3');
  if (!cards.length && valuePropItems.length) {
    valuePropItems.forEach((item) => {
      const img = item.querySelector('img');
      const heading = item.querySelector('h4, h3');
      const desc = item.querySelector('p, [class*="type-base"]');
      const cta = item.querySelector('a[class*="btn-"], a[class*="att-track"]');

      if (heading) {
        cards.push({ img, heading, desc, cta });
      }
    });
  }

  // Story stack pattern
  const storySlides = element.querySelectorAll('[class*="story-slide"], [class*="swiper-slide"]');
  if (!cards.length && storySlides.length) {
    storySlides.forEach((slide) => {
      const img = slide.querySelector('img[class*="story"], img');
      const heading = slide.querySelector('h3, h4, [class*="heading"]');
      const desc = slide.querySelector('p, [class*="description"]');

      if (heading) {
        cards.push({ img, heading, desc });
      }
    });
  }

  // Build cells array - each card becomes a row with [image, content]
  const cells = cards.map((card) => {
    // Image cell
    const imgCell = [];
    if (card.img) {
      const img = document.createElement('img');
      img.src = card.img.src;
      img.alt = card.img.alt || card.heading.textContent.trim();
      imgCell.push(img);
    }

    // Content cell
    const contentCell = [];
    if (card.eyebrow) {
      contentCell.push(document.createTextNode(card.eyebrow.textContent.trim() + ' '));
    }
    if (card.heading) {
      const strong = document.createElement('strong');
      strong.textContent = card.heading.textContent.trim();
      contentCell.push(strong);
      contentCell.push(document.createTextNode(' '));
    }
    if (card.desc) {
      contentCell.push(document.createTextNode(card.desc.textContent.trim() + ' '));
    }
    if (card.pricing) {
      const priceText = card.pricing.textContent.trim();
      if (priceText) {
        contentCell.push(document.createTextNode(priceText + ' '));
      }
    }
    if (card.cta) {
      const link = document.createElement('a');
      link.href = card.cta.href;
      link.textContent = card.cta.textContent.trim();
      contentCell.push(link);
    }

    return [imgCell, contentCell];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Product', cells });
  element.replaceWith(block);
}
