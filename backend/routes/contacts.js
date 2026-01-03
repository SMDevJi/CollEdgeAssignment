import express from "express"
import Contact from "../models/Contact.js";


const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ success: false, message: "Required fields missing" });
        }

        const contact = await Contact.create({
            name,
            email,
            phone,
            message,
        });

        res.status(201).json({
            success: true,
            message: "Contact saved successfully",
            contact,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server error" });
    }
});


router.get("/", async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: 1 });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server error" });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return res.status(404).json({ success: false, message: "Contact not found" });
        }

        res.status(200).json({
            success: true,
            message: "Contact deleted successfully",
            id,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server error" });
    }
});


export default router;
