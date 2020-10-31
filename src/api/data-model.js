////////////////////////////////////////////////////////////////////////////////
//
// data-model.js
//
// This module implements a data access strategy pattern. It adds a layer of 
// abstraction for the React components because they need not concern
// themselves with data access. This also allows us to change the tech without
// breaking the React components. Today we are using Axios; we can change to
// something else tomorrow.
//
////////////////////////////////////////////////////////////////////////////////


import axios from 'axios';

// This is General Assembly code that I added to my project. This config file
// contains the URLs for data access.
import apiUrl from './../apiConfig';




// Implements a data acccess stragegy for the Testprep app.
//
class TestprepDataModel {


    // Allows the user to add a new test by invoking the
    // webservice for creating a test. 
    //
    createATest = (test, user) => {

         // Return the promise to the caller.
        return axios({
            method: 'post',
            url: `${apiUrl}/tests`,
            headers: {'Authorization': `Bearer ${user.token}`},
            data: test
        });
    };   


    // Allows the user to get all flashcards by invoking the
    // webservice for index. 
    //
    // token - A JSON web token used for authorization to the web service.
    //
    getAllTests = (token) => {

        // Return the promise to the caller.
        return axios({
            method: 'get',
            url: `${apiUrl}/tests`,
            headers: {'Authorization': `Bearer ${token}`}
        });
    };


    // Allows the user to get a single test by it's ID.
    //
    // token - A JSON web token used for authorization to the web service.
    // testId - The MongoDB ID for the test.
    //
    getATest = (token, testId) => {

        // Return the promise to the caller.
        return axios({
            method: 'get',
            url: `${apiUrl}/tests/${testId}`,
            headers: {'Authorization': `Bearer ${token}`}
        });
    };


    // Allows the user to get a single test by it's ID.
    //
    // token - A JSON web token used for authorization to the web service.
    // testId - The MongoDB ID for the test.
    //
    getMyTests = (user) => {

        // Return the promise to the caller.
        return axios({
            method: 'get',
            url: `${apiUrl}/tests/mytests/${user.email}`,
            headers: {'Authorization': `Bearer ${user.token}`}
        });
    };


    patchATest = (user, testData) => {

        // Return the promise to the caller.
        return axios({
            method: 'patch',
            url: `${apiUrl}/tests/${testData._id}`,
            headers: {'Authorization': `Bearer ${user.token}`},
            data: testData
        });
    };  


    // Allows the user to get all flashcards by invoking the
    // webservice for index. 
    //
    // flashcardId - The id of the flashcard to delete.
    // token - A JSON web token used for authorization to the web service.
    //
    deleteATest = (testId, token) => {

        // Return the promise to the caller.
        return axios({
            method: 'delete',
            url: `${apiUrl}/tests/${testId}`,
            headers: {'Authorization': `Bearer ${token}`}
        });
    };
  
}


export default TestprepDataModel;
