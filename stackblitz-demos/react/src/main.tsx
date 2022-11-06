import React from 'react'
import ReactDOM from 'react-dom/client'
import ProgressUp from 'progress-up/react';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <div>
    <ProgressUp uploadURL="https://run.mocky.io/v3/dfc3d264-e2bc-41f9-82b9-23b0091c5e34" filesName="uploadFiles" />
  </div>
)
