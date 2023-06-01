import {html, render} from '/node_modules/lit-html/lit-html.js'


class ViewModel extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.render()
    }

    set viewElementsObject(viewElementsObject) {
        this._viewElementsObject = viewElementsObject;
    }

    get viewElementsObject() {
        return this._viewElementsObject;
    }

    render() {
        const ViewModelTemplate = html`

            <div class="view-model-container">
                <h2>${this.viewElementsObject.viewElementsName}</h2>
            </div>
            <div class="view-element-count-container">
                <h3>Count: ${this.viewElementsObject.viewElements.length}</h3>
            </div>
        `

        render(ViewModelTemplate, this.shadowRoot);
    }

    changeButtonTextForViewElements(e) {
        const viewModelElements = this.shadowRoot.querySelectorAll("view-model-element");
            for (let i = 0; i < viewModelElements.length; i++) {
                if(e.target !== viewModelElements[i]) {
                    viewModelElements[i].setAttribute('status', 'collapsed');
                }
            }
    }

    createView(element) {
        const viewModel = this.shadowRoot.querySelector('.view-model-container');
        const viewModelElement = document.createElement('view-model-element');
        viewModelElement.addEventListener('changeClickedStatus', (e) => {
            this.changeButtonTextForViewElements(e);
        })

        viewModelElement.elementDetails = {
            element: element,
            viewElementName: this.viewElementsObject.viewElementsName
        };
        viewModel.appendChild(viewModelElement);
    }

    connectedCallback() {
        if(Array.isArray(this.viewElementsObject.viewElements)) {
            this.viewElementsObject.viewElements.forEach(viewElement => {
                this.createView(viewElement)
            })
        } else {
            this.createView(this.viewElementsObject.viewElements)
        }
    }
}

customElements.define('view-model', ViewModel);