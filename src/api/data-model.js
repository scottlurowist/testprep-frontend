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
    getMyTests = (user) => {

        // Return the promise to the caller.
        return axios({
            method: 'get',
            url: `${apiUrl}/tests/${user.email}`,
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



    // Allows the user to delete a flashcard by invoking the
    // webservice for creating a flashcard. 
    //
    // russianWord - The Russian word to be saved to a flashcard.
    // newPassword - The English word to be saved to a flashcard.
    // token - A JSON web token used for authorization to the web service.
    //
    // createFlashcard = (russianWord, englishWord, token) => {

    //     const data =  {
    //         "flashcard": {
    //           "englishWord": englishWord,
    //           "russianWord": russianWord
    //         }
    //     }

    //     // Return the promise to the caller.
    //     return axios({
    //         method: 'post',
    //         url: `${apiUrl}/flashcards`,
    //         headers: {'Authorization': `Bearer ${token}`},
    //         data: data
    //     });
    // };    


    // Allows the user to get all flashcards by invoking the
    // webservice for index. 
    //
    // flashcardId - The id of the flashcard to delete.
    // token - A JSON web token used for authorization to the web service.
    //
    // deleteFlashcard = (flashcardId, token) => {

    //     // Return the promise to the caller.
    //     return axios({
    //         method: 'delete',
    //         url: `${apiUrl}/flashcards/${flashcardId}`,
    //         headers: {'Authorization': `Bearer ${token}`}
    //     });
    // };


    // Allows the user to get all flashcards by invoking the
    // webservice for index. 
    //
    // token - A JSON web token used for authorization to the web service.
    //
    // getAllFlashcards = (token) => {

    //     // Return the promise to the caller.
    //     return axios({
    //         method: 'get',
    //         url: `${apiUrl}/flashcards`,
    //         headers: {'Authorization': `Bearer ${token}`}
    //     });
    // };




   


    // Allows the user to update a flashcard by invoking the
    // webservice for creating a flashcard. 
    //
    // flashcardId - The id of the flashcard to update.
    // russianWord - The Russian word to be udated in a flashcard.
    // englishWord - The English word to be updated in a flashcard.
    // token - A JSON web token used for authorization to the web service.
    //
    // updateFlashcard = (flashcardId, russianWord, englishWord, token) => {

    //     const data =  {
    //         "flashcard": {
    //           "englishWord": englishWord,
    //           "russianWord": russianWord
    //         }
    //     }

    //     // Return the promise to the caller.
    //     return axios({
    //         method: 'patch',
    //         url: `${apiUrl}/flashcards/${flashcardId}`,
    //         headers: {'Authorization': `Bearer ${token}`},
    //         data: data
    //     });
    // };   
}


export default TestprepDataModel;
