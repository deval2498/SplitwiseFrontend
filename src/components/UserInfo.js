import React, { useState, useEffect } from "react";
import api from "../api";
import { useLocation } from "react-router-dom";
import "./UserInfo.css";
import config from "../config";
import { useNavigate } from "react-router-dom";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import TailwindWrapper from "./TailwindWrapper";
import { capitalizeFirstLetter } from "../utils/capitalize";
import { capitalizeFirstAndLast } from "../utils/userSymbol";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Button,
} from "@nextui-org/react";
import { Link } from "react-router-dom";
import Header from "./Header";
import { CiLogout } from "react-icons/ci";

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(config.userApiUrl);
        setUser(response.data.result);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [location.search]);

  if (!user) {
    console.log("Loading spinners");
    return (
      <div class="spinner-container">
        <div class="orbit-spinner">
          <div class="orbit"></div>
          <div class="orbit"></div>
          <div class="orbit"></div>
        </div>
      </div>
    );
  }

  return (
    <TailwindWrapper>
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-4 bg-white rounded-lg shadow-md w-[375px]">
          <div className="flex justify-between">
            <div className="grid grid-cols-3 gap-2 items-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-green-400 rounded-full text-white col-span-1">
                {capitalizeFirstAndLast(`${user.first_name} ${user.last_name}`)}
              </div>
              <div className="col-span-2">
                <p className="font-bold text-black m-0">{`${user.first_name} ${user.last_name}`}</p>
                <p className="text-xs text-green-600 m-0">
                  {capitalizeFirstLetter(user.registration_status)}
                </p>
              </div>
            </div>
            <Button
              className="flex items-center mt-0 rounded-2xl bg-black text-white h-12"
              onClick={handleLogout}
            >
              <CiLogout />
              Logout
            </Button>
            <LogoutConfirmationModal
              show={showModal}
              onClose={handleCloseModal}
              onConfirm={handleConfirmLogout}
            />{" "}
          </div>
          <Divider />
          <div></div>
          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="cols-span-1">
              <Link to="/add-transaction">
                <Button className="w-32 text-xs rounded-2xl bg-green-400">
                  Add Transaction
                </Button>
              </Link>
            </div>
            <div className="cols-span-1">
              <Link to="/upload-csv">
                <Button className="w-32 text-xs rounded-2xl bg-green-400">
                  Upload CSV
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </TailwindWrapper>
  );
};

export default UserInfo;
