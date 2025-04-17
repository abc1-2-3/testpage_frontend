"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";


export default function MessageForm() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [amount, setAmount] = useState(100);
    const [status, setStatus] = useState("");

    const handleDonate = async () => {
        setStatus("處理中...");
        try {
            const res = await fetch("https://localhost:44333/api/Ecpay/CreateOrder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, message, amount }),
            });
            if (res.ok) {
                const html = await res.text(); // 接收 html 字串
                const win = window.open("", "_self"); // 或 "_blank" 開新分頁
                window.document.write(html);
                window.document.close(); // 觸發 <script> 自動 submit
            } else {
                setStatus("發生錯誤，請稍後再試。");
            }
        } catch (error) {
            console.error(error);
            setStatus("無法連線伺服器。");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center p-4">
            <Card className="w-full max-w-md">
                <CardContent>
                    <h2 className="text-xl font-bold">小小贊助一下 ✨</h2>
                    <Input
                        placeholder="你的名字"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mb-4"
                    />
                    <Input
                        placeholder="留言"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="mb-4"
                    />
                    <Input
                        type="number"
                        placeholder="金額"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="mb-4"
                    />
                    <Button onClick={handleDonate} className="w-full">
                        贊助
                    </Button>
                    <p className="mt-4 text-sm text-gray-500">{status}</p>
                </CardContent>
            </Card>
        </div>
    );
}