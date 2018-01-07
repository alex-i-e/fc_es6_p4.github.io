import initState from './initState';

export default function (
    state = initState,
    action
) {
    switch (action.type) {
        case 'SET_ARTICLE_FOUNDATION': {
            const data = action.payload ? action.payload.concat() : [];
            return {...state, data};
        }
        case 'SET_ARTICLE_SOURCES': {
            const sources = action.payload;
            const data = {...state, sources};
            return {...state, ...data};
        }
    }

    return state;
}