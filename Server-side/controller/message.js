import { Message } from "../models/message.js";
import { Chat } from "../models/chat.js";
import User from "../models/user.js";

export const sendMessage = async (req , res) => {
    
    const { message ,chatId} = req.body;
    if (!message || !chatId) {
        console.log("Invalid data passed into request");
        return res.send(400);
    }

    const newMessage = {
        sender : req.user._id,
        message: message,
        chat: chatId
    }
    try{
        const message = await Message.create(newMessage)

        message = await message.populate('sender', 'name pic')
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
            });
            
            await Chat.findByIdAndUpdate(req.body.chatId , {
                latestMessage : message
            })

            res.json(message);

    }
    catch(error){
        res.status(400)
            throw new Error(error.message)

    }
}

export const allMessage=async(req,res)=>{
     
    try {
    
        const message=await Message.find({chat:req.params.chatId})
        .populate("sender","name pic email")
        .populate({
            path: "chat",
            populate: {
                path: "users",
                select: "name pic email " 
            }
        });

        return res.status(200).json(message);
        
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");

        
    }


}