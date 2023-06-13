import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('tree-model')
class TreeModel extends LitElement {

    static styles = css `
      ul {
        list-style-type: none;
        padding-left: 20px;
      }

      li {
        position: relative;
        padding-left: 20px;
      }

      li.has-children > ul {
        display: none;
      }

      li.collapsed.has-children > ul {
        display: block;
      }

      span.toggle-sign {
        margin-right: 5px;
        cursor: pointer;
        left: 0;
        top: 0;
      }

      span.value-label {
        color: #666;
      }
    `;

    @property()
    mockDataObject: object;

    render() {
        return html`
            <div id="tree">
                <h1>Tree view</h1>

            </div>
        `
    }

    createTreeNodes(parentElement, data, position) {
        const ul = document.createElement('ul');
        for (const key in data) {
            const value = data[key];
            const li = document.createElement('li');
            const newPath = position ? `${position}.${key}` : key;
            li.dataset.position = newPath;
            const label = document.createElement('span');
            const keyLabel = document.createTextNode(key);
            label.appendChild(keyLabel);
            li.appendChild(label);

            if (typeof value === 'object' && value !== null) {
                li.classList.add('has-children');
                const toggleSign = document.createElement('span');
                toggleSign.classList.add('toggle-sign');
                toggleSign.innerText = '+';
                label.prepend(toggleSign);
                toggleSign.addEventListener('click', (e) => {
                    this.toggleCollapse(e);
                });
                if (!Array.isArray(value)) {
                    this.createTreeNodes(li, value, newPath);
                } else {
                    for (let i = 0; i < value.length; i++) {
                        const indexUl = document.createElement('ul');
                        const indexLi = this.createToggleForIndex(i);
                        indexLi.dataset.position = `${newPath}[${i}]`;
                        indexUl.appendChild(indexLi);
                        li.appendChild(indexUl);
                        this.createTreeNodes(indexLi, value[i], `${newPath}[${i}]`);
                    }
                }
            } else {
                li.classList.add('no-children');
                const valueLabel = document.createTextNode(`: ${value}`);
                const span = document.createElement('span');
                span.classList.add('value-label');
                span.appendChild(valueLabel);
                label.appendChild(span);
            }

            ul.appendChild(li);
        }

        parentElement.appendChild(ul);
    }

    createToggleForIndex(i) {
        const indexLi = document.createElement('li');
        const label = document.createElement('span');
        const keyLabel = document.createTextNode(i);
        label.appendChild(keyLabel);
        indexLi.appendChild(label);
        indexLi.classList.add('has-children');
        const toggleSignIndex = document.createElement('span');
        toggleSignIndex.classList.add('toggle-sign');
        toggleSignIndex.innerText = '+';
        label.prepend(toggleSignIndex);
        toggleSignIndex.addEventListener('click', (e) => {
            this.toggleCollapse(e);
        });

        return indexLi;
    }

    toggleCollapse(event) {
        const toggleSign = event.target.closest('.toggle-sign');
        if (toggleSign) {
            this.handleToggleSign(toggleSign);
            event.stopPropagation();

        }
    }

    handleToggleSign(toggleSign) {
        const li = toggleSign.parentNode.parentNode;
        if (li.classList.contains('has-children')) {
            li.classList.toggle('collapsed');
            const ul = li.querySelector('ul');
            if (ul) {
                ul.classList.toggle('open');
            }
            const sign = li.querySelector('.toggle-sign');
            sign.innerText = li.classList.contains('collapsed') ? '-' : '+';
        }
    }

    expandList(li) {
        if (li.classList.contains('has-children')) {
            li.classList.add('collapsed');
            const ul = li.querySelector('ul');
            if (ul) {
                ul.classList.add('open');
            }
            const sign = li.querySelector('.toggle-sign');
            sign.innerText = li.classList.contains('collapsed') ? '-' : '+';
            this.expandList(li.parentNode);
        } else {
            if (li.parentNode.id !== 'tree') {
                this.expandList(li.parentNode);
            }
        }
    }

    collapseList() {
        const collapsedItems = this.renderRoot.querySelectorAll('.collapsed');
        if (collapsedItems.length > 0) {
            for (let i = 0; i < collapsedItems.length; i++) {
                collapsedItems[i].classList.remove('collapsed');
                const sign = collapsedItems[i].querySelector('.toggle-sign');
                //@ts-ignore
                sign.innerText = collapsedItems[i].classList.contains('collapsed') ? '-' : '+';
            }
        }
        const openItems = this.renderRoot.querySelectorAll('.open');
        if (openItems.length > 0) {
            for (let i = 0; i < openItems.length; i++) {
                openItems[i].classList.remove('open');
            }
        }
    }

    expandElement(valueToExpand) {
        const toggleSignOfValue = valueToExpand[0].querySelector('.toggle-sign');
        this.expandList(valueToExpand[0]);
        toggleSignOfValue.scrollIntoView({behavior: 'smooth'});
    }


    expandElementInTree(parentElement, node, target) {
        const position = `${target.dataset.position}`;
        const valueToExpand = this.renderRoot.querySelectorAll(`[data-position="${position}"]`);
        this.expandElement(valueToExpand);
    }

    firstUpdated() {
        const tree = this.shadowRoot.getElementById('tree');
        //@ts-ignore
        this.createTreeNodes(tree, this.mockDataObject.mockData, '');
        document.addEventListener('expandOrCollapseElementInTree', (e) => {
            this.collapseList();
            //@ts-ignore
            if (e.detail.expandElement) {
                //@ts-ignore
                this.expandElementInTree(tree, this.mockDataObject.mockData, e.detail.viewElement);
            }
        })
    }

}
