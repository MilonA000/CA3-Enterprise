"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

type Props = {
  eventId: string;
  primaryClass: string;
  secondaryClass: string;
};

export default function EventActions({
  eventId,
  primaryClass,
  secondaryClass,
}: Props) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saved || saving) return;

    setSaving(true);
    console.log("Trying to save event:", eventId);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("Session result:", session);

    if (!session) {
      alert("Please log in to save events.");
      setSaving(false);
      return;
    }

    const user = session.user;

    const { data, error } = await supabase
      .from("saved_events")
      .upsert(
        {
          user_id: user.id,
          event_id: eventId,
        },
        {
          onConflict: "user_id,event_id",
        }
      )
      .select();

    console.log("Insert result:", { data, error });

    if (error) {
      alert(`Save failed: ${error.message}`);
      console.error("Insert error:", error);
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out this event",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied!");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <>
      <button type="button" onClick={handleSave} className={primaryClass} disabled={saved || saving} aria-label="Save Event">{saved ? "Saved ✓" : saving ? "Saving..." : "Save Event"}</button>

      <button type="button" onClick={handleShare} className={secondaryClass} aria-label="Share Event">Share Event</button>
    </>
  );
}
