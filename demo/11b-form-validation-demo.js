/**
 * 🎨 Form Validation Demo
 *
 * What you'll learn:
 * - Building type-safe forms
 * - Input validation
 * - Form submission handling
 * - Error message display
 */

// Validation functions
function validateName(name) {
    if (name.length < 2) {
        return 'Name must be at least 2 characters';
    }
    if (name.length > 50) {
        return 'Name must be less than 50 characters';
    }
    return null;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return null;
}

function validateAge(age) {
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum)) {
        return 'Age must be a number';
    }
    if (ageNum < 18) {
        return 'You must be at least 18 years old';
    }
    if (ageNum > 120) {
        return 'Please enter a valid age';
    }
    return null;
}

function validateCountry(country) {
    if (!country) {
        return 'Please select a country';
    }
    return null;
}

function validateForm(formData) {
    const errors = [];

    const nameError = validateName(formData.name);
    if (nameError) errors.push(nameError);

    const emailError = validateEmail(formData.email);
    if (emailError) errors.push(emailError);

    const ageError = validateAge(formData.age);
    if (ageError) errors.push(ageError);

    const countryError = validateCountry(formData.country);
    if (countryError) errors.push(countryError);

    return {
        isValid: errors.length === 0,
        errors: errors,
    };
}

// Get output element
const outputElement = document.getElementById('output');
if (!outputElement) {
    console.error('Output element not found!');
} else {
    // Clear existing content
    outputElement.innerHTML = '';

    const container = document.createElement('div');
    container.style.cssText = 'padding: 20px; font-family: Arial, sans-serif;';

    // Header
    const header = document.createElement('h2');
    header.textContent = '📋 User Registration Form';
    header.style.cssText = 'margin: 0 0 20px 0; color: #4CAF50;';
    container.appendChild(header);

    // Create form
    const form = document.createElement('form');
    form.style.cssText = 'display: flex; flex-direction: column; gap: 15px; max-width: 400px;';

    // Name field
    const nameLabel = document.createElement('label');
    nameLabel.innerHTML = '<strong>Name:</strong>';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'name';
    nameInput.placeholder = 'Enter your name';
    nameInput.style.cssText = 'padding: 8px; border: 1px solid #ccc; border-radius: 4px;';

    // Email field
    const emailLabel = document.createElement('label');
    emailLabel.innerHTML = '<strong>Email:</strong>';
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.id = 'email';
    emailInput.placeholder = 'Enter your email';
    emailInput.style.cssText = 'padding: 8px; border: 1px solid #ccc; border-radius: 4px;';

    // Age field
    const ageLabel = document.createElement('label');
    ageLabel.innerHTML = '<strong>Age:</strong>';
    const ageInput = document.createElement('input');
    ageInput.type = 'number';
    ageInput.id = 'age';
    ageInput.placeholder = 'Enter your age';
    ageInput.style.cssText = 'padding: 8px; border: 1px solid #ccc; border-radius: 4px;';

    // Country field
    const countryLabel = document.createElement('label');
    countryLabel.innerHTML = '<strong>Country:</strong>';
    const countrySelect = document.createElement('select');
    countrySelect.id = 'country';
    countrySelect.style.cssText = 'padding: 8px; border: 1px solid #ccc; border-radius: 4px;';

    const countries = [
        '',
        'United States',
        'United Kingdom',
        'Canada',
        'Australia',
        'Germany',
        'France',
        'Japan',
        'Other',
    ];
    countries.forEach((country) => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country || 'Select a country...';
        countrySelect.appendChild(option);
    });

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    submitButton.style.cssText =
        'padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: bold;';

    // Error display
    const errorDisplay = document.createElement('div');
    errorDisplay.id = 'errors';
    errorDisplay.style.cssText = 'color: #f44336; font-size: 14px;';

    // Success display
    const successDisplay = document.createElement('div');
    successDisplay.id = 'success';
    successDisplay.style.cssText = 'color: #4CAF50; font-size: 14px; display: none;';

    // Append elements
    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(emailLabel);
    form.appendChild(emailInput);
    form.appendChild(ageLabel);
    form.appendChild(ageInput);
    form.appendChild(countryLabel);
    form.appendChild(countrySelect);
    form.appendChild(submitButton);
    form.appendChild(errorDisplay);
    form.appendChild(successDisplay);

    container.appendChild(form);
    outputElement.appendChild(container);

    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            name: nameInput.value,
            email: emailInput.value,
            age: ageInput.value,
            country: countrySelect.value,
        };

        const result = validateForm(formData);

        if (result.isValid) {
            errorDisplay.innerHTML = '';
            errorDisplay.style.display = 'none';
            successDisplay.innerHTML = '<strong>✓ Form submitted successfully!</strong><br>Thank you for registering!';
            successDisplay.style.display = 'block';

            // Clear form
            form.reset();
        } else {
            successDisplay.style.display = 'none';
            errorDisplay.innerHTML =
                '<strong>Please fix the following errors:</strong><ul style="margin: 5px 0;">' +
                result.errors.map((err) => `<li>${err}</li>`).join('') +
                '</ul>';
            errorDisplay.style.display = 'block';
        }
    });
}
