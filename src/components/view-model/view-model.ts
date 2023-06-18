import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

type viewElementsObject = {
    viewElements: any,
    viewElementsPath: string,
    viewElementsName: string
};

@customElement('view-model')
class ViewModel extends LitElement {

    @property()
    viewElementsObject: viewElementsObject;

    render() {
        return html`
            <div class="view-model-container">
                <h2>${this.viewElementsObject.viewElementsName}</h2>
            </div>
            <div class="view-element-count-container">
                <h3>Count: ${this.viewElementsObject.viewElements.length}</h3>
            </div>
        `
    }

    changeButtonTextForViewElements(e) {
        const viewModelElements = this.renderRoot.querySelectorAll("view-model-element");
        for (let i = 0; i < viewModelElements.length; i++) {
            if(e.target !== viewModelElements[i]) {
                let element: any = viewModelElements[i];
                element.status = 'collapsed';
            }
        }
    }

    createView(element, index) {
        const viewModel = this.renderRoot.querySelector('.view-model-container');
        const viewModelElement = document.createElement('view-model-element');
        viewModelElement.dataset.position = `${this.viewElementsObject.viewElementsPath}[${index}]`;
        viewModelElement.addEventListener('changeClickedStatus', (e) => {
            this.changeButtonTextForViewElements(e);
        })
        //@ts-ignore
        viewModelElement.elementDetails = element;
        viewModel.appendChild(viewModelElement);
    }

    firstUpdated() {
        const viewElements = this.viewElementsObject.viewElements;
        if(Array.isArray(viewElements)) {
            for (let i = 0; i < viewElements.length; i++) {
                this.createView(viewElements[i], i);
            }
        } else {
            this.createView(viewElements, 0)
        }
    }
}