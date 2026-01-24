/*
  motiv.js — small motivational helper for the site.
  Usage:
    await window.motiv.init({ voice: true });
    window.motiv.show();                 // show one now
    window.motiv.scheduleDaily(9, 0);    // show every day at 09:00
*/

(function(){
  const ID = 'mh-motiv-style';
  if (!document.getElementById(ID)) {
    const s = document.createElement('style');
    s.id = ID;
    s.textContent = `
      .mh-motiv-toast {
        position:fixed; right:18px; bottom:18px; max-width:320px;
        background:linear-gradient(180deg,#ffffff,#f4fbff);
        border:1px solid #dbe9fb; color:#042a57; padding:12px 14px;
        border-radius:12px; box-shadow:0 8px 30px rgba(9,30,63,0.08);
        font-family:Inter,Segoe UI,Roboto,Arial; z-index:99999;
      }
      .mh-motiv-title{font-weight:700;margin-bottom:6px}
      .mh-motiv-body{font-size:0.95rem;color:#12324a}
      .mh-motiv-actions{display:flex;gap:8px;margin-top:10px;justify-content:flex-end}
      .mh-motiv-btn{background:#5b9bd5;color:#fff;border:0;padding:8px 10px;border-radius:8px;cursor:pointer}
      .mh-motiv-ghost{background:transparent;border:1px solid #dbe9fb;color:#5b9bd5;padding:8px 10px;border-radius:8px;cursor:pointer}
    `;
    document.head.appendChild(s);
  }

  const QUOTES = [
    "Take one small step — that's progress.",
    "You are allowed to rest. Resting is productive.",
    "Feelings are visitors. Let them come and go.",
    "Small self-care today helps big tomorrow.",
    "Breathe. You're doing the best you can right now.",
    "It's okay to ask for help — that shows strength."
  ];

  function randomQuote(){
    return QUOTES[Math.floor(Math.random()*QUOTES.length)];
  }

  let scheduled = null;
  let scheduledTimer = null;

  const motiv = {
    // options: { voice: boolean }
    async init(options = {}) {
      this.voice = !!options.voice;
      this.container = options.containerId ? document.getElementById(options.containerId) : null;
      // grant notification permission optionally
      if (options.notify && 'Notification' in window && Notification.permission === 'default') {
        try { await Notification.requestPermission(); } catch(e){}
      }
    },

    // returns selected quote
    getQuote() { return randomQuote(); },

    // show a toast with a quote (optionally pass text)
    show(text) {
      const quote = text || this.getQuote();
      // prevent spamming: if already visible, replace content
      let el = document.querySelector('.mh-motiv-toast');
      if (el) {
        el.querySelector('.mh-motiv-body').textContent = quote;
        return quote;
      }

      el = document.createElement('div');
      el.className = 'mh-motiv-toast';
      el.setAttribute('role','status');
      el.innerHTML = `
        <div class="mh-motiv-title">A gentle reminder</div>
        <div class="mh-motiv-body">${quote}</div>
        <div class="mh-motiv-actions">
          <button class="mh-motiv-ghost mh-motiv-hide">Dismiss 24h</button>
          <button class="mh-motiv-btn mh-motiv-speak">Listen</button>
        </div>
      `;
      (this.container || document.body).appendChild(el);

      // wire buttons
      el.querySelector('.mh-motiv-hide').addEventListener('click', () => {
        localStorage.setItem('mh_motiv_snooze', String(Date.now() + 24*60*60*1000));
        remove();
      });
      el.querySelector('.mh-motiv-speak').addEventListener('click', () => {
        if (!('speechSynthesis' in window)) return;
        const u = new SpeechSynthesisUtterance(quote);
        window.speechSynthesis.cancel();
        u.rate = 1;
        window.speechSynthesis.speak(u);
      });

      // auto-dismiss after 14s
      const t = setTimeout(remove, 14000);
      function remove(){
        clearTimeout(t);
        if (el && el.parentNode) el.parentNode.removeChild(el);
      }

      return quote;
    },

    // schedule daily notification at hour:minute (24h). returns a handle.
    scheduleDaily(hour = 9, minute = 0) {
      if (scheduledTimer) clearTimeout(scheduledTimer);
      scheduled = { hour: Number(hour), minute: Number(minute) };

      const runOnce = () => {
        const snooze = Number(localStorage.getItem('mh_motiv_snooze') || 0);
        if (snooze <= Date.now()) {
          // show toast
          this.show();
        }
        // schedule next in 24h
        scheduledTimer = setTimeout(runOnce, 24*60*60*1000);
      };

      // compute ms until next target
      const now = new Date();
      const target = new Date(now);
      target.setHours(scheduled.hour, scheduled.minute, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);
      const ms = target - now;
      scheduledTimer = setTimeout(runOnce, ms);
      return scheduled;
    },

    // cancel scheduled daily reminders
    cancelSchedule() {
      if (scheduledTimer) { clearTimeout(scheduledTimer); scheduledTimer = null; scheduled = null; }
    }
  };

  window.motiv = motiv;
})();