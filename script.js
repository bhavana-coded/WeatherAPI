const apiKey = "ae5368bad88140fc143934c05f35b870"; // Your API key

// Fetch weather data
async function getWeather(cityNameFromHistory = null) {
  const cityInput = document.getElementById("cityInput");
  const city = cityNameFromHistory || cityInput.value.trim();
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    displayWeather(data);

    // Save to history if not already present
    saveToHistory(city);
  } catch (error) {
    document.getElementById("weatherInfo").innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
  }
}

// Display weather information
function displayWeather(data) {
  const { name, main, weather } = data;
  const info = `
    <p><strong>City:</strong> ${name}</p>
    <p><strong>Temperature:</strong> ${main.temp}°C</p>
    <p><strong>Condition:</strong> ${weather[0].main} - ${weather[0].description}</p>
  `;
  document.getElementById("weatherInfo").innerHTML = info;
}

// Save city name to history in localStorage
function saveToHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  if (!history.includes(city)) {
    history.unshift(city); // add to start
    localStorage.setItem("weatherHistory", JSON.stringify(history.slice(0, 10))); // limit to 10
  }
  renderHistory();
}

// Show city history as buttons
function renderHistory() {
  const historyContainer = document.getElementById("history");
  const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  if (history.length === 0) return;

  historyContainer.innerHTML = `<h4>Recent Searches:</h4>`;
  history.forEach(city => {
    const btn = document.createElement("button");
    btn.textContent = city;
    btn.onclick = () => getWeather(city);
    historyContainer.appendChild(btn);
  });
}

// Render history when page loads
window.onload = renderHistory;
