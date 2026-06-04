import { useState } from "react";
import { useDataStore } from "../contexts/DataStoreContext";
import { useTheme } from "../contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export function Settings() {
  const { settings, setSettings } = useDataStore();
  const { theme, setTheme } = useTheme();
  
  const [formData, setFormData] = useState(settings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(formData);
    // In a real app we'd show a toast here
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto md:mx-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your profile and application preferences.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <form onSubmit={handleSave}>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input 
                    type="email"
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <Input 
                  value={formData.company} 
                  onChange={e => setFormData({...formData, company: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-md border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <Button type="submit">Save Profile</Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
               <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">Email Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts when invoices are paid or overdue.</p>
               </div>
               <button
                  type="button"
                  className={`${formData.emailNotifications ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
                  role="switch"
                  aria-checked={formData.emailNotifications}
                  onClick={() => setFormData({...formData, emailNotifications: !formData.emailNotifications})}
                >
                  <span
                    aria-hidden="true"
                    className={`${formData.emailNotifications ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
            </div>

            <div className="flex items-center justify-between">
               <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">Appearance</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Customise the look of your workspace.</p>
               </div>
               <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as any)}
                  className="flex h-10 w-32 rounded-md border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
               >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
               </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
