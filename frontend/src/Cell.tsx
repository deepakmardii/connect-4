import React from "react";
import { Button } from "@/components/ui/button";

type CellProps = {
    value: number; // 0 = empty, 1 = red, 2 = yellow
    onClick: () => void;
};

const colors = [
    "bg-neutral-200 dark:bg-neutral-700",
    "bg-red-500",
    "bg-yellow-400"
];

const Cell: React.FC<CellProps> = ({ value, onClick }) => (
    <Button
        onClick={onClick}
        className={`w-10 h-10 rounded-full border border-neutral-400 p-0 ${colors[value] || colors[0]}`}
        variant="ghost"
        tabIndex={0}
        aria-label={value === 0 ? "Empty cell" : value === 1 ? "Red disc" : "Yellow disc"}
    />
);

export default Cell;