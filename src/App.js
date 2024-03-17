import React, { useEffect } from 'react';
import useTelegramAuth from '@use-telegram-auth/hook';

function App() {
    const { login, logout, isAuthenticated, user } = useTelegramAuth();

    useEffect(() => {
        // Додаткові дії після входу або виходу користувача
    }, [isAuthenticated, user]);

    return (
        <div className="App">
            {isAuthenticated ? (
                <div>
                    <p>Ви увійшли як {user.name}</p>
                    <button onClick={logout}>Вийти</button>
                </div>
            ) : (
                <button onClick={login}>Увійти через Telegram</button>
            )}
        </div>
    );
}

export default App;
