import QRCode from "qrcode";
import { connectToDB } from "../../lib/mongoose";
import Store from "../../models/Store";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not Allowed"});
    }

    try {
        await connectToDB();
        const { storeId } = req.query;
        const store = await Store.findById(storeId);

        if (!store){
            return res.status(404).json({message: "Store not Found"});
        }

    const qrCodeData = `/scan/storeID=${storeId}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);
    res.json({ success: true, qrCodeImage});
    } catch (error){
        res.status(500).json({ success: false, error: error.message});
    }

}
