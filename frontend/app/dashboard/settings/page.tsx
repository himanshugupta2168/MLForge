"use client"

import { useState, useEffect } from "react"
import { Save, Bell, Shield, Mail, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type PlatformSettings = {
  platformName: string
  supportEmail: string
  apiDomain: string
  maxOrganizations: string
  maintenanceMode: boolean
  emailNotifications: boolean
  securityAlerts: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>({
    platformName: "MLForge",
    supportEmail: "support@mlforge.com",
    apiDomain: "api.mlforge.com",
    maxOrganizations: "unlimited",
    maintenanceMode: false,
    emailNotifications: true,
    securityAlerts: true,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setSettings(data.settings || settings)
      } catch (error) {
        console.error("Failed to fetch settings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (!res.ok) throw new Error("Failed to save")
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("Failed to save settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage platform-wide settings</p>
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <div className="p-4 bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 rounded-lg">
              Settings saved successfully
            </div>
          )}

          {/* General Settings */}
          <div className="border rounded-lg p-6 bg-card space-y-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="platformName" className="text-sm font-medium">
                  Platform Name
                </Label>
                <Input
                  id="platformName"
                  value={settings.platformName}
                  onChange={e => handleChange("platformName", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="apiDomain" className="text-sm font-medium">
                  API Domain
                </Label>
                <Input
                  id="apiDomain"
                  value={settings.apiDomain}
                  onChange={e => handleChange("apiDomain", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="maxOrganizations" className="text-sm font-medium">
                  Max Organizations
                </Label>
                <Input
                  id="maxOrganizations"
                  value={settings.maxOrganizations}
                  onChange={e => handleChange("maxOrganizations", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Maintenance Mode</Label>
                  <p className="text-xs text-muted-foreground mt-1">Disable user access temporarily</p>
                </div>
                <button
                  onClick={() => handleChange("maintenanceMode", !settings.maintenanceMode)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.maintenanceMode
                      ? "bg-red-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.maintenanceMode ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="border rounded-lg p-6 bg-card space-y-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Settings
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="supportEmail" className="text-sm font-medium">
                  Support Email
                </Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={e => handleChange("supportEmail", e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="border rounded-lg p-6 bg-card space-y-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground mt-1">Receive platform updates via email</p>
                </div>
                <button
                  onClick={() => handleChange("emailNotifications", !settings.emailNotifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.emailNotifications
                      ? "bg-green-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.emailNotifications ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Security Alerts</Label>
                  <p className="text-xs text-muted-foreground mt-1">Get notified of security issues</p>
                </div>
                <button
                  onClick={() => handleChange("securityAlerts", !settings.securityAlerts)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.securityAlerts
                      ? "bg-green-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.securityAlerts ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
            </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
