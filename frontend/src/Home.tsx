import React from "react";
import { useNavigate } from "react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex justify-center items-center min-h-screen overflow-hidden bg-gradient-to-br from-fuchsia-500 via-yellow-400 to-cyan-400 animate-gradient-x">
            {/* Confetti SVG overlay */}
            <svg className="pointer-events-none absolute inset-0 w-full h-full opacity-60" style={{ zIndex: 0 }} aria-hidden="true">
                <defs>
                    <pattern id="confetti" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="10" cy="10" r="4" fill="#fff176" />
                        <rect x="25" y="25" width="6" height="6" fill="#f50057" rx="2" />
                        <circle cx="30" cy="12" r="3" fill="#00e676" />
                        <rect x="5" y="28" width="5" height="5" fill="#2979ff" rx="2" />
                        <circle cx="20" cy="35" r="2" fill="#ff9100" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#confetti)" />
            </svg>
            <div className="relative z-10 w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]">4 Connect</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <Button className="w-full font-bold" onClick={() => navigate("/game?host=1")}>
                            Create Game
                        </Button>
                        <form
                            className="flex flex-col gap-3"
                            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                                e.preventDefault();
                                const code = (e.currentTarget.elements.namedItem("code") as HTMLInputElement)?.value.trim();
                                if (code) navigate(`/game?code=${code}`);
                            }}
                        >
                            <Input name="code" placeholder="Enter Game Code" maxLength={6} />
                            <Button type="submit" className="w-full font-bold">
                                Join Game
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Home;