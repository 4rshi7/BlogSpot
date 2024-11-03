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
