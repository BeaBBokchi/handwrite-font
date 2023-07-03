export default function handler(req, res) {
    if (req.method === "POST") {
        console.log(typeof req.body);
        console.log(req.body);
    } else {
        // Handle any other HTTP method
    }
    res.status(200).json({ name: "John Doe" });
}
