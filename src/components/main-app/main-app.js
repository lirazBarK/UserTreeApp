import {html, render} from '/node_modules/lit-html/lit-html.js'


const mockObject = {
    map:
        {
            'key1': 'value1',
            'key2': 'value2'
        },
    users:
        [{
            'name': 'Liraz',
            'age': 32
        },
            {
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
    emails:
        [{
            email: 'liraz@bar.com',
            name: 'Liraz',
            text: 'yada yada'
        },
            {
                email: 'Amir@welwel.com',
                name: 'Amir',
                text: 'yada bada bom'
            },
        ],
}

const mockObjectTwo = {
    simpleArray: ['1', '2', 'Liraz'],
    emails: [
        {
            email: 'liraz@bar.com',
            name: 'Liraz',
            text: 'yada yada'
        },
        {
            email: 'Amir@welwel.com',
            name: 'Amir',
            text: 'yada bada bom'
        },

    ],
    complexData: [
        {
            data: {
                field: 'yep',
                fieldTwo: 'yep yep'
            }
        },
        {
            moreData: [1, 3, 4]
        }
    ]
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
        const mockObjectForApp = mockObject;
        const viewFocus = 'users';
        const mainContainer = this.shadowRoot.querySelector('.main-app-container');
        const viewModel = document.createElement('view-model');
        const treeModel = document.createElement('tree-model');

        viewModel.viewElementsObject = {viewElements: mockObjectForApp[viewFocus], viewElementsName: viewFocus};
        treeModel.mockDataObject = {mockData: mockObjectForApp, viewFocusName: viewFocus};

        mainContainer.appendChild(viewModel);
        mainContainer.appendChild(treeModel);

    }
}

customElements.define('main-app', MainApp);