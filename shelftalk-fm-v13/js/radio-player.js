document.addEventListener("DOMContentLoaded", () => {

  const audio = document.getElementById("shelfTalkAudio");
  const playButton = document.getElementById("shelfTalkPlay");
  const progressBar = document.getElementById("radioProgressBar");
  const currentTime = document.getElementById("radioCurrentTime");
  const duration = document.getElementById("radioDuration");
  const muteButton = document.getElementById("radioMute");

  if (!audio || !playButton) {
    console.log("ShelfTalk radio elements not found.");
    return;
  }

  function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
      return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(secs).padStart(2, "0")
    );
  }


  playButton.addEventListener("click", async () => {

    try {

      if (audio.paused) {

        await audio.play();

        playButton.textContent = "Ⅱ";

        console.log("ShelfTalk FM playing");

      } else {

        audio.pause();

        playButton.textContent = "▶";

        console.log("ShelfTalk FM paused");

      }

    } catch (error) {

      console.error("ShelfTalk audio could not play:", error);

    }

  });


  audio.addEventListener("loadedmetadata", () => {

    if (duration) {
      duration.textContent = formatTime(audio.duration);
    }

  });


  audio.addEventListener("timeupdate", () => {

    if (!audio.duration) return;

    const percent =
      (audio.currentTime / audio.duration) * 100;

    if (progressBar) {
      progressBar.style.width = percent + "%";
    }

    if (currentTime) {
      currentTime.textContent =
        formatTime(audio.currentTime);
    }

  });


  audio.addEventListener("ended", () => {

    playButton.textContent = "▶";

    if (progressBar) {
      progressBar.style.width = "0%";
    }

  });


  if (muteButton) {

    muteButton.addEventListener("click", () => {

      audio.muted = !audio.muted;

      muteButton.textContent =
        audio.muted ? "🔇" : "🔊";

    });

  }

    /* =========================================
     SHELFTALK FM LIVE LISTENERS
  ========================================= */

  const listenerCount =
    document.getElementById("radioListenerCount");

  const sessionId =
    crypto.randomUUID();

  let listening = false;


  async function registerListener() {

    if (listening) return;

    const { error } = await window.shelfTalkDB
      .from("radio_listeners")
      .upsert(
        {
          session_id: sessionId,
          last_seen: new Date().toISOString()
        },
        {
          onConflict: "session_id"
        }
      );

    if (error) {
      console.error("Listener registration error:", error);
      return;
    }

    listening = true;

    updateListenerCount();

  }


  async function removeListener() {

    if (!listening) return;

    await window.shelfTalkDB
      .from("radio_listeners")
      .delete()
      .eq("session_id", sessionId);

    listening = false;

    updateListenerCount();

  }


  async function updateListenerCount() {

    const cutoff =
      new Date(Date.now() - 30000).toISOString();


    const { count, error } =
      await window.shelfTalkDB
        .from("radio_listeners")
        .select("*", {
          count: "exact",
          head: true
        })
        .gte("last_seen", cutoff);


    if (error) {

      console.error(
        "Listener count error:",
        error
      );

      return;

    }


    if (listenerCount) {

      listenerCount.textContent =
        count || 0;

    }

  }


  async function heartbeat() {

    if (!listening) return;


    await window.shelfTalkDB
      .from("radio_listeners")
      .update({
        last_seen: new Date().toISOString()
      })
      .eq("session_id", sessionId);


    updateListenerCount();

  }


  audio.addEventListener("play", () => {

    registerListener();

  });


  audio.addEventListener("pause", () => {

    removeListener();

  });


  window.addEventListener("beforeunload", () => {

    if (!listening) return;

    navigator.sendBeacon?.(
      `${window.SUPABASE_URL}/rest/v1/radio_listeners?session_id=eq.${sessionId}`
    );

  });


  setInterval(heartbeat, 15000);

  updateListenerCount();
});