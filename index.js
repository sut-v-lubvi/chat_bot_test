const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const request = require("request");
const path = require("path");
const docxPdf = require("docx-pdf");

const token = "6755071690:AAFYYRrQJc1o_NPNUKQavOuc9ILSl428f5U";
const bot = new TelegramBot(token, { polling: true });

const download = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on("close", callback);
  });
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendPhoto(chatId, "./img/sticker.webp");

  bot.sendMessage(
    chatId,
    "Салам ! Отправь мне файл в формате .docx для конвертации."
  );
});

bot.on("document", async (msg) => {
  const fileId = msg.document.file_id;
  const fileExt = msg.document.file_name.split(".").pop().toLowerCase();

  try {
    if (fileExt === "docx") {
      const pathToOldFile = `./files/${fileId}.docx`;
      const pathToNewfile = `./files/${fileId}.pdf`;

      bot.sendMessage(msg.chat.id, "Выберите формат для конвертации:", {
        reply_markup: {
          inline_keyboard: [[{ text: "PDF", callback_data: "pdf" }]],
        },
      });

      bot.on("callback_query", async (query) => {
        if (query.data === "pdf") {
          let filePath;
          bot.getFile(fileId).then((resp) => {
            filePath = resp.file_path;
            const downloadURL = `https://api.telegram.org/file/bot${token}/${filePath}`;

            download(
              downloadURL,
              path.join(__dirname, `files`, `${fileId}.docx`),
              () => {
                docxPdf(pathToOldFile, pathToNewfile, function (err, result) {
                  if (err) {
                    console.log(err);
                  }
                  bot.sendDocument(msg.chat.id, pathToNewfile);

                  console.log("result" + result);
                });

                setTimeout(() => {
                  fs.unlink(pathToOldFile, (err) => {
                    if (err) throw err;
                    console.log("OldFile deleted successfully!");
                  });
                  fs.unlink(pathToNewfile, (err) => {
                    if (err) throw err;
                    console.log("NewFile deleted successfully!");
                  });
                }, [3000]);
              }
            );
          });
        }
      });
    } else {
      throw new Error("Пожалуйста, отправьте файл в формате .docx");
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(
      msg.chat.id,
      "Произошла ошибка при обработке файла. Пожалуйста, отправьте файл в формате .docx"
    );
  }
});
