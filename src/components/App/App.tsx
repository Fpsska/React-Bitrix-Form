import React, { useEffect } from 'react';

import { notification } from 'antd';

import { useAppSelector } from '../../app/hooks';

import FeedbackForm from '../Form/Form';

import './App.css';
import '../../assets/styles/_reset.scss';
import '../../assets/styles/style.scss';

// /. imports

const App: React.FC = () => {
    const { formData, isFormSubmitted } = useAppSelector(
        state => state.formSlice
    );

    const [api, contextHolder] = notification.useNotification();

    // /. hooks

    useEffect(() => {
        isFormSubmitted &&
            api.open({
                message: 'Getted Form Data:',
                description: JSON.stringify(formData, null, 2),
                duration: 15
            });
    }, [isFormSubmitted]);

    // /. effects

    return (
        <div className="App">
            <header className="header"></header>
            <main className="main">
                <div className="container">
                    <FeedbackForm />
                    <>{contextHolder}</>
                </div>
            </main>
            <footer className="footer"></footer>
        </div>
    );
};

export default App;
