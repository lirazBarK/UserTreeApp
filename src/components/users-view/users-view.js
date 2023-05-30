import {html, render} from '/node_modules/lit-html/lit-html.js'


class UsersView extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.render()
    }

    set users(users) {
        this._users = users;
    }

    get users() {
        return this._users;
    }

    render() {
        const userViewTemplate = html`

            <div class="user-view-container">
                <h2>Users</h2>
            </div>
            <div class="user-count-container">
                <h3>Count: ${this.users.length}</h3>
            </div>
        `

        render(userViewTemplate, this.shadowRoot);
    }

    changeClickedStatus(e) {
        const userElements = this.shadowRoot.querySelectorAll("user-element");
        if (e.target.getAttribute("status") === 'hide') {
            e.target.setAttribute('status', 'show');
        } else {
            for (let i = 0; i < userElements.length; i++) {
                userElements[i].setAttribute('status', 'show');
            }
            e.target.setAttribute('status', 'hide');
        }
    }

    connectedCallback() {
        const usersView = this.shadowRoot.querySelector('.user-view-container');
        this.users.forEach(user => {
            const userElement = document.createElement('user-element');
            userElement.addEventListener('changeClickedStatus', (e) => {
                this.changeClickedStatus(e);
            })

            userElement.userDetails = user;
            usersView.appendChild(userElement);

        })

    }
}

customElements.define('users-view', UsersView);