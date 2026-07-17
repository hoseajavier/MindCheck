# MindCheck - Sistem Deteksi Tingkat Stres

MindCheck adalah sistem informasi berbasis web yang dirancang untuk membantu masyarakat melakukan deteksi mandiri tingkat stres berdasarkan data fisiologis pola tidur. Proyek ini dikembangkan sebagai bagian dari penelitian tugas akhir untuk memberikan solusi skrining kesehatan mental yang mudah diakses, cepat, dan akurat.

## Link Website
URL: **[https://mindcheck-phi.vercel.app](https://mindcheck-phi.vercel.app)**

## Fitur Utama
*   **Autentikasi**: Login menggunakan akun Google untuk User dan Admin.
*   **Deteksi Stres**: Pengisian kuesioner berdasarkan parameter fisiologis pola tidur.
*   **Analisis Berbasis AI**: Menggunakan model *Machine Learning* (Random Forest) untuk klasifikasi tingkat stres (Rendah, Sedang, Tinggi) dengan akurasi tinggi.
*   **Riwayat & Edukasi**: Lacak riwayat hasil tes dan akses artikel edukasi.
*   **Dashboard Admin**: Kelola dataset, pertanyaan kuesioner, dan *deployment* model AI.

## Tech Stack yang digunakan
*   **Frontend**: Next.js, Tailwind CSS, Lucide React
*   **Backend**: FastAPI (Python), Next.js API Routes
*   **Database**: PostgreSQL (Prisma ORM)
*   **Machine Learning**: Scikit-Learn (Random Forest)
*   **Autentikasi**: NextAuth.js
*   **Deployment**: Vercel & Railway
