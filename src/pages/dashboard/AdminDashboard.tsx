import React, { useState } from 'react';
import { Users, BookOpen, Calendar, Settings, Search, Mail } from 'lucide-react';
import { UserManagement } from '../../components/admin/UserManagement';
import { EmailConfiguration } from '../../components/admin/EmailConfiguration';
import { UserSearch } from '../../components/admin/UserSearch';
import { Button } from '../../components/ui/Button';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'emails' | 'search'>('users');
  
  const stats = [
    { label: 'Total Students', value: '150', icon: Users },
    { label: 'Active Projects', value: '45', icon: BookOpen },
    { label: 'Upcoming Defenses', value: '12', icon: Calendar },
    { label: 'Pending Approvals', value: '8', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <Icon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 px-6" aria-label="Tabs">
            <Button
              variant={activeTab === 'users' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('users')}
              className="flex items-center gap-2 py-4"
            >
              <Users className="h-4 w-4" />
              User Management
            </Button>
            <Button
              variant={activeTab === 'emails' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('emails')}
              className="flex items-center gap-2 py-4"
            >
              <Mail className="h-4 w-4" />
              Email Configuration
            </Button>
            <Button
              variant={activeTab === 'search' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('search')}
              className="flex items-center gap-2 py-4"
            >
              <Search className="h-4 w-4" />
              Search Users
            </Button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'emails' && <EmailConfiguration />}
          {activeTab === 'search' && <UserSearch />}
        </div>
      </div>
    </div>
  );
}