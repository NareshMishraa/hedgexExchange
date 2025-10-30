import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WalletConnect from "./WalletConnect";
import { STORAGES } from "./Store";
import localStore from "./localStore";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [hasToken, setHasToken] = useState(!!localStore.getItem(STORAGES.TOKEN));
  const navigate = useNavigate();

  // Dynamically react to token changes
 useEffect(() => {
  const checkToken = () => {
    setHasToken(!!localStore.getItem(STORAGES.TOKEN));
  };

  checkToken(); // run once
  window.addEventListener("storage", checkToken);      // between tabs
  window.addEventListener("authChanged", checkToken);  // ✅ same tab updates

  return () => {
    window.removeEventListener("storage", checkToken);
    window.removeEventListener("authChanged", checkToken);
  };
}, []);


  const handleConnect = (wallet) => {
    setConnectedWallet(wallet);
    setIsConnected(true);
    setShowModal(false);
  };

  const handleDisconnect = () => {
    // Clear session
     setConnectedWallet(null);
    setIsConnected(false);
    setShowModal(false);
   
  };
  const handleLogout=()=>{
   
     localStore.removeItem(STORAGES.TOKEN);
    localStore.removeItem(STORAGES.EMAIL);
    // Redirect to home
    navigate("/");
    setHasToken(false);
  }

  return (
    <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section: Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <img src="/logo_light.png" alt="Logo" width={150} height={150} />
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg">HedgeX Exchange</h1>
                <p className="text-slate-400 text-sm">Token Migration Portal</p>
              </div>
            </div>

            {/* Right Section: Show only when logged in */}
            {hasToken && (
              <div className="relative flex items-center gap-3">
                <WalletConnect
                  isConnected={isConnected}
                  connectedWallet={connectedWallet}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                  showModal={showModal}
                  setShowModal={setShowModal}
                  bypassAuthForIdo={false}
                />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium transition transform hover:scale-105 hover:shadow-lg"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
