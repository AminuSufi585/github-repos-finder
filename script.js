const input = document.querySelector("input");
const searchBtn = document.querySelector("#search");
const reposContainer = document.querySelector("section");
const url = "https://www.graphqlhub.com/graphql";

searchBtn.addEventListener("click", (e) => {   
  e.preventDefault();
  if (document.querySelector("section article")) {
    document.querySelector("section").innerHTML = '<div id="loading" class="hide"></div>';
  }
  if (input.value) {
    const query = `
      query getAllRepos($username: String!) {
        graphQLHub
        github {
          user(username: $username) {
            repos {
              name
            }
          }
        }
      }
    `;
    const variables = { username: input.value };

    makeQuery(query, variables)
    .then((res) => {
      renderComponents(res.data.github.user.repos, input.value);
      input.value = "";
    })
    .catch((e) => {
      input.value = "";
      alert("Invalid User!!");
      document.querySelector("section div").classList.toggle("hide");
    });

  } else {
    alert("Enter a username please");
  }
});

async function makeQuery(query, variables) {
  document.querySelector("section div").classList.toggle("hide");
  return await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables })
  })
  .then(res => res.json());
}

function renderComponents(repos, user) {
  const fragment = document.createDocumentFragment();
  repos.forEach(repo => {
    const article = document.createElement("article");
    article.innerHTML = `
      <h2><a href="https://github.com/${user}/${repo.name}" target="_blank">${repo.name}</a></h2>
      <p>Lorem ipsum dolor sit amet</p>
      <button data-action="start">Move to start</button>
      <button data-action="delete">Delete</button>
    `;
    fragment.appendChild(article);
  });
  document.querySelector("section div").classList.toggle("hide");
  reposContainer.appendChild(fragment);
  const articles = [...document.querySelectorAll("article")];
  manipulateComponents(articles);
}

function manipulateComponents(articles) {
  articles.forEach(article => {
    article.addEventListener("click", function(e) {
      if (e.target.dataset.action) {
        if (e.target.dataset.action === "start") {
          moveElement(this);
        } else {
          removeElement(this);
        }
      }
    });
  });
}

function moveElement(elem) {
  elem.parentNode.insertBefore(elem, document.querySelector("article"));
}

function removeElement(elem) {
  elem.parentNode.removeChild(elem);
}