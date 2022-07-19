const apiKey = "455cf20328f600486402fed093d6b1c7";

function formatDate(timestamp) {
	let date = new Date(timestamp);
	let days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	];
	let months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	let day = days[date.getMonth()];
	let number = date.getDate();
	let month = months[date.getMonth()];
	let year = date.getFullYear();
	let hours = date.getHours();
	let minutes = date.getMinutes();

	if (hours < 10) {
		hours = `0${hours}`;
	}
	if (minutes < 10) {
		minutes = `0${minutes}`;
	}
	return `${day}, ${number} ${month}, ${year}, ${hours}:${minutes}`;
}
function formatDay(timestamp) {
	let date = new Date(timestamp * 1000);
	let day = date.getDay();
	let days = [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	];
	return days[day];
}
function getForecast(coord) {
	let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=metric`;
	axios.get(apiUrl).then(displayForecast);
}

function showWeatherData(response) {
	let dateEl = document.getElementById("date");
	let cityEl = document.querySelectorAll(".city");
	let tempEl = document.getElementById("temp");
	let descriptionEl = document.getElementById("description");
	let iconEl = document.getElementById("iconWeather");
	let windEl = document.getElementById("wind");
	let humidityEl = document.getElementById("humidity");

	celsius = response.data.main.temp;
	tempEl.innerHTML = Math.round(celsius);
	cityEl.forEach((el) => (el.innerHTML = response.data.name));
	descriptionEl.innerHTML = response.data.weather[0].description;
	humidityEl.innerHTML = response.data.main.humidity;
	windEl.innerHTML = Math.round(response.data.wind.speed);
	dateEl.innerHTML = formatDate(response.data.dt * 1000);
	iconEl.setAttribute(
		"src",
		`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
	);
	iconEl.setAttribute("alt", response.data.weather[0].description);
	iconEl.classList.remove("hide");
	getForecast(response.data.coord);
}

function searchData(city) {
	let apiUrl = "https://api.openweathermap.org/data/2.5/weather";
	axios
		.get(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`)
		.then(showWeatherData);
}
function handleSubmit(event) {
	event.preventDefault();
	let searchInput = document.getElementById("searchInput");
	searchData(searchInput.value);
}
function displayForecast(response) {
	let forecast = response.data.daily;
	let forecastEL = document.getElementById("forecast");
	let forecastHtml = '<div class="row">';
	forecast.forEach((day, index) => {
		if (index < 4) {
			forecastHtml =
				forecastHtml +
				`<div class="col-3">
				<div class="card card-day mb-4">
					<span class="day is-block">${formatDay(day.dt)}</span>
					<span class="degree is-block">
					<span class="max">${Math.round(day.temp.max)}°</span>
					<span class="min">${Math.round(day.temp.min)}°</span></span>
					<img
						src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
						alt=""
						class="icon"
						/>
				</div>
			</div>`;
		}
	});

	forecastHtml = forecastHtml + "</div>";
	forecastEL.innerHTML = forecastHtml;
}


let searchForm = document.getElementById("searchForm");
searchForm.addEventListener("submit", handleSubmit);

searchData("Sofia");
