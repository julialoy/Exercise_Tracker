import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

export const EditMoviePage = ({ movieToEdit }) => {

    /* Initialize state with movieToEdit's data */
    const [title, setTitle] = useState(movieToEdit.title);
    const [year, setYear] = useState(movieToEdit.year);
    const [language, setLanguage] = useState(movieToEdit.language);

    const history = useHistory();

    const editMovie = async () => {
        /* Collect values of state variable */
        const editedMovie = {title, year, language};
        const response = await fetch(`/movies/${movieToEdit._id}`, {
            method: 'PUT',
            /* Fetch requires the body to be a string, we will set it to the string representation of the JSON object */
            body: JSON.stringify(editedMovie),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 200) {
            alert("Successfully edited the movie");
        } else {
            /* In an actual application, we don't want to show the user the status code. Better choice is "please try again" */
            alert(`Failed to edit movie, status code = ${response.status}`);
        }
        /* Return to homepage once user dismisses alert regardless of whether movie was edited */
        history.push("/");
    };

    return (
        <div>
            <h1>Edit Movie</h1>
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)} />
            <input
                type="number"
                value={year}
                onChange={e => setYear(e.target.value)} />
            <input
                type="text"
                value={language}
                onChange={e => setLanguage(e.target.value)} />
            <button
                onClick={editMovie}
            >Save</button>
        </div>
    );
}

export default EditMoviePage;