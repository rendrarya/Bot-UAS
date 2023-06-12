const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const token = "6016693346:AAG1fXVLQYDEiOBAEFDQz5jsQ7WWKEvuhk4";
const bot = new TelegramBot(token, { polling: true });

// Fungsi untuk mengirim permintaan HTTP ke backend
async function sendRequest(endpoint, method, data) {
  const url = `http://localhost:3000${endpoint}`;
  const options = {
    method,
    url,
    data,
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.error("Error sending request to backend:", error);
    throw error;
  }
}


bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  // Memproses perintah CRUD dari pengguna
  if (messageText.startsWith("/create")) {
    const data = messageText.replace("/create", "").trim();
    const [id_barang,nama_barang, harga_barang,gambar_barang,merek_barang] = data.split(" ");
  
    if (nama_barang && harga_barang) {
      try {
        await sendRequest("/api/create", "POST", { id_barang,nama_barang, harga_barang,gambar_barang,merek_barang });
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, "Data creation request sent successfully");
      } catch (error) {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, "Error creating data");
      }
    } else {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, "Silakan masukkan data untuk dibuat (format: /create [id_barang] [nama_barang] [harga_barang] [gambar_barang][merek_barang])");
    }  
  
  } else if (messageText.startsWith("/read")) {
    try {
      const data = await sendRequest("/api/read", "GET");
      let formattedData = "";
  
      data.forEach((item) => {
        formattedData += `ID:${item.id_makanan}\nNama Barang: ${item.nama_barang}\nHarga Barang: ${item.harga_barang}\nFoto: ${item.gambar_barang}\nMerek${item.merek_barang}\n\n`;
      });
  
      bot.sendMessage(chatId, `Nama Barang:\n${formattedData}`);
    } catch (error) {
      bot.sendMessage(chatId, "Error reading data");
    }

  } else if (messageText.startsWith("/baca")) {
    const data = messageText.replace("/baca", "").trim();
    const [nama_barang] = data.split(" ");
  if (nama_barang) {
	try {
	      const data = await sendRequest("/api/readata", "POST",{nama_barang});
	      // await sendRequest("/api/readata", "GET");
	      let formattedData = "";
	  
	      data.forEach((item) => {
	        formattedData += `ID:${item.id_makanan}\nNama Barang: ${item.nama_barang}\nHarga Barang: ${item.harga_barang}\nFoto: ${item.gambar_barang}\nMerek${item.merek_barang}\n\n`;
	      });
	  
	      bot.sendMessage(chatId, `Data:\n${formattedData}`);
        
	    } catch (error) {
	      bot.sendMessage(chatId, "Error reading data");
	    } 
}else {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Silakan masukkan data untuk Diupdate dengan Format /baca [nama barang]");
} 
  }  
  else if (messageText.startsWith("/update")) {
    const data = messageText.replace("/update", "").trim();
    const [nama_barang,id_makanan] = data.split(" ");
    if (nama_barang && id_makanan) {
        try {
          await sendRequest("/api/update", "PUT", { nama_barang,id_makanan });
          const chatId = msg.chat.id;
          bot.sendMessage(chatId, "Data Update sent successfully");
        } catch (error) {
          const chatId = msg.chat.id;
          bot.sendMessage(chatId, "Error creating data");
        }
      } else {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, "Silakan masukkan data untuk Diupdate dengan Format /update [nama barang][id makanan]");
      }  
  } else if (messageText.startsWith("/delete")){
    data = messageText.replace("/delete", "").trim();
    const [id_makanan] = data.split(" ");
    if (id_makanan) {
    try {
      await sendRequest("/api/delete", "DELETE",{id_makanan});
      bot.sendMessage(chatId, "Data deleted successfully");
    } catch (error) {
      bot.sendMessage(chatId, "Error deleting data");
    }
   }else {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Silakan masukkan data untuk Dihapus dengan Format /delete [id makanan]");

  }
}else if (messageText.toLowerCase() === "p") {
    const commands = [
      "/create - Buat Data Baru",
      "/read - Tampilkan List Data",
      "/update - Perbarui List Data",
      "/delete - Hapusapus Data",
      "/baca - Membaca Data Berdasarkan Nama Barang"
    ];
    
    const formattedCommands = commands.join("\n");

    bot.sendMessage(chatId, `Welcome Bro :)\nAvailable Command:\n${formattedCommands}`);}
   else {
    bot.sendMessage(chatId, "Invalid command");
  }
});
