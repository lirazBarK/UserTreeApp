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
            },
            {
                'name': 'Shiraz',
                'age': 27
            },
            {
                'name': 'Liron',
                'age': 35
            },
        ],
    userCount: 4
}

class MainApp extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.render();
    }

    render() {
        const mainTemplate = html`

            <div class="main-app-container">

            </div>
        `

        render(mainTemplate, this.shadowRoot);
    }

    connectedCallback() {
        const mainContainer = this.shadowRoot.querySelector('.main-app-container');
        const usersView = document.createElement('users-view');
        const treeModel = document.createElement('tree-model');

        usersView.users = mockObject.users;
        treeModel.mockData = mockObject;

        mainContainer.appendChild(usersView);
        mainContainer.appendChild(treeModel);

    }
}

customElements.define('main-app', MainApp);