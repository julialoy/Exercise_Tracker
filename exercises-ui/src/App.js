import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CreateExercisePage from './pages/CreateExercisePage';
import EditExercisePage from './pages/EditExercisePage';
import Footer from './components/Footer';
import { useState } from 'react';

function App() {
  const [exerciseToEdit, setExerciseToEdit] = useState();

  return (
    <div className="App">
      <Header />
      <Router>
        <Navigation />
        <Route path="/" exact>
          <HomePage  setExerciseToEdit={setExerciseToEdit} />
        </Route>
        <Route path="/create-exercise">
          <CreateExercisePage />
        </Route>
        <Route path="/edit-exercise">
          <EditExercisePage exerciseToEdit={exerciseToEdit} />
        </Route>
      </Router>
      <Footer />
    </div>
  );
}

export default App;