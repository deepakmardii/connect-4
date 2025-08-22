import React from "react";

type ControlsProps = {
    onRestart: () => void;
    onLeave: () => void;
    disabled?: boolean;
};

const Controls: React.FC<ControlsProps> = ({ onRestart, onLeave, disabled }) => (
    <div style={{ marginTop: 16 }}>
        <button onClick={onRestart} disabled={disabled} style={{ marginRight: 8 }}>
            Restart Game
        </button>
        <button onClick={onLeave} disabled={disabled}>
            Leave Game
        </button>
    </div>
);

export default Controls;