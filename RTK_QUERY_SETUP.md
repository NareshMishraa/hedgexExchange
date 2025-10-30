# RTK Query Setup and Connect Wallet Implementation

This document describes the implementation of RTK Query and Connect Wallet functionality in the hedgexExchange project, based on the Hedgex2.0_Frontend project.

## Overview

The implementation includes:
1. **RTK Query setup** for efficient API state management
2. **Connect Wallet functionality** with localStorage token visibility
3. **Redux store configuration** with middleware
4. **Wagmi integration** for wallet connections
5. **Authentication context** with RTK Query integration

## Key Features

### 1. Wallet Connect Visibility
- **Token-based visibility**: The wallet connect button only appears when a user has a valid token in localStorage
- **Automatic wallet validation**: Checks if connected wallets are whitelisted for the user
- **Network switching**: Automatically switches to Base network when connecting

### 2. RTK Query Integration
- **Centralized API management**: All API calls go through RTK Query
- **Automatic caching**: API responses are cached and managed automatically
- **Loading states**: Built-in loading states for all API calls
- **Error handling**: Comprehensive error handling with user-friendly messages

## File Structure

```
src/
├── api/
│   ├── baseQuery.js          # RTK Query base configuration
│   ├── authApi.js            # Authentication API endpoints
│   ├── auth.js               # Legacy auth functions (kept for compatibility)
│   └── axiosclient.js        # Legacy axios client (kept for compatibility)
├── config/
│   └── wagmi.js              # Wagmi wallet configuration
├── store/
│   └── index.js              # Redux store configuration
├── components/
│   ├── WalletConnect.jsx     # Wallet connection component
│   ├── Navbar.jsx            # Navigation with wallet connect
│   ├── localStore.js         # localStorage utility
│   ├── Store.js              # Constants and wallet configurations
│   └── ExampleUsage.jsx      # Example of RTK Query usage
├── context/
│   └── AuthContext.jsx       # Authentication context with RTK Query
└── main.jsx                  # Main app with providers
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# WalletConnect Project ID
VITE_PROJECT_ID=your-walletconnect-project-id

# Other environment variables
VITE_ENCRYPTION_PASSWORD=your-encryption-password
VITE_ENCRYPTION_SALT=your-encryption-salt
```

## Usage Examples

### 1. Using RTK Query Hooks

```jsx
import { 
  useGetTokensQuery, 
  useGetAllTokenPriceQuery,
  useAddUpdatePortfolioMutation 
} from '../api/authApi';

const MyComponent = () => {
  // Query hooks
  const { data: tokens, isLoading, error } = useGetTokensQuery();
  const { data: prices } = useGetAllTokenPriceQuery();
  
  // Mutation hooks
  const [updatePortfolio, { isLoading: updating }] = useAddUpdatePortfolioMutation();
  
  const handleUpdate = async () => {
    try {
      await updatePortfolio({
        walletAddress: '0x123...',
        portfolioValue: 1000
      }).unwrap();
      toast.success('Portfolio updated!');
    } catch (error) {
      toast.error('Update failed');
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h2>Tokens: {tokens?.length}</h2>
      <button onClick={handleUpdate} disabled={updating}>
        {updating ? 'Updating...' : 'Update Portfolio'}
      </button>
    </div>
  );
};
```

### 2. Using Wallet Connect

```jsx
import WalletConnect from './components/WalletConnect';

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState(null);

  const handleConnect = (wallet) => {
    setConnectedWallet(wallet);
    setIsConnected(true);
    setShowModal(false);
  };

  const handleDisconnect = () => {
    setConnectedWallet(null);
    setIsConnected(false);
    setShowModal(false);
  };

  return (
    <WalletConnect
      isConnected={isConnected}
      connectedWallet={connectedWallet}
      onConnect={handleConnect}
      onDisconnect={handleDisconnect}
      showModal={showModal}
      setShowModal={setShowModal}
      bypassAuthForIdo={false}
    />
  );
};
```

### 3. Using Authentication Context

```jsx
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

const LoginComponent = () => {
  const { login, logout, isAuthenticated, isLoggingIn } = useContext(AuthContext);
  
  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Login failed');
    }
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <form onSubmit={handleLogin}>
          {/* login form */}
        </form>
      )}
    </div>
  );
};
```

## Key Differences from Hedgex2.0_Frontend

1. **Simplified Setup**: Removed complex dashboard data and focused on core functionality
2. **Vite Configuration**: Adapted for Vite instead of Next.js
3. **Environment Variables**: Uses Vite's `import.meta.env` instead of Next.js environment variables
4. **Component Structure**: Streamlined component structure for better maintainability

## Token Visibility Logic

The wallet connect button visibility is controlled by the `shouldShowWalletConnect` variable in `WalletConnect.jsx`:

```jsx
// Check if user has a token in localStorage
const hasToken = useMemo(() => {
  return !!localStore?.getItem(STORAGES?.TOKEN);
}, []);

// Only show wallet connect if token is present
const shouldShowWalletConnect = hasToken;

// Don't render if no token is present
if (!shouldShowWalletConnect) {
  return null;
}
```

This ensures that the wallet connect functionality is only available to authenticated users.

## API Endpoints

The following endpoints are available through RTK Query:

### Authentication
- `userLogin` - User login
- `userSignup` - User registration
- `verifyEmail` - Email verification
- `sendForgotPassword` - Send forgot password email
- `resetPassword` - Reset password
- `getUserDetails` - Get user details

### Wallet Management
- `addWallet` - Add wallet to user account
- `getAllWallets` - Get all user wallets
- `getWallets` - Get wallet list

### Trading & Exchange
- `getTokens` - Get available tokens
- `getQuoteValue` - Get swap quote
- `swapData` - Execute swap
- `tokenPrice` - Get token price
- `getAllTokenPrice` - Get all token prices

### Portfolio & Activity
- `addUpdatePortfolio` - Update portfolio
- `getAllPortfolios` - Get all portfolios
- `getAllRecentActivity` - Get recent activity
- `getRecentTrades` - Get recent trades

## Dependencies Added

```json
{
  "@reduxjs/toolkit": "^2.2.7",
  "react-redux": "^9.1.2",
  "@tanstack/react-query": "^5.80.0",
  "viem": "^2.30.6"
}
```

## Testing the Implementation

1. **Start the development server**: `npm run dev`
2. **Login with valid credentials** to get a token in localStorage
3. **Verify wallet connect button appears** after login
4. **Test wallet connection** with supported wallets
5. **Test API calls** using the RTK Query hooks

## Troubleshooting

### Common Issues

1. **Wallet connect not showing**: Ensure user is logged in and has a valid token
2. **API calls failing**: Check `VITE_API_URL` environment variable
3. **Wallet connection failing**: Verify `VITE_PROJECT_ID` is set correctly
4. **Network switching issues**: Ensure Base network is properly configured

### Debug Tips

1. Check browser console for errors
2. Verify localStorage has the required tokens
3. Check network tab for API call failures
4. Ensure all environment variables are set correctly
