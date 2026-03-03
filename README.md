# 📚 Book Management - Frontend

Aplikasi web untuk manajemen buku dan kategori buku, dibangun menggunakan **Next.js** dan **TypeScript**.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS

---

## 📁 Struktur Project

```
book-client/
├── app/
│   ├── books/
│   │   └── page.tsx        # Halaman CRUD buku + filter
│   ├── categories/
│   │   └── page.tsx        # Halaman CRUD kategori
│   └── page.tsx            # Halaman utama
├── lib/
│   └── api.ts              # API helper & TypeScript interfaces
└── public/
```

---

## ⚙️ Prasyarat

Pastikan backend sudah berjalan di `http://localhost:8000`.  
Lihat repository backend: [book-api](#)

---

## 🚀 Cara Menjalankan

### 1. Clone repository

```bash
git clone <repo-url>
cd book-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Jalankan aplikasi

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

---

## 📄 Halaman

### `/categories` - Manajemen Kategori

- Melihat list semua kategori
- Menambah kategori baru
- Mengedit kategori
- Menghapus kategori

### `/books` - Manajemen Buku

- Melihat list semua buku beserta kategorinya
- Menambah buku baru
- Mengedit buku
- Menghapus buku
- **Filter by kategori**
- **Filter by pencarian** (title, author, publisher)
- **Filter by tanggal publikasi**
- Reset semua filter

---

## 🔌 API Integration

Semua komunikasi ke backend diatur di `lib/api.ts`.

Ubah `BASE_URL` jika backend berjalan di alamat berbeda:

```ts
const BASE_URL = "http://localhost:8000/api";
```

---

## 📦 TypeScript Interfaces

```ts
interface Category {
  ID: number;
  name: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
}

interface Book {
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
```

---

## 🏗️ Arsitektur

```
page.tsx  →  lib/api.ts  →  Backend API (Go + Gin)
```

- **page.tsx**: UI component + state management
- **lib/api.ts**: Fungsi fetch ke backend + TypeScript types
