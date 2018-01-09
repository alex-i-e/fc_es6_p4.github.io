// Observer
class Observer {
    constructor () {
        this.subscriptions = [];
        this.ssObj = {};
    }

    subscribe (event, {scope, func}) {
        if (this.ssObj[event]) {
            this.ssObj[event].push({scope, func});
        } else {
            this.ssObj[event] = [];
            this.ssObj[event].push({scope, func});
        }
    }

    notify (event) {
        if (this.ssObj[event]) {
            this.ssObj[event].forEach(item => item.func.apply(item.scope));
        }
    }

    unsubscribe(event) {
        if (this.ssObj[event]) {
            delete this.ssObj[event]
        }
    }
}


export default Observer;