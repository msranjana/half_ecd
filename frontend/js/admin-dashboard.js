document.addEventListener('DOMContentLoaded', () => {
    // Fetch system overview data (Total Children and Upcoming Vaccinations)
    fetch('http://localhost:3000/admin/overview')
        .then(response => response.json())
        .then(data => {
            document.getElementById('children-count').innerText = data.totalChildren;
            document.getElementById('upcoming-vaccinations').innerText = data.upcomingVaccinations;
        })
        .catch(err => console.error('Error fetching overview data:', err));

    // Fetch children data from the backend
    fetch('http://localhost:3000/admin/children')
        .then(response => response.json())
        .then(data => {
            const childrenList = document.getElementById('children-list');
            data.forEach(child => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${child.name}</td>
                    <td>${child.age}</td>
                    <td>${child.vaccination_status}</td>
                    <td><button>Edit</button> <button>Delete</button></td>
                `;
                childrenList.appendChild(row);
            });
        })
        .catch(err => console.error('Error fetching children:', err));

    // Fetch vaccine data from the backend
    fetch('http://localhost:3000/admin/vaccines')
        .then(response => response.json())
        .then(data => {
            const vaccineList = document.getElementById('vaccine-list');
            data.forEach(vaccine => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${vaccine.name}</td>
                    <td>${vaccine.type}</td>
                    <td>${vaccine.dosage}</td>
                    <td>${vaccine.manufacturer}</td>
                    <td><button>Edit</button> <button>Delete</button></td>
                `;
                vaccineList.appendChild(row);
            });
        })
        .catch(err => console.error('Error fetching vaccines:', err));
});
