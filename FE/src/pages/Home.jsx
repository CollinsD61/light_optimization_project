// src/pages/Home.jsx
const Home = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="font-semibold">Devices</h2>
                <p>Active: 0<br />Inactive: 32</p>
                <button className="mt-2 bg-green-600 text-white rounded px-4 py-2">Add device</button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="font-semibold">Alarms</h2>
                <p className="text-red-500">Critical: 0</p>
                <p>Assigned: 0</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="font-semibold">Dashboards</h2>
                <p>Getting Started</p>
                <button className="mt-2 bg-green-600 text-white rounded px-4 py-2">Add dashboard</button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="font-semibold">Activity</h2>
                <p>History - last 30 days</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="font-semibold">Get started</h2>
                <ol className="list-decimal pl-5">
                    <li>Create device</li>
                    <li>Connect device</li>
                    <li>Create dashboard</li>
                    <li>Configure alarm rules</li>
                    <li>Create alarm</li>
                </ol>
            </div>
        </div>
    );
};

export default Home;
