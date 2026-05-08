// Base URLs
//export const apiUrl = "http://localhost:8000/api";

 //export const apiUrl = "https://sasmedipro.com/api";

export const apiUrl = "";

export const playstoreUrl = "Your playStoreUrl";

// Default headers
export const headers = {
  "Accept": "application/json",
  "Content-Type": "application/json",
};

// Headers with token
export const headersToken = (token) => ({
  "Accept": "application/json",
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`,
});
