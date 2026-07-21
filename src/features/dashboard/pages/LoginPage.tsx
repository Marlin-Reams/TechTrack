import { useState } from "react";
import { login } from "../../auth/services/authService";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningIn, setIsSigningIn] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsSigningIn(true);

        try {
            await login(email, password);
        } catch (error) {
            console.error(error);
            setIsSigningIn(false);
        }
    }
    return (
        <main>
            <h1>TechTrack Login</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <br />
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <br />

                <div>
                    <label htmlFor="password">Password</label>
                    <br />
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <br />

                <button type="submit" disabled={isSigningIn}>
                    {isSigningIn ? "Signing In..." : "Sign In"}
                </button>
            </form>
        </main>
    );
}

export default LoginPage;