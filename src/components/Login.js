import React, { Component } from "react";
import Axios from "axios";
import '../styling/loginStyle.css'

class Login extends Component {
    constructor(props) {
        super(props);

        if(localStorage.getItem('token') !== null)
            this.props.history.push('/Home')

        this.state = {
        }
    }

    changeHandler = (res) => {
        this.setState({[res.target.name] : res.target.value})
    }

    login_btn = (res) =>  {
        res.preventDefault()

        if(this.state.password.length > 5) {
            if (this.state.email.includes('.com')) {
                if (this.state.email !== '' && this.state.password !== '') { // if everything is valid, then send axios request
                    
                    const data = {
                        email: this.state.email,
                        password: this.state.password,
                    }

                    Axios.post('http://localhost/users/login', data).then((res) => {
                        if (res.data.user == undefined) {
                            document.getElementById("loginError").style.backgroundColor = "#FFBABA"
                            document.getElementById("loginError").style.color = "#D8000C"
                            document.getElementById("loginError").style.border = "1px solid"
                            document.getElementById("loginError").style.margin = "20px"
                            document.getElementById("loginError").style.padding = "15px 10px 15px 50px"
                            document.getElementById("loginError").style.backgroundRepeat = "no-repeat"
                            document.getElementById("loginError").style.backgroundPosition = "10px center"
                            document.getElementById("loginError").style.backgroundImage = "url('https://i.imgur.com/GnyDvKN.png')"
                            document.getElementById("loginError").innerHTML = "Error: Incorrect Email/Password"
                        } else {
                            localStorage.setItem('token', res.data.user.token)
                            localStorage.setItem('userId', res.data.user._id)
                            localStorage.setItem('fname', res.data.user.firstname)
                            localStorage.setItem('lname', res.data.user.lastname)
                            localStorage.setItem('age', res.data.user.age)
                            localStorage.setItem('email', res.data.user.email)
                            this.props.history.push("/Home")
                        }
                    }).catch((e) => {
                        console.log(e)
                    })
                }
            }
            else{
                document.getElementById("loginError").style.backgroundColor = "#FFBABA"
                document.getElementById("loginError").style.color = "#D8000C"
                document.getElementById("loginError").style.border = "1px solid"
                document.getElementById("loginError").style.margin = "20px"
                document.getElementById("loginError").style.padding = "15px 10px 15px 50px"
                document.getElementById("loginError").style.backgroundRepeat = "no-repeat"
                document.getElementById("loginError").style.backgroundPosition = "10px center"
                document.getElementById("loginError").style.backgroundImage = "url('https://i.imgur.com/GnyDvKN.png')"
                document.getElementById("loginError").innerHTML = "Error: Incorrect email format"
            }
        }
        else{
            document.getElementById("loginError").style.backgroundColor = "#FFBABA"
            document.getElementById("loginError").style.color = "#D8000C"
            document.getElementById("loginError").style.border = "1px solid"
            document.getElementById("loginError").style.margin = "20px"
            document.getElementById("loginError").style.padding = "15px 10px 15px 50px"
            document.getElementById("loginError").style.backgroundRepeat = "no-repeat"
            document.getElementById("loginError").style.backgroundPosition = "10px center"
            document.getElementById("loginError").style.backgroundImage = "url('https://i.imgur.com/GnyDvKN.png')"
            document.getElementById("loginError").innerHTML = "Error: Password must be atleast 6 characters"
        }
    }

    signUpUser = (res) => {
        res.preventDefault()
        if(this.state.password.length > 5)
        {
            if(this.state.email.includes('.com')) // if everything is valid then sign up user
            {
                Axios.post('http://localhost/users', this.state)
                    .then((res) => {
                        if (this.state.email !== '' && this.state.password !== '') {
                            const data = {
                                email: this.state.email,
                                password: this.state.password
                            }

                            Axios.post('http://localhost/users/login', data)
                                .then((res) => {
                                    localStorage.setItem('token', res.data.user.token)
                                    localStorage.setItem('userId', res.data.user._id)
                                    localStorage.setItem('fname', res.data.user.firstname)
                                    localStorage.setItem('lname', res.data.user.lastname)
                                    localStorage.setItem('age', res.data.user.age)
                                    localStorage.setItem('email', res.data.user.email)
                                    this.props.history.push("/Home")
                                })
                                .catch((e) => {
                                    console.log(e)
                                })
                        }
                    })
                    .catch((e) => {
                        document.getElementById("alert").style.padding = "20px"
                        document.getElementById("alert").style.backgroundColor = "#f44336"
                        document.getElementById("alert").style.color = "white"
                        document.getElementById("strongID").innerHTML = "Error"
                        document.getElementById("pID").innerHTML = "This email has already been registered"
                    })
            }

            else{
                document.getElementById("alert").style.padding = "20px"
                document.getElementById("alert").style.backgroundColor = "#f44336"
                document.getElementById("alert").style.color = "white"
                document.getElementById("strongID").innerHTML = "Error"
                document.getElementById("pID").innerHTML = "Invalid email format"
            }

        }
        else {
            document.getElementById("alert").style.padding = "20px"
            document.getElementById("alert").style.backgroundColor = "#f44336"
            document.getElementById("alert").style.color = "white"
            document.getElementById("strongID").innerHTML = "Error"
            document.getElementById("pID").innerHTML = "Password must be atleast 6 characters"
        }
    }

    handleSignUpForm = () => {
        document.getElementById('id01').style.display='block';
        // style= width:auto;
    }

    handleOnClick2 = () => {
        document.getElementById('id01').style.display='none'
    }

    handleOnclick3 = () => {
        document.getElementById('id01').style.display='none'
    }



    render(){
        return (
            <div>
                <body className={"loginbody"}>
                    <div className="container">
                        <span id={"loginError"}></span>
                        <form onSubmit={this.login_btn}>
                            <div className="row">
                                <div className="col">
                                    <h1 className={"signIn"}>Login</h1>
                                    <input onChange={this.changeHandler} type="email" name="email" placeholder="Email" required/>
                                    <input onChange={this.changeHandler} type="password" name="password" placeholder="Password" required/>
                                    <input className={"signIn"} type="submit" value="Login"/>
                                    <input className={"signIn"} name={"createAccount"} value={"Register"} onClick={this.handleSignUpForm}/>
                                </div>
                            </div>
                        </form>

                        {/*  SIGN UP FORM  */}
                        <div id="id01" className="modal"><span onClick={this.handleOnClick2} className="close" title="Close Modal">&times;</span>
                            <form onSubmit={this.signUpUser} className="modal-content">
                                <div className="container">
                                    <h1 className={"signIn"}>Sign Up</h1>
                                    <p>Please fill in this form to create an account.</p>

                                    <div id="alert">
                                        <strong id={"strongID"}></strong> <p id={"pID"}></p>
                                    </div>

                                    <label><b>First Name</b></label>
                                    <input onChange={this.changeHandler} type="text" placeholder="First Name" name="firstname" required/>

                                    <label><b>Last Name</b></label>
                                    <input onChange={this.changeHandler} type="text" placeholder="Last Name" name="lastname" required/>

                                    <label htmlFor="email"><b>Email</b></label>
                                    <input onChange={this.changeHandler} type="email" placeholder="Email" name="email" required/>

                                    <label htmlFor="password"><b>Password</b></label>
                                    <input onChange={this.changeHandler} type="password" placeholder="Password" name="password" required/>

                                    <label htmlFor="password"><b>Age</b></label>
                                    <input onChange={this.changeHandler} type="number" placeholder="Age" name="age"/>

                                    <div className="clearfix">
                                        <input type="button" onClick={this.handleOnclick3} className="cancelbtn" value={"Cancel"}></input>
                                        <input name={"createAccount"} type="submit" value="Create Account"/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </body>
            </div>
        )
}
}

export default Login