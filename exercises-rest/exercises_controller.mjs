import 'dotenv/config';
import * as exercises from './exercises_model.mjs';
import express from 'express';
// import { body, validationResult } from 'express-validator';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

const isNameValid = (name) => {
    if (!name) {
        console.log(`No name provided: ${name}`);
        return false;
    } else if (typeof name !== 'string') {
        console.log(`Name type incorrect: ${typeof name}`);
        return false;
    } else if (name === " ") {
        return false;
    }

    return true;
};

const isRepsAndWeightValid = (reps, weight) => {
    if (!reps || !weight) {
        console.log(`Reps and/or weight missing: ${reps} ${weight}`)
        return false;
    }
    
    const numReps = parseInt(reps);
    const numWeight = parseInt(weight);
    if (Number.isNaN(numReps) || Number.isNaN(numWeight)) {
        console.log(`Reps and/or weight type incorrect: ${typeof numReps} ${typeof numWeight}`);
        return false;
    } else if (0 >= numReps || 0 >= numWeight) {
        console.log(`Reps or weight below minimum number: ${reps} ${weight}`);
        return false;
    }

    return true;
};

const isUnitValid = (unit) => {
    if (!unit) {
        console.log(`Unit missing: ${unit}`);
        return false;
    } if (unit !== "lbs" && unit !== "kgs") {
        console.log(`Bad unit provided: ${unit}`);
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
    if (isDateValid(req.body.date) &&
        isNameValid(req.body.name) &&
        isRepsAndWeightValid(req.body.reps, req.body.weight) &&
        isUnitValid(req.body.unit)
    ) {
        return true;
    }

    return false;
}

app.post('/exercises', 
    // body('name').isAlpha(),
    // body('reps').isNumeric({no_symbols: true}).isIn({min: 1}), 
    // body('weight').isNumeric({no_symbols: true}).isIn({min: 1}), 
    // body('unit').isIn(['kg', 'lbs']), 
    (req, res) => {
        // exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        //     .then(exercise => {
        //         if (exercise !== null) {
        //             res.status(201).json(exercise);
        //         } else {
        //             res.status(400).json({Error: "Invalid request"});
        //         }
        //     })
        //     .catch(error => {
        //         console.log(`Unable to save exercise: ${error}`);
        //         res.status(400).json({Error: "Invalid request"});
        //     });
    if (validateExercise(req)) {
        exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
            .then(exercise => {
                res.status(201).json(exercise);
            })
            .catch(error => {
                console.log(`Unable to save exercise to database: ${error}`);
                // Is this status and message ok?
                res.status(400).json({Error: "Invalid request"});
            });
    } else {
        res.status(400).json({Error: "Invalid request"});
    }
    // const validDate = isDateValid(req.body.date);
    // const otherErrors = validationResult(req);
    // if (!validDate && !otherErrors.isEmpty()) {
    //     res.status(400).json({Error: "Invalid request"});
    // } else {
    //     exercises.createExercise(req.body.name, req.body.reps.req.body.reps, req.body.weight, req.body.unit, req.body.date)
    //         .then(exercise => {
    //             res.status(201).json(exercise);
    //         })
    //         .catch(error => {
    //             console.log(`Unable to save exercise to database: ${error}`);
    //             res.status(400).json({Error: "Invalid request"});
    //         });
    // }
});

app.get('/exercises', (req, res) => {
    exercises.findExercises({})
        .then(data => {
            res.status(200).send(data);
        })
        .catch(error => {
            console.log(`An error occurred while querying the database: ${error}`);
            // Is this status and message ok?
            res.status(400).json({Error: "Request failed"});
        });
});

app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.findExerciseById(exerciseId)
        .then(exercise => {
            if (exercise !== null) {
                res.status(200).json(exercise);
            } else {
                res.status(404).json({Error: "Not found"});
            }
        })
        .catch(error => {
            console.error(`An error occurred while querying the database: ${error}`);
            // Is this status and message ok?
            res.status(404).json({Error: "Request failed"});
        });
});

app.put('/exercises/:_id', (req, res) => {
        // exercises.updateExercise(req.params._id, req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        //     .then(exerciseCount => {
        //         if (exerciseCount !== 0) {
        //             const updatedExercise = {
        //                 _id: req.body.id,
        //                 name: req.body.name,
        //                 reps: req.body.reps,
        //                 weight: req.body.weight,
        //                 unit: req.body.unit,
        //                 date: req.body.date
        //             };
        //             res.status(200).json(updatedExercise);
        //         } else {
        //             res.status(404).json({Error: "Not found"});
        //         }
        //     })
        //     .catch(error => {
        //         console.log(`Unable to update exercise: ${error}`);
        //         res.status(404).json({Error: "Not found"});
        //     });
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
                    res.status(200).json(updatedExercise);
                } else {
                    res.status(404).json({Error: "Not found"});
                }
            })
            .catch(error => {
                console.log(`An error occurred while trying to update the database: ${error}`);
                // Is this status and message ok?
                res.status(404).json({Error: "Request failed"});
            });
    } else {
        res.status(404).json({Error: "Invalid request"});
    }
});

app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
        .then(deleteCount => {
            if (deleteCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({Error: "Not found"});
            }
        })
        .catch(error => {
            console.log(`An error occurred while trying to delete the record from the database: ${error}`);
            res.status(400).json({Error: "Invalid request"});
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});