const library = [];

function Book(title, author, pageCount, isRead = false) {

    if (!new.target) {
        throw new Error('Constructor must be invoked with the "new" keyword.');
    }

    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pageCount = pageCount;
    this.isRead = isRead;
}

Book.prototype.toggleReadStatus = function() {
    this.isRead = !this.isRead;
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
        row.dataset.id = book.id;

        const title = document.createElement('th');
        title.textContent = book.title;
        title.scope = 'row';

        const author = document.createElement('td');
        author.textContent = book.author;

        const pageCount = document.createElement('td');
        pageCount.textContent = book.pageCount;

        const isRead = document.createElement('td');
        isRead.textContent = book.isRead ? 'Read' : 'Not read';

        const readToggleCell = this.createReadToggleCell();
        const deleteCell = this.createDeleteCell();

        row.append(
            title,
            author,
            pageCount,
            isRead,
            readToggleCell,
            deleteCell,
        );

        this.tbody.append(row);
    },

    createReadToggleCell() {
        const readToggleCell = document.createElement('td');
        const readToggleButton = document.createElement('button');
        const readToggleIcon = document.createElement('img');

        readToggleButton.classList.add('hover-button', 'read-toggle-button');
        readToggleButton.addEventListener(
            'click',
            this.handleReadToggleClick.bind(this)
        );

        readToggleIcon.classList.add('button-icon', 'read-toggle-icon');
        readToggleIcon.src = 'images/bookmark-check.svg';

        readToggleButton.append(readToggleIcon);
        readToggleCell.append(readToggleButton);
        return readToggleCell;
    },

    createDeleteCell() {
        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        const deleteIcon = document.createElement('img');

        deleteButton.classList.add('hover-button', 'delete-button');
        deleteButton.addEventListener('click', this.handleDeleteClick);
        deleteIcon.classList.add('button-icon', 'delete-icon');
        deleteIcon.src = 'images/trash-can.svg';

        deleteButton.append(deleteIcon);
        deleteCell.append(deleteButton);
        return deleteCell;
    },

    syncWithLibrary() {
        this.tbody.innerHTML = '';
        this.addBooks(library);
    },

    handleReadToggleClick(event) {
        const readToggleButton = event.currentTarget;
        const targetRow = readToggleButton.parentNode.parentNode;
        const targetBookId = targetRow.dataset.id;
        const targetBook = library.find(book => book.id === targetBookId);
        targetBook.toggleReadStatus();
        this.syncWithLibrary();
    },

    handleDeleteClick(event) {
        const deleteButton = event.currentTarget;
        const targetRow = deleteButton.parentNode.parentNode;
        const targetBookId = targetRow.dataset.id;
        removeBookFromLibrary(targetBookId);
        targetRow.remove();
    },
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
        Boolean(newBook.isRead),
    );

    libraryDisplay.syncWithLibrary();
});

addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 300);
addBookToLibrary('The Lord of the Rings', 'Same Guy', 1178);
addBookToLibrary('The Odyssey', 'Homer', 592);
libraryDisplay.syncWithLibrary();
