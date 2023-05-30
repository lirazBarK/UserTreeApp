import {html, render} from '/node_modules/lit-html/lit-html.js'

const mockObject = {
    map: {
        'key1': 'value1',
        'key2': 'value2'
    },
    users:
        [{
            'name': 'Liraz',
            'age': 32
        },
            {
                'name': 'Amir',
                'age': 31
            }
        ],
    userCount: 2
}

class UsersView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.render()
    }

    render() {
        const userViewTemplate = html`

            <div class="user-view-container">
                <h2>Users</h2>
            </div>
        `

        render(userViewTemplate, this.shadowRoot);
    }

    connectedCallback() {
        const usersView = this.shadowRoot.querySelector('.user-view-container');
        mockObject.users.forEach(user => {
            const userElement = document.createElement('user-element');
            userElement.userDetails = user;
            usersView.appendChild(userElement);
        })

    }
}

customElements.define('users-view', UsersView);