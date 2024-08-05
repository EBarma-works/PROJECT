let map;
let marker;

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

function updateMap(lat, lng) {
    if (!map) {
        map = L.map('map').setView([lat, lng], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    } else {
        map.setView([lat, lng], 15);
    }

    if (marker) {
        marker.setLatLng([lat, lng]);
    } else {
        marker = L.marker([lat, lng]).addTo(map);
    }
}

function displayInfo(data) {
    const infoDiv = document.getElementById('info');
    infoDiv.innerHTML = `
        <p><strong>Postcode:</strong> ${data.postcode}</p>
        <p><strong>Country:</strong> ${data.country}</p>
        <p><strong>NHS Health Authority:</strong> ${data.nhs_ha}</p>
        <p><strong>Longitude:</strong> ${data.longitude}</p>
        <p><strong>Latitude:</strong> ${data.latitude}</p>
        <p><strong>European Electoral Region:</strong> ${data.european_electoral_region}</p>
        <p><strong>Primary Care Trust:</strong> ${data.primary_care_trust}</p>
        <p><strong>LSOA:</strong> ${data.lsoa}</p>
        <p><strong>Incode:</strong> ${data.incode}</p>
        <p><strong>Outcode:</strong> ${data.outcode}</p>
        <p><strong>Parliamentary Constituency:</strong> ${data.parliamentary_constituency}</p>
        <p><strong>Admin District:</strong> ${data.admin_district}</p>
        <p><strong>Admin Ward:</strong> ${data.admin_ward}</p>
        <p><strong>CCG:</strong> ${data.ccg}</p>
        <p><strong>NUTS:</strong> ${data.nuts}</p>
        <p><strong>Date of Introduction:</strong> ${data.date_of_introduction}</p>
    `;
}
