// [5-6] 1. const {createStore} = Redux;
// TODO : createStore
const createStore = (reducer) => {
    let state;
    let listeners = [];

    const getState = () => state;

    const dispatch = (action) => {
        state = reducer(state, action);
        listeners.forEach(listener => listener());
    };

    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    };

    dispatch({});

    return {getState, dispatch, subscribe};
};

// [15-16] 2. const {combineReducers} = Redux;
// TODO : combineReducers
const combineReducers = (reducers) => {
    return (state = {}, action) => {
        return Object.keys(reducers).reduce(
            (nextState, key) => {
                nextState[key] = reducers[key](
                    state[key],
                    action
                );
            },
            {}
        );
    };
};

// [17] 3. ReactDOM
// TODO : ReactDOM

// 4. Provider.
// 5. connect

////////////////////////////////////////////////////////////
const counter = (state = 0, action) => {
    switch (action.type) {
        case 'INC':
            return state + 1;
        case 'DEC':
            return state - 1;
        default:
            return state;
    }
};

const todo = (state, action) => {
    switch ('' + action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                completed: !state.completed
            };
        default:
            return state;
    }
};

const todos = (state = [], action) => {
    switch ('' + action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ];
        case 'TOGGLE_TODO':
            return state.map(t =>
                todo(t, action)
            );
        default:
            return state;
    }
};

const visibilityFilter = (
    state = 'SHOW_ALL',
    action
) => {
    switch ('' + action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

///////////////////////////////////////////
// 1.
const todoApp = combineReducers({
    todos,
    visibilityFilter
});

// 2.
const store = createStore(todoApp);

// 3.
const {Component} = React;

let nextTodoId = 0;
class TodoApp extends Component {
    render() {
        return (
            '<div> ' +
            '   <div onClick={() => {' +
            '   store.dispatch({' +
            '       type: \'ADD_TODO\',' +
            '       text: \'Test\',' +
            '       id: nextTodoId++' +
            '    });' +
            '}}>' +
            '    Add Todo ' +
            '   </div> ' +
            '   <ul>' +
            '       {this.props.todos.map(todo => ' +
            '           <li key={todo.id}>' +
            '               {todo.text} ' +
            '           </li>' +
            '       )} ' +
            '   </ul> ' +
            '</div>'
/*            `<div>
                <button onClick={() => {
                    store.dispatch({
                        type: 'ADD_TODO',
                        text: 'Test',
                        id: nextTodoId++
                    });
                }}>
                    Add Todo
                </div>
                <ul>
                    {this.props.todos.map(todo =>
                        <li key={todo.id}>
                            {todo.text}
                        </li>
                    )}
                </ul>
            </div>`*/
        );
    }
}

const render = () => {
    ReactDOM.render(
        `<TodoApp 
            todos = {store.getState().todos}
        />`,
        document.getElementById('root')
    );
};

/*const render = () => {
    document.body.innerText = store.getState();
};*/

store.subscribe(render);
render();

/*
document.addEventListener('click', () => {
    store.dispatch({type: 'INC'});
});*/
