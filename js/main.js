const bookshelfList = [];
const RENDER_EVENT = 'render-bookshelf';
const STORAGE_KEY = 'BOOKSHELF_APPS';
const SEARCH_BOOK = 'show-book';

function generatedId() {
    return +new Date;
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function findBook(bookId) {
    for (bookItem of bookshelfList) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (index in bookshelfList) {
        if (bookshelfList[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function makeBookshelf(bookObject) {
    const {
        id,
        title,
        author,
        year,
        isComplete
    } = bookObject;

    const article = document.createElement('article');
    article.classList.add('book_item');
    article.setAttribute('id', `book-${id}`);

    const judulBuku = document.createElement('h3');

    const penulis = document.createElement('p');

    const tahun = document.createElement('p');

    if (isComplete) {
        judulBuku.innerText = title;

        penulis.innerText = 'Penulis: ' + author;

        tahun.innerText = 'Tahun: ' + year;

        const divAction = document.createElement('div');
        divAction.classList.add('action');

        const selesaiDibaca = document.createElement('button');
        selesaiDibaca.classList.add('green');
        selesaiDibaca.innerText = 'Belum selesai Dibaca';

        const hapusBuku = document.createElement('button');
        hapusBuku.classList.add('red');
        hapusBuku.innerText = 'Hapus Buku';

        divAction.append(selesaiDibaca, hapusBuku);

        selesaiDibaca.addEventListener('click', () => {
            undoBookFromCompleted(id);
        });

        hapusBuku.addEventListener('click', () => {
            if (confirm('Apakah anda yakin ingin menghapus buku ' + title + ' dari rak Selesai dibaca?')) {
                removeBookFromCompleted(id);
            }
        });

        article.append(judulBuku, penulis, tahun, divAction);

    } else {
        judulBuku.innerText = title;

        penulis.innerText = 'Penulis: ' + author;

        tahun.innerText = 'Tahun: ' + year;

        const divAction = document.createElement('div');
        divAction.classList.add('action');

        const belumSelesaiDibaca = document.createElement('button');
        belumSelesaiDibaca.classList.add('green');
        belumSelesaiDibaca.innerText = 'Selesai dibaca';

        const hapusBuku = document.createElement('button');
        hapusBuku.classList.add('red');
        hapusBuku.innerText = 'Hapus Buku';

        divAction.append(belumSelesaiDibaca, hapusBuku);

        belumSelesaiDibaca.addEventListener('click', () => {
            addBookToCompleted(id);
        });

        hapusBuku.addEventListener('click', () => {
            if (confirm('Apakah anda yakin ingin menghapus buku ' + title + ' dari rak Belum selesai dibaca?')) {
                removeBookFromCompleted(id);
            }
        });

        article.append(judulBuku, penulis, tahun, divAction);

    }
    return article;
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(bookshelfList);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

function findBookTitle() {
    if (isStorageExist()) {
        const serializedData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedData);

        let titleSearch = document.getElementById('searchBookTitle').value;
        titleSearch = titleSearch.toLowerCase();
        if (titleSearch !== '') {
            data.filter((elemen) => {
                if (elemen.title.toLowerCase().includes(titleSearch)) {
                    document.dispatchEvent(new Event(SEARCH_BOOK));
                }
            });
        } else {
            document.dispatchEvent(new Event(RENDER_EVENT));
        }
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const bookshelf of data) {
            bookshelfList.push(bookshelf);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function checkChebox() {
    const checkboxTry = document.getElementById('inputBookIsComplete');
    if (checkboxTry.checked) {
        return true;
    }
    return false;
}

/* 
{
    id: string | number,
    title: string,
    author: string,
    year: number,
    isComplete: boolean,
}
*/

function addBook() {
    const titleBookshelf = document.getElementById('inputBookTitle').value;
    const authorBookshelf = document.getElementById('inputBookAuthor').value;
    const yearBookshelf = document.getElementById('inputBookYear').value;
    const checkComplete = checkChebox();
    const generatedID = generatedId();

    const addBookObj = generateBookObject(generatedID, titleBookshelf, authorBookshelf, yearBookshelf, checkComplete);

    // menampilkan alert saat menambahkan buku.
    if (checkComplete) {
        alert('Anda menambahkan buku ' + addBookObj.title + ' kedalam rak Selesai dibaca.');
    } else {
        alert('Anda menambahkan buku ' + addBookObj.title + ' kedalam rak Belum selesai dibaca.');
    }

    bookshelfList.push(addBookObj);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    bookshelfList.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('inputBook');
    const bookTitle = document.getElementById('inputBookTitle').value;

    const searchBook = document.getElementById('searchBook');
    searchBook.addEventListener('submit', (event) => {
        event.preventDefault();
        findBookTitle();
        return;
    });

    submitForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

// Untuk merender buku yang dicari
document.addEventListener(SEARCH_BOOK, () => {
    const uncompletedBookList = document.getElementById('uncompleteBookshelfList');
    const completedBookList = document.getElementById('completeBookshelfList');

    uncompletedBookList.innerHTML = '';
    completedBookList.innerHTML = '';

    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    let titleSearch = document.getElementById('searchBookTitle').value;
    titleSearch = titleSearch.toLowerCase();

    let tempArray = [];
    data.filter((elemen) => {
        if (elemen.title.toLowerCase().includes(titleSearch)) {
            tempArray.push(elemen)
        }
    });

    for (const bookItem of tempArray) {
        const bookElement = makeBookshelf(bookItem);
        if (bookItem.isComplete) {
            completedBookList.append(bookElement);
        } else {
            uncompletedBookList.append(bookElement);
        }
    }
});

document.addEventListener(RENDER_EVENT, () => {
    const uncompletedBookList = document.getElementById('uncompleteBookshelfList');
    const completedBookList = document.getElementById('completeBookshelfList');

    uncompletedBookList.innerHTML = '';
    completedBookList.innerHTML = '';

    for (const bookItem of bookshelfList) {
        const bookElement = makeBookshelf(bookItem);
        if (bookItem.isComplete) {
            completedBookList.append(bookElement);
        } else {
            uncompletedBookList.append(bookElement);
        }
    }
});