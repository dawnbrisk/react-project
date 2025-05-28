import { useState } from "react";
import { NavBar, Input, Button, Toast } from "antd-mobile";

const judge = ()=> {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState("");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [result, setResult] = useState("");

    const handleSubmit = async () => {
        if (!value.trim()) {
            Toast.show("please enter sku");
            return;
        }
        try {
            const response = await fetch("https://your-backend-api.com/submit", {
                method: "POST",
                body: JSON.stringify({ data: value })
            });
            const data = await response.json();
            setResult(data.result || "other");
        } catch (error) {
            Toast.show("Error!");
        }
    };

    return (
        <div>
            <NavBar onBack={() => window.history.back()}>back</NavBar>
            <div style={{ padding: "20px" }}>
                <Input
                    placeholder="please enter sku"
                    value={value}
                    onChange={setValue}
                />
                <Button color="primary" style={{ marginTop: "10px" }} onClick={handleSubmit}>
                    Confirm
                </Button>
                {result && <div style={{ marginTop: "20px", fontSize: "16px" }}>result: {result}</div>}
            </div>
        </div>
    );
}

export default judge;