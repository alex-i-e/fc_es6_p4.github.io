import * as Store from 'redux/redux_simple';
import {initialState, todosReducer} from 'reducers/todoReducer';

const reducers = {
    todos: todosReducer,
};

const store = new Store(reducers, initialState);

const unsubscribe = store.subscribe(state => {
});

// store.subscribe(render);

export {
    store
}