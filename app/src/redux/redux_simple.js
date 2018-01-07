function inherit(proto) {
    function F() {}
    F.prototype = proto;
    var object = new F;
    return object;
}

export default class Store {
    // private subscribers; // : Function[];
    // private reducers; // : { [key: string]: Function };
    // private state; // : { [key: string]: any };

    constructor(reducers = {}, initialState = {}) {
        this.subscribers = [];
        this.reducers = reducers;
        this.state = this.reduce(initialState, {});
        this.prevState = this.state;
    }

    get value() {
        return this.state;
    }

    get prevValue() {
        return this.prevState;
    }

    subscribe(fn) {
        this.subscribers = [...this.subscribers, fn];
        fn(this.value);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== fn);
        };
    }

    dispatch(action) {
        this.state = this.reduce(this.state, action);
        this.subscribers.forEach(fn => fn(this.value));

        this.prevState = this.state;
    }

    /*private */
    reduce(state, action) {
        const newState = {};
        for (const prop in this.reducers) {
            newState[prop] = this.reducers[prop](state[prop], action);
        }
        return newState;
    }
}