// components/ui/DataTable.tsx
import * as React from "react";
import { Card, CardBody } from "./Card";

export type Column<T> = {
    key: keyof T | string;
    label: string;
    render?: (row: T) => React.ReactNode;
};

export function DataTable<T extends Record<string, unknown>>({
    title,
    columns,
    rows,
    emptyMessage = "No data found",
    onRowClick,
}: {
    title?: string;
    columns: Column<T>[];
    rows: T[];
    emptyMessage?: string;
    onRowClick?: (row: T) => void;
}) {
    return (
        <Card>
            <CardBody className="bd-grid" style={{ gap: 12 }}>
                {title && <div className="bd-h2">{title}</div>}
                <div className="bd-table-wrap">
                    <table className="bd-table">
                        <thead>
                            <tr>
                                {columns.map((c) => (
                                    <th key={String(c.key)}>{c.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="bd-table-empty">
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, i) => (
                                    <tr
                                        key={i}
                                        onClick={() => onRowClick?.(row)}
                                        style={{ cursor: onRowClick ? "pointer" : "default" }}
                                    >
                                        {columns.map((c) => (
                                            <td key={String(c.key)}>
                                                {c.render ? c.render(row) : String(row[c.key as keyof T] ?? "")}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardBody>
        </Card>
    );
}
