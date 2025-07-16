window.addEventListener('startAutoView', () => {
  if (window.location.href.includes('linkedin.com/search/') || window.location.href.includes('/feed/update/')) {
    const profileLinks = Array.from(document.querySelectorAll('a'))
      .map(a => a.href)
      .filter(href => href.includes('/in/') && !href.includes('miniProfileUrn'))
      .filter((v, i, a) => a.indexOf(v) === i);

    profileLinks.forEach((url, i) => {
      setTimeout(() => {
        window.open(url, '_blank');
      }, i * 5000);
    });
  }
});