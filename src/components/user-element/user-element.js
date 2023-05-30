import {html, render} from '/node_modules/lit-html/lit-html.js'

class UserElement extends HTMLElement {
    static get observedAttributes() {
        return ['status'];
    }

    constructor() {
        super();
        this.attachShadow({mode:"open"});
        this.render();
    }

    set userDetails(userDetails) {
        this._userDetails = userDetails;
    }

    get userDetails() {
        return this._userDetails;
    }

    render() {
        const userElementTemplate = html `
            <style>
                .user-container {
                    border: 1px solid black; /* Adds a black border to the div */
                    display: flex; /* Uses flexbox layout for the div and its children */
                    justify-content: space-between; /* Distributes the elements with equal space between them */
                    align-items: center; /* Centers the elements vertically within the div */
                    padding: 10px; /* Adds some padding inside the div */

                    width: 30%;
                }

                .user-container p {
                    margin: 0; /* Removes any default margin on the p elements */
                }

                .user-container button {
                    /* Add any additional styling you want for the button */
                }
            </style>
            <div class="user-container">
                
            </div>
        `
        render(userElementTemplate, this.shadowRoot);
    }

    expandUserInTree(target) {
        const event = new CustomEvent('expandUser', {
            detail: {userObject: target.userDetails},
            bubbles: true,
            cancelable: true,
            composed: false
        })

        document.dispatchEvent(event);

    }

    collapseUserInTree(target) {
        const event = new CustomEvent('collapseUser', {
            detail: {userObject: target.userDetails},
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
                if (newValue === 'show') {
                    detailsButton.textContent = 'Show Details'
                } else {
                    detailsButton.textContent = 'Hide Details'
                }
                break;
        }
    }

    connectedCallback() {
        const userContainer = this.shadowRoot.querySelector('.user-container');
        const button = document.createElement('button');
        button.id = 'details-button';
        button.textContent = "Show Details";

        button.addEventListener('click', (e) => {
            if(this.getAttribute('status') === 'show' || this.getAttribute('status') == null) {
                this.expandUserInTree(this);

                const event = new CustomEvent('changeClickedStatus', {
                    detail: {userElement: this},
                    bubbles: true,
                    cancelable: true,
                    composed: false
                })

                this.dispatchEvent(event);
            } else {
                this.collapseUserInTree(this);

                const event = new CustomEvent('changeClickedStatus', {
                    detail: {userElement: this},
                    bubbles: true,
                    cancelable: true,
                    composed: false
                })

                this.dispatchEvent(event);
            }
        })

        Object.values(this.userDetails).forEach(value => {
            const p = document.createElement('p');
            p.textContent= value;

            // Append the div to the custom element
            userContainer.appendChild(p);
        });
        userContainer.appendChild(button);
    }
}

customElements.define('user-element', UserElement);