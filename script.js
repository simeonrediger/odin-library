class Library {
    #books = [];

    addBook(book) {
        this.#books.push(book);
    }

    removeBookByIndex(index) {
        this.#books.splice(index, 1);
    }

    getBookIndexFromId(id) {
        const index = this.#books.findIndex(book => book.id === id);

        if (index === -1) {
            throw new Error(`Book ID not found: ${id}`);
        }

        return index;
    }

    getBookById(id) {
        const index = this.getBookIndexFromId(id);
        return this.#books[index]
    }

    removeBookById(id) {
        const index = this.getBookIndexFromId(id);
        this.removeBookByIndex(index);
    }
}

class Book {

    constructor(title, author, pageCount, isRead = false) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.pageCount = pageCount;
        this.isRead = isRead;
    }

    toggleStatus() {
        this.isRead = !this.isRead;
    }
}

class Display {
    static #rowTemplate;

    static {
        const template = document.querySelector('#book-row-template');
        this.#rowTemplate = template.content.querySelector('tr');
    }

    static formatBookAsRow(book) {
        const row = this.#rowTemplate.cloneNode(true);
        row.dataset.id = book.id;
        row.querySelector('.title').textContent = book.title;
        row.querySelector('.author').textContent = book.author;
        row.querySelector('.page-count').textContent = book.pageCount;
        row.querySelector('.status').textContent = (
            this.getStatusDisplayFormat(book.isRead)
        );

        return row;
    }

    static getStatusDisplayFormat(isRead) {
        return isRead ? 'Read' : 'Unread';
    }

    constructor(
        library,
        newBookModalSelector,
        newBookFormSelector,
        cancelNewBookEntryButtonSelector,
        newBookButtonSelector,
        tbodySelector,
    ) {
        this.library = library;
        this.newBookModal = document.querySelector(newBookModalSelector);
        this.newBookForm = document.querySelector(newBookFormSelector);
        this.cancelNewBookEntryButton = document.querySelector(
            cancelNewBookEntryButtonSelector
        );
        this.newBookButton = document.querySelector(newBookButtonSelector);
        this.tbody = document.querySelector(tbodySelector);

        this.#bindEvents();
    }

    addRow(book) {
        const row = this.constructor.formatBookAsRow(book);
        this.tbody.append(row);
    }

    getRow(book) {
        return document.querySelector(`[data-id='${book.id}']`);
    }

    toggleStatus(book) {
        this.getRow(book).querySelector('.status').textContent = (
            this.constructor.getStatusDisplayFormat(book.isRead)
        );
    }

    removeRow(bookId) {
        this.tbody.querySelector(`[data-id='${bookId}']`)?.remove();
    }

    getBookIdFromActionButton(actionButton) {
        const bookRow = actionButton.parentNode.parentNode;
        return bookRow.dataset.id;
    }

    #onAddBook(event) {
        const formData = new FormData(event.target);
        const book = new Book(
            formData.get('title'),
            formData.get('author'),
            Number(formData.get('pageCount')),
            formData.has('isRead'),
        );

        this.library.addBook(book);
        this.addRow(book);
    }

    #onCancelBookEntry() {
        this.newBookModal.close();
    }

    #onBookTableClick(event) {
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
            this.#onToggleStatus(event);
        } else if (deleteButtonClicked) {
            this.#onDeleteBook(event);
        } else {
            return;
        }
    }

    #onDeleteBook(event) {
        const bookId = this.getBookIdFromActionButton(event.target);
        this.library.removeBookById(bookId);
        this.removeRow(bookId);
    }

    #onToggleStatus(event) {
        const bookId = this.getBookIdFromActionButton(event.target);
        const book = this.library.getBookById(bookId);
        book.toggleStatus();
        this.toggleStatus(book);
    }

    #bindEvents() {

        this.newBookButton.addEventListener(
            'click',
            () => {
                document.querySelector('#new-book-form').reset();
                document.querySelector('#new-book-modal').showModal();
            },
        );

        this.cancelNewBookEntryButton.addEventListener(
            'click',
            this.#onCancelBookEntry.bind(this),
        );

        this.newBookForm.addEventListener(
            'submit',
            this.#onAddBook.bind(this),
        );

        this.tbody.addEventListener(
            'click',
            this.#onBookTableClick.bind(this),
        );
    }
}

class Demo {

    books = [
        new Book('The Hobbit', 'J.R.R. Tolkien', 300, false),
        new Book('The Lord of the Rings', 'Same Guy', 1178, true),
        new Book('The Odyssey', 'Homer', 592),
    ];

    constructor(library, display) {
        this.library = library;
        this.display = display;
    }

    addBookToLibrary(book) {
        this.library.addBook(book);
        this.display.addRow(book);
    }

    run() {
        this.books.forEach(this.addBookToLibrary, this);
    }
}

const library = new Library();
const display = new Display(
    library,
    '#new-book-modal',
    '#new-book-form',
    '#cancel-new-book-entry-button',
    '#new-book-button',
    '#book-table-data',
);

new Demo(library, display).run();
