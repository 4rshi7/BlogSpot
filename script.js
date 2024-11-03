// Redirect to the blogs page without filters
function redirectToBlogs() {
    window.location.href = "./Pages/blogs.html";
}

// Handle the search form submission
document.getElementById("search-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from reloading the page
    searchBlogs();
});

function searchBlogs() {
    const city = document.getElementById("city-search").value.trim();
    if (city) {
        localStorage.setItem("filter", city); // Save the city name to localStorage
        redirectToBlogs(); // Redirect to the blogs page
    }
}


// Call initMap when the page has loaded
document.addEventListener("DOMContentLoaded", function() {
    // Check if 'blogs' exists in localStorage, if not, fetch and store it
    let blogs = JSON.parse(localStorage.getItem("blogs"));

    if (!Array.isArray(blogs)) {
        // If blogs is not an array, fetch data from blogs.json
        fetch("../blogs.json")
            .then(response => response.json())
            .then(data => {
                blogs = data.blogs; // Assuming data.blogs is an array
                localStorage.setItem("blogs", JSON.stringify(blogs));
                initMapWithMarkers(blogs);
            })
            .catch(error => console.error("Error fetching blogs:", error));
    } else {
        // If blogs already exists in localStorage, initialize the map
        initMapWithMarkers(blogs);
    }
});

function initMapWithMarkers(blogs) {
    const map = L.map('map').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Add markers
    blogs.forEach(blog => {
        const marker = L.marker([blog.latitude, blog.longitude]).addTo(map);
        marker.bindPopup(`
            <strong>${blog.name}</strong><br>
            <strong>City:</strong> ${blog.city_of_visit}<br>
            <strong>Date:</strong> ${blog.date}<br>
            <p>${blog.blog}</p>
        `);
    });
}

