import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export const CreateExercisePage = () => {

    const [name, setName] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [unit, setUnit] = useState('');
    const [date, setDate] = useState('');

    const history = useHistory();

    const addExercise = async () => {
        /* Collect values of state variable */
        const newExercise = {name, reps, weight, unit, date};
        const response = await fetch('/exercises', {
            method: 'POST',
            /* Fetch requires the body to be a string, we will set it to the string representation of the JSON object */
            body: JSON.stringify(newExercise),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 201) {
            alert("Successfully added the exercise");
        } else {
            /* In an actual application, we don't want to show the user the status code. Better choice is "please try again" */
            alert(`Failed to add exercise, status code = ${response.status}`);
        }
        /* Return to homepage once user dismisses alert regardless of whether movie was added */
        history.push("/");
    };

    return (
        <div>
            <h1>Add Exercise</h1>
            <input
                type="text"
                placeholder="Enter exercise name here"
                value={name}
                onChange={e => setName(e.target.value)} />
            <input
                type="number"
                value={reps}
                placeholder="Enter number of reps here"
                onChange={e => setReps(e.target.value)} />
            <input
                type="number"
                placeholder="Enter weight here"
                value={weight}
                onChange={e => setWeight(e.target.value)} />
            <select
                name="units"
                placeholder="Enter weight unit (lbs or kgs) here"
                value={unit}
                onChange={e => setUnit(e.target.value)}>
                    <option value="">--Please choose a unit--</option>
                    <option value="lbs">lbs</option>
                    <option value="kgs">kgs</option>
            </select>
            <input
                type="text"
                placeholder="Enter date (MM-DD-YY) here"
                value={date}
                onChange={e => setDate(e.target.value)} />
            <button
                onClick={addExercise}
            >Add</button>
        </div>
    );
}

export default CreateExercisePage;