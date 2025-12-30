import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/middleware/ProtectedRoute";
import { ChartsContextProvider } from "./context/ChartsContext";
import TradeHistory from "./pages/TradeHistory";
import ChatHomePage from "./pages/ChatHomePage";
import ChatPage from "./pages/ChatPage";
import StrategyTester from "./pages/StrategyTester";
import { OBStartegyTesterContextProvider } from "./context/OBStrategyTesterContext";
import StrategyTesterHome from "./pages/StrategyTesterHome";
import StrategyTesterReport from "./pages/StrategyTesterReport";
import FilterFeaturesPage from "./pages/FilterFeaturesPage";
import ObStrategyChartsPage from "./pages/ObStrategyChartsPage";
import InPriceStrategyChartsPage from "./pages/InPriceStrategyChartsPage";
import StrategyAgentHomePage from "./pages/StrategyAgentHomePage";
import StrategyAgentCreatePage from "./pages/strategyAgent/StrategyAgentCreatePage";
import CoinsListPage from "./pages/CoinsListPage";

const App: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ChartsContextProvider>
                <Dashboard />
              </ChartsContextProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ob-strategy/charts"
          element={
            <ProtectedRoute>
              <ChartsContextProvider>
                <CoinsListPage strategyType="ob" />
              </ChartsContextProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ob-strategy/charts/:symbol"
          element={
            <ProtectedRoute>
              <ChartsContextProvider>
                <ObStrategyChartsPage />
              </ChartsContextProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/in-price-strategy/charts"
          element={
            <ProtectedRoute>
              <ChartsContextProvider>
                <CoinsListPage strategyType="in-price" />
              </ChartsContextProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/in-price-strategy/charts/:symbol"
          element={
            <ProtectedRoute>
              <ChartsContextProvider>
                <InPriceStrategyChartsPage />
              </ChartsContextProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trade-history"
          element={
            <ProtectedRoute>
              <TradeHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/strategy-agent"
          element={
            <ProtectedRoute>
              <StrategyAgentHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/strategy-agent/create"
          element={
            <ProtectedRoute>
              <StrategyAgentCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/strategy-agent/report/:agent_report_id"
          element={
            <ProtectedRoute>
              <StrategyAgentCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/strategy-tester"
          element={
            <ProtectedRoute>
              <StrategyTesterHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/strategy-tester/create"
          element={
            <ProtectedRoute>
              <OBStartegyTesterContextProvider>
                <StrategyTester />
              </OBStartegyTesterContextProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/strategy-tester/report/:report_id"
          element={
            <ProtectedRoute>
              <StrategyTesterReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/strategy-tester/report/:report_id/filter-features"
          element={
            <ProtectedRoute>
              <FilterFeaturesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:session_id"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
