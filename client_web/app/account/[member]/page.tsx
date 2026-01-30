"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, Calendar, Trophy, User } from 'lucide-react';

interface AccountData {
  name: string;
  email: string;
  joinDate: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  rating: number;
}

const Page = () => {
  const [accountData, setAccountData] = useState<AccountData>({
    name: "",
    email: "",
    joinDate: "",
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    rating: 1200,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    async function fetchAccountData() {
      try {
        setLoading(true);
        
        // Simulated API call - replace with actual endpoint
        // const response = await fetch('/api/account');
        // const data = await response.json();
        // setAccountData(data);
        
        // Mock data for development
        setTimeout(() => {
          setAccountData({
            name: "Harvey Yemm",
            email: "harvey@example.com",
            joinDate: "2024-01-15",
            gamesPlayed: 47,
            wins: 23,
            losses: 18,
            draws: 6,
            rating: 1456,
          });
          setLoading(false);
        }, 500);
        
      } catch (error) {
        console.error('[ACCOUNT] Failed to fetch account data:', error);
        setLoading(false);
      }
    }

    fetchAccountData();
  }, []);

  // Calculate win rate
  const winRate = accountData.gamesPlayed > 0 
    ? ((accountData.wins / accountData.gamesPlayed) * 100).toFixed(1) 
    : '0.0';

  // Get initials for avatar fallback
  const initials = accountData.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-slate-300 rounded-lg"></div>
            <div className="h-64 bg-slate-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-4 lg:p-6 flex justify-center m-auto">
      <div className="w-[50vw] mx-auto space-y-6">
        
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-2">
            Account
          </h1>
          <p className="text-slate-600">Manage your profile and view statistics</p>
        </header>

        {/* Profile Card */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="" alt={accountData.name} />
                <AvatarFallback className="text-2xl bg-slate-200">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <CardTitle className="text-2xl">{accountData.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 justify-center sm:justify-start mt-1">
                  <Mail className="w-4 h-4" />
                  {accountData.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                Joined {new Date(accountData.joinDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Statistics
            </CardTitle>
            <CardDescription>Your chess performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Rating */}
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-3xl font-bold text-slate-800">
                  {accountData.rating}
                </div>
                <div className="text-sm text-slate-600 mt-1">Rating</div>
              </div>

              {/* Games Played */}
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-3xl font-bold text-slate-800">
                  {accountData.gamesPlayed}
                </div>
                <div className="text-sm text-slate-600 mt-1">Games Played</div>
              </div>

              {/* Wins */}
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-700">
                  {accountData.wins}
                </div>
                <div className="text-sm text-green-600 mt-1">Wins</div>
              </div>

              {/* Losses */}
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-700">
                  {accountData.losses}
                </div>
                <div className="text-sm text-red-600 mt-1">Losses</div>
              </div>

            </div>

            <Separator className="my-6" />

            {/* Additional Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Draws</span>
                <span className="font-semibold text-slate-800">{accountData.draws}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Win Rate</span>
                <span className="font-semibold text-slate-800">{winRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button variant="outline" className="gap-2">
            <User className="w-4 h-4" />
            Edit Profile
          </Button>
          <Button variant="destructive">
            Logout
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Page;