import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

const BasicTables = ({ data, columns }) => {
  return (
    <>
      <DataTable value={data} tableStyle={{ minWidth: "50rem" }}>
        {columns.map((col, i) => (
          <Column key={col.field} field={col.field} header={col.header} />
        ))}
      </DataTable>
    </>
  );
};

export default BasicTables;
