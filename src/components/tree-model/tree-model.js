import {html, render} from '/node_modules/lit-html/lit-html.js'


class TreeModel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.render();
    }

    set mockDataObject(data) {
        this._mockDataObject = data;
    }

    get mockDataObject() {
        return this._mockDataObject;
    }

    render() {
        const treeModelTemplate = html`
            <style>
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


            </style>

            <div id="tree">
                <h1>Tree view</h1>

            </div>

        `

        render(treeModelTemplate, this.shadowRoot);
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
            if (key === this.mockDataObject.viewFocusName) {
                label.id = `${this.mockDataObject.viewFocusName}-span`;
                li.classList.add(this.mockDataObject.viewFocusName)
            }
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

    expandList(toggleSign) {
        const li = toggleSign.parentNode.parentNode;
        if (li.classList.contains('has-children')) {
            li.classList.add('collapsed');
            const ul = li.querySelector('ul');
            if (ul) {
                ul.classList.add('open');
            }
            const sign = li.querySelector('.toggle-sign');
            sign.innerText = li.classList.contains('collapsed') ? '-' : '+';
        }
    }

    collapseList(li) {
        if (li.classList.contains('has-children')) {
            li.classList.remove('collapsed');
            const ul = li.querySelector('ul');
            if (ul) {
                ul.classList.remove('open');
            }
            const sign = li.querySelector('.toggle-sign');
            sign.innerText = li.classList.contains('collapsed') ? '-' : '+';
        } else {
            const ul = li.closest('ul');
            ul.parentNode.classList.remove('collapsed');
            ul.classList.remove('open');
            const sign = ul.parentNode.querySelector('.toggle-sign');
            sign.innerText = ul.parentNode.classList.contains('collapsed') ? '-' : '+';
        }
    }

    expandElement(valueToExpand) {
        const elementList = this.shadowRoot.querySelector(`.${this.mockDataObject.viewFocusName}`);
        const elementSpan = this.shadowRoot.getElementById(`${this.mockDataObject.viewFocusName}-span`);
        const toggleSign = elementSpan.children[0];
        if (toggleSign) {
            this.expandList(toggleSign);
        }
        const toggleSignOfValue = valueToExpand[0].querySelector('.toggle-sign');
        this.expandList(toggleSignOfValue);
        toggleSignOfValue.scrollIntoView({ behavior: 'smooth' });
    }


    expandElementInTree(parentElement, node, target) {
        const position = `${target.dataset.position}`;
        const valueToExpand = this.shadowRoot.querySelectorAll(`[data-position="${position}"]`);
        this.expandElement(valueToExpand);
    }


    connectedCallback() {
        const tree = this.shadowRoot.getElementById('tree');
        this.createTreeNodes(tree, this.mockDataObject.mockData, '');
        document.addEventListener('expandOrCollapseElementInTree', (e) => {
            const elementList = this.shadowRoot.querySelector(`.${this.mockDataObject.viewFocusName}`);
            const lis = elementList.querySelectorAll('li');
            for (let i = 0; i < lis.length; i++) {
                this.collapseList(lis[i]);
            }
            if (e.detail.expandElement) this.expandElementInTree(tree, this.mockDataObject.mockData, e.detail.viewElement);
        })
    }

}

customElements.define('tree-model', TreeModel);