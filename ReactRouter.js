import React from 'react';
import { render } from 'react-dom';

export default class App extends React.Component {
    constructor(props) {
        super();
        this.state = {
            route: window.location.hash.substr(1)
        }
    }

    componentDidMount() {
        window.addEventListener('hashchange', () => {
            this.setState({
                route: window.location.hash.substr(1)
            })
        })
    }

    render() {
        let startTime = +new Date()
        let _routers = this.props.routers,
            Child = _routers[this.state.route],
            rParam = {}

        if (!Child) {
            let _routesKes = Object.keys(_routers)
            for (let i = 0, len = _routesKes.length; i < len; i++) {
                let r = _routesKes[i],
                    _m = true,
                    _r = r.replace(/{([^{}]+)}/g, (m1, m2) => {
                        _m = false
                        rParam[m2] = null
                        return '([^\/]+)'
                    })
                if(_m) continue
                if (new RegExp('^' + _r + '$').test(this.state.route)) {
                    Child = _routers[r]
                    let _params = this.state.route.match(new RegExp(_r)), _i = 1
                    for (let k in rParam) {
                        rParam[k] = _params[_i++]
                    }
                    break
                }
            }
        }

        if (!Child) {
            Child = _routers['default']
        }

        console.log('耗时：' + ((+new Date()) - startTime) + 'ms' )
        return (<Child {...rParam} />)
    }
}




import Router from './Router';

import Login from './components/Login';
import List from './components/List';
import Detail from './components/Detail';

let routers = { 
    'login': Login,
    'list': List,
    'detail/{id}/{t}': Detail,
    'default': Login
}

render((<Router routers={routers}  />), document.getElementById('app'));