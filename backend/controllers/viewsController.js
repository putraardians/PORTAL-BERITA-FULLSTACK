import db from "../config/db.js";

// 🔧 Ambil ID kategori dari nama kategori
async function getCategoryIdByName(categoryName) {
  try {
    if (!categoryName) return null;

    const [rows] = await db
      .promise()
      .query("SELECT id FROM categories WHERE LOWER(name) = ? LIMIT 1", [
        categoryName.toLowerCase(),
      ]);

    if (rows.length > 0) return rows[0].id;
  } catch (err) {
    console.error("❌ Gagal cari category dari nama:", err);
  }

  return null;
}

// 🔧 Ambil ID kategori default jika tidak ditemukan
async function getDefaultCategoryId() {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT id FROM categories WHERE LOWER(name) = 'uncategorized' LIMIT 1");

    if (rows.length > 0) return rows[0].id;
  } catch (err) {
    console.error("❌ Gagal ambil kategori default:", err);
  }
  return null;
}

// ✅ Rekam view baru SAAT MASUK halaman berita (tanpa durasi)
export const recordView = async (req, res) => {
  try {
    const {
      news_id,
      external_url,
      source_type,
      category_id: clientCategoryId,
      title,
      category_name,
      duration,
      view_id,
      traffic_source
    } = req.body;

    const device_type = req.useragent?.isMobile
      ? "Mobile"
      : req.useragent?.isTablet
      ? "Tablet"
      : "Desktop";

    if (duration && view_id) {
      await db.promise().query(
        `UPDATE news_views SET duration = ? WHERE id = ?`,
        [duration, view_id]
      );
      return res.json({ success: true, message: "Durasi diperbarui." });
    }

    if (
      !source_type ||
      (source_type === "internal" && !news_id) ||
      (source_type === "external" && !external_url)
    ) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap (news_id atau external_url).",
      });
    }

    let category_id = null;
    if (source_type === "internal") {
      const [rows] = await db
        .promise()
        .query("SELECT category_id FROM news WHERE id = ?", [news_id]);
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Berita internal tidak ditemukan.",
        });
      }
      category_id = rows[0].category_id;
    } else if (source_type === "external") {
      if (clientCategoryId !== undefined && clientCategoryId !== null) {
        category_id = clientCategoryId;
      } else if (category_name) {
        category_id = await getCategoryIdByName(category_name);
      } else if (title) {
        const [rows] = await db
          .promise()
          .query(
            "SELECT category_id FROM news WHERE title = ? AND category_id IS NOT NULL LIMIT 1",
            [title]
          );
        if (rows.length > 0) category_id = rows[0].category_id;
      }

      if (!category_id) {
        category_id = await getDefaultCategoryId();
      }
    }

    const [result] = await db.promise().query(
      `INSERT INTO news_views 
      (news_id, external_url, source_type, category_id, duration, title, device_type, traffic_source)
       VALUES (?, ?, ?, ?, NULL, ?, ?, ?)`,
      [
        news_id || null,
        external_url || null,
        source_type,
        category_id,
        source_type === "external" ? title : null,
        device_type,
        traffic_source || null
      ]
    );

    res.json({
      success: true,
      message: "View berhasil tercatat.",
      view_id: result.insertId,
    });
  } catch (err) {
    console.error("❌ Gagal mencatat/memperbarui view:", err);
    res.status(500).json({
      success: false,
      message: "Server error saat mencatat/memperbarui view.",
    });
  }
};

export const updateViewDuration = async (req, res) => {
  try {
    const { id } = req.params;
    const { duration } = req.body;

    if (!id || isNaN(duration)) {
      return res.status(400).json({
        success: false,
        message: "ID dan duration wajib diisi.",
      });
    }

    await db
      .promise()
      .query("UPDATE news_views SET duration = ? WHERE id = ?", [duration, id]);

    res.json({ success: true, message: "Durasi berhasil diperbarui." });
  } catch (err) {
    console.error("❌ Gagal update durasi:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTrafficOverview = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT DATE(viewed_at) AS date, COUNT(*) AS total_views
      FROM news_views
      GROUP BY DATE(viewed_at)
      ORDER BY date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Gagal ambil traffic overview:", err);
    res.status(500).json({ message: "Gagal ambil data traffic." });
  }
};

export const getPopularCategories = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT c.name AS category, COUNT(*) AS total_views
      FROM news_views nv
      JOIN categories c ON nv.category_id = c.id
      GROUP BY nv.category_id
      ORDER BY total_views DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Gagal ambil kategori populer:", err);
    res.status(500).json({ message: "Gagal ambil data kategori populer." });
  }
};

export const getAnalyticsSummary = async (req, res) => {
  try {
    const [[{ internal_articles }]] = await db
      .promise()
      .query(`SELECT COUNT(*) AS internal_articles FROM news`);

    const [[{ external_articles }]] = await db
      .promise()
      .query(`
        SELECT COUNT(DISTINCT external_url) AS external_articles 
        FROM news_views 
        WHERE source_type = 'external'
      `);

    const [[{ total_views }]] = await db
      .promise()
      .query(`SELECT COUNT(*) AS total_views FROM news_views`);

    const [[{ bounce_views }]] = await db
      .promise()
      .query(`
        SELECT COUNT(*) AS bounce_views 
        FROM news_views 
        WHERE source_type = 'external'
      `);

    const [[{ avg_duration }]] = await db
      .promise()
      .query(`
        SELECT AVG(duration) AS avg_duration 
        FROM news_views 
        WHERE duration IS NOT NULL
      `);

    const avgTime = avg_duration ? Math.round(avg_duration) : 0;

    const bounceRate =
      total_views > 0
        ? `${Math.round((bounce_views / total_views) * 100)}%`
        : "0%";

    const totalArticles = internal_articles + external_articles;

    res.json({
      totalArticles,
      totalViews: total_views,
      avgTime,
      bounceRate,
    });
  } catch (err) {
    console.error("❌ Gagal ambil summary analytics:", err);
    res.status(500).json({ message: "Server error" });
  }
};

function kMeansClustering(data, k = 3, maxIterations = 100) {
  if (data.length < k) return { clusters: data.map(() => 0) };

  const centroids = data.slice(0, k).map(point => [...point]);
  let clusters = new Array(data.length).fill(0);

  for (let iter = 0; iter < maxIterations; iter++) {
    clusters = data.map((point) => {
      let minDist = Infinity;
      let clusterIndex = 0;
      for (let i = 0; i < k; i++) {
        const dist = Math.sqrt(
          point.reduce((sum, val, idx) => sum + Math.pow(val - centroids[i][idx], 2), 0)
        );
        if (dist < minDist) {
          minDist = dist;
          clusterIndex = i;
        }
      }
      return clusterIndex;
    });

    for (let i = 0; i < k; i++) {
      const clusterPoints = data.filter((_, idx) => clusters[idx] === i);
      if (clusterPoints.length === 0) continue;
      centroids[i] = clusterPoints[0].map((_, dim) =>
        clusterPoints.reduce((sum, point) => sum + point[dim], 0) / clusterPoints.length
      );
    }
  }

  return { clusters };
}

function normalize(arr) {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  return arr.map(v => (max - min === 0 ? 0 : (v - min) / (max - min)));
}

export const getTopArticles = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        COALESCE(n.title, nv.title) AS title,
        COALESCE(c.name, 'Uncategorized') AS category,
        COUNT(nv.id) AS views,
        ROUND(AVG(nv.duration)) AS avgTime,
        SUM(CASE WHEN nv.duration < 15 THEN 1 ELSE 0 END) / COUNT(*) AS bounceRate
      FROM news_views nv
      LEFT JOIN news n ON nv.news_id = n.id
      LEFT JOIN categories c ON nv.category_id = c.id
      GROUP BY title, category
      ORDER BY views DESC
      LIMIT 10
    `);

    // Ambil hanya 5 teratas
    const top5 = rows.slice(0, 5);

    const rawData = top5.map(row => [
      row.views,
      row.avgTime || 0,
      parseFloat(row.bounceRate || 0),
    ]);

    const viewsArr = rawData.map(d => d[0]);
    const timeArr = rawData.map(d => d[1]);
    const bounceArr = rawData.map(d => d[2]);

    const normViews = normalize(viewsArr);
    const normTime = normalize(timeArr);
    const normBounce = normalize(bounceArr);

    const normData = rawData.map((_, i) => [
      normViews[i],
      normTime[i],
      normBounce[i]
    ]);

    const k = Math.min(3, normData.length);
    let clusters = [];

    if (normData.length > 1) {
      const { clusters: rawClusters } = kMeansClustering(normData, k);

      // Skor untuk pemeringkatan cluster
      const clusterScores = [];
      for (let i = 0; i < k; i++) {
        const clusterPoints = normData.filter((_, idx) => rawClusters[idx] === i);
        if (clusterPoints.length === 0) continue;

        const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length || 0;
        const viewsAvg = avg(clusterPoints.map(p => p[0]));
        const timeAvg = avg(clusterPoints.map(p => p[1]));
        const bounceAvg = avg(clusterPoints.map(p => p[2]));

        // Bobot: views 50%, time 30%, bounce -20%
        const score = (viewsAvg * 0.5) + (timeAvg * 0.3) - (bounceAvg * 0.2);
        clusterScores.push({ clusterIndex: i, score });
      }

      clusterScores.sort((a, b) => a.score - b.score);
      const labelOrder = ["Low", "Medium", "High"];
      const labelMap = {};
      clusterScores.forEach((entry, i) => {
        labelMap[entry.clusterIndex] = labelOrder[i] || `Cluster-${i}`;
      });

      clusters = rawClusters.map(idx => labelMap[idx]);
    } else {
      clusters = Array(rawData.length).fill("Unclustered");
    }

    const articles = top5.map((row, index) => ({
      title: row.title,
      category: row.category,
      views: row.views,
      avgTime: row.avgTime,
      bounceRate: `${Math.round(parseFloat(row.bounceRate || 0) * 100)}%`,
      cluster: clusters[index]
    }));

    console.table(articles);
    res.json({ articles });
  } catch (err) {
    console.error("❌ Gagal ambil top articles:", err);
    res.status(500).json({ message: "Gagal ambil data artikel teratas" });
  }
};

export const getTrafficSources = (req, res) => {
  const sql = `
    SELECT traffic_source AS name, COUNT(*) AS value
    FROM news_views
    WHERE traffic_source IS NOT NULL
    GROUP BY traffic_source
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error in getTrafficSources:", err);
      return res.status(500).json({ message: "Failed to get traffic sources" });
    }
    res.json(result);
  });
};

export const getDeviceDistribution = (req, res) => {
  const sql = `
    SELECT device_type AS name, COUNT(*) AS value
    FROM news_views
    WHERE device_type IS NOT NULL
    GROUP BY device_type
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error in getDeviceDistribution:", err);
      return res.status(500).json({ message: "Failed to get device distribution" });
    }
    res.json(result);
  });
};

