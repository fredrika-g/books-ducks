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
  console.log(books);

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

      //   let gradeDiv = document.createElement("div");
      //   gradeDiv.classList.add("gradeDiv");
      //   let gradeSelect = document.createElement("select");

      //   for (let i = 0; i < 10; i++) {
      //     gradeSelect.innerHTML += `<option value="${i + 1}">${i + 1}</option>`;
      //   }
      //   gradeDiv.append(gradeSelect);
      //   gradeSelect.classList.add("hidden");

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
        gradeBook(e.target.closest(".book").dataset.id);
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

const gradeBook = (bookId) => {
  console.log(bookId);
};
