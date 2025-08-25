import React from "react";
import { useNavigate } from "react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center min-h-screen bg-background">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">4 Connect</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <Button className="w-full" onClick={() => navigate("/game?host=1")}>
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
                        <Button type="submit" className="w-full">
                            Join Game
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Home;