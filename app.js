const countrySelector = document.querySelector('.country-selector');
const searchBtn = document.querySelector('.search-btn');
const outputDiv = document.querySelector('.output');
const wikiViewer = document.querySelector('.wiki-viewer');
const mainDiv = document.querySelector('main');

countrySelector.addEventListener('change', getInfo);
countrySelector.addEventListener('change', getWiki);

function getInfo(event) {
    const selectedCountry = countrySelector.options[countrySelector.selectedIndex].value;

    const countriesAPI = 'https://restcountries.eu/rest/v2/name/' + selectedCountry + '?fullText=true';

    fetch(countriesAPI)
    .then((response) => response.json())
    .then((data) => {
        // languages is an array in the data, so we need to loop through the array to get access to all the languages to put in the outputDiv.innerHTML
        var languages = '';
        for(i = 0; i < data[0].languages.length; i++) {
            languages += `${data[0].languages[i].name} `
            console.log(languages);
        }

        // now we need another API to get weather from capital city data[0].capital
        const weatherAPI = 'https://api.openweathermap.org/data/2.5/weather?q=' + data[0].capital + '&units=metric' + '&APPID=b34fddd3dae4a2eb0ad363b62f98ba1e';
        fetch(weatherAPI)
        .then((res) => res.json())
        .then((weatherData) => {
            console.log(data[0].capital + weatherData.main.temp + ' degrees Celsius');
            // now that we have all our info, we can put the data from countriesAPI and the weatherData from weatherAPI into our innerHTML
            outputDiv.innerHTML = `
            <h2>${data[0].name}</h2>
            <img src="${data[0].flag}" alt="${data[0].name} national flag" id="national-flag">
            <p>
                Capital City: ${data[0].capital}
                <br>
                Currency: ${data[0].currencies[0].name} (${data[0].currencies[0].code})
                <br>
                Calling Code: +${data[0].callingCodes}
                <br>
                Languages: ${languages}
                <br>
                Population: ${data[0].population}
                <br>
                Timezone: ${data[0].timezones[0]}   
                <br>
                Current Temperature in Capital: ${weatherData.main.temp} degrees Celsius         
            </p>
        `
        })
        //make mainDiv animate in
        mainDiv.classList.add('active');
    })
    .catch((error) => {
        outputDiv.innerHTML = `
            <p class="error-msg">
                Sorry, we are really lame and somehow couldn't get the data for that country. Try Wikipedia: 
            </p>
        `
        mainDiv.classList.add('active');
    })
}

function getWiki(event) {
    const selectedCountry = countrySelector.options[countrySelector.selectedIndex].value;
    
    const wikiAPI = "https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=" + selectedCountry;

    fetch(wikiAPI)
    .then((response) => response.json())
    .then((data) => {
        const wikiResult = data.query.search[0];
        const wikiTitle = wikiResult.title;
        const wikiURL = 'https://en.wikipedia.org/wiki/' + wikiTitle;
        wikiViewer.innerHTML = `
            <h3>${wikiTitle}:</h3>
            <p>
                ${wikiResult.snippet}...
            </p>
            <p>
                <a href="${wikiURL}" target="_blank">${wikiURL}</a>
            </p>
        `
    })
    .catch((error) => {
        wikiViewer.innerHTML = `
            <p class="error-msg">
                We couldn't find a Wiki entry on that country. Weird...isn't everything on Wikipedia? I guess you can always try Google...
            </p>
        `
    })
    
}