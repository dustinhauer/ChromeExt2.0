(async function () {
  console.log('[LinkedIn Auto Viewer] Visiting profile:', window.location.href);

  async function likeLatestPost() {
    try {
      // Scroll to ensure content loads
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      await new Promise(r => setTimeout(r, 2000));

      const likeButtons = Array.from(document.querySelectorAll('button[aria-label*="Like"]'));
      if (likeButtons.length > 0) {
        console.log('[LinkedIn Auto Viewer] Liking latest post.');
        likeButtons[0].click();
      } else {
        console.log('[LinkedIn Auto Viewer] No Like button found.');
      }
    } catch (e) {
      console.warn('[LinkedIn Auto Viewer] Error during liking:', e);
    }
  }

  function getFollowerCount() {
    const matchText = Array.from(document.querySelectorAll('span, div'))
      .map(e => e.innerText)
      .find(text => /followers/i.test(text));
    const match = matchText?.match(/([\d,]+)(?=\s+followers)/i);
    return match ? parseInt(match[1].replace(/,/g, '')) : 0;
  }

  function getLocation() {
    const locationBlock = [...document.querySelectorAll('span, div')].find(e => /\b(canada|united states|uk|australia|dubai)\b/i.test(e.innerText));
    return locationBlock?.innerText.toLowerCase() || '';
  }

  function shouldConnect(followers, location) {
    return followers <= 20000 && /canada|united states|uk|australia|dubai/.test(location);
  }

  async function tryConnect() {
    const buttons = [...document.querySelectorAll('button')];
    let connectBtn = buttons.find(btn => btn.innerText.includes('Connect'));

    if (!connectBtn) {
      const moreBtn = buttons.find(btn => btn.innerText.toLowerCase() === 'more');
      if (moreBtn) {
        moreBtn.click();
        await new Promise(r => setTimeout(r, 1000));
        const allButtons = [...document.querySelectorAll('button')];
        connectBtn = allButtons.find(btn => btn.innerText.includes('Connect'));
      }
    }

    if (connectBtn) {
      console.log('[LinkedIn Auto Viewer] Sending connection request.');
      connectBtn.click();
      setTimeout(() => {
        const sendBtn = document.querySelector('button[aria-label="Send without a note"]') ||
                        [...document.querySelectorAll('button')].find(b => b.innerText.includes('Send without a note'));
        if (sendBtn) {
          console.log('[LinkedIn Auto Viewer] Clicking "Send without a note".');
          sendBtn.click();
        } else {
          console.log('[LinkedIn Auto Viewer] No send button found in modal.');
        }
      }, 1500);
    } else {
      console.log('[LinkedIn Auto Viewer] No Connect button found, even in More dropdown.');
    }
  }

  chrome.storage.local.get(['autoViewing', 'likeOnly'], async (data) => {
    if (!data.autoViewing) return;

    await likeLatestPost();

    if (!data.likeOnly) {
      const followers = getFollowerCount();
      const location = getLocation();
      console.log(`[LinkedIn Auto Viewer] Follower count: ${followers}, Location: ${location}`);

      if (!shouldConnect(followers, location)) {
        console.log('[LinkedIn Auto Viewer] Skipping connection — criteria not met.');
      } else {
        await tryConnect();
      }
    }

    chrome.runtime.sendMessage({ type: "logVisitedProfile", url: window.location.href });
    console.log('[LinkedIn Auto Viewer] Logged and closing tab...');
    setTimeout(() => window.close(), 7000 + Math.random() * 3000);
  });
})();