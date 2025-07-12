const library = [];

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
