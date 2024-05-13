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
  } else {
    userMenu.classList.add("display-none");
    loginSection.classList.remove("display-none");
    homePageContent.classList.add("display-none");
    usernameDisplay.innerText = "";
  }
};
