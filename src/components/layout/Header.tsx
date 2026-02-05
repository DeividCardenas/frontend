import { UserMenu } from "./UserMenu";

type HeaderProps = {
  onMenuClick: () => void;
};

export const Header = ({ onMenuClick }: HeaderProps) => {
  const clientLogo = "/img/client-logo-placeholder.png";

  return (
    <header className="bg-gradient-to-r from-brand-800 to-brand-900 text-white shadow-lg px-4 md:px-6 py-3 flex items-center justify-between z-20">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-white/80 hover:text-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <img src="/img/LOGO.png" alt="Logo Nova Growth" className="h-8" />

        <div className="hidden md:flex items-center gap-4">
          <div className="border-l border-white/30 h-8"></div>
          <img src={clientLogo} alt="Logo Cliente" className="h-7" />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 md:gap-5">
        <div className="hidden md:flex items-center gap-5">
          <button className="text-white/80 hover:text-white focus:outline-none transition-colors">
            <span className="text-2xl cursor-pointer">🔔</span>
          </button>
          <button className="text-white/80 hover:text-white focus:outline-none transition-colors">
            <span className="text-2xl cursor-pointer">❓</span>
          </button>
        </div>

        {/* UserMenu component */}
        <UserMenu />
      </div>
    </header>
  );
};
