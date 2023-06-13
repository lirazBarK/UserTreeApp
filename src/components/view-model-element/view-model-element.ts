import {LitElement, html, css} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';

@customElement('view-model-element')
class ViewModelElement extends LitElement {
    static styles = css`
      .view-model-element-container {
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
        width: 150px;
      }
    `;

    @property()
    elementDetails: object;

    @property({attribute: 'status'})
    status;

    @query('.view-model-element-container')
    viewModelContainer;

    @query('#details-button')
    detailsButton;

    render() {
        return html`
            <div class="view-model-element-container">
                ${Object.values(this.elementDetails).map(value => {
                    return html`
                        <p>${value}</p>`
                })}
                <button id="details-button">Show Details</button>
            </div>
        `
    }

    expandOrCollapseElementInTree(expandElementBoolean) {
        const event = new CustomEvent('expandOrCollapseElementInTree', {
            detail: {viewElement: this, expandElement: expandElementBoolean},
            bubbles: true,
            cancelable: true,
            composed: false
        })

        document.dispatchEvent(event);
    }

    updated(changedProperties: Map<string, any>) {
        if (changedProperties.has('status')) {
            if (this.status === 'collapsed') {
                this.detailsButton.textContent = 'Show Details';
            } else {
                this.detailsButton.textContent = 'Hide Details';
            }
        }
    }

    firstUpdated() {
        this.detailsButton.addEventListener('click', (e) => {
            const oldViewElementStatus = this.status;
            if (oldViewElementStatus === 'collapsed' || oldViewElementStatus == null) {
                this.status = 'expanded';
                this.expandOrCollapseElementInTree(true);

                const event = new CustomEvent('changeClickedStatus', {
                    detail: {viewElement: this},
                    bubbles: true,
                    cancelable: true,
                    composed: false
                })
                this.dispatchEvent(event);
            } else {
                this.status = 'collapsed';
                this.expandOrCollapseElementInTree(false);
            }
        })
    }
}