// Fetch and display blog entries from blogs.json, with filtering
document.addEventListener("DOMContentLoaded", function() {
    fetch("../blogs.json")
      .then(response => response.json())
      .then(data => {
        // Get the filter value from local storage
        const filter = localStorage.getItem("filter");
        localStorage.removeItem("filter");
        // Filter blogs based on the filter value (e.g., city name or author name)
        const filteredBlogs = filter
          ? data.blogs.filter(blog => 
              blog.city_of_visit.toLowerCase().includes(filter.toLowerCase()) || 
              blog.name.toLowerCase().includes(filter.toLowerCase())
            )
          : data.blogs;
  
        // Display the filtered blogs
        displayBlogs(filteredBlogs);
      })
      .catch(error => console.error("Error loading blogs:", error));
  });
  
  function displayBlogs(blogs) {
    const container = document.getElementById("blogs-container");
    container.innerHTML = ""; // Clear previous entries
  
    // If no blogs match the filter, display a message
    if (blogs.length === 0) {
      container.innerHTML = "<p>No blog entries found matching the filter criteria.</p>";
      return;
    }
  
    // Create and display each blog entry
    blogs.forEach(blog => {
      const blogEntry = document.createElement("div");
      blogEntry.classList.add("blog-entry");
  
      // Title
      const title = document.createElement("h3");
      title.textContent = blog.name;
  
      // City and Date
      const city = document.createElement("p");
      city.innerHTML = `<strong>City of Visit:</strong> ${blog.city_of_visit}`;
      
      const date = document.createElement("p");
      date.classList.add("date");
      date.textContent = `Date: ${blog.date}`;
  
      // Blog Content
      const content = document.createElement("p");
      content.textContent = blog.blog;
  
      // Append elements to blog entry
      blogEntry.appendChild(title);
      blogEntry.appendChild(city);
      blogEntry.appendChild(date);
      blogEntry.appendChild(content);
  
      // Append blog entry to container
      container.appendChild(blogEntry);
    });
  }
  
