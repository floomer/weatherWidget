const url = "https://gist.githubusercontent.com/gorborukov/0722a93c35dfba96337b/raw/435b297ac6d90d13a68935e1ec7a69a225969e58/russia"
const suggestField = document.querySelector(".citiesList")
const inputField = document.querySelector("#inputField")
const arrayOfCities = getCitiesList(url)
const dateField = document.querySelector("#currentDate")
const currentTime = document.querySelector("#currentTime")
const cityName = document.querySelector("#cityName")  // should group this in {} ?
const cityTemp = document.querySelector("#cityTemp")  // should I group this in {} ?
const cityFeels = document.querySelector("#cityFeels") // should I group this in {} ?
const weatherType = document.querySelector("#weatherType") // should I group this in {} ?
let weatherApi = "https://api.weatherapi.com/v1/current.json?key=ee906a029100477f8c4115952232604&q="



dateField.innerHTML = getCurrentDate()
currentTime.innerHTML = new Date().getHours().toString() + ":" + new Date().getMinutes().toString() // mb func?

async function getLocationWeather(city,url){
    let currentCity =  await fetch(url + city)
    return await currentCity.json()
}

function setCityWeather(city){
    cityName.textContent = city.location.name
    cityTemp.textContent = city.current.temp_c + "°C"
    cityFeels.style.display = "block"
    cityFeels.textContent = "Ощущается как "
    cityFeels.textContent = cityFeels.textContent + city.current.feelslike_c + "°C"
    weatherType.textContent = city.current.condition.text
    if (city.current.condition.text === "Sunny"){
        document.querySelector("#image-cloudy").style.display = "none"  // looks awful
        document.querySelector("#image-rainy").style.display = "none"  // looks awful
        document.querySelector("#image-sunny").style.display = "block"  // looks awful
    }
    if (city.current.condition.text === "Cloudy" || city.current.condition.text === "Partly cloudy"){
        document.querySelector("#image-sunny").style.display = "none"
        document.querySelector("#image-rainy").style.display = "none"
        document.querySelector("#image-cloudy").style.display = "block"
    }
    if (city.current.condition.text === "Light rain"){
        document.querySelector("#image-cloudy").style.display = "none"
        document.querySelector("#image-sunny").style.display = "none"
        document.querySelector("#image-rainy").style.display = "block"
    }
}
function getCurrentDate(){
    let date = new Date()
    const options = {
        weekday: "short",
        month: "long",
        day: "numeric"
    }
    return new Intl.DateTimeFormat('en-US', options).format(date)
}
function getCitiesList(url){
    let citiesList = []
    fetch(url)
        .then(response => response.json())
        .then(array => {
            array.forEach(city => {
                citiesList.push(city.city)
            })
        })
    return citiesList
}

function clearSuggestField(){
    suggestField.childNodes.forEach(field => {
        field.remove()
    })
}

inputField.addEventListener("input", () => {
    suggestField.style.display = "block"
    let inputFieldValue = inputField.value.toLowerCase()
    let suggestCityList = []

    arrayOfCities.forEach(city => {
        if (city.toLowerCase().startsWith(inputFieldValue)) {
            suggestCityList.push(city)
        } else {
            clearSuggestField()
        }
    })
    suggestCityList.forEach((suggestCity,index) => {
        let liElement = document.createElement("li")
        if (index < 5){
            liElement.innerHTML = suggestCity
            suggestField.append(liElement)
        }
        liElement.addEventListener("click", async() => {
            inputField.value = suggestCity
            suggestField.style.display = "none"
            let city = await getLocationWeather(suggestCity,weatherApi)
            console.log(city)
            setCityWeather(city)
        })
    })
})
