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

    // --- Get references for the Data & Insights Tab ---
    const monthlyView = document.getElementById('monthly-view');
    const weeklyView = document.getElementById('weekly-view');
    const dailyView = document.getElementById('daily-view');
    const calendarDays = document.querySelectorAll('#monthly-view .grid > div[class*="bg-"]');
    const weeklyStatsButtons = document.querySelectorAll('#monthly-view button.w-full'); // More specific selector
    const breadcrumbOl = document.getElementById('breadcrumb')?.querySelector('ol');
    
    // --- Get references for the expandable correlations card ---
    const expandCorrelationsButton = document.getElementById('expand-correlations');
    const correlationsContent = document.getElementById('correlations-content');
    const expandIcon = expandCorrelationsButton?.querySelector('svg');

    /**
     * Hides all insight views (monthly, weekly, daily).
     */
    function hideAllInsightViews() {
        if (monthlyView) monthlyView.classList.add('hidden');
        if (weeklyView) weeklyView.classList.add('hidden');
        if (dailyView) dailyView.classList.add('hidden');
    }
    
    /**
     * Shows the monthly calendar view and resets breadcrumbs.
     */
    function showMonthlyView() {
        hideAllInsightViews();
        if (monthlyView) monthlyView.classList.remove('hidden');
        updateBreadcrumb(); 
    }
    
    /**
     * Shows the weekly view for a specific week.
     * @param {string} weekName - The name of the week to display.
     */
    function showWeeklyView(weekName) {
        hideAllInsightViews();
        if (weeklyView) weeklyView.classList.remove('hidden');
        updateBreadcrumb(weekName);
    }
    
    /**
     * Shows the daily view for a specific day.
     * @param {string} weekName - The parent week of the day.
     * @param {string} day - The day number that was clicked.
     */
    function showDailyView(weekName, day) {
        hideAllInsightViews();
        if (dailyView) dailyView.classList.remove('hidden');
        updateBreadcrumb(weekName, day);
    }

    /**
     * Function to switch to the Patient Detail View.
     */
    function showPatientDetail() {
        if (patientListView) patientListView.classList.add('hidden');
        if (patientDetailView) patientDetailView.classList.remove('hidden');
        showMonthlyView(); // Default to monthly view when a new patient is selected
    }

    /**
     * Function to switch back to the Patient List View.
     */
    function showPatientList() {
        if (patientListView) patientListView.classList.remove('hidden');
        if (patientDetailView) patientDetailView.classList.add('hidden');
    }


    /**
     * Dynamically updates the breadcrumb trail.
     * @param {string|null} week - The selected week.
     * @param {string|null} day - The selected day.
     */
    function updateBreadcrumb(week = null, day = null) {
        if (!breadcrumbOl) return;
        // Clear existing breadcrumbs beyond the base one
        while (breadcrumbOl.children.length > 1) {
            breadcrumbOl.removeChild(breadcrumbOl.lastChild);
        }

        const baseBreadcrumbLink = document.getElementById('breadcrumb-base');
        if (baseBreadcrumbLink) {
            baseBreadcrumbLink.textContent = 'Monthly View'; // Reset base text
            baseBreadcrumbLink.onclick = (e) => { e.preventDefault(); showMonthlyView(); };
        }

        if (week) {
            addBreadcrumbSeparator();
            const weekLink = addBreadcrumbLink(week, () => showWeeklyView(week));
            if (day) {
                addBreadcrumbSeparator();
                addBreadcrumbLink(`Day ${day}`, null, true); // This is the current page
            } else {
                if (weekLink) {
                   weekLink.classList.add('text-delft-blue', 'font-bold');
                   weekLink.classList.remove('text-gray-700');
                }
            }
        }
    }
    
    function addBreadcrumbSeparator() {
        const separatorLi = document.createElement('li');
        separatorLi.innerHTML = `<div class="flex items-center"><svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg></div>`;
        if (breadcrumbOl) breadcrumbOl.appendChild(separatorLi);
    }

    function addBreadcrumbLink(text, onClick, isCurrent = false) {
        const li = document.createElement('li');
        if (isCurrent) {
            li.setAttribute('aria-current', 'page');
            li.innerHTML = `<span class="text-sm font-bold text-delft-blue">${text}</span>`;
        } else {
            const a = document.createElement('a');
            a.href = '#';
            a.className = 'text-sm font-medium text-gray-700 hover:text-powder-blue';
            a.textContent = text;
            a.onclick = (e) => { e.preventDefault(); onClick(); };
            li.appendChild(a);
        }
        if (breadcrumbOl) breadcrumbOl.appendChild(li);
        return li.querySelector('a') || li.querySelector('span');
    }


    // --- Add Event Listeners ---
    
    // 1. Patient List Clicks
    patientRows.forEach(row => {
        row.addEventListener('click', showPatientDetail);
    });

    // 2. Back to Dashboard Button
    if (backButton) {
        backButton.addEventListener('click', showPatientList);
    }

    // 3. Tab Switching
    tabs.forEach((clickedTab, index) => {
        clickedTab.addEventListener('click', (event) => {
            event.preventDefault();
            tabs.forEach(tab => {
                tab.classList.remove('border-powder-blue', 'text-delft-blue', 'font-bold');
                tab.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300', 'font-medium');
            });
            clickedTab.classList.add('border-powder-blue', 'text-delft-blue', 'font-bold');
            tabContents.forEach(content => content.classList.add('hidden'));
            if (tabContents[index]) {
                tabContents[index].classList.remove('hidden');
                // When switching to the Data & Insights tab, always default to the monthly view
                if (tabContents[index].id === 'data-insights-content') {
                    showMonthlyView();
                }
            }
        });
    });

    // 4. Calendar Day Clicks
    calendarDays.forEach(dayElement => {
        dayElement.addEventListener('click', () => {
            const dayNumber = dayElement.innerText.trim();
            // For this demo, we'll find which week this day belongs to
            let weekName = 'Selected Week';
            let parent = dayElement.parentElement;
            while(parent) {
                const weekButton = parent.previousElementSibling;
                if(weekButton && weekButton.matches('.col-span-7 > button')) {
                    weekName = weekButton.textContent.replace('Display statistics for ', '');
                    break;
                }
                parent = parent.previousElementSibling;
            }
            showDailyView(weekName, dayNumber);
        });
    });

    // 5. Weekly Statistics Button Clicks
    weeklyStatsButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // For this demo, we'll just use the index to name the week
            showWeeklyView(`Week ${index + 1} of July`);
        });
    });

    // 6. Expand/Collapse Correlations Card
    if (expandCorrelationsButton) {
        expandCorrelationsButton.addEventListener('click', () => {
            if(correlationsContent) correlationsContent.classList.toggle('hidden');
            if(expandIcon) expandIcon.classList.toggle('rotate-180');
        });
    }
    
    // Initialize the breadcrumb on page load
    updateBreadcrumb();

});
