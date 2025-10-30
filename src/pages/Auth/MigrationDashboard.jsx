import { Card } from "../../components/ui/card.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Coins, Video, AlertCircle, ArrowRight, Shield, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert.jsx";

export function MigrationDashboard({ userTokens, onStartKYC }) {
  const hasTokens = userTokens < 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      

      <div className="max-w-4xl mx-auto p-4 lg:p-8 pt-8">
        <div className="text-center mb-8">
          <h2 className="text-white mb-2">Token Migration Dashboard</h2>
          <p className="text-slate-400">Complete your KYC to migrate your tokens</p>
        </div>

        <Card className="bg-slate-900/70 border-slate-800 backdrop-blur-xl p-6 lg:p-8 mb-6 shadow-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-1">Your Migration Details</h3>
              <p className="text-slate-400">Review your token allocation before proceeding</p>
            </div>
          </div>

          {hasTokens ? (
            <>
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-6 mb-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 mb-1">Available for Migration</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-white">{userTokens.toLocaleString()}</span>
                      <span className="text-blue-400">HEDGEX</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-slate-400 mb-1">Vesting Period</p>
                    <p className="text-white">25 Months</p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <Card className="bg-slate-800/50 border-slate-700 p-4">
                  <p className="text-slate-400 mb-1">Monthly Release</p>
                  <p className="text-white">4%</p>
                  <p className="text-slate-500">{(userTokens * 0.04).toLocaleString()} HEDGEX</p>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700 p-4">
                  <p className="text-slate-400 mb-1">First Claim</p>
                  <p className="text-white">{(userTokens * 0.04).toLocaleString()}</p>
                  <p className="text-slate-500">After KYC</p>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700 p-4">
                  <p className="text-slate-400 mb-1">Total Periods</p>
                  <p className="text-white">25</p>
                  <p className="text-slate-500">~2 years</p>
                </Card>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700 mb-6">
                <h3 className="text-white mb-4">Migration Process</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white">Login & Authentication</p>
                      <p className="text-slate-400">Completed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="text-white">Video KYC Verification</p>
                      <p className="text-slate-400">One-time identity verification</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-slate-400">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-400">Access Vesting Dashboard</p>
                      <p className="text-slate-500">Claim tokens as they vest</p>
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="bg-blue-900/20 border-blue-500/30 mb-6">
                <Video className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-slate-300">
                  <strong className="text-white">Next Step:</strong> Complete a one-time video KYC verification to ensure the security of your assets and unlock your vesting dashboard.
                </AlertDescription>
              </Alert>

              <Button
                onClick={onStartKYC}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              >
                <Video className="w-5 h-5 mr-2" />
                Start Video KYC Verification
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-white mb-3">No Migration Data Found</h3>
              <p className="text-slate-400 mb-4 max-w-md mx-auto">
                We couldn't find any tokens eligible for migration associated with your account.
              </p>
              <p className="text-slate-500 mb-6">
                If you believe this is an error, please contact our support team.
              </p>
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700 max-w-md mx-auto">
                <p className="text-slate-400">
                  📧 Support: support@hedgex.exchange
                </p>
              </div>
            </div>
          )}
        </Card>

        <div className="text-center text-slate-500">
          <p>🔒 Your data is encrypted and securely stored</p>
        </div>
      </div>
    </div>
  );
}

