// Constructor
class TemplateConstructor {
    constructor(tempHtml,
                tempDOM) {
        this.tempHtml = tempHtml;
        this.tempDom = tempDOM;
    }

    setHtml(tempHtml) {
        this.tempHtml = tempHtml;
        return this;
    }

    setNode(type = 'div') {
        this.tempDom = document.createElement(type);
        return this;
    }

    setInnerHtml() {
        this.tempDom.innerHTML = this.tempHtml;
        return this;
    }

    toggleClass(newClass) {
        this.tempDom.classList.toggle(newClass);
        return this;
    }

    setEvent(type, callback) {
        this.tempDom[type] = callback;
        return this;
    }

    appendOnParent(parentElem) {
        parentElem.appendChild(this.tempDom);
        return this;
    }
}

// Factory + Proxy-method + Facade-method
class TemplateFactory {
    constructor(templateProxy) {
        this.templateProxy = templateProxy;
        this.instance = new TemplateConstructor();
    }

    addElement(type, parentElem, data, eventCallback) {
        switch ('' + type) {
            case 'button':
                this.instance.setHtml(this.templateProxy.template.settings.button(data))
                    .setNode()
                    .setInnerHtml()
                    .setEvent('onclick', eventCallback)
                    .appendOnParent(parentElem);
                break;
            case 'category':
                this.instance.setHtml(this.templateProxy.template.settings['category-selector'](data))
                    .setNode()
                    .setInnerHtml()
                    .toggleClass('article-headlines')
                    .setEvent('onchange', eventCallback)
                    .appendOnParent(parentElem);
                break;
            case 'checkbox':
                this.instance.setHtml(this.templateProxy.template.settings.sourceList.checkbox(data))
                    .setNode()
                    .setInnerHtml()
                    .setEvent('onclick', eventCallback)
                    .appendOnParent(parentElem);
                break;
            case 'article':
                this.instance.setHtml(this.templateProxy.template.articles.itemList(data))
                    .setNode()
                    .setInnerHtml()
                    .setEvent('onclick', eventCallback)
                    .appendOnParent(parentElem);
                break;
            default:
        }
    }

    cleanDOM(parentDom) {
        this.templateProxy.cleanParentDomList(parentDom);
    }

    getElemBySelector(selectName) {
        const suffixClass = '-selector';
        return this.templateProxy.getSelectorValue(selectName, suffixClass);
    }
}


class Templates {
    constructor() {

        this.template = {
            settings: {
                'category-selector': (catList = []) => {
                    let htmlTemplate = ` 
<label for="category-selector" class="article-headlines">Choose category: </label>
<select id="category-selector" class="category-selector">
    <option class="selector-option" value="">All categoties</option>`;

                    catList.forEach((item) => {
                        htmlTemplate += `<option class="selector-option" value="${item}">${item.toUpperCase()}</option> `;
                    });
                    htmlTemplate += `</select>`;

                    return htmlTemplate;
                },
                'language-selector': (langList = []) => {
                    let htmlTemplate = ` 
<select class="language-selector">
    <option class="selector-option" value="">All languages</option>`;

                    langList.forEach((item) => {
                        htmlTemplate += `<option class="selector-option" value="${item}">${item.toUpperCase()}</option> `;
                    });
                    htmlTemplate += `</select>`;

                    return htmlTemplate;
                },
                'country-selector': (countryList = []) => {
                    let htmlTemplate = ` 
<select class="country-selector">
    <option class="selector-option" value="">All countries</option>`;

                    countryList.forEach((item) => {
                        htmlTemplate += `<option class="selector-option" value="${item}">${item.toUpperCase()}</option> `;
                    });
                    htmlTemplate += `</select>`;

                    return htmlTemplate;
                },
                button: (btnName) => {
                    return `<button>${btnName}</button>`;
                },
                sourceList: {
                    checkbox: (cbObject) => {
                        const htmlTemplate = ` 
<input type="checkbox" id="${cbObject.id}" category="${cbObject.category}" />
<label for="${cbObject.id}">${cbObject.name}</label>`;

                        return htmlTemplate;
                    }
                }
            },
            articles: {
                itemList: (articleObject) => {
                    const htmlTemplate = `
<a href="${articleObject.url}" class="article-item"
   style="background-image: url('${articleObject.urlToImage}'); " >
${articleObject.title}</a>`;


                    return htmlTemplate;
                },
                itemDescription: () => {
                }
            }
        };
    }

    cleanParentDomList(parentDom) {
        while (parentDom.firstChild) {
            parentDom.removeChild(parentDom.firstChild);
        }
    }

    getSelectorValue(selectName, suffixClass) {
        return document.getElementsByClassName(`${selectName}${suffixClass}`).length
            ? document.getElementsByClassName(`${selectName}${suffixClass}`)[0].value
            : '';
    }
}

let templateFactory = new TemplateFactory(new Templates());

export {
    templateFactory
}