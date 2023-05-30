import {html, render} from '/node_modules/lit-html/lit-html.js'


class TreeModel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.render();
    }

    set objectData(data) {
        this._objectData = data;
    }

    get objectData() {
        return this._objectData;
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

                /* Additional styles for value labels */
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

    createTreeNodes(parentElement, data) {
        const ul = document.createElement('ul');

        for (const key in data) {
            const value = data[key];

            const li = document.createElement('li');
            const label = document.createElement('span');
            const keyLabel = document.createTextNode(key);
            if (keyLabel.textContent === 'users') {
                label.id = 'users-span';
                li.classList.add('users-list')
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

                this.createTreeNodes(li, value);
            } else {
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
        }
    }

    getUserIndexByObject(searchObject) {
        const users = this.objectData.users;
        for (let i = 0; i < users.length; i++) {
            if (this.isObjectEqual(users[i], searchObject)) {
                return i;
            }
        }
        return -1; // Not found
    }

    isObjectEqual(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    findSpanWithValue(element, targetValue) {
        const spans = element.querySelectorAll('span');
        for (let i = 0; i < spans.length; i++) {
            if (spans[i].textContent === `+${targetValue}`) {
                const toggleSign = spans[i].children[0];
                this.expandList(toggleSign);
            }
        }
        // If not found in current element, recursively search in the child elements
        const children = element.children;
        for (let i = 0; i < children.length; i++) {
            this.findSpanWithValue(children[i], targetValue);
        }
    }

    expandUser(indexOfUser) {
        const userList = this.shadowRoot.querySelector('.users-list');
        const usersSpan = this.shadowRoot.getElementById('users-span');
        const toggleSign = usersSpan.children[0];
        if (toggleSign) {
            this.expandList(toggleSign);
        }
        this.findSpanWithValue(userList, indexOfUser.toString());
    }


    expandElementsByObject(parentElement, node, targetObject) {
        const indexOfUser = this.getUserIndexByObject(targetObject);
        if (indexOfUser !== -1) {
            this.expandUser(indexOfUser);
        }
    }


    connectedCallback() {
        // Add the tree nodes to the HTML
        const tree = this.shadowRoot.getElementById('tree');
        this.createTreeNodes(tree, this.objectData);
        document.addEventListener('expandUser', (e) => {
            const userList = this.shadowRoot.querySelector('.users-list');
            const lis = userList.querySelectorAll('li');
            for (let i = 0; i < lis.length; i++) {
                this.collapseList(lis[i]);
            }
            this.expandElementsByObject(tree, this.objectData, e.detail.userObject);
        })

        document.addEventListener('collapseUser', (e) => {
            const userList = this.shadowRoot.querySelector('.users-list');
            const lis = userList.querySelectorAll('li');
            for (let i = 0; i < lis.length; i++) {
                this.collapseList(lis[i]);
            }
        })
    }

}

customElements.define('tree-model', TreeModel);