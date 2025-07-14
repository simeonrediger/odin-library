const library = [
    {
        title: 'The Hobbit',
        author: 'J.R. Tolkien',
        pageCount: 251,
    },
    {
        title: 'The Lord of The Rings',
        author: 'Same Guy',
        pageCount: 413,
    },
];

function Book(title, author, pageCount) {

    if (!new.target) {
        throw Error('Constructor must be invoked with the "new" keyword.');
    }

    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pageCount = pageCount;
}

function addBookToLibrary(title, author, pageCount) {
    const book = new Book(title, author, pageCount);
    library.push(book);
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

        row.append(title, author, pageCount);
        this.tbody.append(row);
    },
};

libraryDisplay.addBooks(library);
