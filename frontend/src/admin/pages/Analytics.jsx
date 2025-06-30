import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line,
  CartesianGrid, Legend, PieChart, Pie, Cell
} from "recharts";
import { FaRegFileAlt, FaEye, FaClock, FaChartBar } from "react-icons/fa";
import "../styles/Analytics.css";

function formatDuration(seconds) {
  if (isNaN(seconds) || seconds <= 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0 ? `${h}h ${m}m ${s}s` : `${m}:${s.toString().padStart(2, "0")}`;
}

function Analytics() {
  const [trafficData, setTrafficData] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const [topArticles, setTopArticles] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [trafficSources, setTrafficSources] = useState([]);
  const [summary, setSummary] = useState({
    totalArticles: 0,
    totalViews: 0,
    avgTime: 0,
    bounceRate: "0%",
  });

useEffect(() => {
  const fetchData = async () => {
    try {
      const [
        trafficRes,
        categoryRes,
        summaryRes,
        topArticlesRes,
        deviceRes,
        sourceRes
      ] = await Promise.all([
        fetch("http://localhost:5000/api/views/traffic-overview"),
        fetch("http://localhost:5000/api/views/popular-categories"),
        fetch("http://localhost:5000/api/views/summary"),
        fetch("http://localhost:5000/api/views/top-articles"),
        fetch("http://localhost:5000/api/views/device-distribution"),
        fetch("http://localhost:5000/api/views/traffic-sources"),
      ]);

      const trafficJson = await trafficRes.json();
      const categoryJson = await categoryRes.json();
      const summaryJson = await summaryRes.json();
      const topArticlesJson = await topArticlesRes.json();
      const deviceJson = await deviceRes.json();
      const sourceJson = await sourceRes.json();

      console.log("📊 Traffic mentah dari API:", trafficJson);

      const processedTrafficData = Array.isArray(trafficJson)
        ? trafficJson.map((item) => ({
            date: item.date,
            views: item.total_views,
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        : [];
      setTrafficData(processedTrafficData);
      console.log("📊 Traffic diurutkan (dari lama ke baru):", processedTrafficData);


      const clusterCategories = (categories) => {
        if (!categories || categories.length < 3)
          return categories.map((c) => ({ ...c, cluster: "Unclustered" }));

        const viewsArr = categories.map((c) => c.views);
        const min = Math.min(...viewsArr);
        const max = Math.max(...viewsArr);
        const step = (max - min) / 3;

        return categories.map((item) => {
          let cluster = "Low";
          if (item.views > min + 2 * step) cluster = "High";
          else if (item.views > min + step) cluster = "Medium";
          return { ...item, cluster };
        });
      };

      setPopularCategories(
        Array.isArray(categoryJson)
          ? clusterCategories(
              categoryJson.map((item) => ({
                name: item.category,
                views: item.total_views,
              }))
            )
          : []
      );

      setSummary({
        totalArticles: summaryJson?.totalArticles || 0,
        totalViews: summaryJson?.totalViews || 0,
        avgTime: summaryJson?.avgTime || 0,
        bounceRate: summaryJson?.bounceRate || "0%",
      });

      // Pindahkan console.log ke sini, setelah data diproses tetapi sebelum disetTopArticles
      // Dengan cara ini, Anda akan melihat data yang sudah difilter sebelum state diupdate
      const filteredTopArticles = Array.isArray(topArticlesJson?.articles)
          ? topArticlesJson.articles
              .filter(item => item.title && item.title.trim() !== '')
              .slice(0, 5)
              .map((item) => ({
                title: item.title,
                views: item.views,
                avgTime: formatDuration(item.avgTime),
                bounce: item.bounceRate,
                category: item.category,
                cluster: item.cluster || "Unclustered",
              }))
          : [];
      setTopArticles(filteredTopArticles);
      console.log("📊 Top Articles (difilter):", filteredTopArticles); // Log data yang sudah difilter di sini

      setDeviceData(
        Array.isArray(deviceJson)
          ? deviceJson
          : Array.isArray(deviceJson?.data)
          ? deviceJson.data
          : []
      );

      setTrafficSources(
        Array.isArray(sourceJson)
          ? sourceJson
          : Array.isArray(sourceJson?.data)
          ? sourceJson.data
          : []
      );
    } catch (err) {
      console.error("❌ Gagal ambil data analitik:", err);
    }
  };

  fetchData();
}, []); // Dependency array tetap kosong karena fetchData hanya perlu dijalankan sekali saat komponen dimount


  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2 className="title">News Analytics</h2>
        <p className="subtitle">Track and analyze news performance and engagement metrics</p>
      </div>

      <div className="stats-row modern">
        <div className="stat-card-light blue">
          <div className="stat-info">
            <span className="label">Total Articles</span>
            <h3>{summary.totalArticles}</h3>
            <span className="growth up">↑ 0 from last month</span>
          </div>
          <div className="stat-icon"><FaRegFileAlt /></div>
        </div>

        <div className="stat-card-light green">
          <div className="stat-info">
            <span className="label">Total Views</span>
            <h3>{summary.totalViews}</h3>
            <span className="growth up">↑ 0 from last month</span>
          </div>
          <div className="stat-icon"><FaEye /></div>
        </div>

        <div className="stat-card-light purple">
          <div className="stat-info">
            <span className="label">Avg. Time on Page</span>
            <h3>{formatDuration(summary.avgTime)}</h3>
            <span className="growth neutral">↔ 0 vs last month</span>
          </div>
          <div className="stat-icon"><FaClock /></div>
        </div>

        <div className="stat-card-light red">
          <div className="stat-info">
            <span className="label">Bounce Rate</span>
            <h3>{summary.bounceRate}</h3>
            <span className="growth down">↓ 0 from last month</span>
          </div>
          <div className="stat-icon"><FaChartBar /></div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-box">
          <h4>Traffic Overview</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trafficData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <XAxis
                dataKey="date"
                tickFormatter={(tick) => {
                  const date = new Date(tick);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                }}
                interval="preserveStartEnd"
              />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip labelFormatter={(label) => `Date: ${new Date(label).toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>Popular Categories (Clustered)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={popularCategories}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-section">
        <h4>Top Performing Articles (Clustered)</h4>
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Views</th>
              <th>Avg. Time</th>
              <th>Bounce Rate</th>
              <th>Category</th>
              <th>Cluster</th>
            </tr>
          </thead>
          <tbody>
            {topArticles.length === 0 ? (
              <tr><td colSpan="6">No data available</td></tr>
            ) : (
              topArticles.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.title}</td>
                  <td>{item.views}</td>
                  <td>{item.avgTime}</td>
                  <td>{item.bounce}</td>
                  <td>{item.category}</td>
                  <td>
                    <span className={`cluster-label ${item.cluster.toLowerCase()}`}>
                      {item.cluster}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="charts-row">
        <div className="chart-box">
          <h4>Device Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={deviceData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>Traffic Sources</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={trafficSources}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {trafficSources.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;