const STORAGE_KEY = "smurfcat-notes";

let biggestIndex = 1;

window.onload = function () {
  const win = document.getElementById("window");
  const notes = document.getElementById("notes");
  const clicker = document.getElementById("clicker");

  centerWindow(win);

  dragElement(win);
  dragElement(notes);
  dragElement(clicker);

  setupWindows();
  setupNotes();
  setupClicker();
};

function centerWindow(el) {
  if (!el) return;

  el.style.position = "absolute";
  el.style.left =
    (window.innerWidth - el.offsetWidth) / 2 + "px";
  el.style.top =
    (window.innerHeight - el.offsetHeight) / 2 + "px";
}

function dragElement(element) {
  if (!element) return;

  let startX = 0;
  let startY = 0;

  const header =
    document.getElementById(element.id + "header");

  const dragTarget = header || element;

  dragTarget.onmousedown = startDragging;

  function startDragging(e) {
    e.preventDefault();

    startX = e.clientX;
    startY = e.clientY;

    bringToFront(element);

    document.onmousemove = dragMove;
    document.onmouseup = stopDragging;
  }

  function dragMove(e) {
    e.preventDefault();

    const dx = startX - e.clientX;
    const dy = startY - e.clientY;

    startX = e.clientX;
    startY = e.clientY;

    element.style.left =
      element.offsetLeft - dx + "px";
    element.style.top =
      element.offsetTop - dy + "px";
  }

  function stopDragging() {
    document.onmousemove = null;
    document.onmouseup = null;
  }
}

function bringToFront(el) {
  biggestIndex++;
  el.style.zIndex = biggestIndex;
}

function openWindow(el) {
  if (!el) return;

  el.style.display = "block";

  bringToFront(el);

  centerWindow(el);
}

function closeWindow(el) {
  if (!el) return;
  el.style.display = "none";
}

function setupWindows() {
  const welcome = document.getElementById("window");
  const notes = document.getElementById("notes");

  const welcomeOpen =
    document.getElementById("welcomeopen");
  const welcomeClose =
    document.getElementById("welcomeclose");

  const notesClose =
    document.getElementById("notesclose");

  const notebookIcon =
    document.getElementById("notebookIcon");

  welcomeOpen?.addEventListener("click", () => {
    openWindow(welcome);
  });

  welcomeClose?.addEventListener("click", () => {
    closeWindow(welcome);
  });

  welcome?.addEventListener("mousedown", () => {
    bringToFront(welcome);
  });

  notebookIcon?.addEventListener("click", () => {
     notebookIcon.classList.add("selected");
    openWindow(notes);
  });

  notesClose?.addEventListener("click", () => {
    notebookIcon.classList.remove("selected");
    closeWindow(notes);
  });

  notes?.addEventListener("mousedown", () => {
    bringToFront(notes);
  });
}

function setupClicker() {
  const clicker = document.getElementById("clicker");
  const icon = document.getElementById("clickerIcon");
  const close = document.getElementById("clickerclose");

  const btn = document.getElementById("clickBtn");
  const countEl = document.getElementById("clickCount");

  let count = Number(localStorage.getItem("smurfcat-clicks")) || 0;

  if (countEl) {
    countEl.textContent = count;
  }

  icon?.addEventListener("click", () => {
    icon.classList.add("selected");
    openWindow(clicker);
  });

  close?.addEventListener("click", () => {
    icon.classList.remove("selected");
    closeWindow(clicker);
  });

  clicker?.addEventListener("mousedown", () => {
    bringToFront(clicker);
  });

  btn?.addEventListener("click", () => {
    count++;
    countEl.textContent = count;

    localStorage.setItem("smurfcat-clicks", count);
  });
}

function setupNotes() {
  const editor = document.getElementById("editorContent");
  const dateEl = document.getElementById("notebookDate");

  if (!editor) {
    console.log("No editor found");
    return;
  }

  const saved = localStorage.getItem("smurfcat-notes");
  if (saved) {
    editor.innerHTML = saved;
  }

  editor.addEventListener("input", () => {
    console.log("saving...");
    localStorage.setItem("smurfcat-notes", editor.innerHTML);

    if (dateEl) {
      const now = new Date().toLocaleString();
      dateEl.textContent = "Last edited: " + now;
      localStorage.setItem("smurfcat-last", now);
    }
  });

  const last = localStorage.getItem("smurfcat-last");
  if (last && dateEl) {
    dateEl.textContent = "Last edited: " + last;
  }
}
