import React, {Component} from 'react';
import '../styling/errorpage.css'

class ErrorPage extends Component {
    render() {
        return (
            <div>
                <div className={"body"} id="main">
                    <div className="fof">
                        <h1 className={'h1'}>Error 404 - Page Not Found</h1>
                    </div>
                </div>
            </div>
        );
    }
}

export default ErrorPage;