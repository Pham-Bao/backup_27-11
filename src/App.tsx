import React, { StrictMode, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes } from './components/routers';
import DeleteExpiredCookie from './components/DeleteCookie';
import { SnackbarProvider } from 'notistack';
const App = () => {
    return (
        <div>
            <StrictMode>
                <BrowserRouter>
                    {Routes}
                    <SnackbarProvider
                        maxSnack={3}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    />
                </BrowserRouter>
                <DeleteExpiredCookie />
            </StrictMode>
        </div>
    );
};

export default App;
