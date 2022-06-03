import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ExerciseList from '../components/ExerciseList';

export const HomePage = ({ setExerciseToEdit }) => {
    const [exercises, setExercises] = useState([]);
    const history = useHistory();

    const onDelete = async _id => {
        const response = await fetch(`/exercises/${_id}`, {method: 'DELETE'});
        if (response.status === 204) {
            const getResponse = await fetch('/exercises');
            const exercises = await getResponse.json();
            setExercises(exercises);
        } else {
            console.error(`Failed to delete exercise with _id = ${_id}, status code = ${response.status}`);
        }
    };

    const onEdit = exercise => {
        setExerciseToEdit(exercise);
        history.push('/edit-exercise');
    };

    const loadExercises = async () => {
        const response = await fetch('/exercises', {method: 'GET'});  
        const data = await response.json();  
        setExercises(data);
    };
    useEffect(() => {
        loadExercises();
    }, []);

    return (
        <>
            <ExerciseList exercises={exercises} onDelete={onDelete} onEdit={onEdit}></ExerciseList>
        </>
    );
}

export default HomePage;