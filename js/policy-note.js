document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("policyPopup");
    const link = document.getElementById("policy-link");
    const closeBtn = document.querySelector(".policy-close");
    const popupContent = document.querySelector(".policy-popup-content");

    function openPopup() {
        popup.style.display = "flex";
        document.body.classList.add("noscroll");
        document.documentElement.classList.add("noscroll");
    }

    function closePopup() {
        popup.style.display = "none";
        document.body.classList.remove("noscroll");
        document.documentElement.classList.remove("noscroll");
    }

    link.addEventListener("click", function (e) {
        e.preventDefault();
        openPopup();
    });

    closeBtn.addEventListener("click", closePopup);

    // Chỉ đóng popup khi click ra ngoài nội dung
    popup.addEventListener("click", function (event) {
        if (!popupContent.contains(event.target)) {
            closePopup();
        }
    });
});
