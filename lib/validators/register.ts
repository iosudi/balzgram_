// lib/validators/register.ts
export const registerRules = {
  firstName: {
    required: "First name is required",
    pattern: {
      value: /^[A-Za-z]{2,20}$/,
      message: "Only letters (2–20 chars)",
    },
  },
  lastName: {
    required: "Last name is required",
    pattern: {
      value: /^[A-Za-z]{2,20}$/,
      message: "Only letters (2–20 chars)",
    },
  },
  username: {
    required: "Username is required",
    pattern: {
      value: /^[a-zA-Z0-9_]{3,20}$/,
      message: "3–20 chars, letters/numbers/_",
    },
  },
  email: {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Invalid email address",
    },
  },
  password: {
    required: "Password is required",
    pattern: {
      value: /^(?=.*[A-Z])(?=.*\d).{8,}$/,
      message: "Min 8 chars, 1 uppercase, 1 number",
    },
  },
};
