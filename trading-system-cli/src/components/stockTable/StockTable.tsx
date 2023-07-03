import "./stockTable.css";
import { UserPortfolio } from "../../types/userType";

interface Props {
  stockPortfolio: UserPortfolio[];
}

const StockTable = ({ stockPortfolio }: Props) => {
  if (!stockPortfolio || stockPortfolio.length === 0) {
    return <div>No stock portfolio found.</div>;
  }
  return (
    <table className="stock-table">
      <thead>
        <tr>
          <th>Icon</th>
          <th>Company Name</th>
          <th>Stock Symbol</th>
          <th>Quantity</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {stockPortfolio[0].stocks.map((stock: any) => (
          <tr key={stock._id}>
            <td>
              <img src={stock.icon} alt="Company Icon" />
            </td>
            <td>{stock.stockCompanyName}</td>
            <td>{stock.stockSymbol}</td>
            <td>{stock.quantityStocks}</td>
            <td>{stock.createdAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StockTable;
