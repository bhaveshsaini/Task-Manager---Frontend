import React, {Component} from "react";
import '../styling/header.css'


export default class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            active: this.props.active
        }
    }

    render() {
        return (
            <ul>
                <li><a id={'home'} className={this.state.active === 'home' ? 'active' : ''} href="/home">Home</a></li>
                <li><a id={'profile'} className={this.state.active === 'profile' ? 'active' : ''} href="/profile">Profile</a></li>
                <li className={"logout"}><a onClick={() => localStorage.clear()} href="/">Logout</a></li>
            </ul>
        )
    }
}