document.addEventListener('DOMContentLoaded', () => {
    const parentForm = document.getElementById('parent-register-form');
    const adminForm = document.getElementById('admin-register-form');
    const errorElement = document.getElementById('signupError');

    // Parent Sign-Up
    parentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const childId = document.getElementById('parent-child-id-signup').value;
        const username = document.getElementById('parent-username').value;
        const password = document.getElementById('parent-password-signup').value;

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    role: 'parent',
                    child_id: childId,
                }),
            });

            if (response.ok) {
                alert('Parent registered successfully!');
                parentForm.reset();
            } else {
                const errorData = await response.json();
                errorElement.textContent = errorData.message || 'Registration failed';
            }
        } catch (error) {
            console.error('Error:', error);
            errorElement.textContent = 'An error occurred while registering.';
        }
    });

    // Admin Sign-Up
    adminForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('admin-username-signup').value;
        const password = document.getElementById('admin-password-signup').value;

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {  // Ensure the URL is correct (with http://localhost:3000)
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    role: 'admin',
                }),
            });

            if (response.ok) {
                alert('Admin registered successfully!');
                adminForm.reset();
            } else {
                const errorData = await response.json();
                errorElement.textContent = errorData.message || 'Registration failed';
            }
        } catch (error) {
            console.error('Error:', error);
            errorElement.textContent = 'An error occurred while registering.';
        }
    });
});
