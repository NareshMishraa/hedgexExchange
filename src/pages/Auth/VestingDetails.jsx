import { useState, useEffect } from "react";
import { Card } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Badge } from "./ui/badge.jsx";
import { Progress } from "./ui/progress.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table.jsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion.jsx";
import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  Shield,
  Trophy,
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert.jsx";

export function VestingDetails({ totalTokens, onLogout }) {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [claimingId, setClaimingId] = useState(null);
  const [timeUntilNext, setTimeUntilNext] = useState("");

  // ✅ Generate vesting schedule (4% per month for 25 months)
  const generateVestingSchedule = () => {
    const schedule = [];
    const monthlyAmount = totalTokens * 0.04;
    const startDate = new Date("2024-11-01");

    for (let i = 0; i < 25; i++) {
      const releaseDate = new Date(startDate);
      releaseDate.setMonth(startDate.getMonth() + i);

      let status;
      if (i === 0) {
        status = "claimed"; // First month already claimed for demo
      } else if (i === 1) {
        status = "available"; // Second month available
      } else {
        status = "pending";
      }

      schedule.push({
        id: i + 1,
        month: i + 1,
        amount: monthlyAmount,
        date: releaseDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        releaseDate,
        status,
      });
    }

    return schedule;
  };

  const [vestingSchedule, setVestingSchedule] = useState(generateVestingSchedule);

  // ✅ Countdown timer for next claimable period
  useEffect(() => {
    const updateCountdown = () => {
      const nextPending = vestingSchedule.find((v) => v.status === "pending");

      if (!nextPending) {
        setTimeUntilNext("all-complete");
        return;
      }

      const now = new Date();
      const diff = nextPending.releaseDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeUntilNext("available");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUntilNext(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [vestingSchedule]);

  // ✅ Token calculations
  const claimedAmount = vestingSchedule
    .filter((v) => v.status === "claimed")
    .reduce((sum, v) => sum + v.amount, 0);

  const availableAmount = vestingSchedule
    .filter((v) => v.status === "available")
    .reduce((sum, v) => sum + v.amount, 0);

  const pendingAmount = vestingSchedule
    .filter((v) => v.status === "pending")
    .reduce((sum, v) => sum + v.amount, 0);

  const progressPercentage = (claimedAmount / totalTokens) * 100;
  const claimedPeriods = vestingSchedule.filter(
    (v) => v.status === "claimed"
  ).length;
  const allComplete = claimedPeriods === 25;

  // ✅ Simulate wallet connection
  const connectWallet = async () => {
    setTimeout(() => {
      setWalletConnected(true);
      setWalletAddress("0x742d...8f5a");
    }, 1000);
  };

  // ✅ Simulate claim action
  const handleClaim = async (id) => {
    setClaimingId(id);
    setTimeout(() => {
      setVestingSchedule((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: "claimed" } : v))
      );
      setClaimingId(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white">HedgeX Exchange</h1>
                <p className="text-slate-400 hidden sm:block">
                  Vesting Dashboard
                </p>
              </div>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8 pt-8 pb-12">
        {/* Countdown Timer */}
        {allComplete ? (
          <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/30 p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h2 className="text-white mb-1">
                  All Vesting Periods Complete! 🎉
                </h2>
                <p className="text-green-300">
                  You have successfully claimed all{" "}
                  {totalTokens.toLocaleString()} HEDGEX tokens
                </p>
              </div>
            </div>
          </Card>
        ) : (
          timeUntilNext !== "available" &&
          timeUntilNext !== "all-complete" && (
            <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30 p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-slate-300 mb-1">
                      Next Claimable Period In:
                    </p>
                    <p className="text-white">{timeUntilNext}</p>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-slate-400">Next Release</p>
                  <p className="text-blue-400">
                    {(totalTokens * 0.04).toLocaleString()} HEDGEX
                  </p>
                </div>
              </div>
            </Card>
          )
        )}

        {/* Overview Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-900/70 border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-slate-400">Total Tokens</p>
            </div>
            <p className="text-white">{totalTokens.toLocaleString()}</p>
            <p className="text-slate-500">HEDGEX</p>
          </Card>

          <Card className="bg-slate-900/70 border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-slate-400">Claimed</p>
            </div>
            <p className="text-white">{claimedAmount.toLocaleString()}</p>
            <p className="text-green-400">{claimedPeriods} of 25 periods</p>
          </Card>

          <Card className="bg-slate-900/70 border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-slate-400">Available</p>
            </div>
            <p className="text-white">{availableAmount.toLocaleString()}</p>
            <p className="text-yellow-400">
              {vestingSchedule.filter((v) => v.status === "available").length}{" "}
              periods
            </p>
          </Card>

          <Card className="bg-slate-900/70 border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-slate-400">Pending</p>
            </div>
            <p className="text-white">{pendingAmount.toLocaleString()}</p>
            <p className="text-purple-400">
              {vestingSchedule.filter((v) => v.status === "pending").length}{" "}
              periods
            </p>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="bg-slate-900/70 border-slate-800 p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white">Vesting Progress</h3>
            <span className="text-slate-400">
              {progressPercentage.toFixed(1)}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3 bg-slate-800" />
          <div className="flex justify-between mt-3 text-sm">
            <span className="text-slate-500">Start: Nov 2024</span>
            <span className="text-slate-500">4% monthly release</span>
            <span className="text-slate-500">End: Nov 2026</span>
          </div>
        </Card>

        {/* Wallet Connection */}
        {!walletConnected ? (
          <Alert className="bg-blue-900/20 border-blue-500/30 mb-6">
            <Wallet className="h-4 w-4 text-blue-400" />
            <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-slate-300">
                Connect your wallet to claim available tokens
              </span>
              <Button
                onClick={connectWallet}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 whitespace-nowrap"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30 p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white">Wallet Connected</p>
                  <p className="text-slate-400">{walletAddress}</p>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Active
              </Badge>
            </div>
          </Card>
        )}

        {/* Quick Claim Action */}
        {availableAmount > 0 && walletConnected && (
          <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30 p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-white mb-1">Ready to Claim</h3>
                <p className="text-slate-300">
                  {availableAmount.toLocaleString()} HEDGEX available now
                </p>
              </div>
              <Button
                onClick={() => {
                  const availablePeriod = vestingSchedule.find(
                    (v) => v.status === "available"
                  );
                  if (availablePeriod) handleClaim(availablePeriod.id);
                }}
                disabled={claimingId !== null}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 w-full sm:w-auto"
              >
                Claim Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* Vesting Schedule - Accordion View */}
        <Card className="bg-slate-900/70 border-slate-800 p-6">
          <h2 className="text-white mb-4">Vesting Schedule</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="table" className="border-slate-700">
              <AccordionTrigger className="text-white hover:text-blue-400">
                View Detailed Schedule (25 Periods)
              </AccordionTrigger>
              <AccordionContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700 hover:bg-transparent">
                        <TableHead className="text-slate-400">Period</TableHead>
                        <TableHead className="text-slate-400">Release Date</TableHead>
                        <TableHead className="text-slate-400">Amount</TableHead>
                        <TableHead className="text-slate-400">Status</TableHead>
                        <TableHead className="text-slate-400">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vestingSchedule.map((period) => (
                        <TableRow key={period.id} className="border-slate-700 hover:bg-slate-800/50">
                          <TableCell className="text-white">Month {period.month}</TableCell>
                          <TableCell className="text-slate-300">{period.date}</TableCell>
                          <TableCell className="text-white">
                            {period.amount.toLocaleString()} HEDGEX
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                period.status === "claimed"
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : period.status === "available"
                                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                  : "bg-slate-700 text-slate-400 border-slate-600"
                              }
                            >
                              {period.status === "claimed" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                              {period.status === "available" && <Clock className="w-3 h-3 mr-1" />}
                              {period.status === "pending" && <Lock className="w-3 h-3 mr-1" />}
                              {period.status.charAt(0).toUpperCase() + period.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {period.status === "available" ? (
                              <Button
                                onClick={() => handleClaim(period.id)}
                                disabled={!walletConnected || claimingId === period.id}
                                size="sm"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                              >
                                {claimingId === period.id ? (
                                  <>
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    Claiming...
                                  </>
                                ) : (
                                  <>
                                    Claim
                                    <ArrowRight className="w-3 h-3 ml-1" />
                                  </>
                                )}
                              </Button>
                            ) : period.status === "claimed" ? (
                              <span className="text-green-400">✓ Completed</span>
                            ) : (
                              <span className="text-slate-500">Locked</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </div>
  );
}
