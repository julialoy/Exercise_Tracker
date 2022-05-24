import 'dotenv/config';
import * as exercises from './exercises_model.mjs';
import express from 'express';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

const validateDate = (dateString) => {
    // Months with 31 days
    const monthsThirtyOne = [1,3,5,6,7,10,12];
    const dateArray = dateString.split('-');
    const validCandidates = dateArray.filter(datePart => datePart.length === 2);
    if (dateString === undefined || dateString === null) {
        // Ensure there is a date in the request
        console.log(`MISSING DATE STRING`);
        return false;
    } else if (validCandidates.length !== 3) {
        // If the dateString is not in the format XX-XX-XX, validCandidates will not have the expected length of 3
        console.log(`DATE STRING FORMAT IS INCORRECT: ${dateString}, ${validCandidates}`);
        return false;
    } else if (parseInt(validCandidates[0]) < 1 || parseInt(validCandidates[0]) > 12) {
        console.log(`MONTH FIELD IS INVALD: ${dateString}`);
        return false;
    } else {
        // If validCandidates has a valid month as its first item, check that second item is a valid day
        if (monthsThirtyOne.includes(parseInt(validCandidates[0]))) {
            // If month can have 31 days, ensure day is not less than 0 or greater than 31
            if (parseInt(validCandidates[1]) < 1 || parseInt(validCandidates[1]) > 31) {
                console.log(`MONTH CAN ONLY HAVE UP TO 31 DAYS AND NO LESS THAN 1: ${dateString}`);
                return false;
            }
        } else if (parseInt(validCandidates[0]) !== 2) {
            // If months is not February and does not have 31 days, ensure day is not less than 0 or greater than 30
            if (parseInt(validCandidates[1]) < 1 || parseInt(validCandidates[1]) > 30) {
                console.log(`MONTH CAN ONLY HAVE UP TO 30 DAYS AND NO LESS THAN 1: ${dateString}`);
                return false;
            }
        } else if (parseInt(validCandidates[1]) < 1 || parseInt(validCandidates[1]) > 29) {
            // If month is February, ensure day is not less than 0 or greater than 29
            console.log(`FEBRUARY CAN ONLY HAVE UP TO 29 DAYS AND NO LESS THAN 1: ${dateString}`);
            return false;
        } else if (parseInt(validCandidates[1]) > 28 && parseInt(validCandidates[2]) % 4 !== 0) {
            // If month is February and the year is not a leap year, check that day is not greater than 28
            // At this point, days have been validated and are not less than 0 or greater than 29
            console.log(`YEAR IS NOT A LEAP YEAR, FEBRUARY CAN ONLY HAVE UP TO 28 DAYS: ${dateString}`);
            return false;
        }
    }
    // All parts of dateString are present and valid
    return true;
};

// const validateNewExercise = (req) => {
//     const exerciseProperties = ["name", "reps", "weight", "unit", "date"];
//     exerciseProperties.forEach(prty => {
//         if (req.body[prty]) {
//             if (prty === "reps" || prty === "weight") {
//                 // Ensure reps and weight properties are numbers that are greater than 0
//                 if (typeof req.body[prty] !== Number) {
//                     return false;
//                 } else if (req.body[prty] <= 0) {
//                     return false;
//                 }
//             } else if (prty === "unit") {
//                 // Ensure unit property is a string equal to "lbs" or "kgs"
//                 if (prty !== "lbs" || prty !== "kgs") {
//                     return false;
//                 }
//             } else if (prty === "name" || prty === "date") {
//                 // Ensure name and date properties are strings
//                 if (typeof req.body[prty] !== String) {
//                     return false;
//                 } else {
//                     if (prt === "date") {
//                         // If current property is the date property, validate the date
//                         if (!validateDate(req.body[prty])) {
//                             return false;
//                         }
//                     }
//                 }
//             }
//         }
//     });
//     // All properties are present and valid
//     return true;
// };

app.post('/exercises', (req, res) => {
    if (validateDate(req.body.date)) {
        exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(exercise => {
            res.status(201).json(exercise);
        })
        .catch(error => {
            console.log(`Unable to save exercise to database: ${error}`);
            res.status(400).json({Error: "Invalid request"});
        });
    } else {
        res.status(400).json({Error: "Invalid request"});
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});