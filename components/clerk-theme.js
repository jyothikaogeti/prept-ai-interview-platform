export const clerkAppearance = {
  variables: {
    colorPrimary: "#FBBF24",
    colorBackground: "#0A0A0B",
    colorText: "#FFFFFF",
    colorTextSecondary: "rgba(255, 255, 255, 0.55)",
    colorInputBackground: "rgba(255, 255, 255, 0.05)",
    colorInputText: "#FFFFFF",
    colorDanger: "#F87171",
    borderRadius: "0.75rem",
  },

  elements: {
    card: `
      bg-white/[0.035]
      border
      border-white/[0.09]
      shadow-2xl
      shadow-black/40
      backdrop-blur-2xl
    `,

    headerTitle: `
      text-white
      font-serif
    `,

    headerSubtitle: `
      text-white/50
    `,

    formFieldLabel: `
      text-white/75
    `,

    formFieldInput: `
      bg-white/[0.045]
      border-white/[0.10]
      text-white
      placeholder:text-white/30
      focus:border-amber-400/60
      focus:ring-2
      focus:ring-amber-400/10
      transition-all
    `,

    formButtonPrimary: `
      bg-amber-500
      text-[#0a0a0b]
      font-medium
      hover:bg-amber-400
      hover:-translate-y-0.5
      hover:shadow-[0_12px_36px_rgba(245,158,11,0.30)]
      transition-all
      duration-200
    `,

    socialButtonsBlockButton: `
      bg-white/[0.045]
      border
      border-white/[0.10]
      text-white
      hover:bg-white/[0.08]
      hover:border-white/[0.16]
      transition-all
    `,

    socialButtonsBlockButtonText: `
      text-white/80
    `,

    dividerLine: `
      bg-white/[0.10]
    `,

    dividerText: `
      text-white/30
    `,

    footerActionText: `
      text-white/40
    `,

    footerActionLink: `
      text-amber-400
      hover:text-amber-300
      transition-colors
    `,

    identityPreview: `
      bg-white/[0.045]
      border-white/[0.10]
    `,

    identityPreviewText: `
      text-white/80
    `,

    identityPreviewEditButton: `
      text-amber-400
      hover:text-amber-300
    `,

    formFieldSuccessText: `
      text-amber-400
    `,

    formFieldErrorText: `
      text-red-400
    `,

    alert: `
      bg-red-500/[0.10]
      border
      border-red-500/[0.20]
      text-red-300
    `,

    userButtonPopoverCard: `
      bg-[#0a0a0b]
      border
      border-white/[0.10]
      shadow-2xl
    `,
  },
};
