import React from "react";
import Cell from "./Cell";

type BoardProps = {
    board: number[][];
    onDrop: (col: number) => void;
    disabled?: boolean;
};

const Board: React.FC<BoardProps> = ({ board, onDrop, disabled }) => (
    <div style={{ display: "grid", gridTemplateRows: "repeat(6, 40px)", gridTemplateColumns: "repeat(7, 40px)", gap: 2 }}>
        {board.map((row, rIdx) =>
            row.map((cell, cIdx) => (
                <Cell
                    key={rIdx + "-" + cIdx}
                    value={cell}
                    onClick={() => !disabled && onDrop(cIdx)}
                />
            ))
        )}
    </div>
);

export default Board;