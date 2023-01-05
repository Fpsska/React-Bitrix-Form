import React from 'react';

import FeedbackForm from '../Form/Form';

import './App.css';
import '../../assets/styles/_reset.scss';
import '../../assets/styles/style.scss';

// /. imports

const App: React.FC = () => {
    return (
        <div className="App">
            <header className="header"></header>
            <main className="main">
                <div className="container">
                    <FeedbackForm />
                </div>
            </main>
            <footer className="footer"></footer>
        </div>
    );
};

export default App;
