class NumRouter extends HTMLElement {
  connectedCallback() {
    this._views = Array.from(this.querySelectorAll('[data-route]'));
    window.addEventListener('hashchange', () => this.applyRoute());
    this.applyRoute();
  }

  applyRoute() {
    const hash = (location.hash || '#home').replace('#', '') || 'home';

    this._views.forEach(section => {
      section.hidden = section.dataset.route !== hash;
    });
  }
}

customElements.define('num-router', NumRouter);
