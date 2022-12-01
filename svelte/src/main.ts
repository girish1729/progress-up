import './app.css'
import App from './App.svelte'
import ProgressUp from './ProgressUp.svelte'

const app = new ProgressUp({
  target: document.getElementById('app')
})

export default app
