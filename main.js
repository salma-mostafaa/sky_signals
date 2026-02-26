const apiKey = "9bfac91326b242ccb55205309262502";

const searchInput = document.getElementById("searchInput");
const forecastContainer = document.getElementById("weatherCards");

const cityNameElement = document.querySelector(".city-name");
const mainTempElement = document.querySelector(".main-temp");
const conditionElement = document.querySelector(".condition");
const todayDayElement = document.getElementById("todayDay");
const todayDayTempElement = document.getElementById("todayDayTemp");
const todayNightTempElement = document.getElementById("todayNightTemp");

const windElement = document.querySelectorAll(".weather-right .info span")[1];
const humidityElement = document.querySelectorAll(".weather-right .info span")[3];
const pressureElement = document.querySelectorAll(".weather-right .info span")[5];
const uvElement = document.querySelectorAll(".weather-right .info span")[7];

async function sendRequest(){
    var response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=Cairo&days=3`);
    data = await response.json();
    console.log(data);
    displayData()
}

sendRequest();



function getWeather(city) {
    var myHttp = new XMLHttpRequest();

    myHttp.open(
        "GET",
        "https://api.weatherapi.com/v1/forecast.json?key=" + apiKey + "&q=" + city + "&days=3"
    );

    myHttp.send();

    myHttp.onreadystatechange = function () {
        if (myHttp.readyState === 4 && myHttp.status === 200) {
            var data = JSON.parse(myHttp.response);
            updateWeather(data);
        }
    };
}


function updateWeather(data) {
    cityNameElement.innerHTML = data.location.name;
    mainTempElement.innerHTML = data.current.temp_c + "°C";
    conditionElement.innerHTML = data.current.condition.text;

    windElement.innerHTML = data.current.wind_kph + " kph";
    humidityElement.innerHTML = data.current.humidity + " %";
    pressureElement.innerHTML = data.current.pressure_mb + " mb";
    uvElement.innerHTML = data.current.uv;

    let todayDate = new Date(data.location.localtime);
    let todayName = todayDate.toLocaleDateString("en-US", { weekday: "short" });
    todayDayElement.innerHTML = todayName;

    todayDayTempElement.innerHTML = data.forecast.forecastday[0].day.maxtemp_c + "°C";
    todayNightTempElement.innerHTML = data.forecast.forecastday[0].day.mintemp_c + "°C";

    forecastContainer.innerHTML = "";
    for (let i = 1; i < data.forecast.forecastday.length; i++) {
        let day = data.forecast.forecastday[i];
        let date = new Date(day.date);
        let dayName = date.toLocaleDateString("en-US", { weekday: "short" });

        forecastContainer.innerHTML += `
            <div class="card-forecast">
                <h4>${dayName}</h4>
                <img src="https:${day.day.condition.icon}" alt="">
                <p>${day.day.maxtemp_c}°C</p>
                <p class="small-temp">${day.day.mintemp_c}°C</p>
                <p>${day.day.condition.text}</p>
            </div>
        `;
    }
}

searchInput.addEventListener("input", function() {
    if (this.value.length >= 3) {
        getWeather(this.value);
    }
});
window.addEventListener("load", function () {
    getWeather("Cairo");
});

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
        let lat = pos.coords.latitude;
        let lon = pos.coords.longitude;
        getWeather(lat + "," + lon);
    });
}