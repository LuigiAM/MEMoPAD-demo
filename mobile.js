document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const hamburgerButton = document.getElementById('hamburger-button');
    const mobileOverlay = document.getElementById('mobile-overlay');

    // Function to open the sidebar
    const openSidebar = () => {
        if (sidebar) sidebar.classList.remove('-translate-x-full');
        if (mobileOverlay) mobileOverlay.classList.remove('hidden');
    };

    // Function to close the sidebar
    const closeSidebar = () => {
        if (sidebar) sidebar.classList.add('-translate-x-full');
        if (mobileOverlay) mobileOverlay.classList.add('hidden');
    };

    // Event listener for the hamburger button
    if (hamburgerButton) {
        hamburgerButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the click from bubbling up
            openSidebar();
        });
    }

    // Event listener for the overlay to close the sidebar
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeSidebar);
    }
});
