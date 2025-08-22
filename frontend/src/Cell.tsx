import React from "react";

type CellProps = {
    value: number; // 0 = empty, 1 = red, 2 = yellow
    onClick: () => void;
};

const colors = ["#eee", "red", "gold"];

const Cell: React.FC<CellProps> = ({ value, onClick }) => (
    <button
        onClick={onClick}
        style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: "1px solid #888",
            background: colors[value] || "#eee",
            cursor: "pointer",
            outline: "none",
            padding: 0,
        }}
    />
);

export default Cell;