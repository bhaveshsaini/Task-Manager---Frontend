import React, {Component} from 'react';
import Header from "./Header";
import Axios from "axios";
import '../styling/profile.css'

class Profile extends Component {

    constructor(props) {
        super(props);

        if (localStorage.getItem('token') === null)
            this.props.history.push('/')

        Axios.get('http://localhost/users/avatar', // to get the user profile picture from the database
            {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            }).
        then((res) => {
            this.setState({photo: res.data})
            // console.log(res)
        }).
        catch((e) => {
            console.log(e)
        })

        this.state = {
            photo: ''
        }
    } // end constructor

    updateStateWithPhoto = (event) => {
        this.setState({photo: event.target.files[0]})
    }

    // updating state with edit profile info
    updateStateWithInfo = (event) => {
        this.setState({[event.target.name] : event.target.value})
    }

    // update user info in the database
    updateUser = () => {
        const data = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            password: this.state.password,
            age: this.state.age,
        }

        Axios.patch(
            `http://localhost/users/me`,
            data,
            {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            }
        ).
        then((res) => { // updating the localstorage with updated values
            localStorage.setItem('fname', res.data.firstname)
            localStorage.setItem('lname', res.data.lastname)
            localStorage.setItem('email', res.data.email)
            localStorage.setItem('age', res.data.age)
            window.location.reload()
        }).
        catch((e) => {
            console.log(e)
        })
    }

    photoUpload = async (event) => {
        event.preventDefault()

        const data = new FormData()
        const newName = localStorage.getItem('userId') + '.jpg'
        data.append('pic', this.state.photo, newName)

        await Axios.post(
            'http://localhost/users/upload',
            data,
            {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            }
        ).
        then((res) => {
            window.location.reload()
        }).
        catch((e) => {
            console.log('error occured ' + e)
        })
    }

    photoDelete = async (event) => {
        event.preventDefault()

        await Axios.delete(
            'http://localhost/users/avatar/delete',
            {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            }
        ).
        then((res) => {
            window.location.reload()
        }).
        catch((e) => {
            console.log(e)
        })

    }

    // pop up form to upload photo
    handleSignUpForm = () => {
        document.getElementById('id01').style.display='block';
    }

    // close button change photo form
    handleOnClick2 = () => {
        document.getElementById('id01').style.display='none'
    }

    // close button edit profile form
    handleOnClick3 = () => {
        document.getElementById('id02').style.display='none'
    }

    // tab bar
    openCity = (tabName) => {
        if(tabName === 'about') {
            document.getElementById('about').style.display = 'block'
            document.getElementById('settings').style.display = 'none'
        }
        else {
            document.getElementById('settings').style.display = "block";
            document.getElementById('about').style.display = "none";
        }
    }

    // edit profile form
    editProfile = () => {
        document.getElementById('id02').style.display='block';
    }


    render() {
        return (
            <div>
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"/>
                <Header active={'profile'}/>

                <div className="container emp-profile">
                    <div className="profile-head">
                        <div className='first'>
                            <img src={this.state.photo}/><br/>
                        </div>

                        <div className='second'>
                            <h1>
                                {localStorage.getItem('fname')} {localStorage.getItem('lname')}
                            </h1>

                            {/* TAB BAR */}
                            <div class="w3-bar w3-black">
                              <button class="w3-bar-item w3-button" onClick={() => this.openCity('about')}>About</button>
                              <button class="w3-bar-item w3-button" onClick={() => this.openCity('settings')}>Settings</button>
                            </div>

                            {/* FIRST TAB */}
                            <div id="about" class="w3-container">
                                <h2>
                                    Email <p className={'person-info'}> {localStorage.getItem('email')}</p>
                                </h2>
                                <h2>
                                    Age <p className={'person-info'}> {localStorage.getItem('age')}</p>
                                </h2>
                            </div>

                            {/* SECOND TAB */}
                            <div id="settings" class="w3-container city">
                                <button className={"changePhoto-btn"} onClick={this.handleSignUpForm}>Change Photo</button>
                                <button className={"changePhoto-btn"} onClick={this.editProfile}>Edit Profile</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/*  CHANGE PICTURE FORM  */}
                <div id="id01" className="modal"><span onClick={this.handleOnClick2} className="close" title="Close Modal">&times;</span>
                    <div className={'signup-div'}>
                        <form className={'upload-form'}>
                            <h1>Profile Picture</h1>
                            <div>
                                <input className={"input-btn"} onChange={this.updateStateWithPhoto} type="file" name="file"/><br/>
                                <button className={"upload-btn"} onClick={this.photoUpload}>Upload</button>
                                <button className={"remove-btn"} onClick={this.photoDelete}>Remove Existing Photo</button>
                                <button type={'button'} className={"upload-btn"} onClick={this.handleOnClick2}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>

            {/*  EDIT PROFILE FORM  */}
                <div id="id02" className="modal"><span onClick={this.handleOnClick3} className="close" title="Close Modal">&times;</span>
                    <div className={'signup-div'}>
                        <form className={'upload-form'}>
                            <h1>Edit Profile</h1>
                            <div>
                                <label><b>First Name</b></label>
                                <input onChange={this.updateStateWithInfo} type="text" placeholder="First Name" name="firstname" defaultValue={localStorage.getItem('fname')}/>

                                <label><b>Last Name</b></label>
                                <input onChange={this.updateStateWithInfo} type="text" placeholder="Last Name" name="lastname" defaultValue={localStorage.getItem('lname')}/>

                                <label htmlFor="email"><b>Email</b></label>
                                <input onChange={this.updateStateWithInfo} type="email" placeholder="Email" name="email" defaultValue={localStorage.getItem('email')}/>

                                <label htmlFor="password"><b>Password</b></label>
                                <input onChange={this.updateStateWithInfo} type="password" placeholder="Password" name="password" />

                                <label htmlFor="password"><b>Age</b></label>
                                <input onChange={this.updateStateWithInfo} type="number" placeholder="Age" name="age" defaultValue={localStorage.getItem('age')}/>

                                <button type={'button'} className={"save-btn"} onClick={this.updateUser}>Save</button>
                                <button type={'button'} className={"upload-btn"} onClick={this.handleOnClick3}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;