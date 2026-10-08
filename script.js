const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

let notes = JSON.parse(localStorage.getItem("quicknotes")) || [];

/* Save notes to localStorage */
function saveNotes() {
  localStorage.setItem("quicknotes", JSON.stringify(notes));
}

/* Update note count */
function updateCount() {
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }
}

/* Get CSS class for category */
function getCategoryClass(category) {
  return `category-${category.toLowerCase()}`;
}

/* Render notes */
function render() {
  notesList.textContent = "";

  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchTerm)
  );

  if (filteredNotes.length === 0 && searchTerm !== "") {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = "No notes match your search.";
    notesList.appendChild(emptyMessage);
  }

  filteredNotes.forEach((note) => {
    const noteItem = document.createElement("li");
    noteItem.className = `note-card ${getCategoryClass(note.category)}`;

    const noteText = document.createElement("p");
    noteText.textContent = note.text;

    const meta = document.createElement("div");
    meta.className = "note-meta";

    const categoryLabel = document.createElement("span");
    categoryLabel.className = "category-label";
    categoryLabel.textContent = note.category;

    const date = document.createElement("small");
    date.textContent = note.createdAt;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      notes = notes.filter((item) => item.id !== note.id);
      saveNotes();
      render();
    });

    const details = document.createElement("div");
    details.appendChild(categoryLabel);
    details.appendChild(date);

    meta.appendChild(details);
    meta.appendChild(deleteButton);

    noteItem.appendChild(noteText);
    noteItem.appendChild(meta);

    notesList.appendChild(noteItem);
  });

  updateCount();
}

/* Add a new note */
noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = noteInput.value.trim();

  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  const newNote = {
    id: Date.now(),
    text: text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString()
  };

  notes.push(newNote);

  saveNotes();
  render();

  noteInput.value = "";
  errorMessage.textContent = "";
  noteInput.focus();
});

/* Search */
searchInput.addEventListener("input", render);

/* Initial render */
render();