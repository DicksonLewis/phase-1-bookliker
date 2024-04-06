let currentBook = 1
let bookData = {}

document.addEventListener("DOMContentLoaded", function() {
    fetch("http://localhost:3000/books")
    .then(res => res.json())
    .then(data => {
        bookData = data

        data.forEach(e => {
            let book = document.createElement('li')
            book.className = 'booktitle'
            book.textContent = e.title
            book.addEventListener('click', () => bookLoad(e))
            document.querySelector('#list').appendChild(book)
        })
    })
})

function bookLoad(book){
    if (document.querySelector('.book')) {document.querySelector('.book').remove()}
    currentBook = book.id

    let panel = document.createElement('ol')
    panel.innerHTML = `
        <img src='${book.img_url}' alt='${book.title}'>
        <p class='bold'>${book.title}</p>
        <p class='bold'>${book.subtitle}</p>
        <p class='bold'>${book.author}</p>
        <p>${book.description}</p>
        <ul id='userlist'>

        </ul>
        <button id='likebutton'/>
    `
    panel.className = "book"
    document.querySelector('#show-panel').appendChild(panel)

    let list = document.querySelector('#userlist')
    let liked = false
    book.users.forEach(e => {
        let user = document.createElement('li')
        user.textContent = e.username
        list.appendChild(user)
        if (e.username == 'pouros'){
            liked = true
            user.className = 'me'
        }
    })

    let btn = document.querySelector('#likebutton')
    btn.addEventListener('click', likeClicked)
    btn.textContent = liked ? 'UNLIKE' : 'LIKE'
}

function likeClicked(){
    let btn = document.querySelector('#likebutton')
    let userlist = bookData[currentBook-1].users
    for (let i = 0; i < userlist.length; i++){
        if (userlist[i].username == 'pouros'){
            document.querySelector('.me').remove()
            bookData[currentBook-1].users.splice(i, i+1)
            btn.textContent = 'LIKE'
            fetch(`http://localhost:3000/books/${currentBook}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(bookData[currentBook-1])
    })
            return
        }
    }
    let list = document.querySelector('#userlist')
    let user = document.createElement('li')
    user.textContent = 'pouros'
    user.className = 'me'
    list.appendChild(user)
    btn.textContent = 'UNLIKE'

    let me = {
        id: 1,
        username: "pouros"
    }
    bookData[currentBook-1].users.push(me)

    fetch(`http://localhost:3000/books/${currentBook}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(bookData[currentBook-1])
    })
}