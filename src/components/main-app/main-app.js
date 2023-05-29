import {html, render} from '/node_modules/lit-html/lit-html.js'

class MainApp extends HTMLElement{
    constructor() {
        super();
        this.attachShadow({mode:"open"});
        this.render();
    }

    render() {
        const mainTemplate = html `
        
            <div class="main-app-container">

            </div>
        `

        render(mainTemplate, this.shadowRoot);
    }
}

customElements.define('main-app', MainApp);