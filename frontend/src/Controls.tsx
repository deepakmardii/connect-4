import React from "react";
import { Button } from "@/components/ui/button";

type ControlsProps = {
    onRestart: () => void;
    onLeave: () => void;
    disabled?: boolean;
};

const Controls: React.FC<ControlsProps> = ({ onRestart, onLeave, disabled }) => (
    <div className="mt-4 flex gap-4 justify-center">
        <Button onClick={onRestart} disabled={disabled} variant="secondary">
            Restart Game
        </Button>
        <Button onClick={onLeave} disabled={disabled} variant="destructive">
            Leave Game
        </Button>
    </div>
);

export default Controls;