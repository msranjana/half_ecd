document.addEventListener('DOMContentLoaded', () => {
    const parentForm = document.getElementById('parent-login-form');
    const adminForm = document.getElementById('admin-login-form');
    const errorElement = document.getElementById('loginError');

    // Parent Login
    parentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const childId = document.getElementById('parent-child-id').value;
        const password = document.getElementById('parent-password').value;

        const body = { child_id: childId, password: password };

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (response.ok) {
                if (data.token) {
                    // Store the token in localStorage for subsequent requests
                    localStorage.setItem('authToken', data.token);
                    alert('Login successful');
                    window.location.href = 'dashboard/parent.html'; // Redirect to parent dashboard
                } else {
                    errorElement.textContent = 'Invalid credentials';
                }
            } else {
                errorElement.textContent = data.message || 'Error during login';
            }
        } catch (err) {
            console.error('Error:', err);
            errorElement.textContent = 'Error during login';
        }
    });

    // Admin Login
    adminForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;

        const body = { username: username, password: password };

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (response.ok) {
                if (data.token) {
                    // Store the token in localStorage for subsequent requests
                    localStorage.setItem('authToken', data.token);
                    alert('Login successful');
                    window.location.href = 'dashboard/admin.html'; // Redirect to admin dashboard
                } else {
                    errorElement.textContent = 'Invalid credentials';
                }
            } else {
                errorElement.textContent = data.message || 'Error during login';
            }
        } catch (err) {
            console.error('Error:', err);
            errorElement.textContent = 'Error during login';
        }
    });
});
