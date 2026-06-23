const buttons = document.querySelectorAll(".toggle-btn");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const content = button.parentElement.nextElementSibling;
        const icon = button.querySelector("img")
        content.classList.toggle("active");
        icon.classList.toggle("rotated");
    });
});