import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import axiosInstance from "../lib/axios";

export default function UserSync() {
    const { user, isSignedIn } = useUser();

    useEffect(() => {
        if (isSignedIn && user) {
            const sync = async () => {
                try {
                    await axiosInstance.post("/users/sync", {
                        name: user.fullName || user.username || "Anonymous Candidate",
                        email: user.primaryEmailAddress?.emailAddress || "",
                        profileImage: user.imageUrl || ""
                    });
                    console.log("✅ User synchronized with Matrix Backend.");
                } catch (e) {
                    console.error("❌ User Sync Failed:", e);
                }
            };
            sync();
        }
    }, [isSignedIn, user]);

    return null;
}
