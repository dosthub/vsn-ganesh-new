import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export function RecordsTable({
  headers,
  rows,
  caption,
}: {
  headers: string[];
  rows: React.ReactNode[][];
  caption: string;
}) {
  return (
    <div className="records-table">
      <Table aria-label={caption}>
        <TableHeader>
          <TableRow>
            {headers.map((h) => (
              <TableHead key={h} scope="col">
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, j) => (
                <TableCell key={j}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
