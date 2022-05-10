import React from 'react';
import './App.css';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';
import { toError } from 'fp-ts/lib/Either';


const fetch = (n: number): TaskEither<Error, number> =>
    tryCatch(
        () => new Promise((resolve, reject) => { resolve(100) }),
        toError
    )

function App() {
    return (
        <div className="App">
            <header className="App-header">
            </header>
        </div>
    );
}

export default App;
