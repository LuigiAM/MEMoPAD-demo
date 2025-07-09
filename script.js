// This function will run once the entire HTML document has been loaded.
document.addEventListener('DOMContentLoaded', () => {

    // --- Get references to the main views ---
    const patientListView = document.getElementById('patient-list-view');
    const patientDetailView = document.getElementById('patient-detail-view');

    // --- Get references to the interactive elements ---
    const patientRows = document.querySelectorAll('#patient-list-view tbody tr');
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const backButton = document.getElementById('back-to-dashboard');
    
    /**
     * Function to switch to the Patient Detail View.
     * It hides the list and shows the detail view.
     */
    function showPatientDetail() {
        patientListView.classList.add('hidden');
        patientDetailView.classList.remove('hidden');
    }

    /**
     * Function to switch back to the Patient List View.
     * It shows the list and hides the detail view.
     */
    function showPatientList() {
        patientListView.classList.remove('hidden');
        patientDetailView.classList.add('hidden');
    }

    // --- Add Event Listeners ---

    // 1. Add a click listener to each patient row in the table.
    patientRows.forEach(row => {
        row.addEventListener('click', () => {
            // When a row is clicked, show the detail view.
            // In a real app, you would also pass the specific patient's data here.
            showPatientDetail();
        });
    });

    // 2. Add a click listener for the "Back to Dashboard" button.
    if (backButton) {
        backButton.addEventListener('click', showPatientList);
    }

    // 3. Add a click listener to each tab to handle tab switching.
    tabs.forEach((clickedTab, index) => {
        clickedTab.addEventListener('click', (event) => {
            // Prevent the link from trying to navigate to a new page
            event.preventDefault(); 

            // First, remove the "active" styles from all tabs
            tabs.forEach(tab => {
                tab.classList.remove('border-powder-blue', 'text-delft-blue', 'font-bold');
                tab.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300', 'font-medium');
            });

            // Then, add the "active" styles only to the tab that was clicked
            clickedTab.classList.add('border-powder-blue', 'text-delft-blue', 'font-bold');
            clickedTab.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300', 'font-medium');

            // Now, hide all tab content panels
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });

            // And finally, show only the content panel that corresponds to the clicked tab
            if (tabContents[index]) {
                tabContents[index].classList.remove('hidden');
            }
        });
    });

});
