<p></p>
<button onclick="increment()">Click</button>

<script>
  let count = 0

  function increment() {
    count += 1
    updateUI()
  }

  function updateUI() {
    let counterElement = document.querySelector('p')
    counterElement.innerText = `
			Clicked ${count} ${count === 1 ? 'time' : 'times'}
		`
  }

  updateUI()
</script>

