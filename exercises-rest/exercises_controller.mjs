import 'dotenv/config';
import * as exercises from './exercises_model.mjs';
import express from 'express';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

const isNameValid = (name) => {
    if (!name) {
        return false;
    } else if (typeof name !== 'string') {
        return false;
    } 
    else if (name === "" || name === null || name === undefined) {
        return false;
    }

    return true;
};

const isRepsAndWeightValid = (reps, weight) => {
    if (!reps || !weight) {
        return false;
    }
    
    const numReps = parseInt(reps);
    const numWeight = parseInt(weight);
    if (Number.isNaN(numReps) || Number.isNaN(numWeight)) {
        return false;
    } else if (0 >= numReps || 0 >= numWeight) {
        return false;
    }

    return true;
};

const isUnitValid = (unit) => {
    if (!unit) {
        return false;
    } else if (typeof unit !== 'string') {
        return false;
    } else if (unit !== 'lbs' && unit !== 'kgs') {
        return false;
    }

    return true;
}

/**
 * 
 * @param {String} date 
 * @returns true if the date format is MM-DD-YY where MM, DD and YY are 2 digit integers
 * Function provided in assignment 7 module
 */
 const isDateValid = (date) => {
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
};

const validateExercise = (req) => {
    if (isDateValid(req.body.date) && isNameValid(req.body.name) &&
        isRepsAndWeightValid(req.body.reps, req.body.weight) &&
        isUnitValid(req.body.unit)) {
        return true;
    }

    return false;
}

app.post('/exercises', (req, res) => {
    if (validateExercise(req)) {
        exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
            .then(exercise => {
                res.status(201).setHeader('content-type', 'application/json').json(exercise);
            })
            .catch(error => {
                res.status(400).setHeader('content-type', 'application/json').json({Error: "Invalid request"});
            });
    } else {
        res.status(400).setHeader('content-type', 'application/json').json({Error: "Invalid request"});
    }
});

app.get('/exercises', (req, res) => {
    exercises.findExercises({})
        .then(data => {
            res.status(200).setHeader('content-type', 'application/json').send(data);
        })
        .catch(error => {
            res.status(400).setHeader('content-type', 'application/json').json({Error: "Request failed"});
        });
});

app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.findExerciseById(exerciseId)
        .then(exercise => {
            if (exercise !== null) {
                res.status(200).setHeader('content-type', 'application/json').json(exercise);
            } else {
                res.status(404).setHeader('content-type', 'application/json').json({Error: "Not found"});
            }
        })
        .catch(error => {
            res.status(404).setHeader('content-type', 'application/json').json({Error: "Request failed"});
        });
});

app.put('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    if (validateExercise(req)) {
        exercises.updateExercise(exerciseId, req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
            .then(exerciseCount => {
                if (exerciseCount === 1) {
                    const updatedExercise = {
                        _id: exerciseId,
                        name: req.body.name,
                        reps: req.body.reps,
                        weight: req.body.weight,
                        unit: req.body.unit,
                        date: req.body.date
                    };
                    res.status(200).setHeader('content-type', 'application/json').json(updatedExercise);
                } else {
                    // Failure response if no document with the given ID is found
                    res.status(404).setHeader('content-type', 'application/json').json({Error: "Not found"});
                }
            })
            .catch(error => {
                res.status(404).setHeader('content-type', 'application/json').json({Error: "Not found"});
            });
    } else {
        // Failure response if request body is invalid
        console.log(`Invalid exercise updtae`);
        res.status(400).setHeader('content-type', 'application/json').json({Error: "Invalid request"});
    }
});

app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
        .then(deleteCount => {
            if (deleteCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).setHeader('content-type', 'application/json').json({Error: "Not found"});
            }
        })
        .catch(error => {
            res.status(400).setHeader('content-type', 'application/json').json({Error: "Invalid request"});
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});