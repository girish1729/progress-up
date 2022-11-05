import React from 'react'
import ReactDOM from 'react-dom/client'
import ProgressUp from 'progress-up';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <div>
    <ProgressUp uploadURL="http://localhost:2324/uploadmultiple" filesName="uploadFiles" />
  </div>
)
