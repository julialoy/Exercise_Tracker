import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

export const AddMoviePage = () => {

    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [language, setLanguage] = useState('');

    const history = useHistory();

    const addMovie = async () => {
        /* Collect values of state variable */
        const newMovie = {title, year, language};
        const response = await fetch('/movies', {
            method: 'POST',
            /* Fetch requires the body to be a string, we will set it to the string representation of the JSON object */
            body: JSON.stringify(newMovie),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 201) {
            alert("Successfully added the movie");
        } else {
            /* In an actual application, we don't want to show the user the status code. Better choice is "please try again" */
            alert(`Failed to add movie, status code = ${response.status}`);
        }
        /* Return to homepage once user dismisses alert regardless of whether movie was added */
        history.push("/");
    };

    return (
        <div>
            <h1>Add Movie</h1>
            <input
                type="text"
                placeholder="Enter title here"
                value={title}
                onChange={e => setTitle(e.target.value)} />
            <input
                type="number"
                value={year}
                placeholder="Enter year here"
                onChange={e => setYear(e.target.value)} />
            <input
                type="text"
                placeholder="Enter language here"
                value={language}
                onChange={e => setLanguage(e.target.value)} />
            <button
                onClick={addMovie}
            >Add</button>
        </div>
    );
}

export default AddMoviePage;