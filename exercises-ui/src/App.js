import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CreateExercisePage from './pages/CreateExercisePage';
import EditExercisePage from './pages/EditExercisePage';
import { useState } from 'react';

function App() {
  const [exerciseToEdit, setExerciseToEdit] = useState();


  return (
    <div className="App">
      <header>
        <h1>Exercise Tracker App</h1>
        <p>
          Track your exercises with the Exercise Tracker App. Exercise Tracker
          allows you to add your own exercises and easily view and edit your 
          exercise history.
        </p>
      </header>
      <Router>
        <Navigation />
        <div className="App-header">
          <Route path="/" exact>
            <HomePage  setExerciseToEdit={setExerciseToEdit} />
          </Route>
          <Route path="/create-exercise">
            <CreateExercisePage />
          </Route>
          <Route path="/edit-exercise">
            <EditExercisePage exerciseToEdit={exerciseToEdit} />
          </Route>
          </div>
      </Router>
      <footer>
        &copy; 2022 Julia Loy
      </footer>
    </div>

  );
}

export default App;