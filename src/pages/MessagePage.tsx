import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PhoneIcon, VideoIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import { get, post } from "@/utils/authUtils";

interface Conversation {
  _id: string;
  customer_id: string;
  seller_id: string;
  last_message: string;
  created_at: string;
  updated_at: string;
  customer_username: string;
  seller_username: string;
}

interface Message {
  _id: string;
  conversation_id: string;
  message: string;
  image_uri: string[];
  sender_id: string;
  created_at: string;
  updated_at: string;
}

const MessagePage: React.FC = () => {
  const { conversation_id } = useParams<{ conversation_id: string }>();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const user_id = currentUser.user_id;

  const fetchConversations = async () => {
    try {
      const response = await get("/conversation", "other");
      console.log("response", response);
      setConversations(response);
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await get(`/message/${conversationId}/1`, "other");
      setMessages(response);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  useEffect(() => {
    fetchConversations();

    if (conversation_id) {
      fetchMessages(conversation_id);
    }
  }, [conversation_id]);

  const handleSendMessage = async () => {
    try {
      await post(`/message/${conversation_id}`, "other", {
        message: newMessage,
        image_uri: [],
      });
      setNewMessage("");
      await fetchMessages(conversation_id || "");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const conversationList = useMemo(
    () =>
      conversations.map((conversation) => (
        <motion.div
          key={conversation._id}
          className="transition-colors duration-200 rounded-lg mb-2 p-2 hover:bg-gray-800 cursor-pointer border-b border-blue-500/30"
          onClick={() => navigate(`/message/${conversation._id}`)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <img
              src="https://via.placeholder.com/32"
              alt="avatar"
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg mr-2 border border-blue-400"
            />
            <div className="flex flex-col flex-grow">
              <span className="font-semibold text-gray-300 text-sm md:text-base">
                {conversation.customer_username}
              </span>
              <p className="text-gray-500 text-xs md:text-sm truncate">
                {conversation.last_message}
              </p>
              <p className="text-gray-500 text-[10px] md:text-xs">
                {dayjs(conversation.updated_at).format("DD/MM HH:mm")}
              </p>
            </div>
          </div>
        </motion.div>
      )),
    [conversations, navigate]
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-transparent text-gray-100">
      <div className="w-full md:w-1/4 lg:w-1/5 h-[540px] bg-background_secondary rounded-lg mb-2 md:mb-0 md:mr-2 overflow-y-auto">
        <Card className="bg-transparent text-gray-100 shadow-none h-full">
          <CardContent className="space-y-2 pt-2 px-2 ">
            {conversationList}
          </CardContent>
        </Card>
      </div>
      {conversation_id && (
        <div className="w-full md:w-3/4 lg:w-4/5 flex flex-col">
          <Card className="bg-transparent text-blue-100 flex-grow shadow-lg border border-blue-500/30 flex flex-col">
            <CardHeader className="bg-background_secondary rounded-t-lg py-2 px-3">
              <div className="flex items-center justify-between">
                <div className="flex space-x-3 items-center">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="avatar"
                    className="w-8 h-8 rounded-lg"
                  />
                  <div>
                    <CardTitle className="text-base md:text-lg font-semibold text-gray-300">
                      username
                    </CardTitle>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3">
                  <Button className="rounded-lg bg-transparent transition-colors duration-200 p-1 md:p-2">
                    <PhoneIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-100" />
                  </Button>
                  <Button className="rounded-lg bg-transparent transition-colors duration-200 p-1 md:p-2">
                    <VideoIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-100" />
                  </Button>
                  <div className="relative">
                    <Button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="rounded-lg bg-transparent transition-colors duration-200 p-1 md:p-2"
                    >
                      <MoreHorizontal className="w-4 h-4 md:w-5 md:h-5 text-blue-100" />
                    </Button>
                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background_secondary ring-1 ring-black ring-opacity-5"
                        >
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-blue-200 hover:bg-gray-600"
                              role="menuitem"
                            >
                              View Profile
                            </a>
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-blue-200 hover:bg-gray-600"
                              role="menuitem"
                            >
                              Block User
                            </a>
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-blue-200 hover:bg-gray-600"
                              role="menuitem"
                            >
                              Report Issue
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-2  md:p-3 bg-gray-800 rounded-lg flex flex-col  ">
              <div className="flex-grow overflow-y-auto h-[400px]">
                {messages.map((message) => (
                  <motion.div
                    key={message._id}
                    className={`flex ${
                      message.sender_id === user_id
                        ? "justify-end"
                        : "justify-start"
                    } mb-2`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`p-2 rounded-lg max-w-[85%] md:max-w-[70%] ${
                        message.sender_id === user_id
                          ? "bg-blue-600 text-blue-100"
                          : "bg-gray-700 text-blue-200"
                      }`}
                    >
                      <p className="text-sm break-words">{message.message}</p>
                      <span className="text-blue-300 text-xs mt-1 block">
                        {dayjs(message.created_at).format("HH:mm")}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="flex mt-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow p-2 rounded-l-lg bg-gray-700 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Type a message..."
            />
            <Button
              onClick={handleSendMessage}
              className="rounded-r-lg text-blue-100 transition-colors duration-200"
            >
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagePage;
