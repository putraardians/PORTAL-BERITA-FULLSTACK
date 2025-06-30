const db = require("../config/db");

const News = {
  create: (data, callback) => {
    const sql = "INSERT INTO news (title, content, image, category, author_id) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [data.title, data.content, data.image, data.category, data.author_id], callback);
  },
  getAll: (callback) => {
    db.query("SELECT news.*, users.username AS author FROM news JOIN users ON news.author_id = users.id", callback);
  }
};

module.exports = News;
