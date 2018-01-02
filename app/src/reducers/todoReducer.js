export const initialState = {
    data: [],
    loaded: false,
    loading: false,
    allInfo: {
        all_category: {
            data: [],
            loaded: false,
            loading: false,
        },
        current_category: {
            data: {},
            loaded: false,
            loading: false,
        },
        all_article: {
            data: [],
            loaded: false,
            loading: false,
        }
    }
};

export function todosReducer(
    state = initialState,
    action //: { type: string, payload: any }
) {
    switch (action.type) {
        case 'ADD_TODO': {
            const todo = action.payload;
            const data = [...state.data, todo];
            return {
                ...state,
                data,
            };
        }
        case 'GET_ALL_CATEGORY': {
            const todo = action.payload;
            state.allInfo.all_category.data = todo.concat();

            return state;
        }
        case 'SET_CATEGORY': {
            const todo = action.payload;
            state.allInfo.current_category.data = {...{}, todo};

            return state;
        }
        case 'GET_ARTICLE': {
            const todo = action.payload;
            state.allInfo.all_article.data = todo.concat();

            return state;
        }
    }

    return state;
}