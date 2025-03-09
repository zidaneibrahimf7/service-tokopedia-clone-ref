const mongoose = require('mongoose');
const dotenv = require('dotenv');
const randomstring = require("randomstring");
const VideosModel = require('./src/models/Videos/model.js');
const ProductModels = require('./src/models/Products/model')

// Load environment variables
dotenv.config();

// Fungsi untuk koneksi database
async function connectDatabase() {
    try {
        await mongoose.connect(`${process.env.DATABASE_URL}${process.env.DB_NAME}`, {});
        console.log("Database Connected");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // Keluar dari proses jika gagal koneksi
    }
}

// Fungsi untuk memasukkan data ke database

async function seedDatabase() {
    try {
          await connectDatabase(); // Pastikan database terhubung

          // Hapus semua data lama
          await VideosModel.deleteMany({});
          await ProductModels.deleteMany({});
          console.log("Old data removed");

          // **1. Masukkan Produk Terlebih Dahulu**
          const seedProducts = [
               {
                    productId: randomstring.generate(),
                    linkProduct: "https://tokopedia.link/EJkQgllIFQb",
                    videoLink: "https://youtu.be/vsdex1l3Olc?si=N5S1PLEz7GCvRBJM",
                    title: "Tas Selempang Pria WEIXIER 1855 Crossbody Sling Bag",
                    price: "169.000"
               },
               {
                    productId: randomstring.generate(),
                    linkProduct: "https://tokopedia.link/vFTtennIFQb",
                    title: "WINOD Siena Flatshoes Wanita",
                    videoLink: "https://youtu.be/Yz027p6Fujc?si=Q58Ifm3B4sUWmEpa",
                    price: "89.900"
               }
          ];

          // Insert Produk ke Database
          const insertedProducts = await ProductModels.insertMany(seedProducts);
          console.log("Products Inserted:", insertedProducts);

          // **2. Masukkan Video dengan Referensi Produk**
          const seedVideos = insertedProducts.map((product, index) => ({
               videoId: randomstring.generate(),
               urlImageThumbnail: index === 0
                    ? "https://images.tokopedia.net/img/cache/700/VqbcmM/2023/11/12/5944710a-39bb-4122-8eb7-320c1c625458.jpg"
                    : "https://images.tokopedia.net/img/cache/700/VqbcmM/2023/9/29/6e26ba35-a7a3-4893-83f6-5650b5b71a0e.jpg",
               product: product._id // **Simpan ID Produk dalam Video**
          }));

          // Insert Video ke Database
          const insertedVideos = await VideosModel.insertMany(seedVideos);
          console.log("Videos Inserted:", insertedVideos);

          // **3. Update Produk dengan Referensi Video**
          for (let i = 0; i < insertedProducts.length; i++) {
               await ProductModels.findByIdAndUpdate(insertedProducts[i]._id, {
                    video: insertedVideos[i]._id
               });
          }

          console.log("Products updated with video references.");
          // Tutup koneksi setelah selesai
          mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

// Jalankan fungsi seed
seedDatabase();
