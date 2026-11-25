export async function getUsersForSidebar(req, res) {
    try{
        const loggedInUserId = req.user.id;
        const users = await User.find({_id: { $ne: loggedInUserId } }).select("-clerkId");
        res.status(200).json(users);
    }
    catch(error){
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({ error: "Failed to fetch users for sidebar" });
    }
}