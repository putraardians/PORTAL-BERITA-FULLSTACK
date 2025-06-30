import React from "react";
import "../styles/DashboardCard.css";

function StatCard({ title, value, color, icon }) {
    return (
        <div className={`stat-card ${color}`}>
            <div className="stat-content">
                <div className="stat-text">
                    <h3>{title}</h3>
                    <p>{value}</p>
                    <span>Selengkapnya <b>➝</b></span>
                </div>
                <div className="stat-icon">
                    <img src={icon} alt={title} />
                </div>
            </div>
        </div>
    );
}

export default StatCard;
