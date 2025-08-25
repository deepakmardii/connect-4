import React from "react";
import Cell from "./Cell";

type BoardProps = {
    board: number[][];
    onDrop: (col: number) => void;
    disabled?: boolean;
};

const Board: React.FC<BoardProps> = ({ board, onDrop, disabled }) => (
    <div className="grid grid-rows-6 grid-cols-7 gap-1">
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