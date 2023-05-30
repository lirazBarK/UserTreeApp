import {html, render} from '/node_modules/lit-html/lit-html.js'

class UserElement extends HTMLElement {
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

    connectedCallback() {
        const userContainer = this.shadowRoot.querySelector('.user-container');
        const button = document.createElement('button');
        button.textContent = "Show Details";
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