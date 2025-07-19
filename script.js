const library = [];

function Book(title, author, pageCount, isRead = false) {

    if (!new.target) {
        throw Error('Constructor must be invoked with the "new" keyword.');
    }

    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pageCount = pageCount;
    this.isRead = isRead;
}

function addBookToLibrary(title, author, pageCount, isRead) {
    const book = new Book(title, author, pageCount, isRead);
    library.push(book);
}

function removeBookFromLibrary(targetId) {
    const targetIndex = library.findIndex(book => book.id === targetId);

    if (targetIndex !== -1) {
        library.splice(targetIndex, 1);
    }
}

const libraryDisplay = {
    tbody: document.querySelector('#book-table-data'),

    addBooks(books) {
        for (const book of books) {
            this.addBook(book);
        }
    },

    addBook(book) {
        const row = document.createElement('tr');

        const title = document.createElement('th');
        title.textContent = book.title;
        title.scope = 'row';

        const author = document.createElement('td');
        author.textContent = book.author;

        const pageCount = document.createElement('td');
        pageCount.textContent = book.pageCount;

        const isRead = document.createElement('td');
        isRead.textContent = book.isRead;

        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        const deleteIcon = document.createElement('img');

        deleteButton.classList.add('delete-button');
        deleteIcon.classList.add('delete-icon');
        deleteIcon.src = 'images/trash-can.svg';

        deleteButton.addEventListener('click', event => {
            removeBookFromLibrary(book.id);
            this.syncWithLibrary();
        });

        deleteButton.append(deleteIcon);
        deleteCell.append(deleteButton);

        row.append(title, author, pageCount, isRead, deleteCell);
        this.tbody.append(row);
    },

    syncWithLibrary() {
        this.tbody.innerHTML = '';
        this.addBooks(library);
    }
};

function syncLibraryAndDisplay() {
    libraryDisplay.addBooks(library);
}

document.querySelector('#new-book-button').addEventListener('click', () => {
    document.querySelector('#new-book-modal').showModal();
});

document.querySelector('#new-book-form').addEventListener('submit', event => {
    const formData = new FormData(event.target);
    const newBook = Object.fromEntries(formData.entries());

    addBookToLibrary(
        newBook.title,
        newBook.author,
        newBook.pageCount,
        newBook.isRead,
    );

    libraryDisplay.syncWithLibrary();
});

addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 300);
addBookToLibrary('The Lord of the Rings', 'Same Guy', 1178);
addBookToLibrary('The Odyssey', 'Home', 592);

libraryDisplay.syncWithLibrary();
