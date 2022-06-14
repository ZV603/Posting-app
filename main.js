const postsList = document.querySelector(".posts-list");
const addPostForm = document.querySelector(".add-post-form");
const titleValue = document.querySelector('#title-value');
const bodyValue = document.querySelector('#body-value');
const buttonSubmit = document.querySelector('.btn');
let output = '';

const renderPosts = (posts) => {
    posts.forEach(post => {
        output += `
        <div class="card mt-4 col-md-6 bg-light">
            <div class="card-body" data-id=${post._id}>
                <h5 class="card-title">${post.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${post.date}</h6>
                <p class="card-text">${post.body}</p>
                <a href="#" class="card-link" id="edit-post">Edit</a>
                <a href="#" class="card-link" id="delete-post">Delete</a>
            </div>
        </div>
        `;
    });
    postsList.innerHTML = output;
}

const url = 'http://localhost:5000/api/posts';

// Get - Read the posts
// Method: GET
fetch(url)
    .then(response => response.json())
    .then(data => renderPosts(data));

postsList.addEventListener('click', (event) => {
    event.preventDefault();
    let deleteButtonIsPressed = event.target.id == 'delete-post';
    let editButtonIsPressed = event.target.id == 'edit-post';

    let id = event.target.parentElement.dataset.id;

    // Delete - Remove the existing post
    // Method: DELETE
    if (deleteButtonIsPressed) {
        fetch(`${url}/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(() => location.reload());
    }

    if (editButtonIsPressed) {
        const parent = event.target.parentElement;
        let titleContent = parent.querySelector('.card-title').textContent;
        let bodyContent = parent.querySelector('.card-text').textContent;

        titleValue.value = titleContent;
        bodyValue.value = bodyContent;
    }

    // Update - update the existing post
    // Method: PATCH
    buttonSubmit.addEventListener('click', (event) => {
        event.preventDefault();
        fetch(`${url}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: titleValue.value,
                    body: bodyValue.value
                })
            })
            .then(response => response.json())
            .then(() => location.reload());
    })

});

// Create - Insert new post
// Method: POST
addPostForm.addEventListener('submit', (event) => {
    event.preventDefault();
    fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: titleValue.value,
                body: bodyValue.value
            })
        })
        .then(response => response.json())
        .then(data => {
            const dataArray = [];
            dataArray.push(data);
            renderPosts(dataArray);
        })

    // reset input field to empty
    titleValue.value = '';
    bodyValue.value = '';
});