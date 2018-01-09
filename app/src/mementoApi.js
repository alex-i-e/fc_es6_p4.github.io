import Observer from './observer';
import NewsApi from './newsApi';

// Memento
class Memento {
    constructor() {
        this.feedObject = {};
        this.feedTimeout = 1000 * 60 * 5;
        this.newsApi = new NewsApi();
        this.category = this;
        this.observer = new Observer();

        this.observer.subscribe('source_from_ram', {
            scope: this,
            func: Memento.checkMementoWorkInConsole('[source]')
        });
        this.observer.subscribe('topHeadlines_from_ram', {
            scope: this,
            func: Memento.checkMementoWorkInConsole('[topHeadlines]')
        })
    }

    static checkMementoWorkInConsole(typeApi) {
        return () => console.info(`${typeApi} => GOT FROM RAM...`);
    }

    async feedSources(prop) {
        let url = `${this.newsApi.baseUrl}${this.newsApi.apiType.source}?${this.newsApi.apiKeyAttr}`;

        Object.keys(prop).forEach((item) => {
            let cat = 'category=';
            switch (item) {
                case 'category':
                    cat += prop[item];
                    break;
                default:
            }

            url += `&${cat}`;
        });

        if (this.feedObject[url]) {
            this.observer.notify('source_from_ram');
            return this.feedObject[url];
        } else {
            this.feedObject[url] = await this.newsApi.getSources(prop, url);
            return this.feedObject[url];
        }
    }

    async feedTopHeadlines(prop) {
        let url = `${this.newsApi.baseUrl}${this.newsApi.apiType.top}?${this.newsApi.apiKeyAttr}`;
        let isDirty = false;

        Object.keys(prop).forEach((item) => {
            let cat = 'sources=';
            switch (item) {
                case 'sources':
                    cat += Object.keys(prop[item]).join(',');
                    isDirty = !cat.endsWith('=');
                    break;
                default:
            }

            url += `&${cat}`;
        });

        if (this.feedObject[url]) {
            this.observer.notify('topHeadlines_from_ram');
            return this.feedObject[url];
        } else {
            this.feedObject[url] = await this.newsApi.getTopHeadlines(isDirty, url);
            return this.feedObject[url];
        }
    }
}
export default Memento;