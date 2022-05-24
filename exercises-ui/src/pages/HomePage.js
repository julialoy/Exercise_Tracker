import React from 'react';
import { Link } from 'react-router-dom';
import MovieList from '../components/MovieList';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function HomePage({ setMovieToEdit }) {
    const [movies, setMovies] = useState([]);

    const history = useHistory();

    /* Async function because we will call the fetch API, which returns a promise */
    const onDelete = async _id => {
        const response = await fetch(`/movies/${_id}`, {method: 'DELETE'});
        if (response.status === 204) {
            /* Filter out the deleted movie from the movies propert of React app's state */
            /* Update the React app's state, this will trigger a rebuild and display the table correctly */
            setMovies(movies.filter(movie => movie._id !== _id));
        } else {
            console.error(`Failed to delete movie with _id = ${_id}, status code = ${response.status}`);
        }
    };

    const onEdit = movie => {
        setMovieToEdit(movie);
        /* Send user to edit movie page when they click the edit icon in the movie list */
        history.push("/edit-movie");
    };

    const loadMovies = async () => {
         /* 
         Successful promise resolution means that fetch received a response, even if the response is a 500 code. 
         Response object is part of fetch API 
         */
        const response = await fetch('/movies');  
        /* response.json() also returns a promise */
        const data = await response.json();  
        setMovies(data);
    };

    /* To get React app to call loadMovies at the appropriate time, use useEffect hook */
    /* Passing empty array as optional parameter deps means loadMovies will be called when the component is first mounted */
    /* useEffect's callback function cannot directly be an async function, but it can call an async function as shown below */
    useEffect(() => {
        loadMovies();
    }, []);

    return (
        <>
            <h2>List of Movies</h2>
            <MovieList movies={movies} onDelete={onDelete} onEdit={onEdit}></MovieList>
            <Link to="/add-movie">Add a movie</Link>
        </>
    );
}

export default HomePage;