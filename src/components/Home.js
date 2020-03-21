import React, {Component} from 'react';
import Axios from "axios";
import '../styling/home.css'
import Header from "./Header";

class Home extends Component {
    constructor(props) {
        super(props);

        if(localStorage.getItem('token') === null)
            this.props.history.push('/')


        this.state = {
            response: [],
            description: ''
        }


        // get all data from backend
        Axios.get('http://localhost/mytasks/all',
            {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }).
        then((res) => {
            this.setState({
                response: res.data
            })
        }).
        catch((e) => {
            console.log('error getting tasks ' + e)
        })

    } //end constructor



//***************************************************

    // update description as user is typing
    handleChangeDescription = (e) => {
        this.setState({
            description: e.target.value
        })
    }

    // create a task when user clicks add button
    handleAddTask = async () => {
        await Axios.post(
            'http://localhost/tasks',
            {description: this.state.description},
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

    // change status of a task
    toggleTaskComplete =  (e, status) => {
         Axios.patch(
            `http://localhost/tasks/${e}`,
            {completed: status === 'Yes' ? 'No' : 'Yes'},
            {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            }
        ).
        then((res) => { // updating the state with the updated value of the element 'completed'
             let counter = 0
             this.state.response.find((element) => {
                 if(element._id === e){
                     const tempArrayOfObjects = this.state.response.slice()
                     tempArrayOfObjects[counter].completed = status === 'Yes' ? 'No' : 'Yes'
                     this.setState({response: tempArrayOfObjects})
                 }
                 counter = counter + 1
             })
        }).
        catch((e) => {
            console.log(e)
        })

    }

    // updating description of a task
    handleEditButton = (id, description) => { // updating the backend
        let task = prompt("Edit task", description);
        Axios.patch(
            `http://localhost/tasks/${id}`,
            {description: task},
            {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            }
        ).
        then((res) => { // updating the state with the updated value of the element 'description' (frontend)
            let counter = 0
            this.state.response.find((element) => {
                if(element._id === id){
                    const tempArrayOfObjects = this.state.response.slice()
                    tempArrayOfObjects[counter].description = task
                    this.setState({response: tempArrayOfObjects})
                }
                counter = counter + 1
            })
        }).
        catch((e) => {
            console.log(e)
        })

    }

    // deleting a task
    handleDeleteButton = (id) => {
        Axios.delete(
            `http://localhost/tasks/${id}`,
            {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            }
        ).
        then((res) => {
            let counter = 0
            this.state.response.find((element) => {
                if(element._id === id){
                    const tempArrayOfObjects = this.state.response
                    tempArrayOfObjects.splice(counter, 1)
                    this.setState({response: tempArrayOfObjects})
                }
                counter = counter + 1
            })
        }).
        catch((e) => {
            console.log(e)
        })

    }

    // deleting all tasks
    handleDeleteAllTasks = (userId) => {
        Axios.delete(
            `http://localhost/tasks/deleteall/${userId}`,
            {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            }
        ).
        then((res) => {
            if (res.status === 200)
            {
                this.setState({response: []})
            }
        }).
        catch((e) => {
            console.log(e)
        })
    }

    // get remaining tasks from database
    remainingTasks = () => {
        Axios.get('http://localhost/mytasks',
            {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            }).
        then((res) => { // update the paragraph tag
            document.getElementById('remaining-tasks').innerHTML = res.data
            if(res.data === 0)
                document.getElementById('label').style.backgroundColor = '#4CAF50'
            else
                document.getElementById('label').style.backgroundColor = 'crimson'
        }).
        catch((e) => {
            console.log('error getting tasks ' + e)
        })
    }


//***************************************************
    render() {
        return (
            <div>
                <Header active = {'home'}/>

                <body className={"homeBody"}>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
                    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"/>

                    <div className={'head'}>
                        <div className={"container"}>
                            <input onChange={this.handleChangeDescription} type="text" placeholder="Add an item"/>
                            <button onClick={this.handleAddTask} className="w3-button w3-xlarge w3-red w3-card-4 button">+</button>
                        </div>

                        <div className={'delete-btn'}>
                            <button className={"deleteAllBtn"} onClick={() => this.handleDeleteAllTasks(localStorage.getItem('userId'))}>Delete all</button>
                            <label id={'label'} className={'label'}>Tasks Remaining <p className={'paragraph'} onLoad={this.remainingTasks()} id={'remaining-tasks'}></p></label>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-md-12">
                            <div className="main-todo-input-wrap">
                                <div className="main-todo-input fl-wrap todo-listing">
                                    <table>
                                        <tr>
                                            <th>Description</th>
                                            <th>Completed</th>
                                        </tr>
                                                {this.state.response.map((station) =>
                                                    <tr>
                                                        <td onClick={() => this.handleEditButton(station._id, station.description)} >{station.description}</td>
                                                        {/*implement the change color feature below*/}
                                                        <td id={'statusOftask'} onClick={() => this.toggleTaskComplete(station._id, station.completed)} className={"button"}>{station.completed}</td>
                                                        <td className="btn"><i onClick={() => this.handleDeleteButton(station._id)} class="fa fa-trash"></i></td>
                                                    </tr>
                                                )}
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
            </div>
        );
    }
}

export default Home;