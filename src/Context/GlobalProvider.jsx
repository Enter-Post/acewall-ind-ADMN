import { Toaster } from "@/components/ui/sonner";
import { axiosInstance } from "@/lib/AxiosInstance";
import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { set } from "date-fns";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [Authloading, setAuthLoading] = useState(true);
  const [signUpdata, setSignupData] = useState({});
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);


  // console.log(user, "Global provider");
  // console.log(onlineUser, "onlineUser");

  console.log(currentConversation, "currentConversation");

  const disconnectsocket = () => {
    if (socket && socket.connected) {
      socket.disconnect();
      console.log("Socket disconnected");
      setSocket(null);
    }
  };

  const signup = async (completeData) => {
    setAuthLoading(true);
    await axiosInstance
      .post("auth/register", completeData)
      .then((res) => {
        setUser(res.data.user);
        toast.success(res.data.message);
        setAuthLoading(false);
      })
      .catch((error) => {
        setAuthLoading(false);
        toast.error(error.response?.data?.message);
      });
  };

  const login = async (formdata) => {
    setAuthLoading(true);
    await axiosInstance
      .post("auth/login", formdata)
      .then((res) => {
        console.log(res, "res");
        setUser(res.data.user);
        toast.success(res.data.message);
        setAuthLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setAuthLoading(false);
        toast.error(err.response.data.message);
      });
  };

  const checkAuth = async () => {
    try {
      setAuthLoading(true);
      const res = await axiosInstance.get("auth/checkAuth");
      setUser(res.data.user);
      setAuthLoading(false);
    } catch (error) {
      setAuthLoading(false);
      console.log(error);
      // toast.error(error.response?.data?.message);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    await axiosInstance
      .post("auth/logout")
      .then((res) => {
        console.log(res);
        checkAuth();
        setAuthLoading(false);
        disconnectsocket();
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        setAuthLoading(false);
        toast.error(err.response.data.message);
      });
  };

  return (
    <GlobalContext.Provider
      value={{
        signUpdata,
        setSignupData,
        checkAuth,
        signup,
        login,
        logout,
        user,
        Authloading,
        setAuthLoading,
        socket,
        setSocket,
        setOnlineUser,
        currentConversation,
        setCurrentConversation,
        selectedSubcategoryId,          
        setSelectedSubcategoryId,   
        
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
