import {LitElement, html, css} from 'lit';
import {customElement, property, query, queryAll} from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/tree/tree.js';
import '@shoelace-style/shoelace/dist/components/tree-item/tree-item.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';


type dataObject = {
    mockData: object
};

@customElement('tree-model')
class TreeModel extends LitElement {

    static styles = css`
      :host {
        display: block;
      }
    `;

    @property()
    mockDataObject: dataObject;

    @query('#tree')
    tree;

    @queryAll('.tree-item')
    treeItems;

    render() {
        return html`
            <div id="tree">
                <h1>Tree view</h1>
                <sl-tree>
                    ${this.createTreeNodes(this.mockDataObject.mockData, '')}
                </sl-tree>
            </div>
        `
    }

    createTreeNodes(data: any, position: string) {
        return Object.entries(data).map(([key, value]: [string, any]) => {
            const newPath = position ? `${position}.${key}` : key;
            return html`
                ${typeof value === 'object' &&
                value !== null ?
                        !Array.isArray(value) ? html`
                                    <sl-tree-item class="tree-item" data-position=${newPath}>
                                        ${key}
                                        ${this.createTreeNodes(value, newPath)}
                                    </sl-tree-item>
                                `
                                : html`
                                    <sl-tree-item class="tree-item" data-position=${newPath}>
                                        ${key}
                                        ${value.map((data, index) => {
                                            return html`
                                                <sl-tree-item class="tree-item" data-position="${newPath}[${index}]">
                                                    ${index}
                                                    ${this.createTreeNodes(data, `${newPath}[${index}]`)}
                                                </sl-tree-item>
                                            `
                                        })
                                        }
                                    </sl-tree-item>

                                `
                        : html`
                            <sl-tree-item class="tree-item">${key}: ${value}</sl-tree-item>`
                }
            `
        })
    }

    expandList(treeItem) {
        if (treeItem.parentNode.id !== 'tree') {
            const childTreeItems = treeItem.getChildrenItems();
            if (childTreeItems.length > 0) {
                treeItem.expanded = true;
                this.expandList(treeItem.parentNode);
            } else {
                this.expandList(treeItem.parentNode);
            }
        }
    }

    collapseList() {
        const treeItemArray: any = Array.from(this.treeItems);
        const treeItemsToCollapse = treeItemArray.filter(treeItem => treeItem.expanded === true);
        treeItemsToCollapse.forEach(item => item.expanded = false);
        this.requestUpdate();
    }

    expandElementInTree(target) {
        const position = `${target.dataset.position}`;
        const treeItem = this.renderRoot.querySelectorAll(`[data-position="${position}"]`);
        this.expandList(treeItem[0]);
        this.requestUpdate();
        treeItem[0].scrollIntoView({behavior: 'auto'});
    }

    firstUpdated() {
        document.addEventListener('expandOrCollapseElementInTree', (e) => {
            this.collapseList();
            //@ts-ignore
            if (e.detail.expandElement) {
                //@ts-ignore
                this.expandElementInTree(e.detail.viewElement);
            }
        })
    }
}
