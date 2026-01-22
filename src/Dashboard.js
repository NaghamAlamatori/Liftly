import React from 'react';
import './Dashboard.css';
import { mcpAsset } from "./lib/publicAssets";

const imgUnion1 = mcpAsset("0525cb84-ab8f-4bd4-8758-29cd9c0be95a");
const imgUnion2 = mcpAsset("14c7162b-9a53-44ea-9655-66abd9bbad04");
const imgLogo2 = mcpAsset("f4d78c6d-9df9-440f-a139-1272f03844f1");
const imgDashboardSquare02 = mcpAsset("42b8cb0a-d9df-4d87-8041-0baa32bff9a8");
const imgDashboardSquare3 = mcpAsset("639a2633-78f3-4d72-b354-b58e79301954");
const imgStreamlinehqInterfaceFileContentListLine48IcoSX3WdVoJmKaLbppI = mcpAsset("f3c8f488-66ab-4ca4-8989-e10a4c6bbba7");
const imgArrowLeft02 = mcpAsset("30ed2204-24ea-44d8-85e7-87c686be4af6");
const imgRectangle16 = mcpAsset("b42db037-0dea-4353-93ed-95d0e014afe3");
const imgChevronDown1 = mcpAsset("4cf90686-34e5-4858-be8d-379114fad4d3");
const imgRectangle29 = mcpAsset("8cb0144e-f0a7-490f-8466-30c097f61948");
const imgVector = mcpAsset("d8eabca7-23d3-425c-a198-6f2f3eacd24e");
const imgVector1 = mcpAsset("41d3d4e4-f64f-4602-82be-564641e072e6");
const imgRectangle30 = mcpAsset("46433c36-4108-434e-aa5e-6b863e6bdcfe");
const imgEllipse4 = mcpAsset("511ff54a-e3de-4a11-b2d9-bbdd957c6806");
const imgEllipse5 = mcpAsset("8ca633a3-d19b-4c44-98e3-8e05062e29df");
const imgEllipse6 = mcpAsset("6978a69d-7c94-4bc1-ae29-a5c8ba4ba63d");
const imgEllipse7 = mcpAsset("86ad42c2-2759-4b74-80c7-08edaaaaf307");
const imgPriceTag3Line = mcpAsset("bdefd48c-b1d1-4485-807a-91bb571723ee");
const imgGroup29 = mcpAsset("8fc45249-e2fc-497c-9296-5cf2caf5f3cb");

function Users1({ className }) {
  return (
    <div className={className} data-name="users-02">
      <div className="users-icon-inner" data-name="union-1">
        <img alt="" className="icon-img" src={imgUnion1} />
      </div>
    </div>
  );
}

function Users({ className }) {
  return (
    <div className={className} data-name="users-01">
      <div className="users-icon-inner" data-name="union-1">
        <img alt="" className="icon-img" src={imgUnion2} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="dashboard-container" data-name="dashboard">
      {/* Sidebar */}
      <div className="sidebar" />
      
      {/* Logo */}
      <div className="logo-container">
        <div className="logo-img-container">
          <img alt="LIFTLY Logo" className="logo-img" src={imgLogo2} />
        </div>
        <p className="logo-text">LIFTLY</p>
      </div>

      {/* Navigation Items */}
      <div className="nav-item dashboard-nav">
        <div className="nav-icon">
          <img alt="" className="icon-img" src={imgDashboardSquare02} />
        </div>
        <p className="nav-text">Dashboard</p>
      </div>

      <a className="nav-item create-user-nav" href="#create-user">
        <Users className="nav-icon" />
        <p className="nav-text">Create User</p>
      </a>

      <div className="nav-item users-nav">
        <Users1 className="nav-icon" />
        <p className="nav-text">Users</p>
      </div>

      <a className="nav-item articles-nav" href="#articles">
        <div className="nav-icon">
          <img alt="" className="icon-img" src={imgStreamlinehqInterfaceFileContentListLine48IcoSX3WdVoJmKaLbppI} />
        </div>
        <p className="nav-text">Articles</p>
      </a>

      <a className="nav-item products-nav" href="#products">
        <div className="nav-icon">
          <img alt="" className="icon-img" src={imgPriceTag3Line} />
        </div>
        <p className="nav-text">Products</p>
      </a>

      {/* Logout Button */}
      <div className="logout-button">
        <div className="logout-content">
          <div className="logout-icon-wrapper">
            <div className="logout-icon-rotated">
              <div className="logout-icon">
                <img alt="" className="icon-img" src={imgArrowLeft02} />
              </div>
            </div>
          </div>
          <p className="logout-text">Logout</p>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="header-icon">
          <img alt="" className="icon-img" src={imgDashboardSquare3} />
        </div>
        <p className="header-title">Dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        {/* Products Card */}
        <div className="stat-card">
          <div className="stat-card-bg" />
          <div className="stat-card-header">
            <div className="stat-label-wrapper">
              <p className="stat-label">Products</p>
            </div>
            <div className="stat-icon">
              <img alt="" className="icon-img" src={imgPriceTag3Line} />
            </div>
          </div>
          <div className="stat-value-container">
            <div className="stat-value-wrapper">
              <p className="stat-value">15,853</p>
            </div>
            <p className="stat-description">Total count</p>
          </div>
        </div>

        {/* Users Card */}
        <div className="stat-card stat-card-users">
          <div className="stat-card-bg" />
          <div className="stat-card-header">
            <div className="stat-label-wrapper">
              <p className="stat-label">Users</p>
            </div>
            <div className="stat-icon">
              <Users1 className="nav-icon" />
            </div>
          </div>
          <div className="stat-value-container">
            <div className="stat-value-wrapper">
              <p className="stat-value">30</p>
            </div>
            <p className="stat-description">Total count</p>
          </div>
        </div>

        {/* Articles Card */}
        <div className="stat-card stat-card-articles">
          <div className="stat-card-bg" />
          <div className="stat-card-header">
            <div className="stat-label-wrapper">
              <p className="stat-label">Articles</p>
            </div>
            <div className="stat-icon">
              <img alt="" className="icon-img" src={imgStreamlinehqInterfaceFileContentListLine48IcoSX3WdVoJmKaLbppI} />
            </div>
          </div>
          <div className="stat-value-container">
            <div className="stat-value-wrapper">
              <p className="stat-value">455</p>
            </div>
            <p className="stat-description">Total count</p>
          </div>
        </div>

        {/* Earning Card */}
        <div className="stat-card stat-card-earning">
          <div className="stat-card-bg" />
          <div className="stat-card-header">
            <div className="stat-label-wrapper">
              <p className="stat-label">Earning</p>
            </div>
            <div className="stat-icon earning-icon">
              <img alt="" className="icon-img" src={imgGroup29} />
            </div>
          </div>
          <div className="stat-value-container">
            <div className="stat-value-wrapper">
              <p className="stat-value">10,235%</p>
            </div>
            <p className="stat-description">Total count</p>
          </div>
        </div>
      </div>

      {/* Overview Chart */}
      <div className="overview-container">
        <div className="overview-bg">
          <img alt="" className="overview-bg-img" src={imgRectangle16} />
        </div>
        <div className="overview-header">
          <p className="overview-title">Overview</p>
          <p className="overview-subtitle">Monthly Earning</p>
        </div>
        <div className="overview-dropdown">
          <div className="dropdown-bg" />
          <div className="dropdown-icon">
            <img alt="" className="icon-img" src={imgChevronDown1} />
          </div>
          <p className="dropdown-text">Quarterly</p>
        </div>
        <div className="chart-bars">
          <div className="chart-bar bar-1" />
          <div className="chart-bar bar-2" />
          <div className="chart-bar bar-3" />
          <div className="chart-bar bar-4" />
          <div className="chart-bar bar-5" />
          <div className="chart-bar bar-6" />
          <div className="chart-bar bar-7" />
          <div className="chart-bar bar-8" />
          <div className="chart-bar bar-9" />
          <div className="chart-bar bar-10" />
          <div className="chart-bar bar-11" />
          <div className="chart-bar bar-12" />
        </div>
        <div className="chart-labels">
          <p className="chart-label">Jan</p>
          <p className="chart-label">Feb</p>
          <p className="chart-label">Mar</p>
          <p className="chart-label">Apr</p>
          <p className="chart-label">May</p>
          <p className="chart-label">Jun</p>
          <p className="chart-label chart-label-bold">Jul</p>
          <p className="chart-label chart-label-bold">Aug</p>
          <p className="chart-label">Sep</p>
          <p className="chart-label">Oct</p>
          <p className="chart-label">Nov</p>
          <p className="chart-label">Dec</p>
        </div>
        <div className="chart-indicator">
          <div className="indicator-bg">
            <img alt="" className="indicator-bg-img" src={imgRectangle29} />
          </div>
          <div className="indicator-content">
            <p className="indicator-value">35%</p>
            <div className="indicator-arrow">
              <img alt="" className="icon-img" src={imgVector} />
            </div>
            <div className="indicator-dot">
              <img alt="" className="icon-img" src={imgVector1} />
            </div>
          </div>
        </div>
      </div>

      {/* Customers Chart */}
      <div className="customers-container">
        <div className="customers-bg">
          <img alt="" className="customers-bg-img" src={imgRectangle30} />
        </div>
        <p className="customers-title">Customers</p>
        <p className="customers-subtitle">Customers that buy products</p>
        <div className="customers-chart">
          <div className="circle-outer">
            <img alt="" className="circle-img" src={imgEllipse4} />
          </div>
          <div className="circle-middle">
            <img alt="" className="circle-img" src={imgEllipse5} />
          </div>
          <div className="circle-inner-1">
            <img alt="" className="circle-img" src={imgEllipse6} />
          </div>
          <div className="circle-inner-2">
            <img alt="" className="circle-img" src={imgEllipse7} />
          </div>
          <div className="customers-percentage">
            <p className="percentage-value">65%</p>
            <p className="percentage-label">Total New Customers</p>
          </div>
        </div>
      </div>
    </div>
  );
}

