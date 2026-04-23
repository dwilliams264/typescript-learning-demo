/**
 * 🎨 Form Validation Demo
 *
 * What you'll learn:
 * - Building type-safe forms
 * - Input validation with TypeScript
 * - Form submission handling
 * - Error message display
 */
// Check if running in browser
if (typeof document === 'undefined') {
    console.log('=== 🎨 Form Validation Demo ===');
    console.log('');
    console.log('⚠️  This is an interactive DOM demo that needs to run in the browser.');
    console.log('');
    console.log('To view this demo:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Click "Edit" button in the top-right');
    console.log('3. Click "Run Modified" to execute in the browser');
    console.log('');
    console.log('This demo creates a working form with type-safe validation!');
    console.log('');
    console.log('Validation rules:');
    console.log('- Name: 2-50 characters');
    console.log('- Email: Valid email format');
    console.log('- Age: 18-120');
    console.log('- Country: Required selection');
    process.exit(0);
}
interface FormData {
    name: string;
    email: string;
    age: number;
    country: string;
}

interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

// Validation functions
function validateName(name: string): string | null {
    if (name.length < 2) {
        return 'Name must be at least 2 characters';
    }
    if (name.length > 50) {
        return 'Name must be less than 50 characters';
    }
    return null;
}

function validateEmail(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return null;
}

function validateAge(age: number): string | null {
    if (age < 18) {
        return 'You must be at least 18 years old';
    }
    if (age > 120) {
        return 'Please enter a valid age';
    }
    return null;
}

function validateForm(data: Partial<FormData>): ValidationResult {
    const errors: string[] = [];

    if (data.name !== undefined) {
        const nameError = validateName(data.name);
        if (nameError) errors.push(nameError);
    } else {
        errors.push('Name is required');
    }

    if (data.email !== undefined) {
        const emailError = validateEmail(data.email);
        if (emailError) errors.push(emailError);
    } else {
        errors.push('Email is required');
    }

    if (data.age !== undefined) {
        const ageError = validateAge(data.age);
        if (ageError) errors.push(ageError);
    } else {
        errors.push('Age is required');
    }

    if (!data.country) {
        errors.push('Country is required');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

// Create UI
const outputElement = document.getElementById('output') as HTMLDivElement;

if (!outputElement) {
    console.error('Output element not found!');
} else {
    outputElement.innerHTML = '';

    const container = document.createElement('div');
    container.style.cssText = 'padding: 20px; font-family: Arial, sans-serif; max-width: 500px;';

    // Header
    const header = document.createElement('h2');
    header.textContent = '🎨 Form Validation Demo';
    header.style.cssText = 'color: #2563eb; margin-bottom: 20px;';
    container.appendChild(header);

    // Form
    const form = document.createElement('form');
    form.style.cssText = 'display: flex; flex-direction: column; gap: 15px;';

    // Name field
    const nameGroup = document.createElement('div');
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name:';
    nameLabel.style.cssText = 'font-weight: bold; margin-bottom: 5px; display: block;';
    const nameInput = document.createElement('input') as HTMLInputElement;
    nameInput.type = 'text';
    nameInput.name = 'name';
    nameInput.placeholder = 'Enter your name';
    nameInput.style.cssText = 'padding: 10px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px;';
    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);

    // Email field
    const emailGroup = document.createElement('div');
    const emailLabel = document.createElement('label');
    emailLabel.textContent = 'Email:';
    emailLabel.style.cssText = 'font-weight: bold; margin-bottom: 5px; display: block;';
    const emailInput = document.createElement('input') as HTMLInputElement;
    emailInput.type = 'email';
    emailInput.name = 'email';
    emailInput.placeholder = 'your@email.com';
    emailInput.style.cssText = 'padding: 10px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px;';
    emailGroup.appendChild(emailLabel);
    emailGroup.appendChild(emailInput);

    // Age field
    const ageGroup = document.createElement('div');
    const ageLabel = document.createElement('label');
    ageLabel.textContent = 'Age:';
    ageLabel.style.cssText = 'font-weight: bold; margin-bottom: 5px; display: block;';
    const ageInput = document.createElement('input') as HTMLInputElement;
    ageInput.type = 'number';
    ageInput.name = 'age';
    ageInput.placeholder = '18';
    ageInput.style.cssText = 'padding: 10px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px;';
    ageGroup.appendChild(ageLabel);
    ageGroup.appendChild(ageInput);

    // Country field
    const countryGroup = document.createElement('div');
    const countryLabel = document.createElement('label');
    countryLabel.textContent = 'Country:';
    countryLabel.style.cssText = 'font-weight: bold; margin-bottom: 5px; display: block;';
    const countrySelect = document.createElement('select') as HTMLSelectElement;
    countrySelect.name = 'country';
    countrySelect.style.cssText = 'padding: 10px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px;';
    const countries = ['', 'UK', 'USA', 'Canada', 'Australia', 'Germany', 'France'];
    countries.forEach((country) => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country || 'Select a country';
        countrySelect.appendChild(option);
    });
    countryGroup.appendChild(countryLabel);
    countryGroup.appendChild(countrySelect);

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    submitButton.style.cssText = `
        background: #3b82f6;
        color: white;
        padding: 12px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
    `;

    // Error/Success display
    const messageBox = document.createElement('div');
    messageBox.style.cssText = 'padding: 15px; border-radius: 6px; margin-top: 15px; display: none;';

    // Form submission
    form.addEventListener('submit', (event: Event) => {
        event.preventDefault();

        const formData: Partial<FormData> = {
            name: nameInput.value,
            email: emailInput.value,
            age: parseInt(ageInput.value),
            country: countrySelect.value,
        };

        const validation = validateForm(formData);

        if (validation.isValid) {
            messageBox.style.cssText =
                'padding: 15px; border-radius: 6px; margin-top: 15px; display: block; background: #d1fae5; color: #065f46;';
            messageBox.innerHTML = `
                <strong>✓ Success!</strong><br>
                Name: ${formData.name}<br>
                Email: ${formData.email}<br>
                Age: ${formData.age}<br>
                Country: ${formData.country}
            `;
            console.log('Form submitted successfully:', formData);
        } else {
            messageBox.style.cssText =
                'padding: 15px; border-radius: 6px; margin-top: 15px; display: block; background: #fee2e2; color: #991b1b;';
            messageBox.innerHTML = `
                <strong>✗ Validation Errors:</strong><br>
                ${validation.errors.map((err) => `• ${err}`).join('<br>')}
            `;
            console.log('Validation errors:', validation.errors);
        }
    });

    form.appendChild(nameGroup);
    form.appendChild(emailGroup);
    form.appendChild(ageGroup);
    form.appendChild(countryGroup);
    form.appendChild(submitButton);
    form.appendChild(messageBox);

    container.appendChild(form);
    outputElement.appendChild(container);

    console.log('=== Form Validation Demo ===');
    console.log('Try submitting the form with different values!');
    console.log('Validation rules:');
    console.log('- Name: 2-50 characters');
    console.log('- Email: Valid email format');
    console.log('- Age: 18-120');
    console.log('- Country: Required');
}
