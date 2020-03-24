import React, {Component, useState} from 'react';
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
            description: '',
        }


        // get all data from backend
        Axios.get('https://task-manager-backendd.herokuapp.com/mytasks/all',
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
            'https://task-manager-backendd.herokuapp.com/tasks',
            {
                description: this.state.description,
                due: this.state.date
            },
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
            `https://task-manager-backendd.herokuapp.com/tasks/${e}`,
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
            `https://task-manager-backendd.herokuapp.com/tasks/${id}`,
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
            `https://task-manager-backendd.herokuapp.com/tasks/${id}`,
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
            `https://task-manager-backendd.herokuapp.com/tasks/deleteall/${userId}`,
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
        Axios.get('https://task-manager-backendd.herokuapp.com/mytasks',
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

    date = () => {
        const date = new Date(Date.now())

        const ret = date.getFullYear() + '-0' + date.getMonth() + '-' + date.getDate()
        document.getElementById('date').defaultValue = ret
        document.getElementById('date').min = ret
        this.setState({date: document.getElementById('date').value})
    }

    // modify date
    changeDate = () => {
        this.setState({date: document.getElementById('date').value})
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
                            <input className={'newtask'} onClick={this.date} onChange={this.handleChangeDescription} type="text" placeholder={'New task'}/>
                            <input className={'date'} onChange={this.changeDate} type="date" id="date" name="due" max="2030-12-31"/>
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
                                            <th>Due</th>
                                            <th>Completed</th>
                                        </tr>
                                            {this.state.response.map((station) =>
                                                <tr>
                                                    {/* DESCRIPTION */}
                                                    <td onClick={() => this.handleEditButton(station._id, station.description)}>{station.description}</td>

                                                    {/* DUE DATE */}
                                                    <td>{station.due.slice(5)}</td>

                                                    {/* STATUS OF TASKS */}
                                                    <td
                                                        onClick={() => {this.toggleTaskComplete(station._id, station.completed)}}
                                                        className={station.completed === 'Yes' ? 'button' : 'button2'}>
                                                        {station.completed}
                                                    </td>

                                                    {/* DELETE BUTTON */}
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