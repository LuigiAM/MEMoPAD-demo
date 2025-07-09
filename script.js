// This function will run once the entire HTML document has been loaded.
document.addEventListener('DOMContentLoaded', () => {

    // --- Get references to the main views ---
    // This finds the HTML element with the ID 'patient-list-view'
    const patientListView = document.getElementById('patient-list-view');
    // This finds the HTML element with the ID 'patient-detail-view'
    const patientDetailView = document.getElementById('patient-detail-view');

    // --- Get references to the interactive elements ---
    // This finds all the patient rows in the table that can be clicked
    const patientRows = document.querySelectorAll('tbody tr');
    // This finds all the navigation tabs in the patient detail view
    const tabs = document.querySelectorAll('#patient-detail-view nav a');
    // This is a placeholder for the tab content panels. We will add these later.
    // For now, we'll just manipulate the active state of the tabs themselves.
    
    /**
     * Function to switch to the Patient Detail View.
     * It hides the list and shows the detail view.
     */
    function showPatientDetail() {
        patientListView.classList.add('hidden'); // Add the 'hidden' class to hide the list
        patientDetailView.classList.remove('hidden'); // Remove the 'hidden' class to show the details
    }

    /**
     * Function to switch back to the Patient List View.
     * It shows the list and hides the detail view.
     * Note: We will need to add a "Back" button to the HTML to trigger this.
     */
    function showPatientList() {
        patientListView.classList.remove('hidden'); // Remove the 'hidden' class to show the list
        patientDetailView.classList.add('hidden'); // Add the 'hidden' class to hide the details
    }

    // --- Add Event Listeners ---

    // 1. Add a click listener to each patient row in the table.
    patientRows.forEach(row => {
        row.addEventListener('click', () => {
            // When a row is clicked, we call the function to show the detail view.
            // In a real app, you would also pass the specific patient's data here.
            showPatientDetail();
        });
    });

    // 2. Add a click listener to each tab in the detail view.
    tabs.forEach(clickedTab => {
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

            // In a real app, you would also show the corresponding content panel here.
            // For this prototype, we are just updating the visual style of the tab.
        });
    });

    // We would add a listener for a "Back" button here once it's added to the HTML.
    // Example:
    // const backButton = document.getElementById('back-to-dashboard');
    // backButton.addEventListener('click', showPatientList);

});
