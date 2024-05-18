// index.html content
let loginSection = document.querySelector("#login-register");
let homePageContent = document.querySelector("#homepageContent");

// variables - log in
let identifierInput = document.querySelector("#identifier");
let passwordInput = document.querySelector("#password");

let loginBtn = document.querySelector("#loginBtn");

// variables - register
let usernameInput = document.querySelector("#username");
let emailInput = document.querySelector("#email");
let registerPasswordInput = document.querySelector("#registerPassword");

let registerBtn = document.querySelector("#registerBtn");

// variables - header content
let siteTitle = document.querySelector("header h1");
let usernameDisplay = document.querySelector("header span");

// variables - header
let userMenu = document.querySelector(".user-menu");
let logoutBtn = userMenu.querySelector("button");

//variables - modal
let gradeModal = document.querySelector("#gradeBookModal");
// const myModal = new bootstrap.Modal(document.getElementById('myModal'), options)
// or
// const gradeModal = new bootstrap.Modal("#gradeBookModal");
let saveGradeBtn = document.querySelector("#saveGradeBtn");
let gradeSelect = document.querySelector("#gradeSelect");

// info about the store

window.addEventListener("load", async () => {
  let response = await axios.get("http://localhost:1337/api/website");
  let siteAttributes = response.data.data.attributes;
  siteTitle.innerText = siteAttributes.name;
  document.body.classList.add(siteAttributes.colorTheme);

  renderPage();
});

// log in
const login = async () => {
  // log in functionality
  try {
    let response = await axios.post("http://localhost:1337/api/auth/local", {
      identifier: identifierInput.value,
      password: passwordInput.value,
    });

    if (response.request.status === 200) {
      sessionStorage.setItem("token", response.data.jwt);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));

      // clearing input fields
      identifierInput.value = "";
      passwordInput.value = "";

      renderPage();
    }
  } catch (err) {
    document.querySelector("#loginMsg").innerText = "Incorrect Credentials";

    setTimeout(() => {
      // clearing input fields and msg after delay
      identifierInput.value = "";
      passwordInput.value = "";
      document.querySelector("#loginMsg").innerText = "";
    }, 4000);
    console.log(err);
  }
};

// register
const register = async () => {
  // register functionality
  let response = await axios.post(
    "http://localhost:1337/api/auth/local/register",
    {
      username: usernameInput.value,
      email: emailInput.value,
      password: registerPasswordInput.value,
    }
  );

  if (response.status === 200) {
    document.querySelector("#registerMsg").innerText =
      "Registered Successfully!";

    setTimeout(() => {
      document.querySelector("#registerMsg").innerText = "";
      usernameInput.value = "";
      emailInput.value = "";
      registerPasswordInput.value = "";
    }, 4000);
  }
};

// log out
const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");

  renderPage();
};

registerBtn.addEventListener("click", register);
loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);

const renderPage = () => {
  if (sessionStorage.getItem("token")) {
    userMenu.classList.remove("display-none");
    loginSection.classList.add("display-none");
    homePageContent.classList.remove("display-none");

    let user = JSON.parse(sessionStorage.getItem("user")).username;

    usernameDisplay.innerText = `Current User: ${user}`;

    getAllBooks();
  } else {
    userMenu.classList.add("display-none");
    loginSection.classList.remove("display-none");
    homePageContent.classList.add("display-none");
    usernameDisplay.innerText = "";

    getAllBooks();
  }
};

const getAllBooks = async () => {
  let response = await axios.get(
    "http://localhost:1337/api/books?populate=deep,2"
  );

  let books = response.data.data;

  document.querySelector("#allBooks").innerHTML = "";

  books.forEach((book) => {
    let bookDiv = document.createElement("div");
    bookDiv.classList.add("book");
    bookDiv.dataset.id = `${book.id}`;

    let bookInfo = document.createElement("div");
    bookInfo.innerHTML = `<p class="title">${book.attributes.title}</p>
    <p class="author">${book.attributes.author}</p>
    <p class="date">${book.attributes.publishDate}</p>
    <p class="grade">Avg Grade</p>`;

    if (sessionStorage.getItem("token")) {
      let actions = document.createElement("div");
      actions.classList.add("actions");

      // add to personal list btn
      let addBtn = document.createElement("button");
      addBtn.classList.add("addToReadBtn");
      addBtn.innerText = "+ My List";

      // grade book btn
      let gradeBtn = document.createElement("button");
      gradeBtn.classList.add("gradeBookBtn");
      gradeBtn.innerText = "Grade";
      gradeBtn.dataset.bookid = book.id;
      gradeBtn.dataset.bsToggle = "modal";
      gradeBtn.dataset.bsTarget = "#gradeBookModal";

      actions.append(addBtn, gradeBtn);
      bookInfo.append(actions);
    }

    bookDiv.append(bookInfo);
    bookDiv.innerHTML += `<img src="http://localhost:1337${book.attributes.cover.data.attributes.url}" alt="${book.attributes.title} Cover"/>`;
    document.querySelector("#allBooks").append(bookDiv);
  });

  //   adding event listeners
  if (sessionStorage.getItem("token")) {
    document.querySelectorAll(".addToReadBtn").forEach((button) => {
      button.addEventListener("click", (e) => {
        addToPersonalList(e.target.closest(".book").dataset.id);
      });
    });
    document.querySelectorAll(".gradeBookBtn").forEach((button) => {
      button.addEventListener("click", (e) => {
        gradeModal.dataset.bookId = e.target.closest(".book").dataset.id;
      });
    });
  }
};

// adding book to personal list
const addToPersonalList = async (bookId) => {
  let user = JSON.parse(sessionStorage.getItem("user"));
  let response = await axios.put(
    `http://localhost:1337/api/users/${user.id}`,
    {
      booksToRead: { connect: [bookId] },
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  console.log("Book Added to List!");
};

// populating data in modal when opened
gradeModal.addEventListener("shown.bs.modal", async () => {
  // getting id of chosen book
  let bookId = gradeModal.dataset.bookId;

  // getting book info
  let response = await axios.get(`http://localhost:1337/api/books/${bookId}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });

  let bookInfo = response.data.data.attributes;

  gradeModal.querySelector("h1").innerText = `Grade ${bookInfo.title}`;
});

gradeModal.addEventListener("hidden.bs.modal", () => {
  gradeModal.querySelector("h1").innerText = "";
});

saveGradeBtn.addEventListener("click", async () => {
  if (gradeSelect.value) {
    await saveGrade();
  } else {
    console.log("Choose a grade first!");
  }
});

const saveGrade = async () => {
  // getting current user id
  let userId = JSON.parse(sessionStorage.getItem("user")).id;

  // turning selected grade into an object
  let grade = { grade: gradeSelect.value, userId: userId };
  // getting the chosen books id
  let bookId = gradeModal.dataset.bookId;

  // getting the book in its current state to get grades array
  let bookResponse = await axios.get(
    `http://localhost:1337/api/books/${bookId}?populate=deep,2`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );

  //  grade array to compare with
  let currentBookGradesList = bookResponse.data.data.attributes.gradesList;

  // 1. checking if user has graded book before
  axios
    .get(`http://localhost:1337/api/users/me?populate=deep,2`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then(async (response) => {
      // saving current graded books array in variable using the response from GET request above
      let gradedBooks = response.data.gradedBooks;

      // creating object out of chosen book grade to pass to api
      let newBook = {
        book: bookId,
        myGrade: gradeSelect.value,
        bookId: bookId,
      };

      // filtering current array of graded books to check for already existing book
      let duplicateCheckUserArr = gradedBooks.filter((a) => {
        return a.bookId == bookId;
      });

      // initializing the users grade array
      let updatedGradedBooks;

      // initializing books grades array
      let updatedBookGrades;

      if (duplicateCheckUserArr.length > 0) {
        // (if book already exists, update the grade of instance)
        console.log("Boken redan recenserad!");

        // assigning value to users grade array
        updatedGradedBooks = gradedBooks.map((book) => {
          if (book.bookId == bookId) {
            return newBook;
          } else {
            return book;
          }
        });

        // updated thisBookGrades: first checking if user has graded this book before, if so, delete previous grade
        updatedBookGrades = currentBookGradesList.map((book) => {
          if (book.userId == userId) {
            return grade;
          } else {
            return book;
          }
        });
      } else {
        // (if book doesnt exist, push newBook to array)
        console.log("Boken är inte recenserad!");
        gradedBooks.push(newBook);
        // assigning value to users grade array
        updatedGradedBooks = [...gradedBooks];

        updatedBookGrades = [...currentBookGradesList];
        updatedBookGrades.push(grade);
      }

      // adding chosen grade to the book in strapi with updated grade array
      let newBookResponse = await axios.put(
        `http://localhost:1337/api/books/${bookId}?populate=deep,2`,
        {
          data: { gradesList: updatedBookGrades },
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      // updating users grade array in strapi
      await axios.put(
        `http://localhost:1337/api/users/${userId}?populate=deep,2`,
        {
          gradedBooks: updatedGradedBooks,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
    }); /*end of .then()*/

  // updating average grade
};
