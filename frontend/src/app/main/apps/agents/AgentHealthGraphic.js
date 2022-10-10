import _ from "@lodash";

import { useSelector } from "react-redux";
import ReactApexChart from "react-apexcharts";
import { styled, ThemeProvider, useTheme } from "@mui/material/styles";
import { selectContrastMainTheme } from "app/store/fuse/settingsSlice";

import Paper from "@mui/material/Paper";
import { Chip, Typography } from "@mui/material";

const Root = styled(Paper)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

function AgentHealthGraphic(props) {
  const { agentHealth, interval, setInterval } = props;

  const theme = useTheme();
  const contrastTheme = useSelector(
    selectContrastMainTheme(theme.palette.primary.main)
  );

  const chartOptions = {
    chart: {
      animations: {
        speed: 400,
        animateGradually: {
          enabled: false,
        },
      },
      fontFamily: "inherit",
      foreColor: "inherit",
      width: "100%",
      height: "100%",
      type: "area",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: [contrastTheme.palette.secondary.light],
    dataLabels: {
      enabled: false,
    },
    fill: {
      colors: [contrastTheme.palette.secondary.dark],
    },
    grid: {
      show: true,
      borderColor: contrastTheme.palette.divider,
      padding: {
        top: 10,
        bottom: 0,
        left: 20,
        right: 20,
      },
      position: "back",
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    stroke: {
      width: 2,
    },
    tooltip: {
      followCursor: true,
      theme: "dark",
      x: {
        format: "MMM dd, yyyy HH:mm",
      },
      y: {
        formatter: (value) => `${value}`,
      },
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        offsetY: 0,
        style: {
          colors: contrastTheme.palette.text.secondary,
        },
      },
      tickAmount: 20,
      tooltip: {
        enabled: false,
      },
      // type: "datetime",
    },
    yaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      min: (min) => 0,
      max: (max) => 100,
      tickAmount: 1,
      show: false,
    },
  };

  return (
    <ThemeProvider theme={contrastTheme}>
      <Root className="sm:col-span-2 lg:col-span-3 dark flex flex-col flex-auto shadow rounded-2xl overflow-hidden mt-20">
        <div className="flex items-center justify-between mt-20 ml-20 mr-24 sm:mr-20">
          <div className="flex flex-col">
            <Typography className="font-medium flex items-center mt-8 text-lg leading-6">
              <span className="whitespace-nowrap leading-none w-200">
                <i>Metric</i>
              </span>
              <span className="whitespace-nowrap leading-none">
                {agentHealth.name}
              </span>
            </Typography>
          </div>
          <div className="mt-12">
            <Chip
              size="small"
              className="font-medium text-sm ml-12"
              label="1 hora"
              color={interval == 60 ? "secondary" : "default"}
              onClick={() => {
                setInterval(60);
              }}
            />
            <Chip
              size="small"
              className="font-medium text-sm ml-12"
              label="6 horas"
              color={interval == 360 ? "secondary" : "default"}
              onClick={() => {
                setInterval(360);
              }}
            />
            <Chip
              size="small"
              className="font-medium text-sm ml-12"
              label="12 horas"
              color={interval == 720 ? "secondary" : "default"}
              onClick={() => {
                setInterval(720);
              }}
            />

            {/* <Chip
              size="small"
              className="font-medium text-sm ml-12"
              label="24 horas"
              color={interval == 1440 ? "secondary" : "default"}
              onClick={() => {
                setInterval(1440);
              }}
            /> */}
          </div>
        </div>
        <div className="flex flex-col flex-auto h-320">
          {agentHealth && (
            <ReactApexChart
              options={chartOptions}
              series={[agentHealth]}
              type={chartOptions.chart.type}
              height={chartOptions.chart.height}
            />
          )}
        </div>
      </Root>
    </ThemeProvider>
  );
}

export default AgentHealthGraphic;
