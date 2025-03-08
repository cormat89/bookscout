"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const inputBox = document.getElementById("input-box");
  const resultBox = document.querySelector(".result-box");
  let debounceTimer;

  inputBox.addEventListener("input", function (event) {
    clearTimeout(debounceTimer); // Pulisce il timer precedente
    const query = event.target.value.trim();

    if (query.length > 2) {
      debounceTimer = setTimeout(() => {
        fetchResults(query);
      }, 300); // Ritardo di 300ms per ridurre le chiamate API
    } else {
      resultBox.innerHTML = ""; // Pulisce i risultati se la query è troppo corta
    }
  });

  function fetchResults(query) {
    fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
      .then((response) => {
        if (!response.ok) throw new Error("Errore nella risposta del server");
        return response.json();
      })
      .then((data) => {
        resultBox.innerHTML = "";
        const ul = document.createElement("ul");

        if (data.docs && data.docs.length > 0) {
          data.docs.slice(0, 10).forEach((doc) => {
            const li = document.createElement("li");
            li.textContent = doc.title;

            if (doc.first_publish_year) {
              const yearSpan = document.createElement("span");
              yearSpan.className = "year";
              yearSpan.textContent = ` (${doc.first_publish_year})`;
              li.appendChild(yearSpan);
            }

            if (doc.author_name && doc.author_name.length > 0) {
              const authorSpan = document.createElement("span");
              authorSpan.className = "author";
              authorSpan.textContent = ` - ${doc.author_name.join(", ")}`;
              li.appendChild(authorSpan);
            }

            ul.appendChild(li);
          });
        } else {
          ul.innerHTML = "<li>Nessun risultato trovato.</li>";
        }

        resultBox.appendChild(ul);
      })
      .catch((error) => {
        console.error("Errore durante la richiesta:", error);
        resultBox.innerHTML =
          "<ul><li>Si è verificato un errore durante la ricerca.</li></ul>";
      });
  }
});
