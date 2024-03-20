import { Inter } from "next/font/google";
import NavBar from "@/components/NavBar";
import Orders from "@/views/Orders";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <NavBar />
      <Orders />
    </div>
  );
}
