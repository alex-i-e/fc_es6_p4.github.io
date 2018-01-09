// Prototype
function inherit(proto) {
    function F() {
    }

    F.prototype = proto;
    var object = new F;
    return object;
}

function BaseStore(reducers = {}, initialState = {}) {
    this._subscribers = [];
    this._reducers = reducers;
    this._state = this._reduce(initialState, {});
}

BaseStore.prototype = {
    subscribe(fn) {
        this._subscribers = [...this._subscribers, fn];
        fn(this.value);
        return () => {
            this._subscribers = this._subscribers.filter(sub => sub !== fn);
        };
    },
    dispatch(action) {
        this._state = this._reduce(this._state, action);
        this._subscribers.forEach(fn => fn(this.value));

        this.prevState = this._state;
    },
    _reduce(state, action) {
        const newState = {};
        for (const prop in this._reducers) {
            newState[prop] = this._reducers[prop](state[prop], action);
        }
        return newState;
    }
};
Object.defineProperty(BaseStore.prototype, "value", {
    get: function () {
        return this._state;
    }
});

function Store() {
    BaseStore.apply(this, arguments);
    this.prevState = this._state;
}

Store.prototype = inherit(BaseStore.prototype);
Store.prototype.constructor = Store;
Object.defineProperty(Store.prototype, "prevValue", {
    get: function () {
        return this.prevState;
    }
});

export default Store;