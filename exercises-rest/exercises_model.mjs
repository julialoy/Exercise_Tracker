import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

const db = mongoose.connection;

const exerciseSchema = mongoose.Schema({
    name: { type: String, required: true },
    reps: { type: Number, min: 1, required: true },
    weight: { type: Number, min: 1, required: true },
    unit: { type: String, enum: ["lbs", "kgs"], required: true },
    date: { type: String, required: true }
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

/**
 * 
 * @param {String} name 
 * @param {Number} reps 
 * @param {Number} weight 
 * @param {String} unit 
 * @param {String} date 
 * @returns A promise that resolves to the JavaScript object for the document calling save.
 */
const createExercise = async (name, reps, weight, unit, date) => {
    const exercise = new Exercise({name: name, reps: reps, weight: weight, unit: unit, date: date});
    return exercise.save();
};

/**
 * 
 * @param {Array} filter 
 * @returns A promise that resolves to the JavaScript object for the document calling exec.
 */
const findExercises = async (filter) => {
    const query = Exercise.find(filter);
    return query.exec();
};

/**
 * 
 * @param {String} _id 
 * @returns A promise that resolves to the JavaScript object for the document calling exec.
 */
const findExerciseById = async (_id) => {
    const query = Exercise.findById(_id);
    return query.exec();
};

/**
 * 
 * @param {String} _id 
 * @param {String} name 
 * @param {Number} reps 
 * @param {Number} weight 
 * @param {String} unit 
 * @param {String} date 
 * @returns A promise
 */
const replaceExercise = async (_id, name, reps, weight, unit, date) => {
    const result = await Exercise.replaceOne({_id: _id}, {name: name, reps: reps, weight: weight, unit: unit, date: date});
    return result.modifiedCount;
};

/**
 * 
 * @param {String} _id 
 * @returns A promise
 */
const deleteById = async (_id) => {
    const result = await Exercise.deleteOne({_id: _id});
    return result.deletedCount;
};

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

export { createExercise, findExercises, findExerciseById, replaceExercise, deleteById };