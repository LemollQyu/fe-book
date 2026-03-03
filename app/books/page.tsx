"use client";

import { useEffect, useState } from "react";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getCategories,
  Book,
  Category,
} from "@/lib/api";

const initialForm = {
  title: "",
  author: "",
  publication_date: "",
  publisher: "",
  number_of_pages: 0,
  category_id: 0,
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editID, setEditID] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  // filter state
  const [filterCategory, setFilterCategory] = useState<number>(0);
  const [filterSearch, setFilterSearch] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");

  const fetchBooks = async () => {
    const res = await getBooks({
      categoryID: filterCategory || undefined,
      search: filterSearch || undefined,
      date: filterDate || undefined,
    });
    setBooks(res.data || []);
  };

  const fetchCategories = async () => {
    const res = await getCategories();
    setCategories(res.data || []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [filterCategory, filterSearch, filterDate]);

  const handleSubmit = async () => {
    if (!form.title || !form.author || !form.publisher || !form.category_id) {
      return alert("Semua field wajib diisi!");
    }
    setLoading(true);

    const payload = {
      ...form,
      publication_date: new Date(form.publication_date).toISOString(),
      number_of_pages: Number(form.number_of_pages),
      category_id: Number(form.category_id),
    };

    if (editID) {
      await updateBook(editID, payload);
    } else {
      await createBook(payload);
    }

    setForm(initialForm);
    setEditID(null);
    setShowForm(false);
    setLoading(false);
    fetchBooks();
  };

  const handleEdit = (book: Book) => {
    setEditID(book.ID);
    setForm({
      title: book.title,
      author: book.author,
      publication_date: book.publication_date.split("T")[0],
      publisher: book.publisher,
      number_of_pages: book.number_of_pages,
      category_id: book.category_id,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await deleteBook(id);
    fetchBooks();
  };

  const handleCancel = () => {
    setEditID(null);
    setForm(initialForm);
    setShowForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Books</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Book
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="border rounded p-4 mb-6 bg-gray-50">
          <h2 className="font-semibold mb-4">
            {editID ? "Edit Book" : "Add Book"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Author"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Publisher"
              value={form.publisher}
              onChange={(e) => setForm({ ...form, publisher: e.target.value })}
              className="border px-3 py-2 rounded"
            />
            <input
              type="number"
              placeholder="Number of Pages"
              value={form.number_of_pages}
              onChange={(e) =>
                setForm({ ...form, number_of_pages: Number(e.target.value) })
              }
              className="border px-3 py-2 rounded"
            />
            <input
              type="date"
              value={form.publication_date}
              onChange={(e) =>
                setForm({ ...form, publication_date: e.target.value })
              }
              className="border px-3 py-2 rounded"
            />
            <select
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: Number(e.target.value) })
              }
              className="border px-3 py-2 rounded"
            >
              <option value={0}>Select Category</option>
              {categories.map((cat) => (
                <option key={cat.ID} value={cat.ID}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editID ? "Update" : "Create"}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search title/author/publisher..."
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          className="border px-3 py-2 rounded flex-1"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(Number(e.target.value))}
          className="border px-3 py-2 rounded"
        >
          <option value={0}>All Categories</option>
          {categories.map((cat) => (
            <option key={cat.ID} value={cat.ID}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={() => {
            setFilterSearch("");
            setFilterCategory(0);
            setFilterDate("");
          }}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2 text-left">ID</th>
            <th className="border px-3 py-2 text-left">Title</th>
            <th className="border px-3 py-2 text-left">Author</th>
            <th className="border px-3 py-2 text-left">Publisher</th>
            <th className="border px-3 py-2 text-left">Pages</th>
            <th className="border px-3 py-2 text-left">Publication Date</th>
            <th className="border px-3 py-2 text-left">Category</th>
            <th className="border px-3 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr key="empty">
              <td colSpan={8} className="text-center py-4 text-gray-400">
                No books found
              </td>
            </tr>
          ) : (
            books.map((book) => (
              <tr key={String(book.ID)} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{book.ID}</td>
                <td className="border px-3 py-2">{book.title}</td>
                <td className="border px-3 py-2">{book.author}</td>
                <td className="border px-3 py-2">{book.publisher}</td>
                <td className="border px-3 py-2">{book.number_of_pages}</td>
                <td className="border px-3 py-2">
                  {new Date(book.publication_date).toLocaleDateString("id-ID")}
                </td>
                <td className="border px-3 py-2">
                  {book.Category?.name ?? "-"}
                </td>
                <td className="border px-3 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book.ID)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
