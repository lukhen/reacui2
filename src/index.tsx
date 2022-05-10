import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux"
import { createStore, combineReducers } from "redux"
import { reduceReservationsInPeriod } from "./reservationsinperiod/reducer"
import { yearReservationsCountReducer } from "./yearreservationscount/reducer"
import App from "./Routes"

const rootReducer = combineReducers({
    reservationsInPeriod: reduceReservationsInPeriod,
    yearReservationsCount2: yearReservationsCountReducer
})

ReactDOM.render(
    <React.StrictMode>
        <Provider store={createStore(rootReducer)}>
            <App />
        </Provider>)
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
