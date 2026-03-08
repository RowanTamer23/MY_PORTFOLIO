// --- DOM Elements ---
const themeToggle = document.getElementById("theme-toggle");
const projectsWeb = document.getElementById("projects-web");
const projectsMobile = document.getElementById("projects-mobile");
const modal = document.getElementById("project-modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.querySelector(".close-modal");
const mobileMenu = document.querySelector(".mobile-menu");
const hamburger = document.querySelector(".hamburger");

// --- Theme Toggle Logic ---
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  if (theme === "light") {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

themeToggle.addEventListener("click", () => {
  let currentTheme = document.documentElement.getAttribute("data-theme");
  let newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

// --- Mobile Menu ---
hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  hamburger.innerHTML = mobileMenu.classList.contains("active")
    ? '<i class="fas fa-times"></i>'
    : '<i class="fas fa-bars"></i>';
});

function closeMenu() {
  mobileMenu.classList.remove("active");
  hamburger.innerHTML = '<i class="fas fa-bars"></i>';
}

// --- Scroll Reveal Animation ---
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, observerOptions);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// --- GitHub API Integration ---
// async function fetchProjects() {
//   try {
//     // Fetch repositories (increased limit to ensure we have enough for both sections)
//     const response = await fetch(
//       `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`,
//     );
//     const readmeresponse = await fetch(
//       `https://api.github.com/users/${GITHUB_USERNAME}/repos/readme`,
//     );

//     if (!response.ok) throw new Error("GitHub User not found");

//     const data = await response.json();

//     projectsWeb.innerHTML = "";
//     projectsMobile.innerHTML = "";

//     let mobileCount = 0;
//     let webCount = 0;
//     data.forEach((repo, index) => {
//       const card = createProjectCard(repo, index);

//       // Classification Logic
//       // Checks if language is Dart (Flutter) or if topic mentions flutter
//       const isFlutter =
//         repo.language === "Dart" ||
//         (repo.topics &&
//           (repo.topics.includes("flutter") || repo.topics.includes("dart"))) ||
//         repo.name.toLowerCase().includes("flutter") ||
//         repo.name.toLowerCase().includes("dart");

//       const isWeb =
//         (repo.topics &&
//           (repo.topics.toLowerCase().includes("web") ||
//             repo.topics.toLowerCase().includes("HTML") ||
//             repo.topics.toLowerCase().includes("CSS") ||
//             repo.topics.toLowerCase().includes("javascript") ||
//             repo.topics.toLowerCase().includes("typescript"))) ||
//         repo.name.toLowerCase().includes("web") ||
//         repo.name.toLowerCase().includes("javascript") ||
//         repo.name.toLowerCase().includes("typescript");

//       if (isFlutter) {
//         projectsMobile.appendChild(card);
//         mobileCount++;
//       } else if (isWeb) {
//         projectsWeb.appendChild(card);
//         webCount++;
//       }
//       observer.observe(card);
//     });

//     // Empty state handling
//     if (mobileCount === 0) {
//       projectsMobile.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);">No dedicated Flutter repositories found publicly.</p>`;
//     }
//     if (webCount === 0) {
//       projectsWeb.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);">No dedicated Web repositories found publicly.</p>`;
//     }
//   } catch (error) {
//     const errorMsg = `
//                     <div style="grid-column: 1/-1; text-align: center; color: #ff5f56; padding: 20px; background: rgba(255,0,0,0.1); border-radius: 12px;">
//                         <i class="fas fa-exclamation-triangle"></i> Unable to load projects.
//                     </div>
//                 `;
//     projectsWeb.innerHTML = errorMsg;
//     projectsMobile.innerHTML = errorMsg;
//     console.error(error);
//   }
// }

async function loadProjects() {
  try {
    const response = await fetch("./projects.json");

    if (!response.ok) throw new Error("Failed to load projects");

    const projects = await response.json();

    projectsWeb.innerHTML = "";
    projectsMobile.innerHTML = "";

    projects.forEach((project, index) => {
      const card = createProjectCard(project, index);

      if (project.type === "mobile") {
        projectsMobile.appendChild(card);
      } else {
        projectsWeb.appendChild(card);
      }

      observer.observe(card);
    });
  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

function createProjectCard(project, index) {
  const card = document.createElement("div");
  card.classList.add("project-card");
  card.classList.add("reveal");
  card.style.transitionDelay = `${(index % 3) * 100}ms`;

  const hue =
    project.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    360;
  const isFlutter = project.language === "Dart";
  const iconClass = isFlutter ? "fa-mobile-alt" : "fa-laptop-code";

  card.innerHTML = `
                <div class="project-img-container" style="background: linear-gradient(135deg, hsl(${hue}, 60%, 20%), hsl(${hue + 40}, 60%, 10%)); display:flex; align-items:center; justify-content:center;">
                    <i class="fas ${iconClass}" style="font-size:3.5rem; color:rgba(255,255,255,0.2)"></i>
                    <div class="project-overlay">
                        <span class="btn btn-primary" style="padding: 8px 16px; font-size: 0.8rem;">View Details</span>
                    </div>
                </div>
                <div class="project-info">
                    <h3 class="project-title">${project.name.replace(/-/g, " ")}</h3>
                    <p class="project-desc">${project.description ? (project.description.length > 80 ? project.description.substring(0, 80) + "..." : project.description) : "Project built with " + (project.language || "code") + "."}</p>
                    <div class="project-meta">
                        <span class="project-tech"><i class="fas fa-circle" style="font-size: 8px;"></i> ${project.language || "Code"}</span>
                        <div class="project-stats">
                            <span><i class="far fa-star"></i> ${project.stargazers_count}</span>
                            <span><i class="fas fa-code-branch"></i> ${project.forks_count}</span>
                        </div>
                    </div>
                </div>
            `;

  card.addEventListener("click", () => openModal(project, hue));
  return card;
}

// --- Modal Logic ---
function openModal(project, hue) {
  modal.classList.add("open");
  document.body.style.overflow = "hidden"; // Prevent scrolling

  const createdDate = new Date(project.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const updatedDate = new Date(project.updated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  modalBody.innerHTML = `
                <div class="modal-header">
                    <h2 class="modal-title">${project.name}</h2>
                    <div class="modal-meta">
                        <span><i class="fas fa-code"></i> ${project.language || "N/A"}</span>
                        <span><i class="far fa-star"></i> ${project.stargazers_count} Stars</span>
                        <span><i class="fas fa-history"></i> Updated ${updatedDate}</span>
                    </div>
                </div>
                
                <div style="background: linear-gradient(135deg, hsl(${hue}, 60%, 20%), hsl(${hue + 40}, 60%, 10%)); padding: 40px; border-radius: 12px; margin-bottom: 30px; display: flex; align-items: center; justify-content: center;">
                     <i class="fas fa-laptop-code" style="font-size: 5rem; color: rgba(255,255,255,0.2);"></i>
                </div>

                <div class="modal-body-text">
                    <p>${project.description || "No description provided for this repository."}</p>
                    <p style="margin-top: 15px;">This project is open source and available on GitHub. It demonstrates modern development practices and clean code architecture.</p>
                </div>

                <div class="modal-actions">
                    <a href="${project.html_url}" target="_blank" class="btn btn-primary">
                        View Code <i class="fab fa-github"></i>
                    </a>
                    ${
                      project.homepage
                        ? `
                        <a href="${project.homepage}" target="_blank" class="btn btn-secondary">
                            Live Demo <i class="fas fa-external-link-alt"></i>
                        </a>
                    `
                        : ""
                    }
                </div>
            `;
}

function closeModalFunc() {
  modal.classList.remove("open");
  document.body.style.overflow = "auto"; // Restore scrolling
}

closeModal.addEventListener("click", closeModalFunc);

window.addEventListener("click", (e) => {
  if (e.target == modal) {
    closeModalFunc();
  }
});

// Send Email

// (function () {
//   emailjs.init("5QuNJT6JmgAADkXp8"); // replace with your EmailJS user ID
// })();

// document
//   .getElementById("contact-form")
//   .addEventListener("submit", function (event) {
//     event.preventDefault();

//     emailjs
//       .send("service_x1grtje", "template_xti489r", {
//         from_name: this.from_name.value,
//         from_email: this.from_email.value,
//         message: this.message.value,
//         to_email: "rowan.tamer232001@gmail.com",
//       })
//       .then(
//         function (response) {
//           alert("Message sent successfully!");
//           document.getElementById("contact-form").reset();
//         },
//         function (error) {
//           alert("Failed to send message. Please try again later.");
//           console.error(error);
//         },
//       );
//   });

document.addEventListener("DOMContentLoaded", () => {
  emailjs.init("5QuNJT6JmgAADkXp8");

  document
    .getElementById("contact-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      emailjs
        .send("service_x1grtje", "template_xti489r", {
          from_name: this.name.value,
          from_email: this.email.value,
          message: this.message.value,
        })
        .then(() => {
          alert("Message sent!");
          this.reset();
        })
        .catch(console.error);
    });
});

// Initialize
initTheme();
loadProjects();
// fetchProjects();
