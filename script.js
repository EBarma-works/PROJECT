let map;
let marker;

document.addEventListener('DOMContentLoaded', async () => {
    const coordinates = await getCoordinatesFromIP();
    if (coordinates) {
        initMap(coordinates.lat, coordinates.lon);
    } else {
        console.error('Failed to retrieve coordinates from IP address.');
    }

    // Load Theme from Local Storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.remove('dark-mode', 'light-mode');
        document.body.classList.add(savedTheme);
        if (savedTheme === 'dark-mode') {
            document.getElementById('checkbox').checked = true;
        }
    }

    // Theme switch checkbox event listener
    const checkbox = document.getElementById("checkbox");
    checkbox.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode");
        document.body.classList.toggle("light-mode");
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark-mode");
        } else {
            localStorage.setItem("theme", "light-mode");
        }
    });
});

async function getCoordinatesFromIP() {
    try {
        const response = await fetch('http://ip-api.com/json');
        const data = await response.json();
        return { lat: data.lat, lon: data.lon };
    } catch (error) {
        console.error('Error fetching IP location data:', error);
        return null;
    }
}

async function fetchPostcodeData() {
    const postcode = document.getElementById('postcode').value;

    if (!postcode) {
        alert('Please enter a postcode');
        return;
    }

    try {
        const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
        const data = await response.json();

        if (data.status === 200) {
            const { latitude, longitude } = data.result;
            updateMap(latitude, longitude);
            displayInfo(data.result);
        } else {
            alert('Postcode not found');
        }
    } catch (error) {
        console.error('Error fetching postcode data:', error);
        alert('Error fetching postcode data');
    }
}

function initMap(lat, lng) {
    map = L.map('map').setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = L.marker([lat, lng]).addTo(map);
}

function updateMap(lat, lng) {
    map.setView([lat, lng], 15);
    marker.setLatLng([lat, lng]);
}

function displayInfo(data) {
    const infoDiv = document.getElementById('info');
    
    if (data) {
        // Format the coordinates as a string
        const coordinates = `${data.latitude} ${data.longitude}`;

        infoDiv.innerHTML = `
            <p><strong>Postcode:</strong> ${data.postcode}</p>
            <p><strong>Country:</strong> ${data.country}</p>
            <p><strong>NHS Health Authority:</strong> ${data.nhs_ha}</p>
            <p><strong>Latitude:</strong> ${data.latitude} <strong>Longitude:</strong> ${data.longitude} <button class="btn-copy" onclick="copyToClipboard('${coordinates}')"> Copy Coordinates</button></p>
            
            <p><strong>European Electoral Region:</strong> ${data.european_electoral_region}</p>
            <p><strong>Primary Care Trust:</strong> ${data.primary_care_trust}</p>
            <p><strong>LSOA:</strong> ${data.lsoa}</p>
            <p><strong>Parliamentary Constituency:</strong> ${data.parliamentary_constituency}</p>
            <p><strong>Admin District:</strong> ${data.admin_district}</p>
            <p><strong>Admin Ward:</strong> ${data.admin_ward}</p>
            <p><strong>CCG:</strong> ${data.ccg}</p>
            <p><strong>Date of Introduction:</strong> ${data.date_of_introduction}</p>
        `;
        infoDiv.classList.add('show'); // Show with fade-in effect
    } else {
        infoDiv.classList.remove('show'); // Hide info div
    }
}


// Function to copy text to clipboard
function copyToClipboard(text) {
    // Create a temporary input element to hold the text
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    
    // Select the text and copy it to the clipboard
    tempInput.select();
    document.execCommand('copy');
    
    // Remove the temporary input element
    document.body.removeChild(tempInput);

    // Provide feedback to the user
    alert('Coordinates copied to clipboard: ' + text);
}
