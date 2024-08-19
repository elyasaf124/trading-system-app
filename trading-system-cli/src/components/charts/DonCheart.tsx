import "chart.js/auto";
import { Line } from "react-chartjs-2";
import "./LineChart.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Istock } from "../../types/stockTypes";
import { IStockAndCompany } from "../../types/companyTypes";
import { updatedData } from "../../utiltis/formetDate";

export const DonCheart = ({ companiesAndStocks }: any) => {
  const newData = useSelector((state: any) => state.stock.socktData);
  const selectCompanyByRange = useSelector(
    (state: any) => state.stock.selectCompanyByRange
  );
  const marketSelect = useSelector(
    (state: any) => state.stock.marketSummarySelect
  );
  const [filterArray, setFilterArray] = useState<Istock[]>([]);
  useEffect(() => {
    if (newData && newData.length !== 0) return;
    companiesAndStocksFilter();
  }, [companiesAndStocks, marketSelect]);

  const companiesAndStocksFilter = async () => {
    let selectCompany;
    if (companiesAndStocks.length === 1) {
      selectCompany = companiesAndStocks;
    } else {
      selectCompany = await companiesAndStocks.filter(
        (data: IStockAndCompany) => {
          return data.company._id === marketSelect;
        }
      );
    }
    let updatearr;

    if (selectCompany.length > 0) {
      updatearr = await updatedData(selectCompany);
      setFilterArray(updatearr);
    }
  };
  useEffect(() => {
    if (newData && newData.companyIdRef === filterArray[0]?.companyIdRef) {
      setFilterArray((prev: any) => [...prev, newData]);
    } else {
      return;
    }
  }, [newData]);

  useEffect(() => {
    if (selectCompanyByRange.length > 0) {
      setFilterArray(selectCompanyByRange);
    } else {
      return;
    }
  }, [selectCompanyByRange]);

  if (filterArray.length === 0) {
    return <div>Loading..</div>;
  }

  let labels = filterArray.map((data: any) => {
    const date = new Date(data.createdAt);
    return date.toLocaleString("default", { month: "short" });
  });

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Stock Price",
        data: filterArray.map((stock: Istock) => {
          return stock.stockPrice;
        }),
        date: filterArray.map((stock: Istock) => stock.date),
        hour: filterArray.map((stock: Istock) => stock.hour),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          callback: (_value: any, index: any, _values: any) => {
            if (labels[index - 1] !== labels[index]) {
              return labels[index];
            } else {
              return;
            }
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `Price: ${context.parsed.y.toFixed(4)}`;
          },
          title: (context: any) => {
            let arr = context[0].dataset.date;
            let index = context[0].dataIndex;
            let date = arr[index];
            return `Date: ${date}`;
          },
          afterTitle: (context: any) => {
            let houers = context[0].dataset.hour;
            let index = context[0].dataIndex;
            let hour = houers[index];
            return `Hour:${hour}`;
          },
        },
        enabled: true,
      },
    },
  };
  return (
    <div className="chart-container">
      {data && <Line data={data} options={options} className="chartLine" />}
    </div>
  );
};
