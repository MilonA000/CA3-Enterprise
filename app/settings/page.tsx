"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./settingspage.module.css"
import Navbar from "@/components/Navbar"
import { supabase } from "@/lib/supabase"
import Background from "@/components/BackgroundStyles"

type User = {
  name: string;
  studentId: string;
  course?: string;
  loggedIn?: boolean;
};

type DefaultPage = "Campus Map" | "Timetable" | "Societies" | "Helpdesk";

type UserSettingsRow = {
  student_id: string;
  large_text: boolean;
  high_contrast: boolean;
  reduced_motion: boolean;
  event_reminders: boolean;
  society_alerts: boolean;
  helpdesk_updates: boolean;
  default_page: DefaultPage;
};

type LocalSettings = {
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  eventReminders: boolean;
  societyAlerts: boolean;
  helpdeskUpdates: boolean;
  defaultPage: DefaultPage;
};

type ProfileRow = {
  id: string;
  student_id: string;
  name: string;
  course: string;
  email?: string;
};

const DEFAULT_SETTINGS: LocalSettings = {
  largeText: false,
  highContrast: false,
  reducedMotion: false,
  eventReminders: true,
  societyAlerts: true,
  helpdeskUpdates: false,
  defaultPage: "Campus Map",
};

const LOCAL_SETTINGS_KEY = "campusSettings";

function getInitialLocalSettings(): LocalSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  const storedSettings = localStorage.getItem(LOCAL_SETTINGS_KEY);
  if (!storedSettings) {
    return DEFAULT_SETTINGS;
  }

  try {
    return JSON.parse(storedSettings) as LocalSettings;
  } catch {
    console.error("Could not parse saved local settings.");
    return DEFAULT_SETTINGS;
  }
}

function applySettingsToDocument(settings: {
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}) {
  const root = document.documentElement;

  root.classList.toggle("large-text", settings.largeText);
  root.classList.toggle("high-contrast", settings.highContrast);
  root.classList.toggle("reduced-motion", settings.reducedMotion);
}

function getRouteForDefaultPage(defaultPage: DefaultPage) {
  switch (defaultPage) {
    case "Campus Map":
      return "/campus-map";
    case "Timetable":
      return "/timetable";
    case "Societies":
      return "/societies";
    case "Helpdesk":
      return "/helpdesk";
    default:
      return "/";
  }
}

export default function SettingsPage() {
  const router = useRouter();
  const initialSettingsRef = useRef<LocalSettings>(getInitialLocalSettings());

  const [largeText, setLargeText] = useState(initialSettingsRef.currentinitialSettings.largeText);
  const [highContrast, setHighContrast] = useState(initialSettingsRef.highContrast);
  const [reducedMotion, setReducedMotion] = useState(initialSettingsRef.reducedMotion);

  const [eventReminders, setEventReminders] = useState(initialSettingsRef.current.eventReminders);
  const [societyAlerts, setSocietyAlerts] = useState(initialSettingsRef.current.societyAlerts);
  const [helpdeskUpdates, setHelpdeskUpdates] = useState(initialSettingsRef.current.helpdeskUpdates);

  const [defaultPage, setDefaultPage] = useState<DefaultPage>(initialSettingsRef.current.defaultPage);
  const [user, setUser] = useState<User | null>(null);

  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    applySettingsToDocument({ largeText, highContrast, reducedMotion });

    const settingsToStore: LocalSettings = {
      largeText,
      highContrast,
      reducedMotion,
      eventReminders,
      societyAlerts,
      helpdeskUpdates,
      defaultPage,
    };

    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settingsToStore));
  }, [
    largeText,
    highContrast,
    reducedMotion,
    eventReminders,
    societyAlerts,
    helpdeskUpdates,
    defaultPage,
  ]);

  useEffect(() => {
    async function loadProfileFromSession(sessionUserId: string) {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, student_id, name, course, email")
        .eq("id", sessionUserId)
        .single();

      if (error || !profile) {
        console.error("Could not load profile:", error);
        setUser(null);
        return;
      }

      const typedProfile = profile as ProfileRow;

      setUser({
        name: typedProfile.name,
        studentId: typedProfile.student_id,
        course: typedProfile.course,
        loggedIn: true,
      });
    }

    async function loadUserFromSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setUser(null);
        return;
      }

      await loadProfileFromSession(session.user.id);
    }

    loadUserFromSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        setUser(null);
        return;
      }

      await loadProfileFromSession(session.user.id);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function fetchSettings() {
      if (!user?.studentId) return;

      setLoadingSettings(true);
      setSaveMessage("");

      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("student_id", user.studentId)
        .single();

      if (error) {
        if (error.code !== "PGRST116") {
          console.error("Could not load saved settings:", error);
          setSaveMessage("Could not load saved settings.");
        }
        setLoadingSettings(false);
        return;
      }

      if (data) {
        const settings = data as UserSettingsRow;

        setLargeText(settings.large_text);
        setHighContrast(settings.high_contrast);
        setReducedMotion(settings.reduced_motion);
        setEventReminders(settings.event_reminders);
        setSocietyAlerts(settings.society_alerts);
        setHelpdeskUpdates(settings.helpdesk_updates);
        setDefaultPage(settings.default_page);

        const localSettings: LocalSettings = {
          largeText: settings.large_text,
          highContrast: settings.high_contrast,
          reducedMotion: settings.reduced_motion,
          eventReminders: settings.event_reminders,
          societyAlerts: settings.society_alerts,
          helpdeskUpdates: settings.helpdesk_updates,
          defaultPage: settings.default_page,
        };

        localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(localSettings));
        applySettingsToDocument(localSettings);
      }

      setLoadingSettings(false);
    }

    fetchSettings();
  }, [user]);

  async function handleSaveSettings() {
    if (!user?.studentId) {
      setSaveMessage("You must be logged in to save settings.");
      setTimeout(() => setSaveMessage(""), 2567);
      return;
    }

    setSavingSettings(true);
    setSaveMessage("");

    const payload: UserSettingsRow = {
      student_id: user.studentId,
      large_text: largeText,
      high_contrast: highContrast,
      reduced_motion: reducedMotion,
      event_reminders: eventReminders,
      society_alerts: societyAlerts,
      helpdesk_updates: helpdeskUpdates,
      default_page: defaultPage,
    };

    const { error } = await supabase
      .from("user_settings")
      .upsert(payload, { onConflict: "student_id" });

    if (error) {
      console.error("Save settings error:", error);
      setSaveMessage("Could not save settings.");
    } else {
      const localSettings: LocalSettings = {
        largeText,
        highContrast,
        reducedMotion,
        eventReminders,
        societyAlerts,
        helpdeskUpdates,
        defaultPage,
      };

      localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(localSettings));
      applySettingsToDocument(localSettings);
      setSaveMessage("Settings saved successfully.");
      setTimeout(() => setSaveMessage(""), 2000);
    }

    setSavingSettings(false);
  }

  function handleRestoreDefaults() {
    setLargeText(DEFAULT_SETTINGS.largeText);
    setHighContrast(DEFAULT_SETTINGS.highContrast);
    setReducedMotion(DEFAULT_SETTINGS.reducedMotion);
    setEventReminders(DEFAULT_SETTINGS.eventReminders);
    setSocietyAlerts(DEFAULT_SETTINGS.societyAlerts);
    setHelpdeskUpdates(DEFAULT_SETTINGS.helpdeskUpdates);
    setDefaultPage(DEFAULT_SETTINGS.defaultPage);

    applySettingsToDocument({
      largeText: DEFAULT_SETTINGS.largeText,
      highContrast: DEFAULT_SETTINGS.highContrast,
      reducedMotion: DEFAULT_SETTINGS.reducedMotion,
    });

    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));

    setSaveMessage("Default settings restored.");
    setTimeout(() => setSaveMessage(""), 2000);
  }

  function handleOpenDefaultPage() {
    router.push(getRouteForDefaultPage(defaultPage));
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      setSaveMessage("Could not sign out.");
      setTimeout(() => setSaveMessage(""), 2000);
      return;
    }

    setUser(null);
    router.push("/login");
    router.refresh();
  }

  return (
    <main>
      
      <Navbar />
      
      <Background />

      <div className={styles.AccountInfoCard}>
        <div className={styles.AccountInfoContent}>
          <h2>Account Information:</h2>

          <p><strong>Name:</strong> {user?.name || "N/A"}</p>
        
          <p><strong>Student ID:</strong> {user?.studentId || "N/A"}</p>
        
          <p><strong>Course:</strong> {user?.course || "N/A"}</p>

          <button type="button" className={styles.secondaryButton} onClick={handleSignOut}>Sign Out</button>
        
        </div>
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.summaryCardContent}>
          <h2 className={styles.summaryTitle}>Current Summary:</h2>

          <p><strong>Large Text:</strong> {largeText ? "On" : "Off"}</p>
          <p><strong>High Contrast:</strong> {highContrast ? "On" : "Off"}</p>
          <p><strong>Reduced Motion:</strong> {reducedMotion ? "On" : "Off"}</p>
          <p><strong>Event Reminders:</strong> {eventReminders ? "On" : "Off"}</p>
          <p><strong>Society Alerts:</strong> {societyAlerts ? "On" : "Off"}</p>
          <p><strong>Helpdesk Updates:</strong> {helpdeskUpdates ? "On" : "Off"}</p>
          <p><strong>Default Page:</strong> {defaultPage}</p>

          <div className={styles.quickLinks}>
            
            <button type="button" className={styles.quickLinkButton} onClick={() => setLargeText(true)}>Accessibility Help</button>

            <button type="button" className={styles.quickLinkButton} onClick={() => setEventReminders(true)}>Notification Help</button>

            <button type="button" className={styles.quickLinkButton} onClick={handleOpenDefaultPage}>Open Default Page</button>
          
          </div>
        </div>
      </div>

      <div className={styles.contentLayer}>
        <section className={styles.settingsHero}>
          <div className={styles.settingsHeroContent}>
            <div>
              <h1>Settings</h1>
              
              <p>Adjust accessibility, notifications and personal preferences for your Campus Companion experience.</p>
            </div>
          </div>
        </section>

        <section className={styles.settingsPanel}>
          <h2 className={styles.settingsHeading}>Preferences:</h2>

          <div className={styles.settingsGrid}>
            <div className={styles.settingsCard}>
              <h3>Accessibility</h3>

              <label className={styles.toggleRow}>
                <span>Large text</span>
                
                <input type="checkbox" checked={largeText} onChange={() => setLargeText(!largeText)}/>
              </label>

              <label className={styles.toggleRow}>
                <span>High Contrast Mode</span>
                
                <input type="checkbox" checked={highContrast} onChange={() => setHighContrast(!highContrast)}/>
              </label>

              <label className={styles.toggleRow}>
                <span>Reduced Motion</span>
                
                <input type="checkbox" checked={reducedMotion} onChange={() => setReducedMotion(!reducedMotion)}/>
              </label>
            </div>

            <div className={styles.settingsCard}>
              <h3>Notifications</h3>

              <label className={styles.toggleRow}>
                <span>Event Reminders</span>
                
                <input type="checkbox" checked={eventReminders} onChange={() => setEventReminders(!eventReminders)}/>
              </label>

              <label className={styles.toggleRow}>
                <span>Society Alerts</span>

                <input type="checkbox" checked={societyAlerts} onChange={() => setSocietyAlerts(!societyAlerts)}/>
              </label>

              <label className={styles.toggleRow}>
                <span>Helpdesk Updates</span>

                <input type="checkbox" checked={helpdeskUpdates} onChange={() => setHelpdeskUpdates(!helpdeskUpdates)}/>
              </label>
            </div>

            <div className={styles.settingsCard}>
              <h3>App Preferences</h3>

              <label className={styles.selectGroup}>
                <span>Default Page</span>

                <select value={defaultPage} onChange={(e) =>
                    setDefaultPage(e.target.value as DefaultPage)}className={styles.selectInput}>
            
                  <option>Campus Map</option>
                  <option>Timetable</option>
                  <option>Societies</option>
                  <option>Helpdesk</option>
            
                </select>
              </label>

              <div className={styles.statusArea}>
                {loadingSettings && (

                  <p className={styles.statusMessage}>Loading saved settings...</p>)}

                {!loadingSettings && saveMessage && (

                  <p className={styles.statusMessage2} role="status">{saveMessage}</p>)}
              </div>

              <div className={styles.buttonRow}>
                
                <button type="button" className={styles.saveButton} onClick={handleSaveSettings} disabled={savingSettings}>
                    {savingSettings ? "Saving..." : "Save Settings"}</button>

                <button type="button" className={styles.restoreButton} onClick={handleRestoreDefaults} disabled={savingSettings}>Restore Defaults</button>

              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
