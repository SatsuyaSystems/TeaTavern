function fetchAndDisplayJoke() {
    fetch('/assets/bad_jokes.json')
      .then(response => response.json())
      .then(data => {
        const randomIndex = Math.floor(Math.random() * data.length);
        $('#modt').text(data[randomIndex]);
      })
      .catch(error => console.error('Error loading the jokes:', error));
  }

document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayJoke();
});