import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';


const mockObject = {
    map:
        {
            'key1': 'value1',
            'key2': 'value2'
        },
    users: {
        clients:
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
            ]
    },
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

@customElement('main-app')
class MainApp extends LitElement {
    render() {
        return html`
            <div class="main-app-container">

            </div>
        `;
    }

    firstUpdated() {
        const mockObjectForApp = mockObject;
        const viewFocus = 'clients'
        const viewPath = 'users.clients';
        const mainContainer = this.renderRoot.querySelector('.main-app-container');
        const viewModel = document.createElement('view-model');
        const treeModel = document.createElement('tree-model');
        const reduceByFocus = viewPath.split('.').reduce((previous, current) => previous[current], mockObjectForApp);
        //@ts-ignore
        viewModel.viewElementsObject = {
            viewElements: reduceByFocus,
            viewElementsPath: viewPath,
            viewElementsName: viewFocus
        };
        //@ts-ignore
        treeModel.mockDataObject = {mockData: mockObjectForApp};

        mainContainer.appendChild(viewModel);
        mainContainer.appendChild(treeModel);
    }
}