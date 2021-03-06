////////////////////////////////////////////////////////////////////////////////
//
// App.jsx
//
// This component is the test prep application. It is the SPA. it contains our
// navbar and it also establishes our routes.
//
////////////////////////////////////////////////////////////////////////////////


import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';

import AuthenticatedRoute from '../AuthenticatedRoute/AuthenticatedRoute';
import AutoDismissAlert from '../AutoDismissAlert/AutoDismissAlert';
import Header from '../Header/Header';
import SignUp from '../SignUp/SignUp';
import SignIn from '../SignIn/SignIn';
import SignOut from '../SignOut/SignOut';
import ChangePassword from '../ChangePassword/ChangePassword';

import HomeView from './../../views/Home/HomeView';
import SelectTestView from './../../views/SelectTest/SelectTestView';
import TakeTestView from './../../views/TakeTest/TakeTestView';
import MyTestsView from '../../views/MyTests/MyTestsView';
import EditTestView from '../../views/EditTest/EditTestView';



class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      user: null,
      msgAlerts: []
    };
  };

  setUser = user => this.setState({ user });

  clearUser = () => this.setState({ user: null });

  msgAlert = ({ heading, message, variant }) => {
    this.setState({ msgAlerts: [...this.state.msgAlerts, { heading, message, variant }] });
  }

  render () {
    const { msgAlerts, user } = this.state;

    return (
      <Fragment>
        <Header user={user} />
        {msgAlerts.map((msgAlert, index) => (
          <AutoDismissAlert
            key={index}
            heading={msgAlert.heading}
            variant={msgAlert.variant}
            message={msgAlert.message}
          />
        ))}
        <main className="container">
          <Route exact path='/' render={() => (
            <HomeView msgAlert={this.msgAlert} />
          )} />
          <Route path='/sign-up' render={() => (
            <SignUp msgAlert={this.msgAlert} setUser={this.setUser} />
          )} />
          <Route path='/sign-in' render={() => (
            <SignIn msgAlert={this.msgAlert} setUser={this.setUser} />
          )} />
          <AuthenticatedRoute user={user} path='/sign-out' render={() => (
            <SignOut msgAlert={this.msgAlert} clearUser={this.clearUser} user={user} />
          )} />
          <AuthenticatedRoute user={user} path='/change-password' render={() => (
            <ChangePassword msgAlert={this.msgAlert} user={user} />
          )} />
          <AuthenticatedRoute user={user} path='/select-test' render={() => (
            <SelectTestView msgAlert={this.msgAlert} user={user} />
          )} /> 
          <AuthenticatedRoute user={user} path='/take-test/:id' render={() => (
            <TakeTestView msgAlert={this.msgAlert} user={user} />
          )} />
          <AuthenticatedRoute user={user} path='/my-tests' render={() => (
            <MyTestsView msgAlert={this.msgAlert} user={user} />
          )} />    
          <AuthenticatedRoute user={user} path='/edit-test/:id' render={() => (
            <EditTestView msgAlert={this.msgAlert} user={user} />
          )} />                                     
        </main>
      </Fragment>
    )
  }
}


export default App;
