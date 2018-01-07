import initState from './initState';

export default function (
    state = initState,
    action
) {
    switch (action.type) {
        case 'GET_ALL_CATEGORY': {
            const data = action.payload ? action.payload.concat() : [];
            return {...state, data};
        }
        case 'SET_CATEGORY': {
            const category = action.payload;
            const data = {...state, category};
            return {...state, ...data};
        }
    }

    return state;
}