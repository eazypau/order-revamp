import { Inter } from "next/font/google";
import NavBar from "@/components/NavBar";
import Dashboard from "@/views/Dashboard";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <NavBar />
      <Dashboard />
    </div>
  );
}
