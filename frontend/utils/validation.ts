import { BookFormData, FormErrors } from '@/types/book';

export function validateBookForm(data: BookFormData): FormErrors {
  const errors: FormErrors = {};

  // Title validation
  if (!data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.length < 2) {
    errors.title = 'Title must be at least 2 characters long';
  }

  // Author validation
  if (!data.author.trim()) {
    errors.author = 'Author is required';
  } else if (data.author.length < 2) {
    errors.author = 'Author must be at least 2 characters long';
  }

  // Year validation
  if (!data.year) {
    errors.year = 'Year is required';
  } else {
    const currentYear = new Date().getFullYear();
    const year = Number(data.year);
    if (isNaN(year) || year < 1000 || year > currentYear + 10) {
      errors.year = `Year must be between 1000 and ${currentYear + 10}`;
    }
  }

  return errors;
}

export function isValidUrl(url: string): boolean {
  if (!url.trim()) return true; // Optional field
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}