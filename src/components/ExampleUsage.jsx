import React from 'react';
import { 
  useGetTokensQuery, 
  useGetAllTokenPriceQuery,
  useGetUserDetailsQuery,
  useAddUpdatePortfolioMutation 
} from '../api/authApi';
import { toast } from 'react-toastify';

const ExampleUsage = () => {
  // Example of using RTK Query hooks
  const { 
    data: tokens, 
    isLoading: tokensLoading, 
    error: tokensError 
  } = useGetTokensQuery();

  const { 
    data: tokenPrices, 
    isLoading: pricesLoading 
  } = useGetAllTokenPriceQuery();

  const { 
    data: userDetails, 
    isLoading: userLoading 
  } = useGetUserDetailsQuery();

  const [addUpdatePortfolio, { isLoading: portfolioLoading }] = useAddUpdatePortfolioMutation();

  const handleUpdatePortfolio = async () => {
    try {
      const result = await addUpdatePortfolio({
        walletAddress: '0x123...',
        portfolioValue: 1000,
        activeHedges: 5,
        totalEarnings: 500,
        successRate: 85
      }).unwrap();
      
      toast.success('Portfolio updated successfully!');
      console.log('Portfolio update result:', result);
    } catch (error) {
      toast.error('Failed to update portfolio');
      console.error('Portfolio update error:', error);
    }
  };

  if (tokensLoading || pricesLoading || userLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (tokensError) {
    return <div className="text-red-500">Error loading tokens: {tokensError.message}</div>;
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg text-white">
      <h2 className="text-2xl font-bold mb-4">RTK Query Example Usage</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Available Tokens:</h3>
          <pre className="bg-gray-700 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(tokens, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Token Prices:</h3>
          <pre className="bg-gray-700 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(tokenPrices, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="text-lg font-semibold">User Details:</h3>
          <pre className="bg-gray-700 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(userDetails, null, 2)}
          </pre>
        </div>

        <button
          onClick={handleUpdatePortfolio}
          disabled={portfolioLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 px-4 py-2 rounded"
        >
          {portfolioLoading ? 'Updating...' : 'Update Portfolio'}
        </button>
      </div>
    </div>
  );
};

export default ExampleUsage;
