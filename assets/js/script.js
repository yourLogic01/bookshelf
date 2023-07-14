document.addEventListener('DOMContentLoaded', function () {
    const books = [];
    const renderEvent = 'RENDER_EVENT';
    const submitAddBook = document.getElementById('inputBook');
    const searchBookButton = document.getElementById('searchBook');
    
    function generatedId() {
        return +new Date();
      }
    
    function generatedBookObject(id, judul, penulis, kategori, tahun, isComplete) {
          return {
          id,
          judul,
          penulis,
          kategori,
          tahun,
          isComplete,
        };
    }

    submitAddBook.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
      const found = document.getElementById('searchItem');
      found.setAttribute('hidden',true);
    });
  
    document.getElementById('searchBook').addEventListener('submit', function (event) {
      event.preventDefault();
      const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
      const bookList = document.querySelectorAll('.book_item > h3');
      for (const book of bookList) {
        if (book.innerText.toLowerCase().includes(searchBook)) {
          book.parentElement.style.display = "block";
        } else {
          book.parentElement.style.display = "none";
        }
      }
    });

    function addBook() {
      const inputJudul = document.querySelector("#inputBookTitle").value;
      const inputPenulis = document.querySelector("#inputBookAuthor").value;
      const inputKategori = document.querySelector("#inputBookCategory").value;
      const inputTahun = document.querySelector("#inputBookYear").value;
      const isCompleted = document.querySelector("#inputBookIsComplete");
      const id = generatedId();
      const bookObject = generatedBookObject(id, inputJudul, inputPenulis, inputKategori, inputTahun, isCompleted.checked);
      books.push(bookObject);
  
      document.dispatchEvent(new Event(renderEvent));
      saveDataBook();
    }
  
    document.addEventListener(renderEvent, function () {
      const incompleteBooksList = document.getElementById('incompleteBookshelfList');
      incompleteBooksList.innerHTML = '';
  
      const completeBookList = document.getElementById('completeBookshelfList');
      completeBookList.innerHTML = '';
  
      for (const bookItem of books) {
        const bookElement = createBook(bookItem);
        if (!bookItem.isComplete) {
          incompleteBooksList.append(bookElement);
        } else {
          completeBookList.append(bookElement);
        }
      }
    });
  
    function createBook(bookObject) {
      const articleContainer = document.createElement('article');
      articleContainer.classList.add('book_item');
      articleContainer.setAttribute('id', `book-${bookObject.id}`);
      const judul = document.createElement('h3');
      judul.innerText = `Nama Buku : ${bookObject.judul}`;
      const penulis = document.createElement('p');
      penulis.innerText = `Penulis : ${bookObject.penulis}`;
      const kategori = document.createElement('p');
      kategori.innerText = `kategori : ${bookObject.kategori}`;
      const tahun = document.createElement('p');
      tahun.innerText = `Tahun : ${bookObject.tahun}`;
      const divButton = document.createElement('div');
      divButton.classList.add('action');
  
      articleContainer.append(judul, penulis, kategori, tahun, divButton);
      
  
      if (bookObject.isComplete) {
        const done = document.createElement('button');
        done.innerText = 'Sudah selesai dibaca';
        done.classList.add("hijau");
        done.disabled=true;

        const unfinishedButton = document.createElement('button');
        unfinishedButton.classList.add('toUnread');
        unfinishedButton.innerHTML = '<i class="bi bi-bookmark-dash"></i>';
  
        unfinishedButton.addEventListener('click', function () {
          undoneReadBook(bookObject.id);
        });
  
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerHTML = '<i class="bi bi-trash3"></i>';
  
        deleteButton.addEventListener('click', function () {
          deleteReadBook(bookObject.id);
        });
  
        divButton.append(done,unfinishedButton, deleteButton);
      } else {
        const undone = document.createElement('button');
        undone.innerText = 'Belum selesai dibaca';
        undone.classList.add("kuning");
        undone.disabled=true;

        const finishedButton = document.createElement('button');
        finishedButton.classList.add('green');
        finishedButton.innerHTML = '<i class="bi bi-bookmark-check"></i>';
  
        finishedButton.addEventListener('click', function () {
          doneReadBook(bookObject.id);
        });
  
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerHTML = '<i class="bi bi-trash3"></i>';
  
        deleteButton.addEventListener('click', function () {
          deleteReadBook(bookObject.id);
        });
        divButton.append(undone,finishedButton, deleteButton);
      }
  
      return articleContainer;
    }
  
    function doneReadBook(bookId) {
      const bookChoice = findBook(bookId);
  
      if (bookChoice == null) return;
  
      bookChoice.isComplete = true;
      document.dispatchEvent(new Event(renderEvent));
      saveDataBook();
      searchDataBook();    
    }
  
    function undoneReadBook(bookId) {
      const bookChoice = findBook(bookId);
      if (bookChoice == null) return;
      bookChoice.isComplete = false;
      document.dispatchEvent(new Event(renderEvent));
      saveDataBook();
      searchDataBook();    
    }
  
    function findDataBook(bookTitle) {
      for (const bookItem of books) {
        if (bookItem.judul === bookTitle) {
          return bookItem;
        }
      }
      return null;
    }
  
    function findBook(bookId) {
      for (const bookItem of books) {
        if (bookItem.id === bookId) {
          return bookItem;
        }
      }
      return null;
    }
  
    function findBookIndex(bookId) {
      for (const index in books) {
        if (books[index].id === bookId) {
          return index;
        }
      }
      return -1;
    }
  
    function deleteReadBook(bookId) {
      const foundListBook = document.getElementById('searchItem');
      const alertPopup = document.getElementById('alert-popup');
      alertPopup.removeAttribute('hidden');
  
      const buttonDelete = document.getElementById('delete');
      const buttonCancel = document.getElementById('cancel');
  
      buttonDelete.addEventListener('click', function () {
        const bookIndex = findBookIndex(bookId);
        if (bookIndex === -1) return;
        books.splice(bookIndex, 1);
        document.dispatchEvent(new Event(renderEvent));
        saveDataBook();
        alertPopup.setAttribute('hidden', true);
        foundListBook.innerHTML = '';
      });
  
      buttonCancel.addEventListener('click', function () {
        alertPopup.setAttribute('hidden', true);
      });
    }

    const STORAGE_KEYBOOK = 'BOOKSHELF_STORAGE';
    function saveDataBook() {
      if (isStorageExist()) {
        const dataBuku = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEYBOOK, dataBuku);
      }
    }
  
    function isStorageExist() {
      if (typeof (Storage) == undefined) {
        alert('Browser ini tidak mendukung local storage');
  
        return false;
      }
      return true;
    }
  
    function displayDataBook() {
      const storage = localStorage.getItem(STORAGE_KEYBOOK);
      let data = JSON.parse(storage);
  
      if (data !== null) {
        for (const book of data) {
          books.push(book);
        }
      }
      document.dispatchEvent(new Event(renderEvent));
    }
  
    if (isStorageExist()) {
      displayDataBook();
    }
  });
  