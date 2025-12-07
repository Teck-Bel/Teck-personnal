document.addEventListener("DOMContentLoaded", function () {
  fetch("/Teck-personnal/includes/header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header-placeholder").innerHTML = data;

      // Titel uit <body data-title="...">
      const title = document.body.dataset.title;
      const titleElement = document.getElementById("page-title");
      if (title && titleElement) {
        titleElement.textContent = title;
      }

      // Logo uit <body data-logo="...">
      const logoSrc = document.body.dataset.logo;
      const logoElement = document.getElementById("site-logo");
      if (logoSrc && logoElement) {
        logoElement.src = logoSrc;
      }

      // Belangrijk: event uitsturen dat de header klaar is
      document.dispatchEvent(new Event("headerLoaded"));
    });
});
