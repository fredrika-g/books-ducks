// index.html content
let loginSection = document.querySelector("#login-register");
let allBooksContent = document.querySelector("#allBooks");
let profilePageContent = document.querySelector("#profilePageContent");

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
let showBooksLink = document.querySelector("#showBooksLink");
let showProfileLink = document.querySelector("#showProfileLink");
let logoutBtn = userMenu.querySelector("button");

// variables - profile page
let toReadUL = document.querySelector("#toReadUL");
let gradedBooksUL = document.querySelector("#gradedBooksUL");

let toReadSorter = document.querySelector("#toReadSorter");
let gradedBooksSorter = document.querySelector("#gradedBooksSorter");

let usersGradedBooks = [];

//variables - modal
let gradeModal = document.querySelector("#gradeBookModal");
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

      // getting full user data
      let fullUserResponse = await axios.get(
        "http://localhost:1337/api/users/me?populate=deep,2",
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      // setting user in session storage to the full response
      sessionStorage.setItem("user", JSON.stringify(fullUserResponse.data));

      // clearing input fields
      identifierInput.value = "";
      passwordInput.value = "";

      // setting starting page to Books page
      sessionStorage.setItem("page", "books");

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
  sessionStorage.clear();

  renderPage();
};

registerBtn.addEventListener("click", register);
loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);

const updateCurrentUser = async () => {
  // getting user info
  let response = await axios.get(
    "http://localhost:1337/api/users/me?populate=deep,2",
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );

  // updating user in session storage
  sessionStorage.setItem("user", JSON.stringify(response.data));
};

const renderPage = () => {
  if (sessionStorage.getItem("token")) {
    userMenu.classList.remove("display-none");
    loginSection.classList.add("display-none");

    let user = JSON.parse(sessionStorage.getItem("user")).username;

    usernameDisplay.innerText = `Current User: ${user}`;

    if (sessionStorage.getItem("page") === "books") {
      allBooksContent.classList.remove("display-none");
      profilePageContent.classList.add("display-none");
      getAllBooks();
    } else {
      allBooksContent.classList.add("display-none");
      profilePageContent.classList.remove("display-none");
      showProfile();
    }
  } else {
    userMenu.classList.add("display-none");
    loginSection.classList.remove("display-none");
    profilePageContent.classList.add("display-none");
    usernameDisplay.innerText = "";

    getAllBooks();
  }
};

const getAllBooks = async () => {
  profilePageContent.classList.add("display-none");
  let response = await axios.get(
    "http://localhost:1337/api/books?populate=deep,2"
  );

  let books = response.data.data;

  allBooksContent.innerHTML = "";

  books.forEach((book) => {
    let bookDiv = document.createElement("div");
    bookDiv.classList.add("book");
    bookDiv.dataset.id = `${book.id}`;

    let bookInfo = document.createElement("div");
    bookInfo.innerHTML = `<p class="title fs-4 fw-medium">${
      book.attributes.title
    }</p>
    <p class="author">${book.attributes.author}</p>
    <p class="date fst-italic">${book.attributes.publishDate}</p>
    <p class="grade">${
      book.attributes.avgGrade
        ? `Avg Grade ${book.attributes.avgGrade}`
        : "Avg Grade -"
    }</p>`;

    if (sessionStorage.getItem("token")) {
      let actions = document.createElement("div");
      actions.classList.add("actions");

      // add to personal list btn
      let addBtn = document.createElement("button");
      addBtn.classList.add(
        "addToReadBtn",
        "btn",
        "btn-sm",
        "btn-outline-primary"
      );
      addBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
      addBtn.title = "Add to My List";

      // grade book btn
      let gradeBtn = document.createElement("button");
      gradeBtn.classList.add(
        "gradeBookBtn",
        "btn",
        "btn-sm",
        "btn-outline-primary"
      );
      gradeBtn.innerText = "Grade";
      gradeBtn.dataset.bookid = book.id;
      gradeBtn.dataset.bsToggle = "modal";
      gradeBtn.dataset.bsTarget = "#gradeBookModal";

      actions.append(addBtn, gradeBtn);
      bookInfo.append(actions);
    }

    bookDiv.append(bookInfo);
    bookDiv.innerHTML += `<img src="http://localhost:1337${book.attributes.cover.data.attributes.url}" alt="${book.attributes.title} Cover"/>`;
    allBooksContent.append(bookDiv);
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
    `http://localhost:1337/api/users/${user.id}?populate=deep,2`,
    {
      booksToRead: { connect: [bookId] },
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );

  // updating user in session storage
  await updateCurrentUser();
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
  gradeSelect.querySelector("option").selected = true;
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

  // checking if user has graded book before
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

      // updating average grade
      let allGrades = 0;
      updatedBookGrades.forEach((gradeObj) => {
        allGrades += +gradeObj.grade;
      });

      let averageGrade = allGrades / updatedBookGrades.length;
      console.log(averageGrade);

      // adding chosen grade to the book in strapi with updated grade array and updating book grade average
      let newBookResponse = await axios.put(
        `http://localhost:1337/api/books/${bookId}?populate=deep,2`,
        {
          data: { gradesList: updatedBookGrades, avgGrade: averageGrade },
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

      //  updating current user in session storage
      await updateCurrentUser();
      // updating books display
      await getAllBooks();
    }); /*end of .then()*/
};

const removeBook = async (bookId) => {
  let user = JSON.parse(sessionStorage.getItem("user"));

  // current user to reads
  let currentList = user.booksToRead;

  // removing chosen book from to reads
  let editedList = currentList.filter((book) => {
    return +book.id !== +bookId;
  });

  // placing ids of the current books in array to pass to API through PUT
  let editedListIds = editedList.map((book) => book.id);

  // updating strapi
  await axios.put(
    `http://localhost:1337/api/users/${user.id}?populate=deep,2`,
    {
      booksToRead: editedListIds,
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );

  // update session storage
  await updateCurrentUser();

  // getting updated to read list to pass to renderToReads function
  let updatedUserToReads = JSON.parse(
    sessionStorage.getItem("user")
  ).booksToRead;
  await renderToReads(updatedUserToReads);
};

const sortAlphabetically = (arr, property) => {
  let array = [...arr];

  array.sort((a, b) => {
    return a[property].localeCompare(b[property]);
  });

  return array;
};

const sortNumerically = (arr, property) => {
  let array = [...arr];

  array.sort((a, b) => {
    return a.gradeInfo[property] - b.gradeInfo[property];
  });

  return array;
};

const renderToReads = async (toReadList) => {
  toReadUL.innerHTML = "";

  await updateCurrentUser();

  if (toReadList.length > 0) {
    toReadList.forEach((book) => {
      toReadUL.innerHTML += `<li class="list-group-item d-flex align-items-center justify-content-between gap-3">
      <div class="d-flex flex-column">
      <p class="fw-bold">${book.title}</p>
      <p class="fst-italic">by ${book.author}</p>
      </div>
      <button class="btn btn-sm removeToRead" data-bookId="${book.id}"><i class="fa fa-solid fa-trash"></i></button>
      </li>`;
    });

    toReadUL.querySelectorAll(".removeToRead").forEach((button) => {
      button.addEventListener("click", async (e) => {
        let bookId = e.target.closest(".removeToRead").dataset.bookid;
        await removeBook(bookId);
      });
    });
  }
};

const renderGradedBooks = async (gradedBooksList) => {
  gradedBooksUL.innerHTML = "";

  await updateCurrentUser();

  gradedBooksList.forEach((book) => {
    let { myGrade } = book.gradeInfo;
    let { title, author } = book.bookInfo;
    gradedBooksUL.innerHTML += `<li class="list-group-item"><div class="d-flex flex-column">
    <p class="fw-bold">${title}</p>
    <p class="fst-italic">by ${author}</p>
    <p>My Grade: ${myGrade}</p>
    </div></li>`;
  });
};

const showProfile = async () => {
  // resetting array
  usersGradedBooks = [];
  // getting current user
  let user = JSON.parse(sessionStorage.getItem("user"));

  // breaking out user content
  let { username, booksToRead, gradedBooks } = user;

  // showing user's to read list
  renderToReads(booksToRead);

  // getting graded books info

  let promises = [];

  gradedBooks.forEach((book) => {
    promises.push(
      axios.get(`http://localhost:1337/api/books/${book.bookId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
    );
  });

  let gradedBooksRequests = await Promise.all(promises);

  gradedBooks.forEach((bookGrade) => {
    gradedBooksRequests.forEach((request) => {
      if (request.data.data.id === +bookGrade.bookId) {
        usersGradedBooks.push({
          gradeInfo: bookGrade,
          bookInfo: request.data.data.attributes,
        });
      }
    });
  });

  renderGradedBooks(usersGradedBooks);
};

// profile page
showProfileLink.addEventListener("click", () => {
  sessionStorage.setItem("page", "profile");

  renderPage();
});

// showing Books page
showBooksLink.addEventListener("click", () => {
  sessionStorage.setItem("page", "books");

  renderPage();
});

toReadSorter.addEventListener("change", () => {
  let toReadList = JSON.parse(sessionStorage.getItem("user")).booksToRead;
  let sortedBooks = sortAlphabetically(toReadList, toReadSorter.value);

  // showing user's to read list
  renderToReads(sortedBooks);
});

gradedBooksSorter.addEventListener("change", () => {
  let sortedBooks = [...usersGradedBooks];

  if (gradedBooksSorter.value == "myGrade") {
    sortedBooks.sort((a, b) => {
      return a.gradeInfo.myGrade - b.gradeInfo.myGrade;
    });
  } else {
    sortedBooks.sort((a, b) => {
      return a.bookInfo[gradedBooksSorter.value].localeCompare(
        b.bookInfo[gradedBooksSorter.value]
      );
    });
  }

  renderGradedBooks(sortedBooks);
});
