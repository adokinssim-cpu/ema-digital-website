/* =========================================
   EMA DIGITAL — JAVASCRIPT
   ========================================= */


/* ---------- SÉLECTION DES ÉLÉMENTS ---------- */

const slides = Array.from(document.querySelectorAll(".slide"));

const dots = Array.from(document.querySelectorAll(".dot"));

const previousButton = document.querySelector(".carousel-arrow.prev");

const nextButton = document.querySelector(".carousel-arrow.next");

const hero = document.querySelector(".hero");

const menuToggle = document.getElementById("menu-toggle");

const navigation = document.getElementById("navigation");

const navLinks = document.querySelectorAll(".nav-link");

const header = document.getElementById("header");

const contactForm = document.getElementById("contact-form");

const formStatus = document.getElementById("form-status");

const currentYear = document.getElementById("current-year");


/* ---------- ANNÉE AUTOMATIQUE ---------- */

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* =========================================
   CARROUSEL D'IMAGES
   ========================================= */

let currentSlide = 0;

let carouselInterval = null;

const carouselDelay = 5000;


/*
 * Affiche une diapositive précise.
 * Toutes les autres deviennent invisibles.
 */

function showSlide(index) {

    if (slides.length === 0) {
        return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, position) => {

        const isActive = position === currentSlide;

        slide.classList.toggle("active", isActive);

        slide.setAttribute("aria-hidden", String(!isActive));

    });


    dots.forEach((dot, position) => {

        const isActive = position === currentSlide;

        dot.classList.toggle("active", isActive);

        dot.setAttribute("aria-pressed", String(isActive));

    });

}


/*
 * Passe à la photo suivante.
 */

function nextSlide() {

    showSlide(currentSlide + 1);

}


/*
 * Revient à la photo précédente.
 */

function previousSlide() {

    showSlide(currentSlide - 1);

}


/*
 * Arrête le défilement automatique.
 */

function stopCarousel() {

    if (carouselInterval !== null) {

        clearInterval(carouselInterval);

        carouselInterval = null;

    }

}


/*
 * Lance le défilement automatique.
 */

function startCarousel() {

    stopCarousel();

    if (slides.length < 2) {
        return;
    }

    carouselInterval = setInterval(() => {

        nextSlide();

    }, carouselDelay);

}


/*
 * Réinitialise le délai après une action manuelle.
 */

function restartCarousel() {

    startCarousel();

}


/* Bouton suivant */

if (nextButton) {

    nextButton.addEventListener("click", () => {

        nextSlide();

        restartCarousel();

    });

}


/* Bouton précédent */

if (previousButton) {

    previousButton.addEventListener("click", () => {

        previousSlide();

        restartCarousel();

    });

}


/* Points de navigation */

dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        showSlide(index);

        restartCarousel();

    });

});


/*
 * Met le carrousel en pause quand la souris
 * est sur la zone d'accueil.
 */

if (hero) {

    hero.addEventListener("mouseenter", stopCarousel);

    hero.addEventListener("mouseleave", startCarousel);

}


/*
 * Respecte la préférence de réduction des animations.
 */

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

if (!reducedMotion.matches) {

    startCarousel();

}


/* Actualise le comportement si la préférence change. */

reducedMotion.addEventListener("change", (event) => {

    if (event.matches) {

        stopCarousel();

    } else {

        startCarousel();

    }

});


/* Affiche correctement la première photo. */

showSlide(0);


/* =========================================
   MENU MOBILE
   ========================================= */


/*
 * Ouvre ou ferme le menu sur téléphone.
 */

if (menuToggle && navigation) {

    menuToggle.addEventListener("click", () => {

        const isOpen = navigation.classList.toggle("open");

        menuToggle.classList.toggle("open", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Fermer le menu" : "Ouvrir le menu"
        );

    });

}


/*
 * Ferme le menu après le clic sur un lien.
 */

navLinks.forEach((link) => {

    link.addEventListener("click", () => {

        if (navigation) {
            navigation.classList.remove("open");
        }

        if (menuToggle) {

            menuToggle.classList.remove("open");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.setAttribute(
                "aria-label",
                "Ouvrir le menu"
            );

        }

    });

});


/*
 * Ferme le menu si l'utilisateur clique
 * en dehors de celui-ci.
 */

document.addEventListener("click", (event) => {

    if (!navigation || !menuToggle) {
        return;
    }

    const clickedInsideMenu = navigation.contains(event.target);

    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {

        navigation.classList.remove("open");

        menuToggle.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.setAttribute(
            "aria-label",
            "Ouvrir le menu"
        );

    }

});


/* =========================================
   OMBRE DE L'EN-TÊTE
   ========================================= */

function updateHeader() {

    if (!header) {
        return;
    }

    header.classList.toggle(
        "scrolled",
        window.scrollY > 20
    );

}

window.addEventListener("scroll", updateHeader, {
    passive: true
});

updateHeader();


/* =========================================
   LIEN ACTIF DU MENU
   ========================================= */

const observedSections = document.querySelectorAll(
    "main section[id]"
);

if ("IntersectionObserver" in window) {

    const sectionObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                const sectionId = entry.target.id;

                navLinks.forEach((link) => {

                    const isActive =
                        link.getAttribute("href") === `#${sectionId}`;

                    link.classList.toggle("active", isActive);

                });

            });

        },
        {
            rootMargin: "-30% 0px -60% 0px"
        }
    );

    observedSections.forEach((section) => {

        sectionObserver.observe(section);

    });

}


/* =========================================
   FORMULAIRE DE CONTACT
   ========================================= */


/*
 * Cette version ne stocke pas les messages sur un serveur.
 * Elle prépare un courriel dans l'application de messagerie
 * installée sur l'appareil.
 *
 * Remplace l'adresse ci-dessous par ton adresse
 * professionnelle avant de publier le site.
 */

const businessEmail = "ema.digital.marc@gmail.com";


if (contactForm) {

    contactForm.addEventListener("submit", (event) => {

        event.preventDefault();


        if (!contactForm.reportValidity()) {
            return;
        }


        const name = document.getElementById("name").value.trim();

        const email = document.getElementById("email").value.trim();

        const subject = document.getElementById("subject").value;

        const message = document.getElementById("message").value.trim();


        const subjectLabels = {

            energie: "Demande concernant les énergies renouvelables",

            digital: "Demande concernant les solutions digitales",

            iot: "Demande concernant l'IoT et l'énergie intelligente",

            autre: "Demande d'information"

        };


        const emailSubject = subjectLabels[subject] || "Contact EMA Digital";


        const emailBody = [
            "Bonjour EMA Digital,",
            "",
            "Nom : " + name,
            "Courriel : " + email,
            "",
            "Message :",
            message,
            "",
            "Envoyé depuis le site EMA Digital."
        ].join("\n");


        const mailtoLink =
            "mailto:" + businessEmail +
            "?subject=" + encodeURIComponent(emailSubject) +
            "&body=" + encodeURIComponent(emailBody);


        if (formStatus) {

            formStatus.textContent =
                "Ouverture de votre application de messagerie...";

        }


        window.location.href = mailtoLink;


        /*
         * Le formulaire ne peut pas confirmer l'envoi réel.
         * Le visiteur doit vérifier et envoyer le courriel
         * depuis son application de messagerie.
         */

    });

}


/* =========================================
   FIN DU SCRIPT
   ========================================= */