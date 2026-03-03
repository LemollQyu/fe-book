const BASE_URL = "http://localhost:8000/api";

export interface Category {
  ID: number;
  name: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
}

export interface Book {
  ID: number;
  title: string;
  author: string;
  publication_date: string;
  publisher: string;
  number_of_pages: number;
  category_id: number;
  Category?: Category;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
}

export type BookPayload = {
  title: string;
  author: string;
  publication_date: string;
  publisher: string;
  number_of_pages: number;
  category_id: number;
};

// ── CATEGORIES ──────────────────────────────
export const getCategories = async (): Promise<{ data: Category[] }> => {
  const res = await fetch(`${BASE_URL}/categories`);
  return res.json();
};

export const getCategoryByID = async (id: number): Promise<{ data: Category }> => {
  const res = await fetch(`${BASE_URL}/categories/${id}`);
  return res.json();
};

export const createCategory = async (data: { name: string }): Promise<{ data: Category }> => {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateCategory = async (id: number, data: { name: string }): Promise<{ data: Category }> => {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteCategory = async (id: number): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "DELETE",
  });
  return res.json();
};

// ── BOOKS ────────────────────────────────────
export const getBooks = async ({
  categoryID,
  search,
  date,
}: {
  categoryID?: number;
  search?: string;
  date?: string;
} = {}): Promise<{ data: Book[] }> => {
  const params = new URLSearchParams();
  if (categoryID) params.append("category_id", String(categoryID));
  if (search) params.append("search", search);
  if (date) params.append("date", date);

  const res = await fetch(`${BASE_URL}/books?${params.toString()}`);
  return res.json();
};

export const getBookByID = async (id: number): Promise<{ data: Book }> => {
  const res = await fetch(`${BASE_URL}/books/${id}`);
  return res.json();
};

export const createBook = async (data: BookPayload): Promise<{ data: Book }> => {
  const res = await fetch(`${BASE_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateBook = async (id: number, data: BookPayload): Promise<{ data: Book }> => {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteBook = async (id: number): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    method: "DELETE",
  });
  return res.json();
};