class RatingStars extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.value = 0;
  }

  connectedCallback() {
    const max = parseInt(this.getAttribute('max')) || 5;
    const color = this.getAttribute('color') || 'gold';
    const size = this.getAttribute('size') || '26px';

    const style = document.createElement('style');
    style.textContent = `
      .rating {
        display: flex;
        gap: 5px;
        cursor: pointer;
        justify-content: center;
      }
      .star {
        font-size: ${size};
        color: #ccc;
        transition: color 0.25s;
      }
      .star.filled {
        color: ${color};
      }
    `;

    const container = document.createElement('div');
    container.classList.add('rating');

    for (let i = 1; i <= max; i++) {
      const span = document.createElement('span');
      span.textContent = '★';
      span.classList.add('star');

      span.addEventListener('mouseover', () => this.updateStars(i));
      span.addEventListener('mouseout', () => this.updateStars(this.value));

      span.addEventListener('click', () => {
        this.value = i;
        this.setAttribute('value', i);
        this.dispatchEvent(new CustomEvent('rate', { detail: i }));
      });

      container.appendChild(span);
    }

    this.shadowRoot.append(style, container);
  }

  updateStars(count) {
    const stars = this.shadowRoot.querySelectorAll('.star');
    stars.forEach((s, idx) => {
      s.classList.toggle('filled', idx < count);
    });
  }

  getValue() {
    return this.value;
  }

  reset() {
    this.value = 0;
    this.updateStars(0);
  }
}

customElements.define('rating-stars', RatingStars);