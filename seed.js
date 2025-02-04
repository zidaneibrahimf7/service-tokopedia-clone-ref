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

const seedProducts = [
    {
          productId: randomstring.generate(),
          linkProduct: "https://tokopedia.link/EJkQgllIFQb",
          title: "Tas Selempang Pria WEIXIER 1855 Crossbody Sling Bag",
          price: "169.000",
          videoId: {}
    },
    {
          productId: randomstring.generate(),
          linkProduct: "https://tokopedia.link/vFTtennIFQb",
          title: "WINOD Siena Flatshoes Wanita",
          price: "89.900",
          videoId: {}
    }
];

// Fungsi untuk memasukkan data ke database
async function seedDatabase() {
     try {
          await connectDatabase(); // Pastikan database terhubung

          // Hapus semua data lama
          await VideosModel.deleteMany({});
          await ProductModels.deleteMany({});
          console.log("Old data removed");

          // Masukkan data ke koleksi Products terlebih dahulu
          const insertedProducts = await ProductModels.insertMany(seedProducts);
          console.log("Products Inserted:", insertedProducts);

          // Pastikan ada jumlah produk yang cukup untuk dipasangkan dengan video
          if (insertedProducts.length < 2) {
               throw new Error("Jumlah produk kurang untuk dihubungkan dengan video!");
          }

          // Ambil `_id` dari produk yang telah disimpan dan pasangan setiap video dengan satu produk
          const seedVideos = insertedProducts.map((product, index) => ({
               videoId: randomstring.generate(),
               urlImageThumbnail: index === 0
                    ? "https://youtu.be/vsdex1l3Olc?si=N5S1PLEz7GCvRBJM"
                    : "https://youtu.be/Yz027p6Fujc?si=Q58Ifm3B4sUWmEpa",
               product: product._id // Setiap video hanya memiliki satu produk
          }));

          // Masukkan data ke koleksi Videos
          const insertedVideos = await VideosModel.insertMany(seedVideos);
          console.log("Videos Inserted:", insertedVideos);

          // Tutup koneksi setelah selesai
          mongoose.connection.close();
     } catch (error) {
          console.error("Error seeding database:", error);
     }
}

// Jalankan fungsi seed
seedDatabase();
