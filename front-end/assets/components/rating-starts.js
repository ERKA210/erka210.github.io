class RatingStars extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.value = 0;
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        .rating {
          display: flex;
          gap: 5px;
          cursor: pointer;
          justify-content: center;
        }
        .star {
          font-size: 28px;
          color: #ccc;
          transition: color 0.25s;
        }
        .star.filled {
          color: orange;
        }
      </style>
      <div class="rating">
        <span class="star">★</span>
        <span class="star">★</span>
        <span class="star">★</span>
        <span class="star">★</span>
        <span class="star">★</span>
      </div>
    `;

    this.setupEvents();
  }

  setupEvents() {
    const stars = this.shadowRoot.querySelectorAll('.star');
    
    stars.forEach((span, index) => {
      const starValue = index + 1;

      span.addEventListener('mouseover', () => this.updateStars(starValue));
      span.addEventListener('mouseout', () => this.updateStars(this.value));

      span.addEventListener('click', () => {
        this.value = starValue;
        this.setAttribute('value', starValue);
        this.dispatchEvent(new CustomEvent('rate', { detail: starValue }));
      });
    });
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