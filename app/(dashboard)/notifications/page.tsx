"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/custom ui/Loader";

interface Notification {
  _id: string;
  supplier: string;
  message: string;
  status: "initial" | "pending" | "completed";
}

const CheckThresholdPage = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [emailConfig, setEmailConfig] = useState({
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPass: "",
    defaultMessage: "",
    deliveryAddress: "", 
    deliveryCity: "",     
    topic: "", 
    
  });

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications/check-threshold", { method: "GET" });
      const data = await res.json();
      console.log("Fetched notifications:", data); // Log para verificar los datos
      setNotifications(data);
      setLoading(false);
    } catch (err) {
      console.error("[fetchNotifications] ❌", err);
    }
  };

  // Fetch email configuration
  const fetchEmailConfig = async () => {
    try {
      const res = await fetch("/api/notifications/email-config", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setEmailConfig({
          smtpHost: data.smtpHost || "",
          smtpPort: data.smtpPort || 587,
          smtpUser: data.smtpUser || "",
          smtpPass: data.smtpPass || "",
          defaultMessage: data.defaultMessage || "",
          deliveryAddress: data.deliveryAddress || "", 
          deliveryCity: data.deliveryCity || "", 
          topic: data.topic || "", 
        });
      }
    } catch (err) {
      console.error("[fetchEmailConfig] ❌", err);
    }
  };

  // Update email configuration
  const handleEmailConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/notifications/email-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailConfig),
      });

      if (res.ok) {
        alert("Email configuration updated successfully!");
      } else {
        alert("Failed to update email configuration.");
      }
    } catch (err) {
      console.error("[handleEmailConfigSubmit] ❌", err);
    }
  };

  // Send email for a notification
  const handleSendEmail = async (id: string) => {
    try {
      const res = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({         
        id,
        deliveryAddress: emailConfig.deliveryAddress, // Incluye deliveryAddress
        deliveryCity: emailConfig.deliveryCity,
        topic: emailConfig.topic,
        }),
      });

      if (res.ok) {
        alert("Email sent successfully!");
        fetchNotifications();
      } else {
        alert("Failed to send email.");
      }
    } catch (err) {
      console.error("[handleSendEmail] ❌", err);
    }
  };

  // Mark notification as completed
  const handleCompleteNotification = async (id: string) => {
    try {
      const res = await fetch("/api/notifications/completed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        alert("Notification marked as completed!");
        fetchNotifications();
      } else {
        alert("Failed to mark notification as completed.");
      }
    } catch (err) {
      console.error("[handleCompleteNotification] ❌", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchEmailConfig();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-heading2-bold mb-4">Low Stock Notifications</h1>

      {/* Email Configuration Form */}
      <div className="mb-8">
        <h2 className="text-heading3-bold mb-2">Email Configuration</h2>
        <form onSubmit={handleEmailConfigSubmit} className="space-y-4">
          <div>
            <label className="block font-bold">SMTP Host:</label>
            <input
              type="text"
              value={emailConfig.smtpHost}
              onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block font-bold">SMTP Port:</label>
            <input
              type="number"
              value={emailConfig.smtpPort}
              onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: Number(e.target.value) })}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block font-bold">SMTP User:</label>
            <input
              type="email"
              value={emailConfig.smtpUser}
              onChange={(e) => setEmailConfig({ ...emailConfig, smtpUser: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block font-bold">SMTP Password:</label>
            <input
              type="password"
              value={emailConfig.smtpPass}
              onChange={(e) => setEmailConfig({ ...emailConfig, smtpPass: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block font-bold">Delivery Address:</label>
            <input
              type="text"
              value={emailConfig.deliveryAddress}
              onChange={(e) => setEmailConfig({ ...emailConfig, deliveryAddress: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block font-bold">Delivery City:</label>
            <input
              type="text"
              value={emailConfig.deliveryCity}
              onChange={(e) => setEmailConfig({ ...emailConfig, deliveryCity: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block font-bold">Place to be delivered:</label>
            <input
              type="text"
              value={emailConfig.topic}
              onChange={(e) => setEmailConfig({ ...emailConfig, topic: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Save Configuration
          </button>
        </form>
      </div>

      {/* Notifications */}
      {loading ? (
        <Loader />
      ) : notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li key={notification._id} className="border p-4 rounded-lg">
              <p>
                <strong>Supplier:</strong> {notification.supplier}
              </p>
              <p>
                <strong>Message:</strong> {notification.message}
              </p>
              <p>
                <strong>Status:</strong> {notification.status}
              </p>
              {notification.status === "initial" && (
                <button
                  onClick={() => handleSendEmail(notification._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                  Send Email
                </button>
              )}
              {notification.status === "pending" && (
                <button
                  onClick={() => handleCompleteNotification(notification._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                >
                  Mark as Completed
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CheckThresholdPage;