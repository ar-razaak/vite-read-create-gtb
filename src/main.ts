import { fetchData } from "./libs/fetch";
import { IBook } from "./types/entity";

interface IBookResult {
  data: IBook[];
}

async function renderBooks() {
  const bookCardsContainer = document.getElementById(
    "bookCardsContainer"
  ) as HTMLElement;
  bookCardsContainer.innerHTML = ""; // Clear the container before rendering

  // Iterate over the fetched book data and create book cards
  const booksResponse: IBookResult | undefined = await fetchData<IBookResult>(
    "https://v1.appbackend.io/v1/rows/TjIAfyntAeEl"
  );

  if (booksResponse) {
    booksResponse.data.forEach((IBook: IBook) => {
      const bookContainer = document.createElement("div");
      bookContainer.classList.add("book-card");
      bookContainer.id = "book-card";
      bookContainer.dataset.id = IBook._id;

      const bookCover = document.createElement("div");
      bookCover.id = "coverBook";
      bookCover.textContent = "JPG";

      const bookRating = document.createElement("div");
      bookRating.id = "ratingBook";
      bookRating.textContent = `Rating: ${IBook.rating}`;

      const bookTitle = document.createElement("div");
      bookTitle.id = "titleBook";
      bookTitle.textContent = IBook.title;

      const bookAuthor = document.createElement("div");
      bookAuthor.id = "authorBook";
      bookAuthor.textContent = IBook.author;

      const bookSubtitle = document.createElement("div");
      bookSubtitle.id = "subtitleBook";
      bookSubtitle.textContent = IBook.subtitle;

      bookContainer.append(
        bookCover,
        bookRating,
        bookTitle,
        bookAuthor,
        bookSubtitle
      );
      bookCardsContainer.appendChild(bookContainer);

      // Add click event listener to each card
      bookContainer.addEventListener("click", () => openBookModal(IBook));
    });
  }
}

function openBookModal(book: IBook) {
  const modal = document.getElementById("addNewModal") as HTMLElement;
  modal.style.display = "block";

  // Populate modal with book details
  const titleInput = document.getElementById(
    "bookTitleInput"
  ) as HTMLInputElement;
  const subtitleInput = document.getElementById(
    "bookSubtitleInput"
  ) as HTMLInputElement;
  const authorInput = document.getElementById(
    "bookAuthorInput"
  ) as HTMLInputElement;
  const ratingInput = document.getElementById(
    "bookRatingInput"
  ) as HTMLInputElement;
  const urlInput = document.getElementById("bookUrlInput") as HTMLInputElement;

  titleInput.value = book.title;
  subtitleInput.value = book.subtitle;
  authorInput.value = book.author;
  ratingInput.value = book.rating.toString();
  urlInput.value = book.url || "";

  // Change the submit button text and functionality
  const submitBtn = document.getElementById(
    "submitBtnBook"
  ) as HTMLButtonElement;
  submitBtn.textContent = "Update Book";
  submitBtn.onclick = () => updateBook(book._id);
}

async function updateBook(bookId: string) {
  const titleInput = (
    document.getElementById("bookTitleInput") as HTMLInputElement
  ).value;
  const subtitleInput = (
    document.getElementById("bookSubtitleInput") as HTMLInputElement
  ).value;
  const authorInput = (
    document.getElementById("bookAuthorInput") as HTMLInputElement
  ).value;
  const ratingInput = (
    document.getElementById("bookRatingInput") as HTMLInputElement
  ).value;
  const urlInput = (document.getElementById("bookUrlInput") as HTMLInputElement)
    .value;

  const updatedBook = {
    title: titleInput,
    subtitle: subtitleInput,
    author: authorInput,
    rating: ratingInput,
    url: urlInput,
  };

  try {
    await fetch(`${API_URL}/${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBook),
    });

    // Close the modal and refresh the book list
    const modal = document.getElementById("addNewModal") as HTMLElement;
    modal.style.display = "none";
    renderBooks();
  } catch (error) {
    console.log(error);
  }
}

// Render Data ke DOM, alias buat ambil data dari Backend dan di DOM
// async function renderBooks() {
//   //fetching data
//   const books = await fetchData<IBookResult>(
//     "https://v1.appbackend.io/v1/rows/TjIAfyntAeEl"
//   );

//   //error checking
//   if (!books) {
//     console.log("Error: No books found");
//     return;
//   }

//   // Get the container where book cards will be appended
//   const bookCardsContainer = document.querySelector(".booksContainer");
//   if (!bookCardsContainer) {
//     console.log("Error: No booksContainer element found");
//     return;
//   }

//   bookCardsContainer.innerHTML = ""; // Clear the container before rendering

//   // Iterate over the fetched book data and create book cards
//   books.data.forEach((book) => {
//     const bookContainer = document.createElement("div");
//     bookContainer.classList.add("book-card");
//     bookContainer.id = "book-card";
//     bookContainer.dataset.id = book._id;

//     const bookBtn = document.createElement("button");
//     bookBtn.classList.add("bookBtn");
//     bookBtn.id = "bookBtn";
//     bookContainer.dataset.id = book._id;

//     const bookCover = document.createElement("div");
//     bookCover.id = "coverBook";
//     bookCover.textContent = "JPG";

//     const bookRating = document.createElement("div");
//     bookRating.id = "ratingBook";
//     bookRating.textContent = `Rating: ${book.rating}`;

//     const bookTitle = document.createElement("div");
//     bookTitle.id = "titleBook";
//     bookTitle.textContent = book.title;

//     const bookAuthor = document.createElement("div");
//     bookAuthor.id = "authorBook";
//     bookAuthor.textContent = book.author;

//     const bookSubtitle = document.createElement("div");
//     bookSubtitle.id = "subtitleBook";
//     bookSubtitle.textContent = book.subtitle;

//     bookContainer.append(
//       bookBtn, // Add this line
//       bookCover,
//       bookRating,
//       bookTitle,
//       bookAuthor,
//       bookSubtitle
//     );
//     bookCardsContainer.appendChild(bookContainer);
//   });

//   selectBook();
// }

const API_URL = "https://v1.appbackend.io/v1/rows/TjIAfyntAeEl";

function handleModal() {
  const modal = document.getElementById("addNewModal") as HTMLElement;
  const btn = document.getElementById("addnew") as HTMLElement;
  const span = document.getElementsByClassName("close")[0] as HTMLElement;

  btn.onclick = () => {
    modal.style.display = "block";
    resetForm();
  };

  span.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

function resetForm() {
  const form = document.querySelector("#addNewModal form") as HTMLFormElement;
  form.reset();
  const submitBtn = document.getElementById(
    "submitBtnBook"
  ) as HTMLButtonElement;
  submitBtn.textContent = "Add Book";
  submitBtn.onclick = addNewBook;
}

// // Function to handle modal open and close
// function handleModal() {
//   const modal = document.getElementById("addNewModal") as HTMLElement;
//   const btn = document.getElementById("addnew") as HTMLElement;
//   const span = document.getElementsByClassName("close")[0] as HTMLElement;

//   btn.onclick = () => {
//     modal.style.display = "block";
//   };

//   span.onclick = () => {
//     modal.style.display = "none";
//   };

//   window.onclick = (event) => {
//     if (event.target === modal) {
//       modal.style.display = "none";
//     }
//   };
// }

function selectBook() {
  const bookCards = document.querySelectorAll(".book-card");
  bookCards.forEach((card) => {
    card.addEventListener("click", () => {
      const modal = document.getElementById("addNewModal") as HTMLElement;
      modal.style.display = "block";
      // Here you would populate the modal with the book's details
    });
  });
}

// Function to add new book
function addNewBook() {
  const submitBtnBook = document.getElementById(
    "submitBtnBook"
  ) as HTMLButtonElement;
  const bookCoverInput = document.getElementById(
    "bookCoverInput"
  ) as HTMLInputElement;

  submitBtnBook?.addEventListener("click", async () => {
    const titleInput = (
      document.getElementById("bookTitleInput") as HTMLInputElement
    ).value;
    const subtitleInput = (
      document.getElementById("bookSubtitleInput") as HTMLInputElement
    ).value;
    const authorInput = (
      document.getElementById("bookAuthorInput") as HTMLInputElement
    ).value;
    const ratingInput = (
      document.getElementById("bookRatingInput") as HTMLInputElement
    ).value;
    const urlInput = (
      document.getElementById("bookUrlInput") as HTMLInputElement
    ).value;
    const coverFile: any = bookCoverInput.files?.[0];

    // Create a new book object
    const newBook = {
      title: titleInput,
      subtitle: subtitleInput,
      author: authorInput,
      rating: ratingInput,
      cover: coverFile,
      url: urlInput,
    };

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([newBook]),
      });

      appendBookToContainer(URL.createObjectURL(coverFile));
    } catch (error) {
      console.log(error);
    } finally {
      window.location.reload();
    }
  });
}

function appendBookToContainer(coverUrl: string) {
  const bookCover = document.createElement("div");
  bookCover.id = "coverBook";
  bookCover.style.backgroundImage = `url(${coverUrl})`;
}

// Initialize modal handling and add book handling
handleModal();
addNewBook();
selectBook();

renderBooks();
