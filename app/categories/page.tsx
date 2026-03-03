"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category,
} from "@/lib/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState<string>("");
  const [editID, setEditID] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCategories = async () => {
    const res = await getCategories();
    console.log("categories data:", res.data);
    setCategories(res.data || []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return alert("Name is required");
    setLoading(true);

    if (editID) {
      await updateCategory(editID, { name });
    } else {
      await createCategory({ name });
    }

    setName("");
    setEditID(null);
    setLoading(false);
    fetchCategories();
  };

  const handleEdit = (category: Category) => {
    setEditID(category.ID);
    setName(category.name);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await deleteCategory(id);
    fetchCategories();
  };

  const handleCancel = () => {
    setEditID(null);
    setName("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Book Categories</h1>

      {/* Form */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Category name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editID ? "Update" : "Create"}
        </button>
        {editID && (
          <button
            onClick={handleCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr key="empty">
              <td colSpan={3} className="text-center py-4 text-gray-400">
                No categories found
              </td>
            </tr>
          ) : (
            categories.map((cat) => (
              <tr key={cat.ID} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{cat.ID}</td>
                <td className="border px-4 py-2">{cat.name}</td>
                <td className="border px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.ID)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
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
