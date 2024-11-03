function redirectToBlogs() {
  window.location.href = "./blogs.html";
}

function searchBlogs() {
  const city = document.getElementById("city-search").value.trim();
  if (city) {
    localStorage.setItem("filter", city); // Save the city name to localStorage
    redirectToBlogs(); // Redirect to the blogs page
  }
}

// Fetch and display blog entries from blogs.json, with filtering
document.addEventListener("DOMContentLoaded", function() {

  const storedBlogs = localStorage.getItem("blogsData");
  
  if (storedBlogs) {
  
    const data = JSON.parse(storedBlogs);
    filterAndDisplayBlogs(data);
  } else {
    fetch("../blogs.json")
      .then(response => response.json())
      .then(data => {
        localStorage.setItem("blogsData", JSON.stringify(data));
        filterAndDisplayBlogs(data);
      })
      .catch(error => console.error("Error loading blogs:", error));
  }
});

function filterAndDisplayBlogs(data) {
  const filter = localStorage.getItem("filter");
  localStorage.removeItem("filter");

  const filteredBlogs = filter
    ? data.blogs.filter(blog => 
        blog.city_of_visit.toLowerCase().includes(filter.toLowerCase()) || 
        blog.name.toLowerCase().includes(filter.toLowerCase())
      )
    : data.blogs;

  displayBlogs(filteredBlogs);
}

function displayBlogs(blogs) {
  const container = document.getElementById("blogs-container");
  container.innerHTML = ""; // Clear previous entries

  if (blogs.length === 0) {
    container.innerHTML = "<p>No blog entries found matching the filter criteria.</p>";
    return;
  }

  blogs.forEach(blog => {
    const blogEntry = document.createElement("div");
    blogEntry.classList.add("blog-entry");

    const title = document.createElement("h3");
    title.textContent = blog.name;

    const city = document.createElement("p");
    city.innerHTML = `<strong>City of Visit:</strong> ${blog.city_of_visit}`;
    
    const date = document.createElement("p");
    date.classList.add("date");
    date.textContent = `Date: ${blog.date}`;

    const content = document.createElement("p");
    content.textContent = blog.blog;

    const commentsSection = document.createElement("div");
    commentsSection.classList.add("comments-section");

    const commentsTitle = document.createElement("h4");
    commentsTitle.textContent = "Comments:";
    commentsSection.appendChild(commentsTitle);

    displayComments(blog, commentsSection);

    const commentForm = document.createElement("form");
    commentForm.classList.add("comment-form");

    const commenterInput = document.createElement("input");
    commenterInput.placeholder = "Your name";
    commenterInput.required = true;

    const commentInput = document.createElement("textarea");
    commentInput.placeholder = "Your comment";
    commentInput.required = true;

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Add Comment";

    commentForm.appendChild(commenterInput);
    commentForm.appendChild(commentInput);
    commentForm.appendChild(submitButton);

    commentForm.addEventListener("submit", function(event) {
      event.preventDefault();

      const newComment = {
        commenter: commenterInput.value,
        text: commentInput.value,
        date: new Date().toISOString().split("T")[0]
      };

      blog.comments = blog.comments || [];
      blog.comments.push(newComment);

      // Update localStorage with the new comment
      updateLocalStorage(blog);

      commenterInput.value = "";
      commentInput.value = "";

      displayComments(blog, commentsSection);
    });

    blogEntry.appendChild(title);
    blogEntry.appendChild(city);
    blogEntry.appendChild(date);
    blogEntry.appendChild(content);
    blogEntry.appendChild(commentsSection);
    blogEntry.appendChild(commentForm);

    container.appendChild(blogEntry);
  });
}

function displayComments(blog, commentsSection) {
  commentsSection.innerHTML = "";

  const commentsTitle = document.createElement("h4");
  commentsTitle.textContent = "Comments:";
  commentsSection.appendChild(commentsTitle);

  if (blog.comments && blog.comments.length > 0) {
    blog.comments.forEach(comment => {
      const commentEntry = document.createElement("div");
      commentEntry.classList.add("comment-entry");
      commentEntry.innerHTML = `<strong>${comment.commenter}:</strong> ${comment.text} <em>${comment.date}</em>`;
      commentsSection.appendChild(commentEntry);
    });
  } else {
    const noCommentsMessage = document.createElement("p");
    noCommentsMessage.textContent = "No comments yet.";
    commentsSection.appendChild(noCommentsMessage);
  }
}

function updateLocalStorage(updatedBlog) {
  const storedBlogs = JSON.parse(localStorage.getItem("blogsData"));
  const blogIndex = storedBlogs.blogs.findIndex(blog => blog.name === updatedBlog.name);

  if (blogIndex !== -1) {
    storedBlogs.blogs[blogIndex] = updatedBlog;
    localStorage.setItem("blogsData", JSON.stringify(storedBlogs));
  }
}
