import React from 'react';

const Home = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Devices Section */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="font-semibold">Devices</h2>
                <p>Active: 5<br />Inactive: 3</p>
                <button className="mt-2 bg-green-600 text-white rounded px-4 py-2">Add Device</button>
            </div>

            {/* Alarms Section */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="font-semibold">Alarms</h2>
                <p className="text-red-500">Critical: 1</p>
                <p>Assigned: 3</p>
                <button className="mt-2 bg-yellow-600 text-white rounded px-4 py-2">View Alarms</button>
            </div>

            {/* Dashboards Section */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="font-semibold">Dashboards</h2>
                <p>Getting Started</p>
                <button className="mt-2 bg-blue-600 text-white rounded px-4 py-2">Add Dashboard</button>
            </div>

            {/* Activity Section */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="font-semibold">Activity</h2>
                <p>History - last 30 days</p>
                <button className="mt-2 bg-gray-600 text-white rounded px-4 py-2">View History</button>
            </div>

            {/* Get Started Section */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="font-semibold">Get Started</h2>
                <ol className="list-decimal pl-5">
                    <li>Create device</li>
                    <li>Connect device</li>
                    <li>Create dashboard</li>
                    <li>Configure alarm rules</li>
                    <li>Create alarm</li>
                </ol>
                <button className="mt-2 bg-green-600 text-white rounded px-4 py-2">Start Now</button>
            </div>
        </div>
    );
};

export default Home;
