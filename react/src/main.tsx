/*
import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
export default ProgressUp;
*/

/*
const container = document.getElementById('app');
const root = createRoot(container); 
root.render(<App />);
*/

import ProgressUp from './ProgressUp';

const returnLibrary = () => {
    return {
	ProgressUp: ProgressUp
    }
}
export default returnLibrary();
