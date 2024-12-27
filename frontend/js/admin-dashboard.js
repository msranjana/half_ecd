/*document.addEventListener('DOMContentLoaded', () => {
    // Fetch system overview data (Total Children and Upcoming Vaccinations)
    fetch('http://localhost:3000/admin/overview')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch overview data: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Overview data received:', data);
            if (typeof data.totalChildren !== 'number' || typeof data.upcomingVaccinations !== 'number') {
                throw new Error('Invalid overview data received');
            }
            document.getElementById('children-count').innerText = data.totalChildren || 0;
            document.getElementById('upcoming-vaccinations').innerText = data.upcomingVaccinations || 0;
        })
        .catch(err => console.error('Error fetching overview data:', err));

    // Fetch children data from the backend
    fetch('http://localhost:3000/admin/children')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch children data: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error('Invalid children data format received');
            }
            const childrenList = document.getElementById('children-list');
            if (!childrenList) {
                console.error('Element with ID "children-list" not found.');
                return;
            }
            childrenList.innerHTML = ''; // Clear any existing rows
            data.forEach(child => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${child.name || 'N/A'}</td>
                    <td>${child.age || 'N/A'}</td>
                    <td>${child.vaccination_status || 'N/A'}</td>
                    <td><button>Edit</button> <button>Delete</button></td>
                `;
                childrenList.appendChild(row);
            });
        })
        .catch(err => console.error('Error fetching children:', err));

    // Fetch vaccine data from the backend
    fetch('http://localhost:3000/admin/vaccines')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch vaccine data: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error('Invalid vaccine data format received');
            }
            const vaccineList = document.getElementById('vaccine-list');
            if (!vaccineList) {
                console.error('Element with ID "vaccine-list" not found.');
                return;
            }
            vaccineList.innerHTML = ''; // Clear any existing rows
            data.forEach(vaccine => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${vaccine.v_name || 'N/A'}</td>
                    <td>${vaccine.v_type || 'N/A'}</td>
                    <td>${vaccine.mfg_company || 'N/A'}</td>
                    <td><button>Edit</button> <button>Delete</button></td>
                `;
                vaccineList.appendChild(row);
            });
        })
        .catch(err => console.error('Error fetching vaccines:', err));

    // Fetch vaccine records from the backend
    fetch('http://localhost:3000/admin/vaccine-records')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch vaccine records: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error('Invalid vaccine records data format received');
            }
            const vaccineRecordList = document.getElementById('vaccine-record-list');
            if (!vaccineRecordList) {
                console.error('Element with ID "vaccine-record-list" not found.');
                return;
            }
            vaccineRecordList.innerHTML = ''; // Clear any existing rows
            data.forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${record.child_name || 'N/A'}</td>
                    <td>${record.vaccine_name || 'N/A'}</td>
                    <td>${record.administered_date || 'N/A'}</td>
                    <td>${record.next_due_date || 'N/A'}</td>
                `;
                vaccineRecordList.appendChild(row);
            });
        })
        .catch(err => console.error('Error fetching vaccine records:', err));
});
*/
document.addEventListener('DOMContentLoaded', () => {
    // Fetch system overview data (Total Children and Upcoming Vaccinations)
    fetch('http://localhost:3000/admin/overview')
        .then(response => response.json())
        .then(data => {
            document.getElementById('children-count').innerText = data.totalChildren || 0;
            document.getElementById('upcoming-vaccinations').innerText = data.upcomingVaccinations || 0;
        })
        .catch(err => console.error('Error fetching overview data:', err));

    // Fetch children data from the backend
    fetch('http://localhost:3000/admin/children')
        .then(response => response.json())
        .then(data => {
            const childrenList = document.getElementById('children-list');
            childrenList.innerHTML = ''; // Clear any existing rows
            data.forEach(child => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${child.name || 'N/A'}</td>
                    <td>${child.age || 'N/A'}</td>
                    <td>${child.vaccination_status || 'N/A'}</td>
                    <td><button>Edit</button> <button>Delete</button></td>
                `;
                childrenList.appendChild(row);
            });
        })
        .catch(err => console.error('Error fetching children:', err));

    // Toggle Add Child Form visibility
    document.getElementById('add-child-btn').addEventListener('click', () => {
        const formContainer = document.getElementById('add-child-form-container');
        if (formContainer.style.display === 'none' || formContainer.style.display === '') {
            formContainer.style.display = 'block';  // Show the form
        } else {
            formContainer.style.display = 'none';   // Hide the form
        }
    });

    // Cancel button for Add Child Form
    document.getElementById('cancel-child-btn').addEventListener('click', () => {
        const formContainer = document.getElementById('add-child-form-container');
        formContainer.style.display = 'none';  // Hide the form when cancel is clicked
    });

    // Add Child Form Submission
    const addChildForm = document.getElementById('add-child-form');
    addChildForm.addEventListener('submit', function (event) {
        event.preventDefault();  // Prevent the default form submit action
    
        const name = document.getElementById('child-name').value;
        const age = document.getElementById('child-age').value;
        const vaccinationStatus = document.getElementById('vaccination-status').value;
    
        if (!name || !age || !vaccinationStatus) {
            alert('Please fill out all fields!');
            return;  // Don't proceed if any field is missing
        }
    
        console.log("Submitting child data:", name, age, vaccinationStatus);
    
        fetch('http://localhost:3000/admin/children', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                age: age,
                vaccinationStatus: vaccinationStatus,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Child added:', data);
            document.getElementById('add-child-form-container').style.display = 'none';  // Hide form after submission
            fetchChildrenData();  // Reload children data or refresh the list
        })
        .catch(error => {
            console.error('Error adding child:', error);
        });
    });
});
