import React, {Component} from 'react';
import './App.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import ErrorPage from "./components/errorPage";


export default class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <div className={'App'}>
                    <Switch>
                        <Route path={'/'} exact render={
                            props => (
                                <Login {...props}/>
                            )
                        }
                        />

                        <Route path={'/Home'} exact render={
                            props => (
                                <Home {...props}/>
                            )
                        }/>

                        <Route path={"/Profile"} exact render = {
                            props => (
                                <Profile {...props}/>
                            )
                        }/>

                        <Route render = {
                            props => (
                                <ErrorPage {...props}/>
                            )
                        }/>

                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}