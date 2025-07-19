const library = [];

function Book(title, author, pageCount, read) {

    if (!new.target) {
        throw Error('Constructor must be invoked with the "new" keyword.');
    }

    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pageCount = pageCount;
    this.read = read;
}

function addBookToLibrary(title, author, pageCount, read) {
    const book = new Book(title, author, pageCount, read);
    library.push(book);
}

const libraryDisplay = {
    tbody: document.querySelector('#book-table-data'),

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

document.querySelector('#new-book-button').addEventListener('click', () => {
    document.querySelector('#new-book-modal').showModal();
});

addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 413);
addBookToLibrary('The Lord of the Rings', 'Same Guy', 251);

library.forEach(book => libraryDisplay.addBook(book));
