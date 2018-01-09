import {templateFactory} from './templateApi.js';
import Memento from './mementoApi.js';

import Store from './redux/redux_simple';
import articleReducer from './reducers/articleReducer';
import categoryReducer from './reducers/categoryReducer';
import initState from './reducers/initState';

const mementoApi = new Memento();

const reducers = {
    category: categoryReducer,
    article: articleReducer
};

const reduxStore = new Store(reducers, initState);

const unsubscribe = reduxStore.subscribe((state) => {
    if (reduxStore.prevValue.category.data !== reduxStore.value.category.data) {

        templateFactory.addElement('category',
            document.getElementsByClassName('settings')[0],
            reduxStore.value.category.data,
            () => {
                reduxStore.dispatch({type: 'SET_CATEGORY', payload: templateFactory.getElemBySelector('category')});
            })
    }
    if (reduxStore.prevValue.category.category !== reduxStore.value.category.category) {

        templateFactory.cleanDOM(document.getElementsByClassName('headlines-container')[0]);

        mementoApi.feedSources({
            category: templateFactory.getElemBySelector('category')
        }).then(data => {

            reduxStore.dispatch({type: 'SET_ARTICLE_FOUNDATION', payload: data});
            reduxStore.dispatch({type: 'SET_ARTICLE_SOURCES', payload: {}});
        });
    }
    if (reduxStore.prevValue.article.data !== reduxStore.value.article.data) {

        const parentDom = document.getElementsByClassName('source-list')[0];
        templateFactory.cleanDOM(parentDom);

        reduxStore.value.article.data.forEach((item) => {
            templateFactory.addElement('checkbox',
                parentDom,
                item,
                (e) => {
                    const sourcesCopy = {...reduxStore.value.article.sources};
                    const checked = e.target.checked;
                    const targetId = e.target.id || e.target.getAttribute('for');

                    checked
                        ? (sourcesCopy[targetId] = targetId)
                        : (delete sourcesCopy[targetId]);

                    reduxStore.dispatch({type: 'SET_ARTICLE_SOURCES', payload: sourcesCopy});
                });

        });
    }
    if (reduxStore.prevValue.article.sources !== reduxStore.value.article.sources) {

        const parentHeadlinesDom = document.getElementsByClassName('headlines-container')[0];
        templateFactory.cleanDOM(parentHeadlinesDom);

        mementoApi.feedTopHeadlines({
            sources: reduxStore.value.article.sources
        }).then(data => {
            data.forEach((item) => {
                templateFactory.addElement('article', parentHeadlinesDom, item, () => {
                })
            })
        });
    }
});

reduxStore.dispatch({type: 'GET_ALL_CATEGORY', payload: mementoApi.newsApi.category});

export default reduxStore;