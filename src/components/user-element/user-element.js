import {html, render} from '/node_modules/lit-html/lit-html.js'

class UserElement extends HTMLElement {
    static get observedAttributes() {
        return ['status'];
    }

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.render();
    }

    set userDetails(userDetails) {
        this._userDetails = userDetails;
    }

    get userDetails() {
        return this._userDetails;
    }

    render() {
        const userElementTemplate = html`
            <style>
                .user-container {
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
            <div class="user-container">

            </div>
        `
        render(userElementTemplate, this.shadowRoot);
    }

    expandOrCollapseUserInTree(expandUserBoolean) {
        const event = new CustomEvent('expandOrCollapseUserInTree', {
            detail: {userObject: this.userDetails, expandUser: expandUserBoolean},
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
        const userContainer = this.shadowRoot.querySelector('.user-container');
        const button = document.createElement('button');

        button.id = 'details-button';
        button.textContent = "Show Details";
        button.addEventListener('click', (e) => {
            const userStatus = this.getAttribute('status');
            if (userStatus === 'collapsed' || userStatus== null) {
                this.setAttribute('status', 'expanded');
                this.expandOrCollapseUserInTree(true);

                const event = new CustomEvent('changeClickedStatus', {
                    detail: {userElement: this},
                    bubbles: true,
                    cancelable: true,
                    composed: false
                })
                this.dispatchEvent(event);

            } else {
                this.setAttribute('status', 'collapsed');
                this.expandOrCollapseUserInTree(false);
            }
        })

        Object.values(this.userDetails).forEach(value => {
            const p = document.createElement('p');
            p.textContent = value;
            userContainer.appendChild(p);
        });

        userContainer.appendChild(button);
    }
}

customElements.define('user-element', UserElement);