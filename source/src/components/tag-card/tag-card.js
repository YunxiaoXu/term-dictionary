import * as backend_function from '../../backend/dict.js';
import * as redirection from '../../common-scripts/redirection.js';

class TagCard extends HTMLElement {
  constructor() {
    super();
    let shadow_el;
  }

  connectedCallback() {
    this.shadow_el = this.initShadowDom();
  }

  initShadowDom() {
    let shadow_el = this.attachShadow({ mode: 'open' });
    return shadow_el;
  }

  set data(data) {
    if (!data) return;

    // Add style element to reference css file
    let style_el = document.createElement('style');
    style_el.innerHTML = "@import 'src/components/tag-card/tag-card.css';";
    this.shadow_el.appendChild(style_el);

    // Add tag element and html
    let tag_el = document.createElement('div');
    tag_el.className = 'tag';
    tag_el.innerHTML = `
        <button part="color-button">
        </button>
        <ul class="term-container">
        </ul>
    `;

    let button = tag_el.querySelector('button');
    let term_container_el = tag_el.querySelector('.term-container');

    // Add tag name to button
    button.textContent = data.tag_name;

    // Add terms to tag
    if (data.terms && data.terms.length > 0) {
      // Only get 4 terms max
      data.terms = data.terms.slice(0, 4);

      data.terms.forEach((term) => {
        // Create term element
        let term_el = document.createElement('li');
        term_el.className = 'term';
        term_el.term_id = term.id;

        // Create inner elements of term
        let term_name_el = document.createElement('p');
        term_name_el.className = 'term-name';
        term_name_el.textContent = term.term_name;
        let term_description_el = document.createElement('p');
        term_description_el.className = 'term-description';
        term_description_el.textContent = term.short_description;

        // Go to term page when click on a term
        term_el.addEventListener('click', (e) => {
          localStorage.setItem('get_term_id', e.currentTarget.term_id);
          redirection.jumpTermPageHtml();
        });

        // Add element to term then add term to tag
        term_el.appendChild(term_name_el);
        term_el.appendChild(term_description_el);
        term_container_el.appendChild(term_el);
      });
    }

    // Go to search for all terms of a tag when click on tag    
    button.addEventListener('click', (e) => {
      // Get tag name and get search results by tag
      let tag_name = e.currentTarget.textContent;
      let search_results = backend_function.findTermsOfTagExact(tag_name);

      // Build json for tag-search page and redirect
      let tag_search_results = [
        {
          'tag_name': tag_name,
          'terms': search_results
        }
      ];
      localStorage.setItem('tag_search_results', JSON.stringify(tag_search_results));
      redirection.jumpTagSearchHtml();
    });
    // let open_term_button = article_element.querySelector('#open_term');
    // open_term_button.addEventListener('click', (e) => {
    //  localStorage.setItem('get_term_id', data['id']);
    // });

    this.shadow_el.appendChild(tag_el);
  }
}

customElements.define('tag-card', TagCard);
