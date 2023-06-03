import {html, render} from '/node_modules/lit-html/lit-html.js'

class ViewModelElement extends HTMLElement {
    static get observedAttributes() {
        return ['status'];
    }

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.render();
    }

    set elementDetails(elementDetails) {
        this._elementDetails = elementDetails;
    }

    get elementDetails() {
        return this._elementDetails;
    }

    render() {
        const ViewModelElementTemplate = html`
            <style>
                .view-model-element-container {
                    border: 1px solid black;
                    display: flex; 
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    width: 30%;
                }

                .user-container p {
                    margin: 0; 
                }

                .user-container button {
                    width:150px;
                }
            </style>
            <div class="view-model-element-container">

            </div>
        `
        render(ViewModelElementTemplate, this.shadowRoot);
    }

    expandOrCollapseElementInTree(expandElementBoolean) {
        const event = new CustomEvent('expandOrCollapseElementInTree', {
            detail: {viewElement: this, expandElement: expandElementBoolean},
            bubbles: true,
            cancelable: true,
            composed: false
        })

        document.dispatchEvent(event);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'status':
                const detailsButton = this.shadowRoot.getElementById('details-button');
                if (newValue === 'collapsed') {
                    detailsButton.textContent = 'Show Details'
                } else {
                    detailsButton.textContent = 'Hide Details'
                }
                break;
        }
    }

    connectedCallback() {
        const viewModelContainer = this.shadowRoot.querySelector('.view-model-element-container');
        const button = document.createElement('button');

        button.id = 'details-button';
        button.textContent = "Show Details";
        button.addEventListener('click', (e) => {
            const viewElementStatus = this.getAttribute('status');
            if (viewElementStatus === 'collapsed' || viewElementStatus== null) {
                this.setAttribute('status', 'expanded');
                this.expandOrCollapseElementInTree(true);

                const event = new CustomEvent('changeClickedStatus', {
                    detail: {viewElement: this},
                    bubbles: true,
                    cancelable: true,
                    composed: false
                })
                this.dispatchEvent(event);

            } else {
                this.setAttribute('status', 'collapsed');
                this.expandOrCollapseElementInTree(false);
            }
        })

        Object.values(this.elementDetails).forEach(value => {
            const p = document.createElement('p');
            p.textContent = value;
            viewModelContainer.appendChild(p);
        });

        viewModelContainer.appendChild(button);
    }
}

customElements.define('view-model-element', ViewModelElement);