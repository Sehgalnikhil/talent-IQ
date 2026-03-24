import { chatClient, streamClient } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    // issue video-compatible token using streamClient Node flawlessly flaws
    const token = streamClient.createToken({ user_id: req.user.clerkId });

    res.status(200).json({
      token,
      userId: req.user.clerkId,
      userName: req.user.name,
      userImage: req.user.image,
    });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
