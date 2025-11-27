import { i18n } from "@/i18n";

/**
 * Generic Form Validation Utility
 * @param {Object} formData - The data object to validate
 * @param {Object} schema - The validation rules
 * @param {Function} t - The i18n translation function
 * @returns {Object} result - { isValid: boolean, errors: { fieldName: string } }
 */

export function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(String(email).trim());
}

function getPasswordError(password) {
    const errors = [];
    const t = i18n.global.t;

    if (!/[a-z]/.test(password)) errors.push(t("validation.password.missing_lower"));
    if (!/[A-Z]/.test(password)) errors.push(t("validation.password.missing_upper"));
    if (!/[0-9]/.test(password)) errors.push(t("validation.password.missing_number"));
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push(t("validation.password.missing_special"));

    if (errors.length === 0) return ""; // valid

    // Combine into one message
    const combined = errors.join(", ");

    return t("validation.password.prefix") + combined;
}


export function validateForm(formData, schema) {
    const errors = {};
    let isValid = true;

    for (const field in schema) {
        const rule = schema[field];
        const value = formData[field];

        // Skip if field is not in formData
        if (formData[field] === undefined) continue;

        let errorKey = null;
        let errorParams = {};

        // 1. Type Check
        if (rule.type) {
            if (rule.type == 'password') {
                // if (!validateEmail(value)) {
                errorKey = getPasswordError(value);
                debugger
                // }
            }
            else if (rule.type == 'email') {
                if (!validateEmail(value)) {
                    errorKey = 'validation.invalid_email';
                }
            }
            else if (rule.type === 'number' && (typeof value !== 'number' || isNaN(value))) {
                if (rule.validate == 'required') {
                    errorKey = 'validation.required';
                } else {
                    errorKey = 'validation.numeric';
                }
            } else if (rule.type === 'string' && typeof value !== 'string') {
                errorKey = 'validation.text';
            }
        }

        // 2. Validation Logic (only if type check passed)
        if (!errorKey && rule.validate) {

            if (typeof rule.validate === 'function') {
                const result = rule.validate(value);
                if (result !== true) {
                    errorKey = result || 'validation.invalid';
                }
            } else if (typeof rule.validate === 'string') {
                const ruleString = rule.validate.trim();

                if (ruleString === 'required') {
                    if (value === null || value === undefined || value === '') {
                        errorKey = 'validation.required';
                    }
                } else if (ruleString === 'valid date') {
                    // Check for valid date string
                    if (!value || isNaN(Date.parse(value))) {
                        errorKey = 'validation.invalid_date';
                    }
                } else if (ruleString === 'valid time') {
                    // Check for HH:MM format (24-hour)
                    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                    if (!value || !timeRegex.test(value)) {
                        errorKey = 'validation.invalid_time';
                    }
                } else if (ruleString.startsWith('>')) {
                    const threshold = parseFloat(ruleString.substring(1).trim());
                    if (rule.type === 'string') {
                        if (!value || value.trim().length <= threshold) {
                            errorKey = 'validation.min_length';
                            errorParams = { count: threshold + 1 };
                        }
                    } else if (rule.type === 'number') {
                        if (value === null || value === '' || Number(value) <= threshold) {
                            errorKey = 'validation.greater_than';
                            errorParams = { value: threshold };
                        }
                    }
                }
            }
        }

        // If an error was found, translate it and add to errors object
        if (errorKey) {
            const t = i18n.global.t;

            errors[field] = t(errorKey, errorParams);
            isValid = false;
        }
    }

    return { isValid, errors };
}