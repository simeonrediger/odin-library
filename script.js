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

Book.prototype.toggleStatus = function () {
    this.isRead = !this.isRead;
}

const display = {
    tbody: document.querySelector('#book-table-data'),

    addRow(book) {
        const row = this.formatBookAsRow(book);
        this.tbody.append(row);
    },

    getRow(book) {
        return document.querySelector(`[data-id='${book.id}']`);
    },

    toggleStatus(book) {
        this.getRow(book).querySelector('.status').textContent = (
            getStatusDisplayFormat(book.isRead)
        );
    },

    removeRow(bookId) {
        this.tbody.querySelector(`[data-id='${bookId}']`)?.remove();
    },

    formatBookAsRow(book) {
        const template = document.querySelector('#book-row-template');
        const rowTemplate = template.content.querySelector('tr');
        const row = rowTemplate.cloneNode(true);
        row.dataset.id = book.id;
        row.querySelector('.title').textContent = book.title;
        row.querySelector('.author').textContent = book.author;
        row.querySelector('.page-count').textContent = book.pageCount;
        row.querySelector('.status').textContent = (
            getStatusDisplayFormat(book.isRead)
        );

        return row;
    },
};

function onAddBook(event) {
    const formData = new FormData(event.target);
    const book = new Book(
        formData.get('title'),
        formData.get('author'),
        Number(formData.get('pageCount')),
        formData.has('isRead'),
    );

    library.push(book);
    display.addRow(book);
}

function onCancelBookEntry() {
    document.querySelector('#new-book-modal').close();
}

function onBookTableClick(event) {
    const button = event.target.closest('button');

    if (!button) {
        return;
    }

    const toggleStatusButtonClicked = (
        button.classList.contains('toggle-status-button')
    );

    const deleteButtonClicked = (
        button.classList.contains('delete-button')
    );

    if (toggleStatusButtonClicked) {
        onToggleStatus(event);
    } else if (deleteButtonClicked) {
        onDeleteBook(event);
    } else {
        return;
    }
}

function onDeleteBook(event) {
    const bookId = getBookIdFromActionButton(event.target);
    const bookIndex = getBookIndexFromId(bookId);
    library.splice(bookIndex, 1);
    display.removeRow(bookId);
}

function onToggleStatus(event) {
    const bookId = getBookIdFromActionButton(event.target);
    const bookIndex = getBookIndexFromId(bookId);
    const book = library[bookIndex];
    book.toggleStatus();
    display.toggleStatus(book);
}

function getBookIdFromActionButton(actionButton) {
    const bookRow = actionButton.parentNode.parentNode;
    return bookRow.dataset.id;
}

function getBookIndexFromId(id) {
    const bookIndex = library.findIndex(book => book.id === id);

    if (bookIndex === -1) {
        throw new Error(`Book ID not found: ${id}`);
    }

    return bookIndex;
}

function getStatusDisplayFormat(isRead) {
    return isRead ? 'Read' : 'Unread';
}

function bindEvents() {
    document.querySelector('#new-book-button').addEventListener(
        'click',
        () => {
            document.querySelector('#new-book-form').reset();
            document.querySelector('#new-book-modal').showModal();
        },
    );

    document.querySelector('#cancel-new-book-entry-button').addEventListener(
        'click',
        onCancelBookEntry,
    );

    document.querySelector('#new-book-form').addEventListener(
        'submit',
        onAddBook,
    );

    document.querySelector('#book-table-data').addEventListener(
        'click',
        onBookTableClick,
    );
}

const demo = {

    addBookToLibrary(book) {
        library.push(book);
        display.addRow(book);
    },

    run() {
        this.books.forEach(this.addBookToLibrary);
    },

    books: [
        new Book('The Hobbit', 'J.R.R. Tolkien', 300, false),
        new Book('The Lord of the Rings', 'Same Guy', 1178, true),
        new Book('The Odyssey', 'Homer', 592),
    ],
};

const library = [];
bindEvents();
demo.run();
