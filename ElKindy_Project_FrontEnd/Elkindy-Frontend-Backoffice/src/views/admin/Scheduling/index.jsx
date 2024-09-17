import React from "react";
import ReactDOM from 'react-dom';
import Demo from "./demo";
export default Demo;


document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById("Schedule");
    if (container) {
        ReactDOM.render(<Demo />, container);
    } else {
        console.error("Target container '#schedule' is not found in the DOM.");
    }
});
