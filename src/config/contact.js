// Replace each placeholder URL with the matching Helaly profile. Any entry left
// empty is filtered out, so a network disappears from the hero rail and the
// footer at once instead of rendering a dead link.
const contact = {
  businessEmail: "",
  whatsappBusinessNumber: "201276539981",
  phoneNumber: "",
  socialLinks: [
    { id: "facebook", label: "Facebook", url: "https://www.facebook.com/" },
    { id: "instagram", label: "Instagram", url: "https://www.instagram.com/" },
    { id: "x", label: "X (Twitter)", url: "https://x.com/" },
    { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/" },
    { id: "snapchat", label: "Snapchat", url: "https://www.snapchat.com/" },
    { id: "tiktok", label: "TikTok", url: "https://www.tiktok.com/" },
  ],
};

export default contact;
