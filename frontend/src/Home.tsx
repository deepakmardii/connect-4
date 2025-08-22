import React from "react";
import { useNavigate } from "react-router";

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: "center", marginTop: 40 }}>
            <h1>4 Connect</h1>
            <button onClick={() => navigate("/game?host=1")}>Create Game</button>
            <br /><br />
            <form
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    const code = (e.currentTarget.elements.namedItem("code") as HTMLInputElement)?.value.trim();
                    if (code) navigate(`/game?code=${code}`);
                }}
            >
                <input name="code" placeholder="Enter Game Code" maxLength={6} />
                <button type="submit">Join Game</button>
            </form>
        </div>
    );
};

export default Home;