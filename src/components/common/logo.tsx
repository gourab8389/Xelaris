import { cn } from "../../lib/utils";

interface LogoProps {
        className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <div>
      <img
        src="/logo.png"
        alt="Excel Analytics Logo"
        className={cn("h-8 w-auto", className)}
      />
    </div>
  )
}

export default Logo
