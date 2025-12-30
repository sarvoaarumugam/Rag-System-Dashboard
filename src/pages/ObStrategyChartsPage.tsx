import ChartContainer from "../components/chart/ChartContainer";
import ChartSection from "../components/chart/ChartSection";
import Header from "../components/common/Header";
import PageTitle from "../components/common/PageTitle";
import { useChartsContext } from "../context/ChartsContext";
import { IndividualChartContextProvider } from "../context/IndividualChartContext";
import { useParams } from "react-router-dom";

const ObStrategyChartsPage = () => {
  const { fullscreen, fullscreenConfig } = useChartsContext();
  const { symbol } = useParams<{ symbol: string }>();

  return (
    <>
      {!fullscreen && (
        <>
          <Header />
          <PageTitle
            titleProp="OB Strategy Charts"
            backButtonLinkProp="/ob-strategy/charts"
          />

          <div className="px-6 bg-white flex justify-center mb-6">
            <div className="max-w-[1440px] w-full bg-white p-6 flex flex-col gap-6">
              <ChartSection
                getChartConfigEventProp="get_chart_config"
                symbol={symbol}
              />
            </div>
          </div>
        </>
      )}

      {/* Full Screen Chart */}
      {fullscreen && fullscreenConfig && (
        <div className="w-full h-screen p-6">
          <IndividualChartContextProvider>
            <ChartContainer
              chartConfigProp={fullscreenConfig}
              strategyProp="ob-strategy"
            />
          </IndividualChartContextProvider>
        </div>
      )}
    </>
  );
};

export default ObStrategyChartsPage;
