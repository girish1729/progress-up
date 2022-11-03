import ProgressUp from './ProgressUp';

import React from 'react'
import ReactDOM from 'react-dom/client'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ProgressUp />
  </React.StrictMode>
)

const returnLibrary = () => {
    return {
	ProgressUp: ProgressUp
    }
}
export default returnLibrary();
