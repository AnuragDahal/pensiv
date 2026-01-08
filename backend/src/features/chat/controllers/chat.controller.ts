import { Request, Response } from "express";
import { chatWithBlog } from "../services/chat.service";

export const handleChat = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    
    if (!query) {
       res.status(400).json({ success: false, message: "Query is required" });
       return;
    }

    const result = await chatWithBlog(query);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ success: false, message: "Failed to process chat request" });
  }
};
