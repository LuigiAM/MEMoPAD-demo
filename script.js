// This function will run once the entire HTML document has been loaded.
document.addEventListener('DOMContentLoaded', () => {

    // --- State Variable ---
    let currentPatientId = null;

    // --- Get references to the main views ---
    const patientListView = document.getElementById('patient-list-view');
    const patientDetailView = document.getElementById('patient-detail-view');

    // --- Get references to interactive elements ---
    const patientRows = document.querySelectorAll('.patient-row');
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const backButton = document.getElementById('back-to-dashboard');
    const patientNameHeader = document.querySelector('#patient-detail-view h2');

    // --- Get references for the Data & Insights Tab ---
    const monthlyView = document.getElementById('monthly-view');
    const weeklyView = document.getElementById('weekly-view');
    const dailyView = document.getElementById('daily-view');
    const calendarDays = document.querySelectorAll('.calendar-day');
    const weeklyStatsButtons = document.querySelectorAll('#monthly-view .col-span-7 > button');
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
     * @param {string} patientName - The name of the patient clicked.
     */
    function showPatientDetail(patientName) {
        currentPatientId = patientName.toLowerCase().replace(' ', '-');
        
        if (patientNameHeader) {
            patientNameHeader.textContent = `Patient: ${patientName}`;
        }
        
        if (patientListView) patientListView.classList.add('hidden');
        // FIX: This line was incorrectly adding 'hidden'. It should remove it.
        if (patientDetailView) patientDetailView.classList.remove('hidden'); 
        
        // Reset to the first tab ('Data & Insights') when showing a new patient
        if (tabs.length > 0) {
            handleTabClick(tabs[0], 0); 
        }
    }

    /**
     * Function to switch back to the Patient List View.
     */
    function showPatientList() {
        if (patientListView) patientListView.classList.remove('hidden');
        if (patientDetailView) patientDetailView.classList.add('hidden');
        currentPatientId = null; // Reset the current patient
    }

    /**
     * Handles the logic for clicking a tab.
     * @param {HTMLElement} clickedTab - The tab element that was clicked.
     * @param {number} index - The index of the clicked tab.
     */
    function handleTabClick(clickedTab, index) {
        // Style the tabs and manage ARIA attributes
        tabs.forEach((tab, i) => {
            const isActive = (i === index);
            tab.classList.toggle('border-powder-blue', isActive);
            tab.classList.toggle('text-delft-blue', isActive);
            tab.classList.toggle('font-bold', isActive);
            
            tab.classList.toggle('border-transparent', !isActive);
            tab.classList.toggle('text-gray-500', !isActive);
            tab.classList.toggle('hover:text-gray-700', !isActive);
            tab.classList.toggle('hover:border-gray-300', !isActive);
            tab.classList.toggle('font-medium', !isActive);

            tab.setAttribute('aria-selected', isActive);
        });

        // Show the correct content panel
        tabContents.forEach((content, i) => {
            const isActive = (i === index);
            content.classList.toggle('hidden', !isActive);
        });
        
        // Special logic for Data & Insights tab to reset its view
        if (tabContents[index] && tabContents[index].id === 'data-insights-content') {
            showMonthlyView();
        }
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
            baseBreadcrumbLink.textContent = 'Monthly View';
            baseBreadcrumbLink.onclick = (e) => { e.preventDefault(); showMonthlyView(); };
        }

        if (week) {
            addBreadcrumbSeparator();
            const weekLink = addBreadcrumbLink(week, () => showWeeklyView(week));
            if (day) {
                addBreadcrumbSeparator();
                addBreadcrumbLink(`Day ${day}`, null, true);
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
        // Handle mouse click
        row.addEventListener('click', () => {
            const patientName = row.querySelector('td').textContent.trim();
            showPatientDetail(patientName);
        });

        // Handle keyboard interaction for accessibility
        row.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // Prevent spacebar from scrolling the page
                const patientName = row.querySelector('td').textContent.trim();
                showPatientDetail(patientName);
            }
        });
    });

    // 2. Back to Dashboard Button
    if (backButton) {
        backButton.addEventListener('click', showPatientList);
    }

    // 3. Tab Switching
    tabs.forEach((clickedTab, index) => {
        clickedTab.addEventListener('click', (event) => {
            event.preventDefault();
            handleTabClick(clickedTab, index);
        });
    });

    // 4. Calendar Day Clicks
    calendarDays.forEach(dayElement => {
        dayElement.addEventListener('click', () => {
            const dayNumber = dayElement.dataset.day;
            const weekName = dayElement.dataset.weekName;
            showDailyView(weekName, dayNumber);
        });
    });

    // 5. Weekly Statistics Button Clicks
    weeklyStatsButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const weekName = button.textContent.replace('Display statistics for ', '');
            showWeeklyView(weekName);
        });
    });

    // 6. Expand/Collapse Correlations Card
    if (expandCorrelationsButton) {
        expandCorrelationsButton.addEventListener('click', () => {
            const isExpanded = expandCorrelationsButton.getAttribute('aria-expanded') === 'true';
            expandCorrelationsButton.setAttribute('aria-expanded', !isExpanded);
            if(correlationsContent) correlationsContent.classList.toggle('hidden');
            if(expandIcon) expandIcon.classList.toggle('rotate-180');
        });
    }
    
    // Initialize the breadcrumb on page load
    updateBreadcrumb();

});
