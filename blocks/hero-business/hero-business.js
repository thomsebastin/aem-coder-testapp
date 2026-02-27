export default function decorate(block) {
  const hasImage = block.querySelector(':scope > div:first-child picture');
  if (!hasImage) {
    block.classList.add('no-image');
  }

  // Find the text content row (the row without a picture, or the last row)
  const rows = [...block.children];
  const textRow = rows.find((row) => !row.querySelector('picture')) || rows[rows.length - 1];
  if (!textRow) return;

  const cell = textRow.querySelector('div');
  if (!cell) return;

  const p = cell.querySelector('p');
  if (!p) return;

  const strong = p.querySelector('strong');
  if (!strong) return;

  // Extract eyebrow text (text before <strong>), body text and CTAs after it
  const nodes = [...p.childNodes];
  const strongIndex = nodes.indexOf(strong);

  const eyebrowText = nodes
    .slice(0, strongIndex)
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent)
    .join('')
    .trim();

  const bodyText = nodes
    .slice(strongIndex + 1)
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent)
    .join('')
    .trim();

  const ctas = nodes
    .slice(strongIndex + 1)
    .filter((n) => n.nodeType === Node.ELEMENT_NODE && n.tagName === 'A');

  // Build new content structure
  cell.innerHTML = '';

  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'hero-business-eyebrow';
    eyebrow.textContent = eyebrowText;
    cell.appendChild(eyebrow);
  }

  const heading = document.createElement('h1');
  heading.textContent = strong.textContent;
  cell.appendChild(heading);

  if (bodyText) {
    const body = document.createElement('p');
    body.className = 'hero-business-body';
    body.textContent = bodyText;
    cell.appendChild(body);
  }

  if (ctas.length > 0) {
    const ctaContainer = document.createElement('p');
    ctaContainer.className = 'button-container';
    ctas.forEach((cta) => {
      cta.className = 'button primary';
      ctaContainer.appendChild(cta);
    });
    cell.appendChild(ctaContainer);
  }
}
