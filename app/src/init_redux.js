import Templates from './templateApi.js';
import NewsApi from './newsApi.js';

import Store from './redux/redux_simple';
import articleReducer from './reducers/articleReducer';
import categoryReducer from './reducers/categoryReducer';
import initState from './reducers/initState';

const templateApi = new Templates();
const newsApi = new NewsApi();

const reducers = {
    category: categoryReducer,
    article: articleReducer
};

const reduxStore = new Store(reducers, initState);

const unsubscribe = reduxStore.subscribe((state) => {
    if (reduxStore.prevValue.category.data !== reduxStore.value.category.data) {

        templateApi.addCategory(document.getElementsByClassName('settings')[0],
            reduxStore.value.category.data,
            () => {
                reduxStore.dispatch({type: 'SET_CATEGORY', payload: templateApi.getSelectorValue('category')});
            })
    }
    if (reduxStore.prevValue.category.category !== reduxStore.value.category.category) {

        templateApi.cleanParentDomList(document.getElementsByClassName('headlines-container')[0]);

        newsApi.getSources({
            category: templateApi.getSelectorValue('category')
        }).then(data => {

            reduxStore.dispatch({type: 'SET_ARTICLE_FOUNDATION', payload: data});
            reduxStore.dispatch({type: 'SET_ARTICLE_SOURCES', payload: {}});
        });
    }
    if (reduxStore.prevValue.article.data !== reduxStore.value.article.data) {

        const parentDom = document.getElementsByClassName('source-list')[0];
        templateApi.cleanParentDomList(parentDom);

        reduxStore.value.article.data.forEach((item) => {
            templateApi.addCheckbox(parentDom,
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
        templateApi.cleanParentDomList(parentHeadlinesDom);

        newsApi.getTopHeadlines({
            sources: reduxStore.value.article.sources
        }).then(data => {
            data.forEach((item) => {
                templateApi.addArticle(parentHeadlinesDom, item, () => {
                })
            })
        });
    }
});

reduxStore.dispatch({type: 'GET_ALL_CATEGORY', payload: newsApi.category});

export default reduxStore;