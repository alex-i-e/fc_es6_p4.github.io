import "babel-polyfill";
import "whatwg-fetch";

import './style/app.scss';

import DataStore from './src/dataStore.js';
import Templates from './src/templateApi.js';
import NewsApi from './src/newsApi.js';
import Behavior from './src/behavior.js';
import Store from './src/redux/redux_simple'

const dataStore = new DataStore();
const templateApi = new Templates();
const newsApi = new NewsApi();
const behavior = new Behavior(newsApi, templateApi, dataStore, Store);

behavior.onInit();
